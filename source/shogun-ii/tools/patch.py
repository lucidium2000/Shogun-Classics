# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Turn the original Kof91.c (v1.2, Win32/Allegro 3.9.32) into a version that
builds against the web Allegro layer. The game logic is left untouched; only
the MP3 player (xaudio), the directory scanner and busy-wait loops change."""
import re, sys

src = open(sys.argv[1], 'rb').read().decode('latin-1').replace('\r\n', '\n')

def sub(pattern, repl, count=0, flags=0, expect=None):
    global src
    src, n = re.subn(pattern, repl, src, count=count, flags=flags)
    if expect is not None and n != expect:
        raise SystemExit(f'patch {pattern!r}: expected {expect} matches, got {n}')
    if n == 0:
        raise SystemExit(f'patch {pattern!r}: no match')

# headers
sub(r'#include "allegro/aintern.h"\n', '')
sub(r'#include "xaudio.h"\n#include "decoder.h"\n', '')
sub(r'#include "file_input.h"\n#include "audio_output.h"\n', '')
sub(r'XA_DecoderInfo \*decoder;\n', '')
sub(r'/\* structure for the directory scanning routines \*/\ntypedef struct FFIND_INFO \{.*?\} FFIND_INFO;\n', '', flags=re.S)

# entry point
sub(r'\nmain\(\)\n', '\nint main(void)\n', expect=1)

# busy waits on the 70Hz retrace counter must hand control back to the browser
# The engine lets retrace_count go negative and then never waits, so on any
# machine faster than ~2000-era hardware it runs flat out. Wait until a 70Hz
# tick has actually arrived, which is the frame rate the game was tuned for.
sub(r'while\s*\(\s*!retrace_count\s*\)\s*;;?', 'while (retrace_count <= 0) al_wait_retrace();')

# exit() should stop the game cleanly in the page
src = src.replace('#include "allegro.h"\n', '#include "allegro.h"\nvoid exit_hook(int);\n#define exit(c) exit_hook(c)\nvoid web_music(const char *);\nvoid web_music_stop(void);\nint web_find_char(const char *, int);\nvoid web_win_voice(int);\nint web_story_stage(int);\nint web_stage_index(const char *);\nextern int *web_dbgp[12];\nvoid web_stage_load(const char *);\nvoid web_stage_back(BITMAP *);\nvoid web_stage_front(BITMAP *);\n', 1)

# ---- Shogun II restoration changes ------------------------------------
# Title music: the Shogun song plays from the intro through the main menus,
# then hands over to the select-screen MIDI.
sub(r'MP3_Open \("title.mp3"\)', 'MP3_Open ("music/shogunsong.mp3")', expect=1)
sub(r'   MP3_Close\(\);\n\n   MP3_Exit\(\) ;\n', '', expect=1)
sub(r'(if \( \(music = load_midi \("midi\\\\select.mid" \)\)==NULL\)\n\t  \{\n.*?\n\t  \}\n)\n   play_midi \( music , 1 \) ;\n',
    r'\1', expect=1, flags=re.S)
sub(r'\nDemoniac:\n', '\nDemoniac:\n   web_music("music/shogunsong.mp3");\n', expect=1)
# Character select: "Seven Strokes of Fate" replaces select.mid
sub(r'(allegro_message\("step 4 : load midi"\);\n.*?\n   else\n)   play_midi \( music , 1 \) ;\n',
    r'\1   web_music("music/select.mp3");\n', expect=1, flags=re.S)
# Fights: "Steel Under Storm" and "Iron Beneath the Snow" alternate by stage
sub(r'\n   play_midi \(music , 1\) ;\n\n   set_palette\( fli_palette \);',
    '\n   web_music((bgd & 1) ? "music/fight2.mp3" : "music/fight1.mp3");\n\n   set_palette( fli_palette );', expect=1)

# Rambo song: losing to the computer, and the story-mode ending
sub(r'(\t\tif \(gmode\) Carton_WN = load_bitmap \( "sprites\\\\lose.pcx" , 0 \) ;\n)',
    r'\1\t\tif (gmode) { play_midi(NULL, 0); web_music("music/rambo.mp3"); }\n', expect=1)
sub(r'(\tif \(cy\) // end of game\n\t\{\n)', r'\1\t\tplay_midi(NULL, 0); web_music("music/rambo.mp3");\n', expect=1)

# Keero is the hero: put the select cursor on him first
# (both cursors start on him, and the icon strip is built around that slot
#  instead of assuming slot 1, which put Captain America's icon under Keero)
sub(r'   sel1 = 1 ; cx = 1 ;\n   sel2 = 1 ; cy = 1 ;\n',
    '   sel1 = web_find_char("keero", 1) ; cx = 1 ;\n   sel2 = sel1 ; cy = 1 ;\n', expect=1)
sub(r'\t\tfx = cx ;\n', '\t\tfx = cx + sel1 - 1 ;\n', expect=1)

# each fighter can say a win quote (sprites/<name>/win.wav) as the victory pose starts
sub(r'\t\t\t\tload_win2 \(\);\n', '\t\t\t\tload_win2 (); web_win_voice(sel2);\n', expect=1)
sub(r'\t\t\t\tload_win1 \(\);\n', '\t\t\t\tload_win1 (); web_win_voice(sel1);\n', expect=1)

# Story mode fights each opponent in their own place; the other modes use the stage picked
# on the stage-select screen
sub(r'\nforeground = animated = 0 ;\n', '\nforeground = animated = 0 ;\n   if (gmode == 2 || bgd < 0 || bgd >= nbbkgd) bgd = web_story_stage(sel2) ;\n', expect=1)

# Difficulty against the computer starts on EASY (it was MEDIUM)
sub(r'\t   cx = 1 ;\n\t   cy = 42 ;\n\n\t   diff = 1 ;\n', '\t   cx = 1 ;\n\t   cy = 27 ;\n\n\t   diff = 0 ;\n', expect=1)

# menu loops that test the pad without polling it: the touch/gamepad punch
# button never registered on NEXT OPPONENT, GAME OVER/ending and the pause menu
sub(r'\t\t\trest\(20\);\n\n\n(\t\t\t?)if \( \(key\[p2_spunch\]\)', r'\t\t\trest(20);\n\t\t\tpoll_joystick();\n\n\1if ( (key[p2_spunch])', expect=2)
sub(r'(\n\t\t\t\t  textout_centre \( virtscreen , font ,"CONTINUE",)', r'\n\t\t\t\t  poll_joystick();\1', expect=1)

# HPOWER: the bar used to fill only from special moves (+10 each).  Landing a
# hit now adds 3 for the attacker and 2 for the one taking it, so a full bar
# (60) and the super it unlocks come up a few times a fight
for P, A, V in (('2', '1', '2'), ('', '2', '1')):
    sub(r'(\thflag%s\+\+ ;\n\n\tif \( hflag%s < (?:17|25) \) life%s = life%s - damag%s ;)' % (P, P, V, V, V),
        r'\1\n\tif ( hflag%s == 1 ) { spower%s += 3 ; spower%s += 2 ; }' % (P, A, V), expect=3)

# Stage select: the button that picked the fighter was still held when this
# screen opened, so it confirmed the first stage on its own frame and the
# screen never seemed to work.  Wait for every button to be let go first,
# step one stage per press, and skip the screen in story mode (each
# opponent has a home stage there)
sub(r'\n   fx =1 ;\n\n   retrace_count = 0 ;\n\n   poll_joystick\(\);\n\n   while \( cx \)',
    '\n   if (gmode == 2) cx = 0 ;\n'
    '   do { poll_joystick() ; al_wait_retrace() ; }\n'
    '   while ( cx && ( key[KEY_ENTER] || key[p2_spunch] || key[p2_skick] || key[p2_wpunch] || key[p2_wkick]\n'
    '          || P1_WK || P1_SK || P1_WP || P1_SP || P1_LT || P1_RT || key[p2_left] || key[p2_right] ) ) ;\n'
    '\n   fx =1 ;\n\n   retrace_count = 0 ;\n\n   poll_joystick();\n\n   while ( cx )', expect=1)
sub(r'(260, 160\) ;\n\n\t\tBing\(\);)', r'\1\n\t\trest(180) ;', expect=2)

# ...and holding a direction (or a touch pad that reports a hold) still
# spun through the stages, so a stage now moves once per press: the
# direction has to be let go before it moves again
sub(r'(\n\tif\( P1_LT \|\| \(key\[p2_left\]\) \) \n\n\t\{\n\t\tbgd-- ;)',
    r'\n\t{ int d = ( P1_LT || key[p2_left] ) ? -1 : ( P1_RT || key[p2_right] ) ? 1 : 0 ;'
    r' web_sdir_new = ( d != web_sdir ) ? d : 0 ; web_sdir = d ; }'
    r'\n\tif( web_sdir_new < 0 ) \n\n\t{\n\t\tbgd-- ;', expect=1)
sub(r'\n\tif\( P1_RT \|\| \(key\[p2_right\]\) \) \n\n\t\{\n        bgd\+\+ ;',
    r'\n\tif( web_sdir_new > 0 ) \n\n\t{\n        bgd++ ;', expect=1)
sub(r'(\n   fx =1 ;\n\n   retrace_count = 0 ;\n\n   poll_joystick\(\);\n\n   while \( cx \))',
    r'\n   web_sdir = web_sdir_new = 0 ;\1', expect=1)
sub(r'(\nint bkgdlim ;\n)', r'\1static int web_sdir, web_sdir_new ;\n', expect=1)
# the stage screen only looked at the pad every third frame, so a quick tap
# could fall between looks; with one move per press it can look every frame
sub(r'("< select background >".*?\nif \(fx<)1(\)\n)', r'\g<1>9\2', count=1, flags=re.S, expect=1)

# point the test hook at the fight state
sub(r'(\n/\*+ THE REAL GAME STARTS HERE \*+/\n)',
    r'\n   { int *p[12] = { &actual, &actual2, &spower1, &spower2, &life1, &life2, &spr1x, &spr2x, &spr1y, &spr2y, &sol1, &cx } ;'
    r' int i ; for (i = 0 ; i < 12 ; i++) web_dbgp[i] = p[i] ; }\1', expect=1)

# Character select: the starting fighter's portrait and name never showed
# until you moved, because "previous pick" started at 2, which is the
# default pick (Keero).  And one tap could jump two or three fighters, so each
# step now waits a moment
sub(r'oldsel1 =2 ;\n   oldsel2 =2 ;', 'oldsel1 = -1 ;\n   oldsel2 = -1 ;', expect=1)
sub(r'p2_sel = 1 ; oldsel2 =2 ;', 'p2_sel = 1 ; oldsel2 = -1 ;', expect=1)
sub(r'(\n\t+Bing\(\);)(\n\t+sel[12](?:--|\+\+) ;)', r'\1 rest(140) ;\2', expect=4)

# Living stages (stagefx.c): animation layers behind the fighters are drawn
# right after the background, layers marked "front" just before the
# foreground picture; both are loaded with the stage
sub(r'(void blit_Bkgd \(void\)\n\{.*?)\n\}\n', r'\1\n   web_stage_back(zoomscreen) ;\n}\n', count=1, flags=re.S, expect=1)
sub(r'if \(foreground\)(\s*)masked_blit \( Frgd, zoomscreen ,', r'web_stage_front(zoomscreen) ;\n\tif (foreground)\1masked_blit ( Frgd, zoomscreen ,', expect=8)
sub(r'(zoomscreen = create_bitmap\( Bkgd->w, Bkgd->h\) ;)', r'\1\n\tweb_stage_load(bkgdname[bgd]) ;', expect=1)

# The tournament arena is the home stage: it's the first pick on the stage-select
# screen and the first fight of a story run
sub(r'\n   cx = 1 ;\n   bgd = 1 ;\n', '\n   cx = 1 ;\n   bgd = web_stage_index("arena.pcx") ;\n', expect=1)

# Special-move inputs: the engine dropped a motion the moment any state not
# in the sequence showed up (the neutral between back and forward, the
# diagonal between down and forward), which made specials very hard to do.
# Now an in-between state is ignored for up to a third of a second.
sub(r'\tchar nb ;\n\n\};', '\tchar nb ;\n\tint idle ;\n\n};', expect=1)
for pl in ('1', '2'):
    for mv in ('fireb', 'rush', 'smove', 'firebx', 'rushx', 'smovex'):
        P = 'p%s.%s' % (pl, mv)
        sub(r'\{ %s\.succ = 1 ; %s\.nb = 0 ; \}' % (re.escape(P), re.escape(P)),
            '{ %s.succ = 1 ; %s.nb = 0 ; %s.idle = 0 ; }' % (P, P, P), expect=1)
        sub(r'\{\n(\t+)  %s\.nb\+\+ ; ' % re.escape(P),
            r'{\n\1  %s.idle = 0 ; %s.nb++ ; ' % (P, P), expect=1)
        sub(r'if \( !check_kstatus%s\(last_status%s\) \) %s\.succ = 0 ;' % (pl, pl, re.escape(P)),
            'if ( !check_kstatus%s(last_status%s) && ++%s.idle > 20 ) %s.succ = 0 ;' % (pl, pl, P, P), expect=1)
        sub(r'(\n\t\t  \}\n\n\t\t  else) %s\.succ = 0 ;' % re.escape(P),
            r'\1 if ( ++%s.idle > 20 ) %s.succ = 0 ;' % (P, P), expect=1)

# replace the Win32 directory scanner and the xaudio MP3 player
cut = src.rindex('int scan_files(char *name, int attrib, char what )')
src = src[:cut] + r'''
int scan_files(char *name, int attrib, char what )
{
   if (what == 0) return web_scan_dir(name, 1, charname, 1000);
   if (what == 1) return web_scan_dir(name, 0, bkgdname, 200);
   return web_scan_dir(name, 0, flcname, 100);
}

int MP3_Init (void) { return 1 ; }
void MP3_Exit (void) { }
int MP3_Open (char *mp3file) { return mp3 ? web_mp3_open(mp3file) : 0 ; }
int MP3_Play (void) { if (mp3) web_mp3_play() ; return 0 ; }
int MP3_Close (void) { web_mp3_close() ; return 0 ; }

void web_music(const char *file) { web_mp3_open(file) ; web_mp3_play() ; }
void web_music_stop(void) { web_mp3_close() ; }
int web_find_char(const char *name, int fallback)
{
   int i ;
   for (i = 0 ; i < nbchar ; i++) if (!strcasecmp(charname[i], name)) return i ;
   return fallback ;
}
int web_stage_index(const char *want)
{
   int i ;
   for (i = 0 ; i < nbbkgd ; i++) if (!strcasecmp(bkgdname[i], want)) return i ;
   return 0 ;
}
int web_story_stage(int s)
{
   static const char *home[][2] = {
      {"onikage", "arena.pcx"}, {"frill", "forest.pcx"}, {"yamana", "temple.pcx"},
      {"wanfu", "temple.pcx"}, {"shokei", "forest.pcx"}, {"keero", "arena.pcx"}, {"corbin", "cfbk2.pcx"} } ;
   const char *want = "arena.pcx" ;
   int i ;
   for (i = 0 ; i < 7 ; i++) if (!strcasecmp(charname[s], home[i][0])) want = home[i][1] ;
   if (gmode == 2) {                     /* nobody beaten yet: start at home */
      int beaten = 0 ;
      for (i = 0 ; i < nbchar ; i++) beaten |= defeated[i] ;
      if (!beaten) want = "arena.pcx" ;
   }
   for (i = 0 ; i < nbbkgd ; i++) if (!strcasecmp(bkgdname[i], want)) return i ;
   return 0 ;
}
/* test hook: lets the browser test harness read the fight state (main's locals) */
int *web_dbgp[12] ;
__attribute__((export_name("web_dbg"))) int web_dbg(int i)
{
   return (i >= 0 && i < 12 && web_dbgp[i]) ? *web_dbgp[i] : -1 ;
}
__attribute__((export_name("web_dbg_set"))) void web_dbg_set(int i, int v)
{
   if (i >= 0 && i < 12 && web_dbgp[i]) *web_dbgp[i] = v ;
}
void web_win_voice(int s)
{
   static SAMPLE *v ;
   char f[300] ;
   if (v) { destroy_sample(v) ; v = 0 ; }
   strcpy(f, "sprites/") ; strcat(f, charname[s]) ; strcat(f, "/win.wav") ;
   v = load_sample(f) ;
   if (v) play_sample(v, 255, 128, 1000, 0) ;
}
'''

open(sys.argv[2], 'w').write(src)
