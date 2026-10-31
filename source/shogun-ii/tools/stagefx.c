// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* Living stages: optional animation layers for a background, read from
   bkgds/fx/<stage>.txt.  One layer per line, numbers in stage pixels:

     anim  X Y DELAY  f1.pcx f2.pcx ...        masked frames cycled every DELAY ticks
     glow  X Y PERIOD LO HI  col.pcx alpha.pcx  added light, strength pulsing LO..HI (0-255)
     mist  X Y SPEED  LO HI PERIOD col.pcx alpha.pcx
                                                blended haze, scrolling SPEED/16 px per tick
     parts N X0 Y0 X1 Y1 VX VY SWAY sprite.pcx  drifting particles (VX, VY in 1/16 px per tick)

   Put "front" as the first word to draw a layer in front of the fighters.
   File names are relative to bkgds/fx/.  A tick is one drawn frame. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <math.h>
#include "allegro.h"

unsigned char *web_read_file(const char *filename, int *size);

enum { FX_ANIM, FX_GLOW, FX_MIST, FX_PARTS };
#define MAXF 16
#define MAXP 48
#define KEY 0xF81F

typedef struct {
   int type, front, x, y, delay, n, period, lo, hi, speed;
   BITMAP *f[MAXF], *a[MAXF];
   int count, x0, y0, x1, y1, vx, vy, sway;
   int px[MAXP], py[MAXP], ph[MAXP];      /* particle positions in 1/16 px */
} FX;

static FX fx[24];
static int nfx, tick;

static void fx_free(void)
{
   int i, j;
   for (i = 0; i < nfx; i++)
      for (j = 0; j < MAXF; j++) {
         if (fx[i].f[j]) destroy_bitmap(fx[i].f[j]);
         if (fx[i].a[j]) destroy_bitmap(fx[i].a[j]);
      }
   memset(fx, 0, sizeof(fx));
   nfx = 0;
}

static BITMAP *ld(const char *name)
{
   char p[260];
   snprintf(p, sizeof(p), "bkgds/fx/%s", name);
   return load_pcx(p, NULL);
}

static int rnd(int a, int b) { return b > a ? a + rand() % (b - a) : a; }

void web_stage_load(const char *bkgd)
{
   char p[260], *txt, *line, *next;
   int size, k;
   fx_free();
   tick = 0;
   k = snprintf(p, sizeof(p), "bkgds/fx/%s", bkgd);
   if (k > 4 && !strcmp(p + k - 4, ".pcx")) strcpy(p + k - 4, ".txt");
   txt = (char *)web_read_file(p, &size);
   if (!txt) return;
   txt[size] = 0;
   for (line = txt; line && *line && nfx < 24; line = next) {
      char w[24][64];
      int n = 0, i = 0;
      FX *e = &fx[nfx];
      next = strchr(line, '\n');
      if (next) *next++ = 0;
      while (n < 24) {
         int c = 0;
         while (line[i] == ' ' || line[i] == '\t' || line[i] == '\r') i++;
         if (!line[i] || line[i] == '#') break;
         while (line[i] && line[i] != ' ' && line[i] != '\t' && line[i] != '\r' && c < 63) w[n][c++] = line[i++];
         w[n++][c] = 0;
      }
      if (!n) continue;
      i = 0;
      if (!strcmp(w[0], "front")) { e->front = 1; i = 1; }
      if (n - i < 2) continue;
      if (!strcmp(w[i], "anim") && n - i >= 5) {
         int j;
         e->type = FX_ANIM; e->x = atoi(w[i + 1]); e->y = atoi(w[i + 2]); e->delay = atoi(w[i + 3]);
         for (j = i + 4; j < n && e->n < MAXF; j++) if ((e->f[e->n] = ld(w[j]))) e->n++;
         if (e->n) nfx++;
      }
      else if (!strcmp(w[i], "glow") && n - i >= 8) {
         e->type = FX_GLOW; e->x = atoi(w[i + 1]); e->y = atoi(w[i + 2]); e->period = atoi(w[i + 3]);
         e->lo = atoi(w[i + 4]); e->hi = atoi(w[i + 5]);
         e->f[0] = ld(w[i + 6]); e->a[0] = ld(w[i + 7]);
         if (e->f[0] && e->a[0]) nfx++;
      }
      else if (!strcmp(w[i], "mist") && n - i >= 9) {
         e->type = FX_MIST; e->x = atoi(w[i + 1]); e->y = atoi(w[i + 2]); e->speed = atoi(w[i + 3]);
         e->lo = atoi(w[i + 4]); e->hi = atoi(w[i + 5]); e->period = atoi(w[i + 6]);
         e->f[0] = ld(w[i + 7]); e->a[0] = ld(w[i + 8]);
         if (e->f[0] && e->a[0]) nfx++;
      }
      else if (!strcmp(w[i], "parts") && n - i >= 10) {
         int j;
         e->type = FX_PARTS; e->count = atoi(w[i + 1]);
         if (e->count > MAXP) e->count = MAXP;
         e->x0 = atoi(w[i + 2]); e->y0 = atoi(w[i + 3]); e->x1 = atoi(w[i + 4]); e->y1 = atoi(w[i + 5]);
         e->vx = atoi(w[i + 6]); e->vy = atoi(w[i + 7]); e->sway = atoi(w[i + 8]);
         for (j = i + 9; j < n && e->n < MAXF; j++) if ((e->f[e->n] = ld(w[j]))) e->n++;
         for (j = 0; j < e->count; j++) {
            e->px[j] = rnd(e->x0, e->x1) * 16; e->py[j] = rnd(e->y0, e->y1) * 16; e->ph[j] = rand() % 628;
         }
         if (e->n) nfx++;
      }
   }
   free(txt);
}

static inline int px16(BITMAP *b, int x, int y) { return ((uint16_t *)b->dat)[y * b->w + x]; }

/* src * alpha added to (glow) or mixed into (mist) dst; alpha = green of a, scaled by s/255 */
static void overlay(BITMAP *dst, BITMAP *src, BITMAP *a, int dx, int dy, int s, int add, int scroll)
{
   int x, y;
   if (!dst || dst->depth != 16 || src->depth != 16 || a->depth != 16) return;
   for (y = 0; y < src->h; y++) {
      int ty = dy + y;
      uint16_t *d;
      if (ty < 0 || ty >= dst->h) continue;
      d = (uint16_t *)dst->dat + ty * dst->w;
      for (x = 0; x < src->w; x++) {
         int tx = dx + x, sx = scroll ? (x + scroll) % src->w : x;
         int al, c, o, r, g, b;
         if (tx < 0 || tx >= dst->w) continue;
         al = ((px16(a, sx, y) >> 5) & 63) * s / 63;
         if (al <= 2) continue;
         c = px16(src, sx, y); o = d[tx];
         if (add) {
            r = (o >> 11) + (((c >> 11) * al) >> 8);
            g = ((o >> 5) & 63) + ((((c >> 5) & 63) * al) >> 8);
            b = (o & 31) + (((c & 31) * al) >> 8);
         } else {
            r = (o >> 11) + ((((c >> 11) - (o >> 11)) * al) >> 8);
            g = ((o >> 5) & 63) + (((((c >> 5) & 63) - ((o >> 5) & 63)) * al) >> 8);
            b = (o & 31) + ((((c & 31) - (o & 31)) * al) >> 8);
         }
         if (r > 31) r = 31; if (g > 63) g = 63; if (b > 31) b = 31;
         if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
         d[tx] = (uint16_t)((r << 11) | (g << 5) | b);
      }
   }
}

static int pulse(FX *e)
{
   double t = e->period > 0 ? sin(tick * 6.2831853 / e->period) : 0;
   return e->lo + (int)((e->hi - e->lo) * (t + 1) / 2);
}

static void draw(BITMAP *dst, int front)
{
   int i, j;
   for (i = 0; i < nfx; i++) {
      FX *e = &fx[i];
      if (e->front != front) continue;
      switch (e->type) {
      case FX_ANIM:
         draw_sprite(dst, e->f[(tick / (e->delay > 0 ? e->delay : 1)) % e->n], e->x, e->y);
         break;
      case FX_GLOW:
         overlay(dst, e->f[0], e->a[0], e->x, e->y, pulse(e), 1, 0);
         break;
      case FX_MIST:
         overlay(dst, e->f[0], e->a[0], e->x, e->y, pulse(e), 0, (tick * e->speed / 16) % e->f[0]->w);
         break;
      case FX_PARTS:
         for (j = 0; j < e->count; j++) {
            BITMAP *s = e->f[j % e->n];
            int sw = (int)(e->sway * sin((tick * 3 + e->ph[j]) / 100.0));
            e->px[j] += e->vx; e->py[j] += e->vy;
            if (e->py[j] > e->y1 * 16) { e->py[j] = e->y0 * 16; e->px[j] = rnd(e->x0, e->x1) * 16; }
            if (e->py[j] < e->y0 * 16) { e->py[j] = e->y1 * 16; e->px[j] = rnd(e->x0, e->x1) * 16; }
            if (e->px[j] > e->x1 * 16) e->px[j] = e->x0 * 16;
            if (e->px[j] < e->x0 * 16) e->px[j] = e->x1 * 16;
            draw_sprite(dst, s, e->px[j] / 16 + sw, e->py[j] / 16);
         }
         break;
      }
   }
}

void web_stage_back(BITMAP *dst) { tick++; draw(dst, 0); }
void web_stage_front(BITMAP *dst) { draw(dst, 1); }

__attribute__((export_name("web_fx"))) int web_fx(int i)
{
   return i == 0 ? nfx : i == 1 ? tick : i == 2 ? (nfx ? fx[0].n : -1) : 0;
}
