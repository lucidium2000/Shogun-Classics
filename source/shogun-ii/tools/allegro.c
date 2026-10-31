// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* Browser implementation of the Allegro subset used by KOF91.
   Graphics are done here in C (16-bit RGB565 like the original DirectX build),
   while timing, files, input and audio are provided by the JavaScript host. */

#include "allegro.h"
#include <stdarg.h>
#include <stdint.h>
#include <ctype.h>

#define IMPORT(name) __attribute__((import_module("env"), import_name(#name)))

IMPORT(js_yield) void js_yield(int ms);
IMPORT(js_now) double js_now(void);
IMPORT(js_file_size) int js_file_size(const char *path);
IMPORT(js_file_read) void js_file_read(const char *path, void *dst);
IMPORT(js_scan) int js_scan(const char *pattern, int dirs, char *out, int max);
IMPORT(js_present) void js_present(const void *rgba, int w, int h);
IMPORT(js_log) void js_log(const char *msg);
IMPORT(js_title) void js_title(const char *msg);
IMPORT(js_exit) void js_exit(int code);
IMPORT(js_sample_load) int js_sample_load(const char *path);
IMPORT(js_sample_play) void js_sample_play(int id, int vol, int pan, int freq, int loop);
IMPORT(js_sample_stop) void js_sample_stop(int id);
IMPORT(js_midi_load) int js_midi_load(const char *path);
IMPORT(js_midi_play) void js_midi_play(int id, int loop);
IMPORT(js_midi_stop) void js_midi_stop(void);
IMPORT(js_mp3_open) int js_mp3_open(const char *path);
IMPORT(js_mp3_play) void js_mp3_play(void);
IMPORT(js_mp3_close) void js_mp3_close(void);
IMPORT(js_set_volume) void js_set_volume(int digi, int midi);

/* ------------------------------------------------------------------ */
/* globals                                                             */

JOYSTICK_INFO joy[4];
int joy_type = JOY_TYPE_NONE;
BITMAP *screen;
FONT *font;
volatile char key[128];
volatile int retrace_count;
BITMAP *fli_bitmap;
PALETTE fli_palette;
PALETTE black_palette;
static int errno_store;
int *allegro_errno = &errno_store;
char allegro_error[256];

static RGB cur_palette[256];
static int color_depth = 8;

/* keyboard buffer: JS bumps keybuf_count on every key press */
volatile int keybuf_count;
int pad_state;     /* bitmask from gamepad/touch, mirrored into joy[0] */
int pad_latch;     /* pad bits pressed since the last poll_joystick() */
char key_latch[128];   /* keys pressed since the last rest() began */
static char key_ghost[128];

__attribute__((export_name("web_key_ptr"))) char *web_key_ptr(void) { return (char *)key; }
__attribute__((export_name("web_keybuf_ptr"))) int *web_keybuf_ptr(void) { return (int *)&keybuf_count; }
__attribute__((export_name("web_pad_ptr"))) int *web_pad_ptr(void) { return &pad_state; }
__attribute__((export_name("web_pad_latch_ptr"))) int *web_pad_latch_ptr(void) { return &pad_latch; }
__attribute__((export_name("web_key_latch_ptr"))) char *web_key_latch_ptr(void) { return key_latch; }

/* Menus poll the keyboard once per rest(150). A quick tap that starts and
   ends inside that sleep would be lost, so it is replayed as held until the
   game next gives control back to the browser. */
static void clear_ghosts(void)
{
   int k;
   for (k = 0; k < 128; k++)
      if (key_ghost[k]) { key_ghost[k] = 0; key[k] = 0; }
}

static void apply_ghosts(void)
{
   int k;
   for (k = 0; k < 128; k++) {
      if (key_latch[k] && !key[k]) { key[k] = 1; key_ghost[k] = 1; }
      key_latch[k] = 0;
   }
}

/* ------------------------------------------------------------------ */
/* timing: retrace_count ticks at 70Hz like a VGA retrace              */

static double tick_base;
static long ticks_done;
static double last_yield;
static int screen_dirty;
static uint32_t present_buf[640 * 480];

static void update_ticks(void)
{
   double now = js_now();
   long t = (long)((now - tick_base) * 70.0 / 1000.0);
   if (t > ticks_done) {
      long d = t - ticks_done;
      if (d > 20) d = 20;
      retrace_count += (int)d;
      ticks_done = t;
   }
}

static void present(void)
{
   int i, n;
   uint16_t *s;
   if (!screen_dirty || !screen) return;
   screen_dirty = 0;
   n = screen->w * screen->h;
   s = (uint16_t *)screen->dat;
   for (i = 0; i < n; i++) {
      uint32_t c = s[i];
      uint32_t r = (c >> 11) & 31, g = (c >> 5) & 63, b = c & 31;
      r = (r << 3) | (r >> 2); g = (g << 2) | (g >> 4); b = (b << 3) | (b >> 2);
      present_buf[i] = 0xFF000000u | (b << 16) | (g << 8) | r;
   }
   js_present(present_buf, screen->w, screen->h);
}

static void do_yield(int ms)
{
   clear_ghosts();
   present();
   js_yield(ms);
   last_yield = js_now();
   update_ticks();
}

/* yield only if we have been running a while, so tight polling loops
   (waiting for a key, etc.) don't freeze the page */
static void maybe_yield(void)
{
   double now = js_now();
   update_ticks();
   if (now - last_yield > 12.0) do_yield(0);
}

void al_wait_retrace(void)
{
   double now = js_now();
   double next = tick_base + (ticks_done + 1) * 1000.0 / 70.0;
   int ms = (int)(next - now);
   if (ms < 0) ms = 0;
   do_yield(ms);
}

void rest(long ms)
{
   double end = js_now() + ms;
   memset(key_latch, 0, sizeof(key_latch));
   present();
   for (;;) {
      double left = end - js_now();
      if (left <= 0) break;
      do_yield((int)left);
   }
   update_ticks();
   apply_ghosts();
}

void vsync(void)
{
   int r = retrace_count;
   while (retrace_count == r) al_wait_retrace();
}

/* ------------------------------------------------------------------ */
/* system                                                              */

int allegro_init(void)
{
   tick_base = js_now();
   last_yield = tick_base;
   memset(black_palette, 0, sizeof(black_palette));
   return 0;
}

void allegro_exit(void) { js_midi_stop(); js_mp3_close(); }

void allegro_message(const char *fmt, ...)
{
   char buf[1024];
   va_list ap;
   va_start(ap, fmt);
   vsnprintf(buf, sizeof(buf), fmt, ap);
   va_end(ap);
   js_log(buf);
}

void set_window_title(const char *name) { js_title(name); }
int install_timer(void) { return 0; }
int install_keyboard(void) { return 0; }
void remove_keyboard(void) {}
int install_joystick(int type) { joy_type = 1; return 0; }

int poll_joystick(void)
{
   int p = pad_state | pad_latch;
   pad_latch = 0;
   joy[0].stick[0].axis[0].d1 = (p & 1) != 0;   /* left  */
   joy[0].stick[0].axis[0].d2 = (p & 2) != 0;   /* right */
   joy[0].stick[0].axis[1].d1 = (p & 4) != 0;   /* up    */
   joy[0].stick[0].axis[1].d2 = (p & 8) != 0;   /* down  */
   joy[0].button[0].b = (p & 16) != 0;
   joy[0].button[1].b = (p & 32) != 0;
   joy[0].button[2].b = (p & 64) != 0;
   joy[0].button[3].b = (p & 128) != 0;
   maybe_yield();
   return 0;
}

int install_sound(int digi, int midi, const char *cfg) { return 0; }
void set_volume(int digi, int midi) { js_set_volume(digi, midi); }

int keypressed(void)
{
   maybe_yield();
   return keybuf_count > 0;
}

int readkey(void)
{
   while (keybuf_count <= 0) do_yield(10);
   keybuf_count--;
   return 0;
}

void clear_keybuf(void) { keybuf_count = 0; }
void simulate_keypress(int k) { keybuf_count++; }

void exit_hook(int code)
{
   present();
   js_exit(code);
}

/* ------------------------------------------------------------------ */
/* files                                                               */

static void norm_path(const char *in, char *out, int size)
{
   int i;
   for (i = 0; in[i] && i < size - 1; i++) {
      char c = in[i];
      if (c == '\\') c = '/';
      out[i] = (char)tolower((unsigned char)c);
   }
   out[i] = 0;
}

static unsigned char *read_file(const char *filename, int *size)
{
   char p[260];
   unsigned char *buf;
   int n;
   norm_path(filename, p, sizeof(p));
   n = js_file_size(p);
   if (n < 0) return NULL;
   buf = malloc(n + 1);
   if (!buf) return NULL;
   js_file_read(p, buf);
   buf[n] = 0;
   if (size) *size = n;
   return buf;
}

int web_scan_dir(const char *pattern, int dirs, char names[][30], int max)
{
   char p[260];
   norm_path(pattern, p, sizeof(p));
   return js_scan(p, dirs, &names[0][0], max);
}

/* ------------------------------------------------------------------ */
/* config files                                                        */

typedef struct CFG_ENTRY { char *section; char *name; char *value; } CFG_ENTRY;
typedef struct CFG { CFG_ENTRY *e; int n; } CFG;

static CFG main_cfg, over_cfg;

static void free_cfg(CFG *c)
{
   /* strings are leaked on purpose: get_config_string() hands out pointers
      to them and KOF91 keeps those around */
   c->e = NULL; c->n = 0;
}

static char *trim(char *s)
{
   char *e;
   while (*s == ' ' || *s == '\t') s++;
   e = s + strlen(s);
   while (e > s && (e[-1] == ' ' || e[-1] == '\t' || e[-1] == '\r' || e[-1] == '\n')) *--e = 0;
   return s;
}

static void load_cfg(CFG *c, const char *filename)
{
   int size, cap = 0;
   char *data, *line, *next, *section = "";
   free_cfg(c);
   if (!filename) return;
   data = (char *)read_file(filename, &size);
   if (!data) return;
   for (line = data; line && *line; line = next) {
      char *eq, *l;
      next = strchr(line, '\n');
      if (next) *next++ = 0;
      l = trim(line);
      if (*l == '#' || *l == 0) continue;
      if (*l == '[') {
         char *end = strchr(l, ']');
         if (end) *end = 0;
         section = strdup(l + 1);
         continue;
      }
      eq = strchr(l, '=');
      if (!eq) continue;
      *eq = 0;
      if (c->n == cap) {
         cap = cap ? cap * 2 : 64;
         c->e = realloc(c->e, cap * sizeof(CFG_ENTRY));
      }
      c->e[c->n].section = section;
      c->e[c->n].name = strdup(trim(l));
      c->e[c->n].value = strdup(trim(eq + 1));
      c->n++;
   }
   free(data);
}

void set_config_file(const char *filename) { load_cfg(&main_cfg, filename); }
void override_config_file(const char *filename) { load_cfg(&over_cfg, filename); }

static const char *find_cfg(CFG *c, const char *section, const char *name)
{
   int i;
   if (!section) section = "";
   if (section[0] == '[') section++;
   for (i = 0; i < c->n; i++) {
      if (strcasecmp(c->e[i].name, name) == 0 && strcasecmp(c->e[i].section, section) == 0)
         return c->e[i].value;
   }
   return NULL;
}

const char *get_config_string(const char *section, const char *name, const char *def)
{
   const char *v = find_cfg(&over_cfg, section, name);
   if (!v) v = find_cfg(&main_cfg, section, name);
   return v ? v : def;
}

int get_config_int(const char *section, const char *name, int def)
{
   const char *v = get_config_string(section, name, NULL);
   if (v && *v) return (int)strtol(v, NULL, 0);
   return def;
}

/* ------------------------------------------------------------------ */
/* bitmaps                                                             */

#define MASK16 0xF81F

static int drawmode = DRAW_MODE_SOLID;
static BITMAP *pattern_bmp;
static int pattern_x, pattern_y;
static int blend_r, blend_g, blend_b, blend_a;
static int blender_col;

void set_color_depth(int depth) { color_depth = depth; }

int set_gfx_mode(int card, int w, int h, int vw, int vh)
{
   if (card == GFX_TEXT) return 0;
   if (screen) destroy_bitmap(screen);
   screen = create_bitmap(w, h);
   clear(screen);
   screen_dirty = 1;
   return 0;
}

void set_palette(const RGB *p) { memcpy(cur_palette, p, sizeof(cur_palette)); }

int makecol(int r, int g, int b)
{
   return ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3);
}

static int scale6(int v) { return (v * 255) / 63; }

static int pal_to16(const RGB *p, int i)
{
   return makecol(scale6(p[i].r), scale6(p[i].g), scale6(p[i].b));
}

static BITMAP *create_bitmap_ex(int depth, int w, int h)
{
   BITMAP *b;
   if (w < 1) w = 1;
   if (h < 1) h = 1;
   b = malloc(sizeof(BITMAP));
   if (!b) return NULL;
   b->w = w; b->h = h; b->depth = depth;
   b->dat = malloc((size_t)w * h * (depth == 8 ? 1 : 2));
   if (!b->dat) { free(b); return NULL; }
   return b;
}

BITMAP *create_bitmap(int w, int h) { return create_bitmap_ex(16, w, h); }

void destroy_bitmap(BITMAP *b)
{
   if (!b || b == screen || b == fli_bitmap) return;
   free(b->dat);
   free(b);
}

RLE_SPRITE *get_rle_sprite(BITMAP *b)
{
   BITMAP *r;
   if (!b) return NULL;
   r = create_bitmap_ex(b->depth, b->w, b->h);
   if (r) memcpy(r->dat, b->dat, (size_t)b->w * b->h * (b->depth == 8 ? 1 : 2));
   return r;
}

void destroy_rle_sprite(RLE_SPRITE *s) { destroy_bitmap(s); }

static inline int get16(BITMAP *b, int x, int y)
{
   if (b->depth == 8) return pal_to16(cur_palette, ((uint8_t *)b->dat)[y * b->w + x]);
   return ((uint16_t *)b->dat)[y * b->w + x];
}

static inline void mark(BITMAP *b) { if (b == screen) screen_dirty = 1; }

static inline int pattern_pixel(int x, int y)
{
   int px = (x - pattern_x) % pattern_bmp->w;
   int py = (y - pattern_y) % pattern_bmp->h;
   if (px < 0) px += pattern_bmp->w;
   if (py < 0) py += pattern_bmp->h;
   return get16(pattern_bmp, px, py);
}

static inline void plot(BITMAP *b, int x, int y, int c)
{
   if (drawmode == DRAW_MODE_COPY_PATTERN && pattern_bmp) c = pattern_pixel(x, y);
   if (b->depth == 8) ((uint8_t *)b->dat)[y * b->w + x] = (uint8_t)c;
   else ((uint16_t *)b->dat)[y * b->w + x] = (uint16_t)c;
}

void acquire_screen(void) {}
void release_screen(void) {}

void clear_to_color(BITMAP *b, int c)
{
   int i, n;
   if (!b) return;
   n = b->w * b->h;
   if (b->depth == 8) memset(b->dat, c, n);
   else for (i = 0; i < n; i++) ((uint16_t *)b->dat)[i] = (uint16_t)c;
   mark(b);
}

void clear(BITMAP *b) { clear_to_color(b, 0); }

void putpixel(BITMAP *b, int x, int y, int c)
{
   if (!b || x < 0 || y < 0 || x >= b->w || y >= b->h) return;
   plot(b, x, y, c);
   mark(b);
}

int getpixel(BITMAP *b, int x, int y)
{
   if (!b || x < 0 || y < 0 || x >= b->w || y >= b->h) return -1;
   if (b->depth == 8) return ((uint8_t *)b->dat)[y * b->w + x];
   return ((uint16_t *)b->dat)[y * b->w + x];
}

void rectfill(BITMAP *b, int x1, int y1, int x2, int y2, int c)
{
   int x, y, t;
   if (!b) return;
   if (x2 < x1) { t = x1; x1 = x2; x2 = t; }
   if (y2 < y1) { t = y1; y1 = y2; y2 = t; }
   if (x1 < 0) x1 = 0;
   if (y1 < 0) y1 = 0;
   if (x2 >= b->w) x2 = b->w - 1;
   if (y2 >= b->h) y2 = b->h - 1;
   for (y = y1; y <= y2; y++)
      for (x = x1; x <= x2; x++) plot(b, x, y, c);
   mark(b);
}

void hline(BITMAP *b, int x1, int y, int x2, int c) { rectfill(b, x1, y, x2, y, c); }

void rect(BITMAP *b, int x1, int y1, int x2, int y2, int c)
{
   rectfill(b, x1, y1, x2, y1, c);
   rectfill(b, x1, y2, x2, y2, c);
   rectfill(b, x1, y1, x1, y2, c);
   rectfill(b, x2, y1, x2, y2, c);
}

void drawing_mode(int mode, BITMAP *pattern, int x_anchor, int y_anchor)
{
   drawmode = mode;
   pattern_bmp = pattern;
   pattern_x = x_anchor;
   pattern_y = y_anchor;
}

/* clip a copy of w*h from (sx,sy) in src to (dx,dy) in dst */
static int clip(BITMAP *src, BITMAP *dst, int *sx, int *sy, int *dx, int *dy, int *w, int *h)
{
   if (*sx < 0) { *w += *sx; *dx -= *sx; *sx = 0; }
   if (*sy < 0) { *h += *sy; *dy -= *sy; *sy = 0; }
   if (*sx + *w > src->w) *w = src->w - *sx;
   if (*sy + *h > src->h) *h = src->h - *sy;
   if (*dx < 0) { *w += *dx; *sx -= *dx; *dx = 0; }
   if (*dy < 0) { *h += *dy; *sy -= *dy; *dy = 0; }
   if (*dx + *w > dst->w) *w = dst->w - *dx;
   if (*dy + *h > dst->h) *h = dst->h - *dy;
   return *w > 0 && *h > 0;
}

void blit(BITMAP *src, BITMAP *dst, int sx, int sy, int dx, int dy, int w, int h)
{
   int x, y;
   if (!src || !dst) return;
   if (!clip(src, dst, &sx, &sy, &dx, &dy, &w, &h)) return;
   if (src->depth == dst->depth) {
      int bpp = src->depth == 8 ? 1 : 2;
      for (y = 0; y < h; y++)
         memmove((char *)dst->dat + ((dy + y) * dst->w + dx) * bpp,
                 (char *)src->dat + ((sy + y) * src->w + sx) * bpp, w * bpp);
   }
   else if (src->depth == 8) {
      int lut[256], i;
      for (i = 0; i < 256; i++) lut[i] = pal_to16(cur_palette, i);
      for (y = 0; y < h; y++) {
         uint8_t *s = (uint8_t *)src->dat + (sy + y) * src->w + sx;
         uint16_t *d = (uint16_t *)dst->dat + (dy + y) * dst->w + dx;
         for (x = 0; x < w; x++) d[x] = (uint16_t)lut[s[x]];
      }
   }
   mark(dst);
}

static void sprite_blit(BITMAP *src, BITMAP *dst, int sx, int sy, int dx, int dy, int w, int h, int flip, int mode)
{
   int x, y;
   int ox = dx, ow = w;
   if (!src || !dst) return;
   if (flip) {
      /* clip in destination space, then mirror the source columns */
      int sx0;
      if (!clip(src, dst, &sx, &sy, &dx, &dy, &w, &h)) return;
      sx0 = sx;
      for (y = 0; y < h; y++) {
         uint16_t *d = (uint16_t *)dst->dat + (dy + y) * dst->w + dx;
         for (x = 0; x < w; x++) {
            int srcx = (src->w - 1) - (dx + x - ox);
            int c;
            (void)sx0; (void)ow;
            if (srcx < 0 || srcx >= src->w) continue;
            c = get16(src, srcx, sy + y);
            if (c != MASK16) d[x] = (uint16_t)c;
         }
      }
      mark(dst);
      return;
   }
   if (!clip(src, dst, &sx, &sy, &dx, &dy, &w, &h)) return;
   for (y = 0; y < h; y++) {
      uint16_t *d = (uint16_t *)dst->dat + (dy + y) * dst->w + dx;
      for (x = 0; x < w; x++) {
         int c = get16(src, sx + x, sy + y);
         if (c == MASK16) continue;
         if (mode == 1) {
            /* translucent */
            uint32_t a = (uint32_t)c, b = d[x], n = (uint32_t)blend_a;
            if (n) n = (n + 1) / 8;
            a = ((a & 0xFFFF) | (a << 16)) & 0x7E0F81F;
            b = ((b & 0xFFFF) | (b << 16)) & 0x7E0F81F;
            a = ((a - b) * n / 32 + b) & 0x7E0F81F;
            c = (int)((a & 0xFFFF) | (a >> 16));
         }
         else if (mode >= 2) {
            /* lit: blend the pixel towards the blender colour */
            uint32_t a = (uint32_t)blender_col, b = (uint32_t)c, n = (uint32_t)(mode - 2);
            if (n) n = (n + 1) / 8;
            a = ((a & 0xFFFF) | (a << 16)) & 0x7E0F81F;
            b = ((b & 0xFFFF) | (b << 16)) & 0x7E0F81F;
            a = ((a - b) * n / 32 + b) & 0x7E0F81F;
            c = (int)((a & 0xFFFF) | (a >> 16));
         }
         d[x] = (uint16_t)c;
      }
   }
   mark(dst);
}

void masked_blit(BITMAP *src, BITMAP *dst, int sx, int sy, int dx, int dy, int w, int h)
{
   sprite_blit(src, dst, sx, sy, dx, dy, w, h, 0, 0);
}

void draw_sprite(BITMAP *dst, BITMAP *src, int x, int y)
{
   if (src) sprite_blit(src, dst, 0, 0, x, y, src->w, src->h, 0, 0);
}

void draw_rle_sprite(BITMAP *dst, RLE_SPRITE *s, int x, int y) { draw_sprite(dst, s, x, y); }

void draw_sprite_h_flip(BITMAP *dst, BITMAP *src, int x, int y)
{
   if (src) sprite_blit(src, dst, 0, 0, x, y, src->w, src->h, 1, 0);
}

void set_trans_blender(int r, int g, int b, int a)
{
   blend_r = r; blend_g = g; blend_b = b; blend_a = a;
   blender_col = makecol(r, g, b);
}

void draw_trans_sprite(BITMAP *dst, BITMAP *src, int x, int y)
{
   if (src) sprite_blit(src, dst, 0, 0, x, y, src->w, src->h, 0, 1);
}

void draw_lit_sprite(BITMAP *dst, BITMAP *src, int x, int y, int color)
{
   if (color < 0) color = 0;
   if (color > 255) color = 255;
   if (src) sprite_blit(src, dst, 0, 0, x, y, src->w, src->h, 0, 2 + color);
}

static void do_stretch(BITMAP *src, BITMAP *dst, int sx, int sy, int sw, int sh,
                       int dx, int dy, int dw, int dh, int masked)
{
   int x, y;
   if (!src || !dst || dw <= 0 || dh <= 0 || sw <= 0 || sh <= 0) return;
   for (y = 0; y < dh; y++) {
      int ty = dy + y, syy;
      uint16_t *d;
      if (ty < 0 || ty >= dst->h) continue;
      syy = sy + (int)(((long long)y * sh) / dh);
      if (syy < 0 || syy >= src->h) continue;
      d = (uint16_t *)dst->dat + ty * dst->w;
      for (x = 0; x < dw; x++) {
         int tx = dx + x, sxx, c;
         if (tx < 0 || tx >= dst->w) continue;
         sxx = sx + (int)(((long long)x * sw) / dw);
         if (sxx < 0 || sxx >= src->w) continue;
         c = get16(src, sxx, syy);
         if (masked && c == MASK16) continue;
         d[tx] = (uint16_t)c;
      }
   }
   mark(dst);
}

void stretch_blit(BITMAP *src, BITMAP *dst, int sx, int sy, int sw, int sh, int dx, int dy, int dw, int dh)
{
   do_stretch(src, dst, sx, sy, sw, sh, dx, dy, dw, dh, 0);
}

void stretch_sprite(BITMAP *dst, BITMAP *src, int x, int y, int w, int h)
{
   if (src) do_stretch(src, dst, 0, 0, src->w, src->h, x, y, w, h, 1);
}

void fade_out(int speed)
{
   /* darken the screen over ~half a second */
   int step, i, n;
   uint16_t *orig;
   if (!screen) return;
   n = screen->w * screen->h;
   orig = malloc(n * 2);
   memcpy(orig, screen->dat, n * 2);
   for (step = 16; step >= 0; step -= (speed > 0 ? speed : 1)) {
      uint16_t *d = (uint16_t *)screen->dat;
      for (i = 0; i < n; i++) {
         int c = orig[i];
         int r = ((c >> 11) & 31) * step / 16, g = ((c >> 5) & 63) * step / 16, b = (c & 31) * step / 16;
         d[i] = (uint16_t)((r << 11) | (g << 5) | b);
      }
      screen_dirty = 1;
      rest(30);
   }
   free(orig);
}

/* ------------------------------------------------------------------ */
/* PCX loading                                                         */

BITMAP *load_pcx(const char *filename, RGB *pal)
{
   int size, w, h, bpl, planes, bpp, x, y, p, pos;
   unsigned char *d = read_file(filename, &size);
   unsigned char *line;
   RGB filepal[256];
   BITMAP *b;
   if (!d || size < 128) { free(d); return NULL; }
   bpp = d[3];
   w = (d[8] | (d[9] << 8)) - (d[4] | (d[5] << 8)) + 1;
   h = (d[10] | (d[11] << 8)) - (d[6] | (d[7] << 8)) + 1;
   planes = d[65];
   bpl = d[66] | (d[67] << 8);
   if (bpp != 8 || (planes != 1 && planes != 3) || w <= 0 || h <= 0) { free(d); return NULL; }

   memset(filepal, 0, sizeof(filepal));
   if (planes == 1 && size > 769 && d[size - 769] == 12) {
      for (p = 0; p < 256; p++) {
         filepal[p].r = d[size - 768 + p * 3] / 4;
         filepal[p].g = d[size - 768 + p * 3 + 1] / 4;
         filepal[p].b = d[size - 768 + p * 3 + 2] / 4;
      }
   }
   if (pal) memcpy(pal, filepal, sizeof(filepal));

   b = create_bitmap_ex(16, w, h);
   line = malloc(bpl * planes + 64);
   pos = 128;
   for (y = 0; y < h; y++) {
      int n = 0, total = bpl * planes;
      while (n < total && pos < size) {
         int c = d[pos++], cnt = 1;
         if ((c & 0xC0) == 0xC0) { cnt = c & 0x3F; c = pos < size ? d[pos++] : 0; }
         while (cnt-- > 0 && n < total) line[n++] = (unsigned char)c;
      }
      for (; n < total; n++) line[n] = 0;
      for (x = 0; x < w; x++) {
         int c;
         if (planes == 3) c = makecol(line[x], line[bpl + x], line[2 * bpl + x]);
         else c = pal_to16(filepal, line[x]);
         ((uint16_t *)b->dat)[y * w + x] = (uint16_t)c;
      }
   }
   free(line);
   free(d);
   return b;
}

BITMAP *load_bitmap(const char *filename, RGB *pal) { return load_pcx(filename, pal); }

/* ------------------------------------------------------------------ */
/* fonts and datafiles                                                 */

typedef struct GLYPH { int w, h; unsigned char *bits; } GLYPH;
struct FONT { int begin, end; GLYPH *g; };

static uint32_t rd32(const unsigned char *p) { return ((uint32_t)p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]; }
static int rd16(const unsigned char *p) { return (int16_t)((p[0] << 8) | p[1]); }

static FONT *parse_font(const unsigned char *b, int size)
{
   FONT *f;
   int q = 4, c;
   if (size < 13 || rd16(b) != 0) return NULL;
   f = malloc(sizeof(FONT));
   q++;                                     /* mono flag */
   f->begin = (int)rd32(b + q); f->end = (int)rd32(b + q + 4); q += 8;
   f->g = calloc(f->end - f->begin + 1, sizeof(GLYPH));
   for (c = 0; c <= f->end - f->begin && q + 4 <= size; c++) {
      int w = rd16(b + q), h = rd16(b + q + 2), n;
      q += 4;
      n = ((w + 7) / 8) * h;
      f->g[c].w = w; f->g[c].h = h; f->g[c].bits = (unsigned char *)b + q;
      q += n;
   }
   return f;
}

DATAFILE *load_datafile(const char *filename)
{
   int size, n, i, p;
   unsigned char *d = read_file(filename, &size);
   DATAFILE *df;
   if (!d || size < 12 || memcmp(d, "slh.ALL.", 8) != 0) { free(d); return NULL; }
   n = (int)rd32(d + 8);
   df = calloc(n + 1, sizeof(DATAFILE));
   p = 12;
   for (i = 0; i < n && p + 12 <= size; i++) {
      uint32_t sz;
      while (p + 12 <= size && memcmp(d + p, "prop", 4) == 0) p += 12 + rd32(d + p + 8);
      sz = rd32(d + p + 4);
      if (memcmp(d + p, "FONT", 4) == 0) df[i].dat = parse_font(d + p + 12, (int)sz);
      df[i].type = (int)rd32(d + p);
      df[i].size = sz;
      p += 12 + sz;
   }
   df[n].type = -1;
   return df;
}

void unload_datafile(DATAFILE *d) {}

void text_mode(int mode) {}

int text_length(FONT *f, const char *s)
{
   int w = 0;
   if (!f) return (int)strlen(s) * 8;
   for (; *s; s++) {
      int c = (unsigned char)*s;
      if (c < f->begin || c > f->end) c = ' ';
      w += f->g[c - f->begin].w;
   }
   return w;
}

void textout(BITMAP *b, FONT *f, const char *s, int x, int y, int color)
{
   if (!b || !f || !s) return;
   for (; *s; s++) {
      int c = (unsigned char)*s, gx, gy, bpr;
      GLYPH *g;
      if (c < f->begin || c > f->end) c = ' ';
      g = &f->g[c - f->begin];
      bpr = (g->w + 7) / 8;
      for (gy = 0; gy < g->h; gy++)
         for (gx = 0; gx < g->w; gx++)
            if (g->bits[gy * bpr + gx / 8] & (0x80 >> (gx & 7))) {
               int px = x + gx, py = y + gy;
               if (px >= 0 && py >= 0 && px < b->w && py < b->h)
                  ((uint16_t *)b->dat)[py * b->w + px] = (uint16_t)color;
            }
      x += g->w;
   }
   mark(b);
}

void textout_centre(BITMAP *b, FONT *f, const char *s, int x, int y, int c)
{
   if (!s) return;
   textout(b, f, s, x - text_length(f, s) / 2, y, c);
}

/* ------------------------------------------------------------------ */
/* FLI / FLC player                                                    */

static unsigned char *fli_data;
static int fli_size, fli_pos, fli_first, fli_frames, fli_frame;

static int fli_u16(int p) { return fli_data[p] | (fli_data[p + 1] << 8); }
static int fli_u32(int p) { return fli_u16(p) | (fli_u16(p + 2) << 16); }

int open_fli(const char *filename)
{
   int w, h, magic;
   close_fli();
   fli_data = read_file(filename, &fli_size);
   if (!fli_data || fli_size < 128) { free(fli_data); fli_data = NULL; return FLI_ERROR; }
   magic = fli_u16(4);
   if (magic != 0xAF11 && magic != 0xAF12) { free(fli_data); fli_data = NULL; return FLI_ERROR; }
   fli_frames = fli_u16(6);
   w = fli_u16(8); h = fli_u16(10);
   fli_first = (magic == 0xAF12 && fli_u32(80)) ? fli_u32(80) : 128;
   fli_pos = fli_first;
   fli_frame = 0;
   fli_bitmap = create_bitmap_ex(8, w, h);
   memset(fli_bitmap->dat, 0, w * h);
   memset(fli_palette, 0, sizeof(fli_palette));
   return FLI_OK;
}

void close_fli(void)
{
   if (fli_bitmap) {
      BITMAP *b = fli_bitmap;
      fli_bitmap = NULL;
      destroy_bitmap(b);
   }
   free(fli_data);
   fli_data = NULL;
}

void reset_fli_variables(void) {}

static void fli_chunk(int type, int p, int end)
{
   BITMAP *b = fli_bitmap;
   uint8_t *px = (uint8_t *)b->dat;
   int W = b->w, H = b->h;
   switch (type) {
      case 4:     /* COLOR_256 */
      case 11: {  /* COLOR_64 */
         int packets = fli_u16(p), idx = 0, i;
         p += 2;
         while (packets-- > 0 && p < end) {
            int cnt;
            idx += fli_data[p++];
            cnt = fli_data[p++];
            if (cnt == 0) cnt = 256;
            for (i = 0; i < cnt && idx < 256; i++, idx++, p += 3) {
               int s = type == 4 ? 2 : 0;
               fli_palette[idx].r = fli_data[p] >> s;
               fli_palette[idx].g = fli_data[p + 1] >> s;
               fli_palette[idx].b = fli_data[p + 2] >> s;
            }
         }
         break;
      }
      case 13: memset(px, 0, W * H); break;
      case 16: if (end - p >= W * H) memcpy(px, fli_data + p, W * H); break;
      case 15: {  /* BYTE_RUN */
         int y;
         for (y = 0; y < H && p < end; y++) {
            int x = 0;
            p++;
            while (x < W && p < end) {
               int c = (int8_t)fli_data[p++];
               if (c > 0) { int v = fli_data[p++]; while (c-- && x < W) px[y * W + x++] = (uint8_t)v; }
               else if (c < 0) { c = -c; while (c-- && x < W) px[y * W + x++] = fli_data[p++]; }
            }
         }
         break;
      }
      case 12: {  /* DELTA_FLI */
         int y = fli_u16(p), lines = fli_u16(p + 2);
         p += 4;
         while (lines-- > 0 && p < end && y < H) {
            int packets = fli_data[p++], x = 0;
            while (packets-- > 0) {
               int c;
               x += fli_data[p++];
               c = (int8_t)fli_data[p++];
               if (c > 0) { while (c--) { if (x < W) px[y * W + x] = fli_data[p]; x++; p++; } }
               else if (c < 0) { int v = fli_data[p++]; c = -c; while (c--) { if (x < W) px[y * W + x] = (uint8_t)v; x++; } }
            }
            y++;
         }
         break;
      }
      case 7: {   /* DELTA_FLC */
         int lines = fli_u16(p), y = 0;
         p += 2;
         while (lines > 0 && p < end && y < H) {
            int w = (int16_t)fli_u16(p), x = 0;
            p += 2;
            if ((w & 0xC000) == 0xC000) { y += -w; continue; }
            if ((w & 0xC000) == 0x8000) { if (y < H) px[y * W + W - 1] = (uint8_t)(w & 0xFF); continue; }
            while (w-- > 0) {
               int c;
               x += fli_data[p++];
               c = (int8_t)fli_data[p++];
               if (c > 0) { while (c--) { if (x + 1 < W + 1) { if (x < W) px[y * W + x] = fli_data[p]; if (x + 1 < W) px[y * W + x + 1] = fli_data[p + 1]; } x += 2; p += 2; } }
               else if (c < 0) { int a = fli_data[p], bb = fli_data[p + 1]; p += 2; c = -c; while (c--) { if (x < W) px[y * W + x] = (uint8_t)a; if (x + 1 < W) px[y * W + x + 1] = (uint8_t)bb; x += 2; } }
            }
            y++;
            lines--;
         }
         break;
      }
      default: break;
   }
}

int next_fli_frame(int loop)
{
   int size, type, chunks, p, end;
   if (!fli_data) return FLI_NOT_OPEN;
   for (;;) {
      if (fli_frame >= fli_frames || fli_pos + 16 > fli_size) {
         if (!loop) return FLI_EOF;
         fli_pos = fli_first;
         fli_frame = 0;
      }
      size = fli_u32(fli_pos);
      type = fli_u16(fli_pos + 4);
      if (size < 16 || fli_pos + size > fli_size) {
         if (!loop) return FLI_EOF;
         fli_pos = fli_first; fli_frame = 0;
         continue;
      }
      if (type != 0xF1FA) { fli_pos += size; continue; }   /* prefix chunk etc. */
      break;
   }
   chunks = fli_u16(fli_pos + 6);
   p = fli_pos + 16;
   end = fli_pos + size;
   while (chunks-- > 0 && p + 6 <= end) {
      int csize = fli_u32(p), ctype = fli_u16(p + 4);
      if (csize < 6) break;
      fli_chunk(ctype, p + 6, p + csize < end ? p + csize : end);
      p += csize;
   }
   fli_pos += size;
   fli_frame++;
   return FLI_OK;
}

/* ------------------------------------------------------------------ */
/* sound                                                               */

SAMPLE *load_sample(const char *filename)
{
   char p[260];
   int id;
   SAMPLE *s;
   norm_path(filename, p, sizeof(p));
   id = js_sample_load(p);
   if (id < 0) return NULL;
   s = malloc(sizeof(SAMPLE));
   s->id = id;
   return s;
}

void destroy_sample(SAMPLE *s) { free(s); }

int play_sample(const SAMPLE *s, int vol, int pan, int freq, int loop)
{
   if (s) js_sample_play(s->id, vol, pan, freq, loop);
   return 0;
}

void stop_sample(const SAMPLE *s) { if (s) js_sample_stop(s->id); }

static MIDI *playing_midi;

MIDI *load_midi(const char *filename)
{
   char p[260];
   int id;
   MIDI *m;
   norm_path(filename, p, sizeof(p));
   id = js_midi_load(p);
   if (id < 0) return NULL;
   m = malloc(sizeof(MIDI));
   m->id = id;
   return m;
}

void destroy_midi(MIDI *m)
{
   if (!m) return;
   if (m == playing_midi) { js_midi_stop(); playing_midi = NULL; }
   free(m);
}

int play_midi(MIDI *m, int loop)
{
   playing_midi = m;
   if (m) js_midi_play(m->id, loop);
   else js_midi_stop();
   return 0;
}

int web_mp3_open(const char *filename)
{
   char p[260];
   norm_path(filename, p, sizeof(p));
   return js_mp3_open(p);
}

void web_mp3_play(void) { js_mp3_play(); }
void web_mp3_close(void) { js_mp3_close(); }

/* ------------------------------------------------------------------ */
/* misc                                                                */

/* lets stagefx.c read data files from the pack */
unsigned char *web_read_file(const char *filename, int *size) { return read_file(filename, size); }
