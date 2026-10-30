// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
/* Minimal Allegro 3.9/4.0 compatible layer for running KOF91 in the browser.
   Only the parts of the API that Kof91.c uses are implemented. */
#ifndef WEB_ALLEGRO_H
#define WEB_ALLEGRO_H

#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>

#define END_OF_MAIN()

typedef struct BITMAP {
   int w, h;
   int depth;               /* 8 or 16 */
   void *dat;               /* uint8_t* or uint16_t* */
} BITMAP;

typedef BITMAP RLE_SPRITE;

typedef struct RGB { unsigned char r, g, b, filler; } RGB;
typedef RGB PALETTE[256];
typedef RGB PALLETE[256];

typedef struct FONT FONT;

typedef struct DATAFILE {
   void *dat;
   int type;
   long size;
   void *prop;
} DATAFILE;

typedef struct SAMPLE { int id; } SAMPLE;
typedef struct MIDI { int id; } MIDI;

typedef struct JOYSTICK_BUTTON_INFO { int b; const char *name; } JOYSTICK_BUTTON_INFO;
typedef struct JOYSTICK_AXIS_INFO { int pos; int d1, d2; const char *name; } JOYSTICK_AXIS_INFO;
typedef struct JOYSTICK_STICK_INFO { int flags; int num_axis; JOYSTICK_AXIS_INFO axis[3]; const char *name; } JOYSTICK_STICK_INFO;
typedef struct JOYSTICK_INFO { int flags; int num_sticks; int num_buttons; JOYSTICK_STICK_INFO stick[5]; JOYSTICK_BUTTON_INFO button[16]; } JOYSTICK_INFO;

extern JOYSTICK_INFO joy[4];
extern int joy_type;

extern BITMAP *screen;
extern FONT *font;
extern volatile char key[128];
extern volatile int retrace_count;
extern BITMAP *fli_bitmap;
extern PALETTE fli_palette;
extern PALETTE black_palette;
extern int *allegro_errno;
extern char allegro_error[];

/* key codes (Allegro 4.0 numbering, matches KOF91's game.ini) */
enum {
   KEY_A = 1, KEY_B, KEY_C, KEY_D, KEY_E, KEY_F, KEY_G, KEY_H, KEY_I, KEY_J, KEY_K, KEY_L, KEY_M,
   KEY_N, KEY_O, KEY_P, KEY_Q, KEY_R, KEY_S, KEY_T, KEY_U, KEY_V, KEY_W, KEY_X, KEY_Y, KEY_Z,
   KEY_0, KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9,
   KEY_0_PAD, KEY_1_PAD, KEY_2_PAD, KEY_3_PAD, KEY_4_PAD, KEY_5_PAD, KEY_6_PAD, KEY_7_PAD, KEY_8_PAD, KEY_9_PAD,
   KEY_F1, KEY_F2, KEY_F3, KEY_F4, KEY_F5, KEY_F6, KEY_F7, KEY_F8, KEY_F9, KEY_F10, KEY_F11, KEY_F12,
   KEY_ESC, KEY_TILDE, KEY_MINUS, KEY_EQUALS, KEY_BACKSPACE, KEY_TAB, KEY_OPENBRACE, KEY_CLOSEBRACE,
   KEY_ENTER, KEY_COLON, KEY_QUOTE, KEY_BACKSLASH, KEY_BACKSLASH2, KEY_COMMA, KEY_STOP, KEY_SLASH,
   KEY_SPACE, KEY_INSERT, KEY_DEL, KEY_HOME, KEY_END, KEY_PGUP, KEY_PGDN, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN,
   KEY_SLASH_PAD, KEY_ASTERISK, KEY_MINUS_PAD, KEY_PLUS_PAD, KEY_DEL_PAD, KEY_ENTER_PAD,
   KEY_MAX = 128
};

#define DRAW_MODE_SOLID          0
#define DRAW_MODE_XOR            1
#define DRAW_MODE_COPY_PATTERN   2
#define DRAW_MODE_SOLID_PATTERN  3
#define DRAW_MODE_MASKED_PATTERN 4
#define DRAW_MODE_TRANS          5

#define DIGI_AUTODETECT -1
#define DIGI_NONE 0
#define MIDI_AUTODETECT -1
#define MIDI_NONE 0
#define GFX_TEXT -1
#define GFX_AUTODETECT 0
#define GFX_DIRECTX_ACCEL 1
#define GFX_DIRECTX_SOFT 2
#define GFX_DIRECTX_WIN 3
#define JOY_TYPE_AUTODETECT -1
#define JOY_TYPE_NONE 0

#define FLI_OK 0
#define FLI_EOF -1
#define FLI_ERROR -2
#define FLI_NOT_OPEN -3

#define FA_RDONLY 1
#define FA_HIDDEN 2
#define FA_SYSTEM 4
#define FA_LABEL 8
#define FA_DIREC 16
#define FA_ARCH 32

/* system */
int allegro_init(void);
void allegro_exit(void);
void allegro_message(const char *fmt, ...);
void set_window_title(const char *name);
int install_timer(void);
int install_keyboard(void);
void remove_keyboard(void);
int install_joystick(int type);
int poll_joystick(void);
int install_sound(int digi, int midi, const char *cfg);
void set_volume(int digi, int midi);
void rest(long ms);
void vsync(void);
int keypressed(void);
int readkey(void);
void clear_keybuf(void);
void simulate_keypress(int k);
void al_wait_retrace(void);

/* config */
void set_config_file(const char *filename);
void override_config_file(const char *filename);
const char *get_config_string(const char *section, const char *name, const char *def);
int get_config_int(const char *section, const char *name, int def);

/* graphics */
void set_color_depth(int depth);
int set_gfx_mode(int card, int w, int h, int vw, int vh);
void set_palette(const RGB *p);
int makecol(int r, int g, int b);
BITMAP *create_bitmap(int w, int h);
void destroy_bitmap(BITMAP *b);
BITMAP *load_pcx(const char *filename, RGB *pal);
BITMAP *load_bitmap(const char *filename, RGB *pal);
RLE_SPRITE *get_rle_sprite(BITMAP *b);
void destroy_rle_sprite(RLE_SPRITE *s);
void draw_rle_sprite(BITMAP *dst, RLE_SPRITE *s, int x, int y);
void acquire_screen(void);
void release_screen(void);
void clear(BITMAP *b);
void clear_to_color(BITMAP *b, int c);
void putpixel(BITMAP *b, int x, int y, int c);
int getpixel(BITMAP *b, int x, int y);
void hline(BITMAP *b, int x1, int y, int x2, int c);
void rect(BITMAP *b, int x1, int y1, int x2, int y2, int c);
void rectfill(BITMAP *b, int x1, int y1, int x2, int y2, int c);
void drawing_mode(int mode, BITMAP *pattern, int x_anchor, int y_anchor);
void blit(BITMAP *src, BITMAP *dst, int sx, int sy, int dx, int dy, int w, int h);
void masked_blit(BITMAP *src, BITMAP *dst, int sx, int sy, int dx, int dy, int w, int h);
void stretch_blit(BITMAP *src, BITMAP *dst, int sx, int sy, int sw, int sh, int dx, int dy, int dw, int dh);
void stretch_sprite(BITMAP *dst, BITMAP *src, int x, int y, int w, int h);
void draw_sprite(BITMAP *dst, BITMAP *src, int x, int y);
void draw_sprite_h_flip(BITMAP *dst, BITMAP *src, int x, int y);
void set_trans_blender(int r, int g, int b, int a);
void draw_trans_sprite(BITMAP *dst, BITMAP *src, int x, int y);
void draw_lit_sprite(BITMAP *dst, BITMAP *src, int x, int y, int color);
void fade_out(int speed);
void text_mode(int mode);
void textout(BITMAP *b, FONT *f, const char *s, int x, int y, int c);
void textout_centre(BITMAP *b, FONT *f, const char *s, int x, int y, int c);
int text_length(FONT *f, const char *s);

/* datafiles */
DATAFILE *load_datafile(const char *filename);
void unload_datafile(DATAFILE *d);

/* FLI/FLC */
int open_fli(const char *filename);
void close_fli(void);
int next_fli_frame(int loop);
void reset_fli_variables(void);

/* sound */
SAMPLE *load_sample(const char *filename);
void destroy_sample(SAMPLE *s);
int play_sample(const SAMPLE *s, int vol, int pan, int freq, int loop);
void stop_sample(const SAMPLE *s);
MIDI *load_midi(const char *filename);
void destroy_midi(MIDI *m);
int play_midi(MIDI *m, int loop);

/* web-only helpers */
int web_mp3_open(const char *filename);
void web_mp3_play(void);
void web_mp3_close(void);
int web_scan_dir(const char *pattern, int dirs, char names[][30], int max);

/* misc C library bits the Windows build had */
char *gcvt(double value, int ndigit, char *buf);
#define ustrchr strchr
#define ustrlen strlen
#define ustrncpy(d, s, n) (strncpy((d), (s), (n)), (d)[(n) - 1] = 0, (d))
#define ustrncat strncat

#endif
