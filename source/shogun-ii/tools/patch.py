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
src = src.replace('#include "allegro.h"\n', '#include "allegro.h"\nvoid exit_hook(int);\n#define exit(c) exit_hook(c)\nvoid web_music(const char *);\nvoid web_music_stop(void);\nint web_find_char(const char *, int);\nvoid web_win_voice(int);\nint web_story_stage(int);\n', 1)

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

# Against the computer the game never chose a stage (bgd was left over from the scrolling
# select pattern), so each opponent now fights in their own place
sub(r'\nforeground = animated = 0 ;\n', '\nforeground = animated = 0 ;\n   if (gmode || bgd < 0 || bgd >= nbbkgd) bgd = web_story_stage(sel2) ;\n', expect=1)

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
int web_story_stage(int s)
{
   static const char *home[][2] = {
      {"onikage", "keep.pcx"}, {"frill", "village.pcx"}, {"yamana", "harbor.pcx"},
      {"wanfu", "snowpass.pcx"}, {"shokei", "snowpass.pcx"}, {"keero", "harbor.pcx"}, {"corbin", "cfbk2.pcx"} } ;
   const char *want = "snowpass.pcx" ;
   int i ;
   for (i = 0 ; i < 7 ; i++) if (!strcasecmp(charname[s], home[i][0])) want = home[i][1] ;
   for (i = 0 ; i < nbbkgd ; i++) if (!strcasecmp(bkgdname[i], want)) return i ;
   return 0 ;
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
