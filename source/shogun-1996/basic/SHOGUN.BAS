DECLARE SUB TPLAY ()
REM***HERE YOU GO CHRIS......SHOULDN'T YOU BE WORKING ON GRAPHICS?***
DECLARE SUB REEP (PN$)
DECLARE SUB FATALSHOGUN (PN$)
DECLARE SUB SHOGUNL2 (PN$)
REEP (PN$)
LET RR = 1
CLS
SCREEN 12
OVR: COLOR 11
REM PLAY "T250 O3E O3G O3E"
PRINT ""
PRINT ""
PRINT ""
PRINT "       ██▓▓▒▒░░ ██▓▒"
PRINT "       █▓▒       █▓▒"
PRINT "       █▓▒       █▓▒                                   (R)"
PRINT "       █▓▒       █▓▒▒▒░░ ██▓▒░░ ██▓▒▒░ ██▓ ▒░░ ██▓▓▒░░"
PRINT "       ██▓▓▒▒░░  █▓▒  ▒░ ██  ░░ ██  ▒░ ██▓ ▒░░ ██▓ ▒░░"
PRINT "            █▓▒  █▓▒  ▒░ ██▓▒░░ ██▓▒▒░ ██▓▓▒▒░ ██▓ ▒░░"
PRINT "            █▓▒                    ▓▒░"
PRINT "            █▓▒                 ██▓▒▒░"
PRINT "       ██▓▓▒▒░░    S H O T A K A N   T A K A M A R A"
PRINT ""
PRINT ""
PRINT ""
DRAW "bm30,30 c4 d200 r500 u200 l500"
REM PLAY "T 250 O3E O3F O3G O3A.O3G O3E O3G O3G.O3E O3E"
PRINT "                      PRESS (ENTER) TO BEGIN"
REM PLAY "O0E O0E. O0E"
COLOR 0: INPUT H
COLOR 11: PRINT "                        (1) OR (2) PLAYERS"
CD: B$ = INKEY$
IF B$ = "1" THEN GOTO CHOOSE
IF B$ = "2" THEN CALL TPLAY
GOTO CD
COLOR 11: CLS : PRINT "What type of computer is running this program? A-386=slower  or  B-486=faster"
COMP: SR$ = INKEY$: IF SR$ = "A" THEN LET OV = 1: SCREEN 0: GOTO CHOOSE
IF SR$ = "B" THEN GOTO CHOOSE
GOTO COMP
CHOOSE: CLS
COLOR 14: PRINT "                  CHOOSE YOUR FIGHTER"
COLOR 6: PRINT "                ▄               ▓▒    ▄     ▒░"
PRINT "               █╪░               ▓▒  █╫░   ▒▒"
PRINT "             ██▓▓▒▒░              ███▓▓▒▒░░░"
PRINT "            █▓▓▒▒░░▓▒              ██▓▓▒▒░░"
PRINT "            █▓ ▓▒░ ▓▒                ▓▒▒░"
PRINT "           █▓  ▓▒░  ▓▒               ▓▓░░"
PRINT "              ▓▒▒░░                 ▓▒▒▒░░"
PRINT "              ▓▒ ░░                 ▓▒  ░░"
PRINT "             ▓▒░ ▓▒░               ▓▒░  ░▒░"
PRINT "             ▓▒░ ▓▒░               ▓▒░  ▒░░"
PRINT ""
COLOR 15: PRINT "              Keero                 Sho'ki"
PRINT : PRINT : PRINT : PRINT
PRINT "  Press 'K' for Keero, 'S' for Sho'ki"
IF OV = 0 THEN DRAW "bm10,260 c4 d40 r310 u40 l310"
PRINT : PRINT
CH: CHOICE$ = INKEY$
IF CHOICE$ = "" THEN GOTO CH
IF (CHOICE$ = CHR$(75)) OR (CHOICE$ = CHR$(107)) THEN
 IF OV = 0 THEN DRAW "bm80,19 c3 d161 r100 u161 l100":
    PN$ = "KEERO"
      END IF
IF (CHOICE$ = CHR$(83)) OR (CHOICE$ = CHR$(115)) THEN
    PN$ = "SHO'KI"
    IF OV = 0 THEN DRAW "bm250,15 c3 d168 r123 u168 l123":
      END IF
IF CHOICE$ = ">" THEN LET PN$ = "KEERO": PRINT PN$; ", YOU PRECEED WAN'FU, YOU FIGHT THE MIGHTY YAMANA": FOR N = 1 TO 50000: NEXT N: CALL SHOGUNL2(PN$)
IF CHOICE$ = "<" THEN LET PN$ = "SHO'KI": PRINT PN$; ", YOU PRECEED WAN'FU, YOU FIGHT THE MIGHTY YAMANA": FOR N = 1 TO 50000: NEXT N: CALL SHOGUNL2(PN$)
FOR d = 1 TO 10000
NEXT d
IF PN$ = "SHO'KI" THEN GOTO PLAYER2
IF PN$ = "KEERO" THEN GOTO PLAYER1
GOTO CHOOSE
PLAYER1: CLS
LOCATE 10, 10
COLOR 4
PLAY "T250 O0E O0G O0E- O0E O0G- O0G"
PRINT " WE SHALL NOW SEE YOUR TALENT, YOU WEAK-WILLED WARRIOR....  "
PLAY "T250 O1E- O1E- O1E O1E O1E- O1E- O1E O1E"
NEXTROUND: LET ONE = 10: LET TWO = 10
POWER: IF ONE = 10 THEN LET P$ = "░▒▒▓▓▓▓███  "
IF ONE = 9 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4 THEN LET P$ = "░▒▒▓        "
IF ONE = 3 THEN LET P$ = "░▒▒         "
IF ONE = 2 THEN LET P$ = "░▒          "
IF ONE = 1 THEN LET P$ = "░           "
IF ONE = 9.5 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8.5 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7.5 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6.5 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5.5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4.5 THEN LET P$ = "░▒▒▓        "
IF ONE = 3.5 THEN LET P$ = "░▒▒         "
IF ONE = 2.5 THEN LET P$ = "░▒          "
IF ONE = 1.5 THEN LET P$ = "░           "
IF ONE = .5 THEN LET P$ = "░           "
IF ONE = 0 THEN LET P$ = "            "
IF TWO = 10 THEN LET PA$ = "░▒▒▓▓▓▓███"
IF TWO = 9 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4 THEN LET PA$ = "░▒▒▓"
IF TWO = 3 THEN LET PA$ = "░▒▒"
IF TWO = 2 THEN LET PA$ = "░▒ "
IF TWO = 1 THEN LET PA$ = "░   "
IF TWO = 0 THEN LET PA$ = "          "
IF TWO = 9.5 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8.5 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7.5 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6.5 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5.5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4.5 THEN LET PA$ = "░▒▒▓"
IF TWO = 3.5 THEN LET PA$ = "░▒▒"
IF TWO = 2.5 THEN LET PA$ = "░▒ "
IF TWO = 1.5 THEN LET PA$ = "░   "
IF TWO = .5 THEN LET PA$ = "░   "
IF k = 1 THEN GOTO BLOCK
REDO: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                ▄                ▄                     "
PRINT "               █╪▓              █▓▒                     "
PRINT "              █▓▒▒░  ▒         ▓0|0░                     "
PRINT "             █ █▓▒ ▓▄▓     ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________     "

MENU: IF F = 1 THEN GOTO MMENU
IF (ONE < 1) AND (RDT = 1) THEN GOTO TWIN
IF ONE < 1 THEN GOTO TWIN
IF (TWO < 1) AND (RD = 1) THEN GOTO FWIN
IF TWO < 1 THEN GOTO WIN
IF BL = 1 THEN GOTO SKIP
LET x% = 0
SKIP: COLOR 15: COLOR 0:
LET BL = 0:
IMPUG: REM ******PLEASE FIND A KEYBOARD BUFFER CLEAR STATEMENT*********
INPUG: LET G$ = "I": G$ = INKEY$: IF G$ = " " THEN GOTO HIT
MMENU: IF G$ = "2" THEN GOTO SIT
MMMENU: IF G$ = "8" THEN GOTO JUMP
IF G$ = "4" THEN GOTO BLOCK
IF G$ = "0" THEN GOTO REDO
IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO BLOCK
IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG
RANDOMIZE TIMER: x% = INT(RND * 6)
IF x% = 2 THEN GOTO EHIT
IF x% = 1 THEN GOTO EHIT
IF x% = 0 THEN GOTO EKICK
GOTO INPUG
HIT: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      WAN'FU             "
COLOR 6: LET BL = 0
PRINT ""
PRINT ""
PRINT ""
PRINT "                                        ▄ "
PRINT "                  ▄                ▄  *      ▄"
PRINT "                ▄█╪▓              █▓▒  0 ▄     "
PRINT "              █▓██▓▒▒▒▒░░░╟------█0| ▓--                  "
PRINT "            █▓  █▓▒▀       ████▒▒▒▒▒░░░░░                        "
PRINT "           █▓  ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░    ▄                   "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________"
COLOR 6
LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN:
LET TWO = TWO - .5: GOTO POWER
JUMPKICK: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT " "
PRINT "                        ▄     ░▀"
PRINT "                       █╪▒  ░░            ▄"
PRINT "                  ▓███▓▒▒░░░▀"
PRINT "                 █▓   ▓▒░        ▄   *   ▄               "
PRINT "                █▓   █▓▒▒     ▒░█▓▒   ▄     0             "
PRINT "                    █▓ █▓▓▓▒▒▒░░0| ░      *               "
PRINT "                   █▓      ████▒▒▒▒▒░░░░░                        "
PRINT "                    ▓▓▓  ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                      ▒ ▓▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "                            ██▓▒   ▓▓▒▒                         "
PRINT "__________________________███▓▓_____▓▓▒░░_______________________"
PLAY "O0E": LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN:
LET TWO = TWO - 1: GOTO POWER
BLOCK: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET k = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT " "
PRINT ""
PRINT "      ▄    ░░                    ▄                     "
PRINT "     █╪▓   ▒                    █▓▒                     "
PRINT "    █▓▒▒░░▒▒                   ▓0|0░                     "
PRINT "    ██████▄                ████▒▒▒▒▒░░░░░                        "
PRINT "     ██▒                 ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "     █ ▓                █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                   ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░________________███▓▓_____▓▓▒░░_______________________"
KL: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO KL
IF G$ = "6" THEN GOTO POWER
LET HKL = 1: LET HKL = 0: LET V = 0: IF G$ = "4" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN GOTO FIREBALL
LET BL = 2: GOTO MMENU
SIT: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                 ▄                     "
PRINT "                                █▓▒                     "
PRINT "                               ▓0|0░                     "
PRINT "                           ████▒▒▒▒▒░░░░░                        "
PRINT "             ▓▓▒▒▒░░     ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "            ▓▓▒▓▓▓░░░   █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "            ▓ █▒▓▒▒ ░       ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________     "
SITO: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO SITO
IF G$ = " " THEN GOTO UPPERCUT
LET SD = 1: GOTO MMMENU
UPPERCUT: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "   "
PRINT ""
PRINT "     "
PRINT "                                 ▒▒▓▓██"
PRINT "                      ▓▒   ██▒▒█▓▓▒▒▒▒░▓▓▒▒"
PRINT "                ▄    ▓   ██ ██ █▓▓▒▒▒▒▓▓███▒▒░         "
PRINT "               █╪▓  ▒     █▓█       ▓▒░             "
PRINT "              █▓▒▒░░   ▓▓▓▒          ▒░░                    "
PRINT "             █ █▓▒                    ▒░             "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PLAY "O0E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                       "
PRINT "                      ▓▒                    "
PRINT "                ▄    ▓                                 "
PRINT "               █╪▓  ▒     █▓██                      "
PRINT "              █▓▒▒░░    ▓▓▒█  █     ▒▒▓▓██                  "
PRINT "             █ █▓▒          ██ █ ██▓▓▒▒▒▒░▓▓▒▒       "
PRINT "            ▄█ ██▒            █████▓▓▒▒▒▒▓▓███▒▒░                  "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PLAY "O0E": IF F = 1 THEN GOTO WIN
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓               ▓▒▒░░▒░ "
PRINT "              █▓ ▓▒      ▄▄     ▓▓▓▒▒▒▒░░▒▒▓ ▒▒▓               "
PRINT "_____________█▓▒_▓▒░_____▒▒▓▒▒▓▓░░░▒▒▓▓▓▓▓▓▓▒▒▓▓"
LET TWO = TWO - 2: PLAY "O0E": GOTO POWER
FWIN: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     WAN'FU  "
COLOR 6
PRINT ""
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                ▄          *  *  ▄   *                 "
PRINT "               █╪▓              █▓▒ *    *              "
PRINT "              █▓▒▒░  ▒      *  ▓0|0░                     "
PRINT "             █ █▓▒ ▓▄▓     ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
SOUND 30000, 5
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO NF3
GOTO FATALITIES
NF3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     WAN'FU  "
COLOR 6
PRINT ""
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                ▄            *    ▄   *                 "
PRINT "               █╪▓                █▓▒ *    *              "
PRINT "              █▓▒▒░  ▒      *    ▓0|0░                     "
PRINT "             █ █▓▒ ▓▄▓       ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒         ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓        █▓▒  ██▓▓▓▓░░░ ░░░                        "
PRINT "              █▓ ▓▒          ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓______▓▓▒░░______________________ "
SOUND 30000, 5
IF N = 5 THEN GOTO WIN
LET N = N + 1
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO FWIN
GOTO FATALITIES
WIN: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                         YOU WIN!"
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓               ▓▒▒░░▒░ "
PRINT "              █▓ ▓▒      ▄▄     ▓▓▓▒▒▒▒░░▒▒▓ ▒▒▓               "
PRINT "_____________█▓▒_▓▒░_____▒▒▓▒▒▓▓░░░▒▒▓▓▓▓▓▓▓▒▒▓▓"
LET RR = RR + 1
IF RD = 1 THEN GOTO NEXTLEVEL
IF RD = 0 THEN LET RD = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND
END
EHIT: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *      ▄"
PRINT "           ▄  * "
PRINT "     *        ▄    ▒           ▄                     "
PRINT "          ▄  █╪▓  ▒             █▓▒                     "
PRINT "       *      █▓▒▒  ▄          ▓0|0░                     "
PRINT "             █ █▓▒ ▓▓▓▓▓▓██████▒▒▒▒▒░░░░                         "
PRINT "            ▄█ ██▒  ▀      ████▓▓▒▓▓░░░░░                          "
PRINT "              ██ ▓           ██▓▓▓▓░░░ ░░                           "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓░░░                        "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________     "
LET ONE = ONE - .5
PLAY "O0E": FOR R = R TO 5000: NEXT R: GOTO POWER
EKICK: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                    ▄            ▄                     "
PRINT "             ▄     █╪▓          █▓▒                     "
PRINT "                 █▓▒▒░         ▓0|0░                     "
PRINT "               █▓▒▒▓▄▓   ███▓▓▓▒▒▒▒▒░░░░░                        "
PRINT "            ▄  ██▒ ▒        ██▓▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓ ▄ ▓▒   ▒██▓▓▓▓▓▓░░░   ░░░                        "
PRINT "             ▄  █▓▒  ▒▓▒▓▓██       ▓▓▒▒                         "
PRINT "_________________▓▒░________________▓▓▒░░_______________________     "
LET ONE = ONE - 1
PLAY "O0E": LET R = 0: FOR R = R TO 5000: NEXT R: GOTO POWER
TWIN: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                         ▓▒▒     ▄                     "
PRINT "                         █▓▒    █▓▒                     "
PRINT "                          ██▓  ▓0|0░                     "
PRINT "                           ████▒▒▒▒▒░░░░░                        "
PRINT "                             ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                             ██▓▓▓▓░░░   ░░░                        "
PRINT "          ▄▄▄               ██▓▒   ▓▓▒▒                         "
PRINT "____▒█▄▄▒▒▒▓▒█▓▒▓▄▄▄▒▒____███▓▓_____▓▓▒░░_______________________     "
LET RR = RR + 1
IF RDT = 0 THEN LET RDT = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND
FOR T = T TO 10000: NEXT T
RUN "A:LEND"
END
FIREBALL: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                           ▄                     "
PRINT "     █╪▓     ▄                   █▓▒                     "
PRINT "    █▓▒▒▒▒░░░▄░▒▓██             ▓0|0░                     "
PRINT "    ██████▄   ░▒▓██         ████▒▒▒▒▒░░░░░                        "
PRINT "     ██▒  ▄  ▄            ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "     █ ▓                 █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
PLAY "O6E O6E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT " "
PRINT ""
PRINT "      ▄       ▄                   ▄                     "
PRINT "     █╪▓     ▄   ▄               █▓▒                     "
PRINT "    █▓▒▒▒▒░░░▄     ░▒▓██        ▓0|0░                     "
PRINT "    ██████▄     ▄  ░▒▓██    ████▒▒▒▒▒░░░░░                        "
PRINT "     ██▒  ▄  ▄            ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "     █ ▓          ▄      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄              ▄             ▄                     "
PRINT "     █╪▓         ▄                █▓▒                     "
PRINT "    █▓▒▒▒▒░░░▄        ▄░▒▓██     ▓0|0░                     "
PRINT "    ██████▄     ▄      ░▒▓██ ███▒▒▒▒▒░░░░░                        "
PRINT "     ██▒            ▄     ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "     █ ▓          ▄      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                                *"
PRINT "      ▄              ▄    ▀ *       ▓                    "
PRINT "     █╪▓                *    * ▀   █   ░ ░░░              "
PRINT "    █▓▒▒▒▒░░░▄        ▄    ▀ ░▓░░▓x|x░  ░░░                "
PRINT "    ██████▄             *  ▄ ▒█░▒▒▒▒▒░░░░░                        "
PRINT "     ██▒            ▄  █▓▒██▓░██▓▓▒▓▓░░░  ░  ░                      "
PRINT "     █ ▓               *      ██▓▓▓▓░░░                              "
PRINT "    █▓ ▓▒               *    ██▓▒   ▓▓▒▒    ░                    "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
LET TWO = TWO - 1.5
PLAY "O0G-"
IF F = 1 THEN GOTO WIN:
LET k = 1: GOTO POWER
JUMP: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT " "
PRINT "                    ▄   ░▀"
PRINT "                   █╪▒ ░░             "
PRINT "               ▓██▓▒▒░░░ "
PRINT "              ██  ▓▒░            ▄                       "
PRINT "              █▓  █▓▒▒          █▓▒                       "
PRINT "                  ██▓▒▒        █0|0░                      "
PRINT "                ▒▒▒▒▒▒▒    ████▒▒▒▒▒░░░░░                        "
PRINT "                ▒░░░░░   ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                 ░      ▓▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "                            ██▓▒   ▓▓▒▒                         "
PRINT "__________________________███▓▓_____▓▓▒░░_______________________"
FOR HJ = 10 TO 5000: NEXT HJ: G$ = INKEY$: IF G$ = " " THEN GOTO JUMPKICK: SOUND 30000, 5:
GOTO POWER

NEXTLEVEL: PRINT "PRESS (RETURN) TO PLAY THE NEXT CONFRENTATION"
COLOR 0: INPUT NL
GOTO LEVEL2


FATALITIES:
INPUT FT$
IF FT$ = "668" THEN GOTO FATAL1
IF FT$ = "246" THEN GOTO FATAL2
LET F = 1: GOTO MMENU
FATAL1: PLAY "T200 O1E O1E.O1E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                          ▄    *"
PRINT "                ▄          *▄**▄ ▄   *                 "
PRINT "               █╪▓        ▄  ▄* █▓▒ *    *              "
PRINT "              █▓▒▒░▒▓▓▒▓▓▒██* ▄▓0|0░                     "
PRINT "             █ █▓▒         ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                              *    *            "
PRINT "                                      *"
PRINT "                ▄     ▓▒      *   *     ▒▒             "
PRINT "               █╪▓    ▒      *  ** * * ▒00▒"
PRINT "              █▓▒▒░▒▓▓         ****▄ * *▄                "
PRINT "             █ █▓▒         ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                          ▄    *"
PRINT "                ▄          *▄**▄ ▄   *                 "
PRINT "               █╪▓            *  *  *    *              "
PRINT "              █▓▒▒█            * ***            ▒▓       "
PRINT "             █ █▓▒ █       ████▒▒▒▒▒░░░░░     ▒▒00▒              "
PRINT "            ▄█ ██▒ █▄    ██▓ ██▓▓▒▓▓░░░ ░░░     **                 "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░   *                    "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                                    *  "
PRINT "                ▄                                      "
PRINT "               █╪▓             *   * *    *             "
PRINT "              █▓▒▒█              ***                     "
PRINT "             █ █▓▒ █       ████▒▒▒▒▒░░░░░      *                 "
PRINT "            ▄█ ██▒ █▄    ██▓ ██▓▓▒▓▓░░░ ░░░     **                 "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░      *                 "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒          ▒00▒           "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_________▒▒___________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               DEAD"
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                    "
PRINT "                   |                  "
PRINT "                   |                            "
PRINT "                 >-|-< "
PRINT "             █  ▄  █                                   "
PRINT "             █ █╪▓ █                       "
PRINT "              █▓▒▒█                                      "
PRINT "               █▓▒         ████▒▒▒▒▒░░░░░                        "
PRINT "               ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒        *   ▒▒           "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______**▒00▒**_______ "
PLAY "O0E"
GOTO NEXTLEVEL
END
FATAL2: PLAY "T200 O1E O1E.O1E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                          ▄    *"
PRINT "                           *▄**▄ ▄   *                 "
PRINT "                             ▄* █▓▒ *    *              "
PRINT "                            * ▄▓0|0░                     "
PRINT "                           ████▒▒▒▒▒░░░░░                        "
PRINT "               ▄▄▄       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "            ▒▒▓▓▓███    █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "             ▒█▓▒▓▒▒        ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                 ▒▒▓▓██"
PRINT "                      ▓▒   ██▒▒█▓▓▒▒▒▒░▓▓▒▒"
PRINT "                ▄    ▓   ██ ██ █▓▓▒▒▒▒▓▓███▒▒░         "
PRINT "               █╪▓  ▒     █▓█       ▓▒░             "
PRINT "              █▓▒▒░░   ▓▓▓▒          ▒░░                    "
PRINT "             █ █▓▒                    ▒░             "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                                 ▒▒▓▓██"
PRINT "                      ▓▒   ██▒▒█▓▓▒▒▒▒░▓▓▒▒"
PRINT "                ▄    ▓   ██ ██ █▓▓▒▒▒▒▓▓███▒▒░         "
PRINT "               █╪▓  ▒     █▓█       ▓▒░             "
PRINT "              █▓▒▒░░    ▓▓▒░        ▒▒░                     "
PRINT "             █ █▓▒                 ▒░        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PRINT ""
PRINT " "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                                 ▒▒▓▓██"
PRINT "                           ██▒▒█▓▓▒▒▒▒░▓▓▒▒"
PRINT "_________________________██_██_█▓▓▒▒▒▒▓▓███▒▒░__________________"
PRINT "                          █▓█        ▒░░            "
PRINT "                       ▓▓▒░         ▒░░                     "
PRINT "                                 ▒▒░░    "
PRINT "                                                                   "
PRINT "                                                                  "
PRINT "                                                                "
PRINT "                                                                     "
PRINT ""
PRINT " "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                                 ▒▒▓▓██"
PRINT "                           ██▒▒█▓▓▒▒▒▒░▓▓▒▒"
PRINT "                         ██ ██ █▓▓▒▒▒▒▓▓███▒▒░                  "
PRINT "                          █▓█        ▓▒░            "
PRINT "                       ▓▒▒░           ▒░░                       "
PRINT "                                       ▒░"
PRINT "                                                                   "
PRINT "                                                                  "
PRINT "                                                                "
PRINT "                                                                     "
PRINT ""
PRINT " "
PLAY "T180 O0E O0E O0E O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                   *     *       ▒▒▓▓██ *"
PRINT "                      *    ██▒▒█▓▓▒▒▒▒░▓▓▒▒ *"
PRINT "                  *      ██ ██ █▓▓▒▒▒▒▓▓███▒▒░   *              "
PRINT "                      *   ███        ▒▒░░        "
PRINT "                          │      *   │ ░░░   *           "
PRINT "                          █          █  ▒░"
PRINT "           _______________█__________█______________│________________"
PRINT "        /        │        █          █              █                /"
PRINT "                 █                   █              █           "
PRINT "    /            █                                                 /"
PRINT "              "
PRINT "/_______________________________________________________________/"
PLAY "O0E                     "
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               DEAD  "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                                                         "
PRINT "                       *            "
PRINT "   *   "
PRINT "   *     "
PRINT "                         *          **                               "
PRINT "                                *        *     *      * "
PRINT "        ____________________________│___________________________"
PRINT "              │     │      * *    * █     *         │            /"
PRINT "    /   │     █     █    *    *  ▒▒▒█▒▒*  ** *  *   █              "
PRINT "        █     █     █       *▒▒█▓▓▒░█░▒▓▓▒▒***   *  █           /  "
PRINT " /            █         * * ██▓█▓▓▒▒░▒▓▓███▒*  *    █           "
PRINT "______________█___________███▓▓_____█______▒▒_________________/"
GOTO NEXTLEVEL
END

PLAYER2: CLS
LOCATE 10, 10
COLOR 4
PLAY "T250 O0E O0G O0E- O0E O0G- O0G"
PRINT " WE SHALL NOW SEE YOUR TALENT, YOU WEAK-WILLED WARRIOR....  "
PLAY "T250 O1E- O1E- O1E O1E O1E- O1E- O1E O1E"
NEXTROUND2: LET ONE = 10: LET TWO = 10
POWER2: IF ONE = 10 THEN LET P$ = "░▒▒▓▓▓▓███  "
IF ONE = 9 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4 THEN LET P$ = "░▒▒▓        "
IF ONE = 3 THEN LET P$ = "░▒▒         "
IF ONE = 2 THEN LET P$ = "░▒          "
IF ONE = 1 THEN LET P$ = "░           "
IF ONE = 9.5 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8.5 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7.5 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6.5 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5.5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4.5 THEN LET P$ = "░▒▒▓        "
IF ONE = 3.5 THEN LET P$ = "░▒▒         "
IF ONE = 2.5 THEN LET P$ = "░▒          "
IF ONE = 1.5 THEN LET P$ = "░           "
IF ONE = .5 THEN LET P$ = "░           "
IF ONE = 0 THEN LET P$ = "            "
IF TWO = 10 THEN LET PA$ = "░▒▒▓▓▓▓███"
IF TWO = 9 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4 THEN LET PA$ = "░▒▒▓"
IF TWO = 3 THEN LET PA$ = "░▒▒"
IF TWO = 2 THEN LET PA$ = "░▒ "
IF TWO = 1 THEN LET PA$ = "░   "
IF TWO = 0 THEN LET PA$ = "          "
IF TWO = 9.5 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8.5 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7.5 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6.5 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5.5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4.5 THEN LET PA$ = "░▒▒▓"
IF TWO = 3.5 THEN LET PA$ = "░▒▒"
IF TWO = 2.5 THEN LET PA$ = "░▒ "
IF TWO = 1.5 THEN LET PA$ = "░   "
IF TWO = .5 THEN LET PA$ = "░   "
IF k = 1 THEN GOTO BLOCK2
REDO2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT " "
PRINT ""
PRINT "                ▄                ▄                     "
PRINT "               █╪▓              █▓▒                     "
PRINT "              █▓▒▒░  ▒         ▓0|0░                     "
PRINT "             █ █▓▒ ▓▄▓     ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________     "

MENU2: IF (ONE < 1) AND (RDT = 1) THEN GOTO TWIN2
IF ONE < 1 THEN GOTO TWIN2
IF (TWO < 1) AND (RD = 1) THEN GOTO FWIN2
IF TWO < 1 THEN GOTO WIN2
IF BL = 1 THEN GOTO SKIP2
LET x% = 0
SKIP2: COLOR 15: COLOR 0:
IMPUG2: LET BL = 0: G$ = INKEY$
MMENU2: IF G$ = "2" THEN GOTO SIT2
MMMENU2: IF G$ = "4" THEN GOTO BLOCK2
IF G$ = " " THEN GOTO HIT2
IF G$ = "6" THEN GOTO POWER2
IF G$ = "8" THEN GOTO JUMP2
IF G$ = "0" THEN GOTO REDO2
IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO BLOCK2
IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG2
RANDOMIZE TIMER: x% = INT(RND * 6)
IF x% = 2 THEN GOTO EHIT2
IF x% = 1 THEN GOTO EHIT2
IF x% = 0 THEN GOTO EKICK2
GOTO IMPUG2
HIT2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      WAN'FU             "
COLOR 6: LET BL = 0
PRINT ""
PRINT ""
PRINT ""
PRINT "                                        ▄ "
PRINT "                  ▄                ▄  *      ▄"
PRINT "                ▄█╪▓              █▓▒  0 ▄     "
PRINT "              █▓██▓▒▒▒▒░░░╟------█0| ▓--                  "
PRINT "            █▓  █▓▒▀       ████▒▒▒▒▒░░░░░                        "
PRINT "           █▓  ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░    ▄                   "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________"
COLOR 6
LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": LET TWO = TWO - .5: GOTO POWER2
JUMPKICK2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT " "
PRINT "                        ▄     ░▀"
PRINT "                       █╪▒  ░░            ▄"
PRINT "                  ▓███▓▒▒░░░▀"
PRINT "                 █▓   ▓▒░        ▄   *   ▄               "
PRINT "                █▓   █▓▒▒     ▒░█▓▒   ▄     0             "
PRINT "                    █▓ █▓▓▓▒▒▒░░0| ░      *               "
PRINT "                   █▓      ████▒▒▒▒▒░░░░░                        "
PRINT "                    ▓▓▓  ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                      ▒ ▓▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "                            ██▓▒   ▓▓▒▒                         "
PRINT "__________________________███▓▓_____▓▓▒░░_______________________"
PLAY "O0E": LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": LET TWO = TWO - 1: GOTO POWER2
BLOCK2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET k = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄    ░░                     ▄                     "
PRINT "     █╪▓   ▒                     █▓▒                     "
PRINT "    █▓▒▒░░▒▒                    ▓0|0░                     "
PRINT "    ██████▄                 ████▒▒▒▒▒░░░░░                        "
PRINT "     ██▒                  ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "     █ ▓                 █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
COLOR 0: G$ = INKEY$
KL2: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO KL2
IF G$ = "6" THEN GOTO POWER2
LET HKL = 1: LET HKL = 0: LET V = 0: IF G$ = "2" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "8" THEN GOTO FIREBALL2
LET BL = 2: GOTO MMENU2
WIN2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                         YOU WIN!"
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓               ▓▒▒░░▒░ "
PRINT "              █▓ ▓▒      ▄▄     ▓▓▓▒▒▒▒░░▒▒▓ ▒▒▓               "
PRINT "_____________█▓▒_▓▒░_____▒▒▓▒▒▓▓░░░▒▒▓▓▓▓▓▓▓▒▒▓▓"
LET RR = RR + 1
IF RD = 1 THEN GOTO NEXTLEVEL
IF RD = 0 THEN LET RD = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND2
END
FWIN2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     WAN'FU  "
COLOR 6
PRINT ""
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                ▄          *  *  ▄   *                 "
PRINT "               █╪▓              █▓▒ *    *              "
PRINT "              █▓▒▒░  ▒      *  ▓0|0░                     "
PRINT "             █ █▓▒ ▓▄▓     ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
SOUND 30000, 5
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO NF4
GOTO FATALITIES2
NF4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     WAN'FU  "
COLOR 6
PRINT ""
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                ▄            *    ▄   *                 "
PRINT "               █╪▓                █▓▒ *    *              "
PRINT "              █▓▒▒░  ▒      *    ▓0|0░                     "
PRINT "             █ █▓▒ ▓▄▓       ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒         ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓        █▓▒  ██▓▓▓▓░░░ ░░░                        "
PRINT "              █▓ ▓▒          ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓______▓▓▒░░______________________ "
SOUND 30000, 5
IF N = 5 THEN GOTO WIN2
LET N = N + 1
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO FWIN2
GOTO FATALITIES2
EHIT2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *      ▄"
PRINT "           ▄  * "
PRINT "     *        ▄    ▒           ▄                     "
PRINT "          ▄  █╪▓  ▒             █▓▒                     "
PRINT "       *      █▓▒▒  ▄          ▓0|0░                     "
PRINT "             █ █▓▒ ▓▓▓▓▓▓██████▒▒▒▒▒░░░░                         "
PRINT "            ▄█ ██▒  ▀      ████▓▓▒▓▓░░░░░                          "
PRINT "              ██ ▓           ██▓▓▓▓░░░ ░░                           "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓░░░                        "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________     "
LET ONE = ONE - .5
PLAY "O0E": FOR R = R TO 5000: NEXT R: GOTO POWER2
EKICK2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                    ▄            ▄                     "
PRINT "             ▄     █╪▓          █▓▒                     "
PRINT "                 █▓▒▒░         ▓0|0░                     "
PRINT "               █▓▒▒▓▄▓   ███▓▓▓▒▒▒▒▒░░░░░                        "
PRINT "            ▄  ██▒ ▒        ██▓▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓ ▄ ▓▒   ▒██▓▓▓▓▓▓░░░   ░░░                        "
PRINT "             ▄  █▓▒  ▒▓▒▓▓██       ▓▓▒▒                         "
PRINT "_________________▓▒░________________▓▓▒░░_______________________     "
LET ONE = ONE - 1
PLAY "O0E": LET R = 0: FOR R = R TO 5000: NEXT R: GOTO POWER2
TWIN2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                         ▓▒▒     ▄                     "
PRINT "                         █▓▒    █▓▒                     "
PRINT "                          ██▓  ▓0|0░                     "
PRINT "                           ████▒▒▒▒▒░░░░░                        "
PRINT "                             ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                             ██▓▓▓▓░░░   ░░░                        "
PRINT "          ▄▄▄               ██▓▒   ▓▓▒▒                         "
PRINT "____▒█▄▄▒▒▒▓▒█▓▒▓▄▄▄▒▒____███▓▓_____▓▓▒░░_______________________     "
LET RR = RR + 1
IF RDT = 0 THEN LET RDT = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND2
END
FIREBALL2: PLAY "O6E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT " "
PRINT ""
PRINT "                                  ▄                     "
PRINT "                                 █▓▒                     "
PRINT "    █▓▒▒▒▒░░░▄                  ▓0|0░                     "
PRINT "    ██████▄                 ████▒▒▒▒▒░░░░░                        "
PRINT "     ██▒                  ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "     █ ▓                 █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
PLAY "O5E    "
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                  ▄                     "
PRINT "                                 █▓▒                     "
PRINT "                                ▓0|0░                     "
PRINT "                            ████▒▒▒▒▒░░░░░                        "
PRINT "     ██▒                  ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "     █ ▓                 █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
PLAY "O4E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                   ▄                     "
PRINT "                                  █▓▒                     "
PRINT "                                 ▓0|0░                     "
PRINT "                            ████▒▒▒▒▒░░░░░                        "
PRINT "                          ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                         █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒                         "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
PLAY "O3E      "
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                   ▄                     "
PRINT "                                  █▓▒                     "
PRINT "                                 ▓0|0░                     "
PRINT "                            ████▒▒▒▒▒░░░░░                        "
PRINT "                          ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                         █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "                             ██▓▒   ▓▓▒▒                         "
PRINT "___________________________███▓▓_____▓▓▒░░_______________________"
PLAY "O2E          "
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                                *"
PRINT "                     ▄    ▀ *       ▓                    "
PRINT "                        *    * ▀   █   ░ ░░░              "
PRINT "                      ▄    ▀ ░▓░░▓x|x░  ░░░                "
PRINT "                        *  ▄ ▒█░▒▒▒▒▒░░░░░                        "
PRINT "                    ▄  █▓▒██▓░██▓▓▒▓▓░░░  ░  ░                      "
PRINT "                       *      ██▓▓▓▓░░░                              "
PRINT "                        *    ██▓▒   ▓▓▒▒    ░                    "
PRINT "___________________________███▓▓_____▓▓▒░░_______________________"
PLAY "O0G-"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                   ▄                     "
PRINT "                                  █▓▒                     "
PRINT "                                 ▓0|0░                     "
PRINT "                            ████▒▒▒▒▒░░░░░                        "
PRINT "                          ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                         █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "                             ██▓▒   ▓▓▒▒                         "
PRINT "___________________________███▓▓_____▓▓▒░░_______________________"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      WAN'FU             "
COLOR 6: LET BL = 0
PRINT ""
PRINT ""
PRINT ""
PRINT "                                        ▄ "
PRINT "                                   ▄  *      ▄"
PRINT "                                  █▓▒  0 ▄     "
PRINT "                                 █0| ▓                    "
PRINT "                           ████▒▒▒▒▒░░░░░                        "
PRINT "                         ██▓ ██▓▓▒▓▓░░░ ░░░    ▄                   "
PRINT "                        █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "                            ██▓▒   ▓▓▒▒                         "
PRINT "__________________________███▓▓_____▓▓▒░░_______________________"
PLAY "O1E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                     "
PRINT "                                                "
PRINT "                                   "
PRINT "                                                         "
PRINT "                           "
PRINT "                                                         "
PRINT "                                              "
PRINT "                                                                   "
PRINT "                                 ▓▒▒░░▒░ "
PRINT "                         ▄▄     ▓▓▓▒▒▒▒░░▒▒▓ ▒▒▓               "
PRINT "_________________________▒▒▓▒▒▓▓░░░▒▒▓▓▓▓▓▓▓▒▒▓▓"
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                   "
PRINT "                                                "
PRINT "                                   "
PRINT "                                                         "
PRINT "                           "
PRINT "                                                         "
PRINT "                       *                  *   "
PRINT "                                  *                                "
PRINT "                           ▒▒▒   ▓▒▒░░▒░   * ▓▓▒▒"
PRINT "                            ▒█  ▓▓▓▒▒▒▒░░▒▒▓ ▓▓▓▒              "
PRINT "_____________________________▒▓▓░░░▒▒▓▓▓▓▓▓▓▒▒  "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                     "
PRINT "                                                "
PRINT "                                   "
PRINT "                                                         "
PRINT "                           "
PRINT "                                                         "
PRINT "                                              "
PRINT "                                                                   "
PRINT "                                 ▓▒▒░░▒░ "
PRINT "                         ▄▄     ▓▓▓▒▒▒▒░░▒▒▓ ▒▒▓               "
PRINT "_________________________▒▒▓▒▒▓▓░░░▒▒▓▓▓▓▓▓▓▒▒▓▓"
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                                        "
PRINT "                                        ▒▒               "
PRINT "                                  ▓▓▓▓▓▒00░               "
PRINT "                                 ▒▓▓▓▓░░░░                        "
PRINT "     ██▒                        ▓▓▒▓▓░█░ ░░░                        "
PRINT "     █ ▓                      ██▓▓▓▓░░░   ░░░                        "
PRINT "    █▓ ▓▒                    ██▓▒   ▓▓▒▒   ░░░                   "
PRINT "___█▓▒_▓▒░_________________███▓▓_____▓▓▒░░_______________________"
SOUND 30000, 5
LET TWO = TWO - 1.5: LET k = 1: GOTO POWER2
SIT2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                 ▄                     "
PRINT "                                █▓▒                     "
PRINT "                               ▓0|0░                     "
PRINT "                           ████▒▒▒▒▒░░░░░                        "
PRINT "             ▓▓▒▒▒░░     ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "            ▓▓▒▓▓▓░░░   █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "            ▓ █▒▓▒▒ ░       ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░_______________________     "
SITO2: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO SITO2
IF G$ = " " THEN GOTO UPPERCUT2
LET SD = 1: GOTO MMMENU2
UPPERCUT2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "   "
PRINT ""
PRINT "     "
PRINT "                                 ▒▒▓▓██"
PRINT "                      ▓▒   ██▒▒█▓▓▒▒▒▒░▓▓▒▒"
PRINT "                ▄    ▓   ██ ██ █▓▓▒▒▒▒▓▓███▒▒░         "
PRINT "               █╪▓  ▒     █▓█       ▓▒░             "
PRINT "              █▓▒▒░░   ▓▓▓▒          ▒░░                    "
PRINT "             █ █▓▒                    ▒░             "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PLAY "O0E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                       "
PRINT "                      ▓▒                    "
PRINT "                ▄    ▓                                 "
PRINT "               █╪▓  ▒     █▓██                      "
PRINT "              █▓▒▒░░    ▓▓▒█  █     ▒▒▓▓██                  "
PRINT "             █ █▓▒          ██ █ ██▓▓▒▒▒▒░▓▓▒▒       "
PRINT "            ▄█ ██▒            █████▓▓▒▒▒▒▓▓███▒▒░                  "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PLAY "O0E": IF F = 1 THEN GOTO WIN2
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓               ▓▒▒░░▒░ "
PRINT "              █▓ ▓▒      ▄▄     ▓▓▓▒▒▒▒░░▒▒▓ ▒▒▓               "
PRINT "_____________█▓▒_▓▒░_____▒▒▓▒▒▓▓░░░▒▒▓▓▓▓▓▓▓▒▒▓▓"
LET TWO = TWO - 2: PLAY "O0E": GOTO POWER2

FATALITIES2:
INPUT FT$
IF FT$ = "6264 " THEN GOTO FATAL12
IF FT$ = "468  " THEN GOTO FATAL2
GOTO MMENU2:
FATAL12: PLAY "T200 O1E O1E.O1E":
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                      |                         "
PRINT "                      |   ▄    *"
PRINT "                ▄     |    *▄**▄ ▄   *                 "
PRINT "               █╪▓    |   ▄  ▄* █▓▒ *    *              "
PRINT "              █▓▒▒█  >┼<      ▄▓0|0░                     "
PRINT "             █ █▓▒ ▒▒▒░    ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                          ▄   /*"
PRINT "                ▄          */**▄ ▄   *                 "
PRINT "               █╪▓        /  ▄* █▓▒ *    *              "
PRINT "              █▓▒▒██   \/     ▄▓0|0░                     "
PRINT "             █ █▓▒  ▒▒▒░\  ████▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒       ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                          ▄    *"
PRINT "                ▄          * **▄ ▄   *                 "
PRINT "               █╪▓       █   ▄* █▓▒ *    *              "
PRINT "              █▓▒▒██    | █ █  ▓x|0░                     "
PRINT "             █ █▓▒  ▒▒▒░|------▒▒▒▒▒░░░░░                        "
PRINT "            ▄█ ██▒    █ |██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒                         "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                              *"
PRINT "                                      "
PRINT "                          *         *           "
PRINT "                          ▄    *"
PRINT "                ▄     *    * **▄ ▄   *    ▓▒           "
PRINT "               █╪▓       *   ▄*     * * █▒▒▒            "
PRINT "              █▓▒▒██    |      *▀  *   *█▓▒▒▒░░          "
PRINT "             █ █▓▒  ▒▒▒░|--------  *   *█▒▒▒░▒░▀               "
PRINT "            ▄█ ██▒    █ |██▓  *** ▄   * █▓▒▒                      "
PRINT "               █ ▓      █▓▒  ██▓▓▓▓░░░    ▒▒▒░                     "
PRINT "              █▓ ▓▒         ██▓▒   ▓▓▒▒     ░░░                 "
PRINT "_____________█▓▒_▓▒░______███▓▓_____▓▓▒░░______________________ "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                     |"
PRINT "                     |                "
PRINT "                    -|-                         "
PRINT "                     ▒          "
PRINT "                ▄   ▒▒                                 "
PRINT "               █╪▓  ▓▓                                  "
PRINT "              █▓▒▒██                                     "
PRINT "             █ █▓▒                                             "
PRINT "            ▄█ ██▒            *** ▄                               "
PRINT "               █ ▓           ██▓▓▓▓░░░            ░░               "
PRINT "              █▓ ▓▒   ▓░░   ██▓▒   ▓▓▒▒      ▓▓░░░░▒▒           "
PRINT "_____________█▓▒_▓▒░_█▓▒__███▓▓_____▓▓▒░░__█▓▓▓▒▒▒░░00░░______ "
PLAY "O0E"
GOTO NEXTLEVEL: END
JUMP2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT " "
PRINT "                    ▄   ░▀"
PRINT "                   █╪▒ ░░             "
PRINT "               ▓██▓▒▒░░░ "
PRINT "              ██  ▓▒░            ▄                       "
PRINT "              █▓  █▓▒▒          █▓▒                       "
PRINT "                  ██▓▒▒        █0|0░                      "
PRINT "                ▒▒▒▒▒▒▒    ████▒▒▒▒▒░░░░░                        "
PRINT "                ▒░░░░░   ██▓ ██▓▓▒▓▓░░░ ░░░                        "
PRINT "                 ░      ▓▓▒  ██▓▓▓▓░░░   ░░░                        "
PRINT "                            ██▓▒   ▓▓▒▒                         "
PRINT "__________________________███▓▓_____▓▓▒░░_______________________"
FOR HJ = 10 TO 5000: NEXT HJ: G$ = INKEY$: IF G$ = " " THEN GOTO JUMPKICK2: SOUND 30000, 5:
GOTO POWER2

LEVEL2:
SHOGUNL2 (PN$)

SUB FATALSHOGUN (PN$) STATIC
FATAL4: PLAY "T200 O1E O1E.O1E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                               ▄ --█                         "
PRINT "                              █░█  ▄█                     "
PRINT "                            ███████                                   "
PRINT "                        __▄██ ███                      "
PRINT "              ▓▓▒▒▒░░          ██                                          "
PRINT "             ▓▓▒▓▓▓░░░        █ █"
PRINT "             ▓ █▒▓▒▒ ░       █   █  "
PRINT "______________█▓▒_▓▒░_______██___██____________________________                      "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                       "
PRINT "                      ▓▒   ████████████████"
PRINT "                ▄    ▓   ██ ██ ███████████████         "
PRINT "               █╪▓  ▒     ███          ██           "
PRINT "              █▓▒▒░░                    ██                  "
PRINT "             █ █▓▒                                   "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                                       "
PRINT "                      ▓▒   ████████████████"
PRINT "                ▄    ▓   ██ ██ ███████████████         "
PRINT "               █╪▓  ▒     ███         ██            "
PRINT "              █▓▒▒░░                 ██                     "
PRINT "             █ █▓▒                           "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PRINT ""
PRINT " "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                                       "
PRINT "                           ████████████████"
PRINT "_________________________██_██_███████████████__________________"
PRINT "                          ███           ██          "
PRINT "                                         ██                 "
PRINT "                                         "
PRINT "                                                                   "
PRINT "                                                                  "
PRINT "                                                                "
PRINT "                                                                     "
PRINT ""
PRINT " "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                                        "
PRINT "                           ████████████████"
PRINT "                         ██ ██ ███████████████                  "
PRINT "                          ███       ██              "
PRINT "                                                                "
PRINT "                                         "
PRINT "                                                                   "
PRINT "                                                                  "
PRINT "                                                                "
PRINT "                                                                     "
PRINT ""
PRINT " "
PLAY "T180 O0E O0E O0E O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                   *     *              *"
PRINT "                      *    ████████████████ *"
PRINT "                  *      ██ ██ ███████████████   *              "
PRINT "                      *   ███          ██        "
PRINT "                          │      *   │ ██    *           "
PRINT "                          █          █    "
PRINT "           _______________█__________█______________│________________"
PRINT "        /        │        █          █              █                /"
PRINT "                 █                   █              █           "
PRINT "    /            █                                                 /"
PRINT "              "
PRINT "/_______________________________________________________________/"
PLAY "O0E                     "
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               DEAD  "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                                                         "
PRINT "                       *            "
PRINT "   *   "
PRINT "   *     "
PRINT "                         *          **                               "
PRINT "                                *        *     *      * "
PRINT "        ____________________________│___________________________"
PRINT "              │     │      * *    * █     *         │            /"
PRINT "    /   │     █     █    *    *     █  *  ** *  *   █              "
PRINT "              █     █         █████░█░████          █ "
PRINT " /            █         * * ████████░███████*  *    █           "
PRINT "______________█___________█████_____█______██_________________/"
RTY = 1
SHOGUNL2 (PN$)
END SUB

SUB REEP (PN$)
RANDOMIZE TIMER
GOTO NP
FOR H = H TO 10000: NEXT H: LET H = 0
CLS : PRINT : FOR H = H TO 9000: NEXT H: LET H = 0
CLS : COLOR 3: PRINT "                    █▓▒░Mystical Software Presents░▒▓█":  FOR H = H TO 9000: NEXT H: LET H = 0
CLS : COLOR 11: PRINT "                    █▓▒░Mystical Software Presents░▒▓█":  FOR H = H TO 30000: NEXT H: LET H = 0
CLS : COLOR 3: PRINT "                    █▓▒░Mystical Software Presents░▒▓█": FOR H = H TO 9000: NEXT H: LET H = 0
CLS : PRINT "":  FOR H = H TO 10000: NEXT H: LET H = 0
FOR Z = 1 TO 10000
NEXT Z
SCREEN 13
DIM circx(10): DIM circy(10)
DIM circxt(10): DIM circyt(10)

radius = 5
circlecount = 0: x = INT(RND * 294): y = INT(RND * 194): c = 1: dire = 2

directi = INT(RND * 4)
IF directi = 2 THEN directi = 3: GOTO start
IF directi = 3 THEN directi = 7: GOTO start
IF directi = 4 THEN directi = 9
start:


movecircle:
IF H = 200 THEN GOTO NP
IF directi = 1 THEN
        x = x - 5: y = y + 5
        IF x < radius THEN directi = 3: GOTO endc
        IF y > 199 - radius THEN directi = 7: GOTO endc
ELSE
END IF

IF directi = 3 THEN
        x = x + 5: y = y + 5
        IF x > 299 - radius THEN directi = 1: GOTO endc
        IF y > 199 - radius THEN directi = 9: GOTO endc
ELSE
END IF

IF directi = 9 THEN
        x = x + 5: y = y - 5
        IF x > 299 - radius THEN directi = 7: GOTO endc
        IF y < radius THEN directi = 3: GOTO endc
ELSE
END IF
IF directi = 7 THEN
        x = x - 5: y = y - 5
        IF x < radius THEN directi = 9: GOTO endc
        IF y < radius THEN directi = 1: GOTO endc
ELSE
END IF
endc:

FOR tempx = 0 TO 9
circxt(tempx) = circx(tempx)
circyt(tempx) = circy(tempx)
NEXT tempx

FOR tempx = 8 TO 0 STEP -1
circx(tempx) = circxt(tempx + 1)
circy(tempx) = circyt(tempx + 1)
NEXT tempx

drawcirc:
circlecount = circlecount + 1
IF dire = 1 THEN c = c - 1
IF dire = 2 THEN c = c + 1
IF c = 256 THEN
        dire = 1
        IF c = 0 THEN dire = 2
ELSE
END IF
IF c = 0 THEN
        dire = 2
        IF c = 256 THEN dire = 1
ELSE
END IF


CIRCLE (x, y), radius, c
circx(9) = x: circy(9) = y

delete:
CIRCLE (circx(0), circy(0)), radius, 0
LET H = H + 1
GOTO movecircle
NP: END SUB

SUB SHOGUNL2 (PN$) STATIC
IF RTY = 1 THEN GOTO NEXTLEVEL3
LET RR = 1
LET RD = 0
IF PN$ = "SHO'KI" THEN GOTO PLAYER3
CLS
LOCATE 10, 10
COLOR 4
PLAY "T250 O0E O0G O0E- O0E O0G- O0G"
PRINT "THINK YOUR SOMETHING, WE SHALL SEE HOW YOU FARE AGAINST YAMANA!!"
PLAY "T250 O1E- O1E- O1E O1E O1E- O1E- O1E O1E"
NEXTROUND3: LET ONE = 10: LET TWO = 10
POWER3: IF ONE = 10 THEN LET P$ = "░▒▒▓▓▓▓███  "
IF ONE = 9 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4 THEN LET P$ = "░▒▒▓        "
IF ONE = 3 THEN LET P$ = "░▒▒         "
IF ONE = 2 THEN LET P$ = "░▒          "
IF ONE = 1 THEN LET P$ = "░           "
IF ONE = 9.5 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8.5 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7.5 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6.5 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5.5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4.5 THEN LET P$ = "░▒▒▓        "
IF ONE = 3.5 THEN LET P$ = "░▒▒         "
IF ONE = 2.5 THEN LET P$ = "░▒          "
IF ONE = 1.5 THEN LET P$ = "░           "
IF ONE = .5 THEN LET P$ = "░           "
IF ONE = 0 THEN LET P$ = "            "
IF TWO = 10 THEN LET PA$ = "░▒▒▓▓▓▓███"
IF TWO = 9 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4 THEN LET PA$ = "░▒▒▓"
IF TWO = 3 THEN LET PA$ = "░▒▒"
IF TWO = 2 THEN LET PA$ = "░▒ "
IF TWO = 1 THEN LET PA$ = "░   "
IF TWO = 0 THEN LET PA$ = "          "
IF TWO = 9.5 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8.5 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7.5 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6.5 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5.5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4.5 THEN LET PA$ = "░▒▒▓"
IF TWO = 3.5 THEN LET PA$ = "░▒▒"
IF TWO = 2.5 THEN LET PA$ = "░▒ "
IF TWO = 1.5 THEN LET PA$ = "░   "
IF TWO = .5 THEN LET PA$ = "░   "
IF k = 1 THEN GOTO BLOCK3
REDO3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA       "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                 ▄             ▄ --█                   "
PRINT "                █╪▓           █░█  ▄█                     "
PRINT "               █▓▒▒░  ▒      ██████                       "
PRINT "              █ █▓▒ ▓▄▓ __▄██ ███                                 "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           █ █                                    "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "

MENU3: IF F = 1 THEN GOTO MMENU3
IF (ONE < 1) AND (RDT = 1) THEN GOTO TWIN3
IF ONE < 1 THEN GOTO TWIN3
IF (TWO < 1) AND (RD = 1) THEN GOTO FWIN3
IF TWO < 1 THEN GOTO WIN3
IF BL = 1 THEN GOTO SKIP3
LET x% = 0
SKIP3: COLOR 15: COLOR 0:
LET BL = 0:
IMPUG3: LET G$ = "": G$ = INKEY$: IF G$ = " " THEN GOTO HIT3
MMENU3: IF G$ = "2" THEN GOTO SIT3
MMMENU3: IF G$ = "8" THEN GOTO JUMP3
IF G$ = "4" THEN GOTO BLOCK3
IF G$ = "0" THEN GOTO REDO3
IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO BLOCK3
IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG3
RANDOMIZE TIMER: x% = INT(RND * 6)
IF x% = 2 THEN GOTO EHIT3
IF x% = 1 THEN GOTO EHIT3
IF x% = 0 THEN GOTO EKICK3
GOTO IMPUG3

HIT3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                   ▄        █--   ▄█  *                   "
PRINT "                  █╪▓        █▄▄███▒*    *    "
PRINT "                ▄█▓▒▒▒▒░░░|----████--* *     *            "
PRINT "               ██▓▒          *-███ █ *                           "
PRINT "             ▄█ ██▒      * * **██ █ *         *                   "
PRINT "                █ ▓         ███ █ |        *                       "
PRINT "              █▓  ▓▒      ▄█▀    █                               "
PRINT "____________███___███____________██____________________________"
LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN3:
LET TWO = TWO - .5: GOTO POWER3

LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN3:
LET TWO = TWO - .5: GOTO POWER3
JUMPKICK3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6: LET BL = 0
COLOR 6
PRINT "                        ▄     ░▀  "
PRINT "                       █╪▒  ░░"
PRINT "                  ▓███▓▒▒░░░"
PRINT "                 █▓   ▓▒░              *"
PRINT "                █▓   █▓▒▒     ▒░  ▄ *  *   *                "
PRINT "                    █▓ █▓▓▓▒▒▒░░█░█ *  *   *                "
PRINT "                   █▓        ██████ *  ***                "
PRINT "                    ▓▓▓  __▄██ ███ █                              "
PRINT "                      ▒       ██    █                             "
PRINT "                             █ █    |                              "
PRINT "                            █   █                               "
PRINT "___________________________██___██_____________________________     "
PLAY "O0E": LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN3:
LET TWO = TWO - 1: GOTO POWER3
BLOCK3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET k = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄    ░░                  ▄ --█                           "
PRINT "     █╪▓   ▒                  █░█  ▄█                                  "
PRINT "    █▓▒▒░░▒▒                ███████                                "
PRINT "    ██████▄             __▄██ ███                                           "
PRINT "     ██▒                       ██                                          "
PRINT "     █ ▓                      █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
KL3: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO KL3
IF G$ = "6" THEN GOTO POWER3
LET HKL = 1: LET HKL = 0: LET V = 0: IF G$ = "4" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN GOTO FIREBALL3
LET BL = 2: GOTO MMENU3
COLOR 0: INPUT G
IF G = 466 THEN GOTO FIREBALL3
LET BL = 1: GOTO MMENU3
SIT3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$; ""
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                               ▄ --█                         "
PRINT "                              █░█  ▄█                     "
PRINT "                            ███████                                   "
PRINT "                        __▄██ ███                      "
PRINT "              ▓▓▒▒▒░░          ██                                          "
PRINT "             ▓▓▒▓▓▓░░░        █ █"
PRINT "             ▓ █▒▓▒▒ ░       █   █  "
PRINT "______________█▓▒_▓▒░_______██___██____________________________                      "
SITO3: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO SITO3
IF G$ = " " THEN GOTO UPPERCUT3
LET SD = 1: GOTO MMMENU3
UPPERCUT3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                               \           "
PRINT "                      ▓▒   ██████████████▒█"
PRINT "                ▄    ▓   ██ ██ ███████████████         "
PRINT "               █╪▓  ▒     ███                       "
PRINT "              █▓▒▒░░                           \            "
PRINT "             █ █▓▒                                   "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░___________________________________________     "
CLS : COLOR 4: PLAY "O0E": PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                       "
PRINT "                      ▓▒                    "
PRINT "                ▄    ▓                                 "
PRINT "               █╪▓  ▒      ███      /               "
PRINT "              █▓▒▒░░     ███  █                  \          "
PRINT "             █ █▓▒          ██ █ ███████████▒█       "
PRINT "            ▄█ ██▒            ███████████████████                  "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░___________________________________________     "
PLAY "O0E": IF F = 1 THEN GOTO WIN3
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                       "
PRINT "              █▓ ▓▒    \ ▄▄    ████████████  █▒█               "
PRINT "_____________█▓▒_▓▒░_____███████████████████████___\___________"
LET TWO = TWO - 2: PLAY "O0E": GOTO POWER3
FWIN3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     YAMANA  "
COLOR 6
PRINT "  "
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                 ▄          *  ▄ *                     "
PRINT "                █╪▓           █░█                         "
PRINT "               █▓▒▒░  ▒      ██████                       "
PRINT "              █ █▓▒ ▓▄▓     █ ███  █                              "
PRINT "             ▄█ ██▒         █  ██  █                                "
PRINT "                █ ▓         | █ █  |                                 "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
SOUND 30000, 5
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO NF
GOTO FATALITIES3
NF: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     YAMANA  "
COLOR 6
PRINT "  "
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                 ▄          *    ▄ *                     "
PRINT "                █╪▓             █░█                         "
PRINT "               █▓▒▒░  ▒        ██████                       "
PRINT "              █ █▓▒ ▓▄▓       █ ███  █                              "
PRINT "             ▄█ ██▒          █  ██  █                                "
PRINT "                █ ▓          | █ █  |                                 "
PRINT "               █▓ ▓▒          █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
IF NNN = 10 THEN GOTO WIN3
LET NNN = NNN + 1
SOUND 30000, 5
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO FWIN3
GOTO FATALITIES3

WIN3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET F = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                                      "
PRINT "                    YOU    WIN!                 "
PRINT ""
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                       "
PRINT "              █▓ ▓▒    \ ▄▄    ████████████  █▒█               "
PRINT "_____________█▓▒_▓▒░_____███████████████████████___\___________"
LET RR = RR + 1
IF RD = 1 THEN GOTO NEXTLEVEL3
IF RD = 0 THEN LET RD = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND3
END
EHIT3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "                "
PRINT "                "
PRINT "                ▄     ▒░       ▄                               "
PRINT "               █╪▓  ░░        █░█                                "
PRINT "              █▓▒▒█▒       ██████                                "
PRINT "             █ █▓▒    __▄██  ███                                         "
PRINT "            ▄█ ██▒       --██ ██                                "
PRINT "              ██ ▓            █ █                                           "
PRINT "              █▓ ▓▒          █   █                          "
PRINT "_____________█▓▒_▓▒░________██___██____________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *      ▄"
PRINT "           ▄  * "
PRINT "     *        ▄    ▒                                         "
PRINT "          ▄  █╪▓  ▒  ██                                        "
PRINT "       *      █▓▒▒-███▒█                                         "
PRINT "             █ █▓▒   ████                                                "
PRINT "            ▄█ ██▒-██    ██                                     "
PRINT "              ██ ▓       █ ████                                        "
PRINT "              █▓ ▓▒       █   █                         "
PRINT "_____________█▓▒_▓▒░_______█___________________________________"
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *      ▄"
PRINT "           ▄  * "
PRINT "     *        ▄    ▒                                         "
PRINT "          ▄  █╪▓  ▒  ██            █                           "
PRINT "       *      █▓▒▒-███▒█      █████                              "
PRINT "             █ █▓▒   █████████     ▄                                     "
PRINT "            ▄█ ██▒-██         █████                             "
PRINT "              ██ ▓                                                     "
PRINT "              █▓ ▓▒                                     "
PRINT "_____________█▓▒_▓▒░___________________________________________"
PLAY "O1E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *               █   █"
PRINT "              *         █  █"
PRINT "     *          ▄  ▒   ████                                  "
PRINT "               █╪▓▒  █████                                     "
PRINT "       *      █▓▒▒-███▒██                                        "
PRINT "             █ █▓▒   ████                                                "
PRINT "            ▄█ ██▒      █                                       "
PRINT "              ██ ▓      █                                              "
PRINT "              █▓ ▓▒     |                               "
PRINT "_____________█▓▒_▓▒░___________________________________________"
PLAY "o0e"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "               ▄             "
PRINT "           ▄    "
PRINT "               ▄  █▒    █                                    "
PRINT "          ▄   █╪▓ ▒ █   █                                      "
PRINT "              █▓▒▒   █  █                                        "
PRINT "             █ █▓▒    ██                                                 "
PRINT "            ▄█ ██▒   ████                                       "
PRINT "              ██ ▓   █▒██                                              "
PRINT "              █▓ ▓▒  █  █                               "
PRINT "_____________█▓▒_▓▒░_█___█_____________________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT "            **"
PRINT "        *  *   ▄             "
PRINT "  *        ▄  * "
PRINT "     *    *   ▄                                             "
PRINT "          ▄  █╪▓██▒ █                                          "
PRINT "   *   *      █▓▒▒█  █                                           "
PRINT "             █ █▓▒ █ █   █                                               "
PRINT "            ▄█ ██▒  ██  █                                       "
PRINT "              ██ ▓   ███                                               "
PRINT "              █▓ ▓▒   ███▒█                             "
PRINT "_____________█▓▒_▓▒░__█________________________________________"
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *                    "
PRINT "              * "
PRINT "     *          ▄ █▒    █                                    "
PRINT "               █╪▓▒ █   █                                      "
PRINT "       *      █▓▒▒   █  █                                        "
PRINT "             █ █▓▒    ██                                                 "
PRINT "            ▄█ ██▒   ████                                       "
PRINT "              ██ ▓   █▒██                                              "
PRINT "              █▓ ▓▒  █  █                               "
PRINT "_____________█▓▒_▓▒░_█___█_____________________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "               ▄        █   █"
PRINT "           ▄  *         █  █"
PRINT "                ▄  ▒   ████                                  "
PRINT "               █╪█▒  █████                                     "
PRINT "              █▓▒▒  ██▒██                                        "
PRINT "             █ █▓▒ █ ████                                                "
PRINT "            ▄█ ██▒ █    █                                       "
PRINT "              ██ ▓ |    █                                              "
PRINT "              █▓ ▓▒     |                               "
PRINT "_____________█▓▒_▓▒░__________________________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "                "
PRINT "                "
PRINT "                ▄            ▄                               "
PRINT "               █╪▓          █░█                                "
PRINT "              █▓▒▒█        ██████                                "
PRINT "             █ █▓▒ █  __▄██  ███                                         "
PRINT "            ▄█ ██▒ ▒░    --██ ██                                "
PRINT "              ██ ▓            █ █                                           "
PRINT "              █▓ ▓▒          █   █             "
PRINT "_____________█▓▒_▓▒░________██___██___________________________"
LET ONE = ONE - 2
FOR R = R TO 5000: NEXT R: GOTO POWER3
EKICK3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT "                         |"
PRINT "                        _|_"
PRINT "                   * *  ██"
PRINT "                * ▄      ██   ▄               "
PRINT "            *    █╪▓       █ █░█    "
PRINT "               * █▓▒▒░███   ██████    "
PRINT "             *    █▓▒▒▓ ███  ███  ██ "
PRINT "                  ██▒ ▒   █████    ██"
PRINT "                  █ ▓▒▒▒▒    ███    ██|---"
PRINT "                   █▓▒   ░░    ██       "
PRINT "____________________▓▒░________███____________________________"
LET ONE = ONE - 1
PLAY "O0E": LET R = 0: FOR R = R TO 5000: NEXT R: GOTO POWER3
TWIN3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT "                          |          |"
PRINT "                         _|_        _|_"
PRINT "                         ██    ▄    ██      "
PRINT "                          ██  █░█  ██                "
PRINT "                            ███████                "
PRINT "                              ███                        "
PRINT "                               ██                           "
PRINT "                              █ █                              "
PRINT "          ▄▄▄                █   █                              "
PRINT "____▒█▄▄▒▒▒▓▒█▓▒▓▄▄▄▒▒______██___██___________________________"
LET RR = RR + 1
IF RDT = 0 THEN LET RDT = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND3
END
FIREBALL3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                        ▄ --█                           "
PRINT "     █╪▓    ▒                 █░█  ▄█                                  "
PRINT "    █▓▒▒░░▒▒▒▒▓█            ███████                                "
PRINT "    ██████▄  ▒▓█        __▄██ ███                                           "
PRINT "     ██▒    ▒                  ██                                          "
PRINT "     █ ▓                      █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
PLAY "O6E O6E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                          "
PRINT "      ▄     ▒                  ▄ --█                           "
PRINT "     █╪▓       ▒              █░█  ▄█                                  "
PRINT "    █▓▒▒░        ▒▓▓██      ███████                                "
PRINT "   █ ▓▒▒ ▒       ▒▓▓██  __▄██ ███                                           "
PRINT "   █ ██▒ ▒     ▒               ██                                          "
PRINT "     █ ▓    ▒                 █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                          "
PRINT "      ▄                  ▄     ▄ --█                           "
PRINT "     █╪▓               █      █░█  ▄█                                  "
PRINT "    █▓▒▒▒          ▒▓▓██    ███████                                "
PRINT "   █ ▓▒▒ ▒         ▒▓▓██__▄██ ███                                           "
PRINT "    ███▒▒              █       ██                                          "
PRINT "     █ ▓                 ▄    █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                            ██ ▄ --█                           "
PRINT "      ▄                    █▒▒█░█  ▄█                                  "
PRINT "    ████▒                 █▒███████                                "
PRINT "   █ ▓▒▒ ▒               █▄██ ███                                           "
PRINT "    ███▒▒                █▒▒   ██                                          "
PRINT "     █ ▓                  █▒  █ █"
PRINT "    █▓ ▓▒                  █▒█   █  "
PRINT "___█▓▒_▓▒░_________________███___██____________________________                           "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                       ████████                           "
PRINT "     █╪▓                 █▒▒█░█▒▒██                                  "
PRINT "    █▓▒▒▒                   █▒███████▒█                              "
PRINT "   █ ▓▒▒ ▒             █▄██▒███▒▒▒█                                       "
PRINT "    ███▒▒                █▒▒▒▒▒██▒▒▒█                                      "
PRINT "     █ ▓                █▒▒▒█▒█▒▒▒█"
PRINT "    █▓ ▓▒                   █▒█▒▒▒█▒▒█"
PRINT "___█▓▒_▓▒░_______________█████████___________________________                           "
LET TWO = TWO - 1.5
PLAY " O0G-"
IF F = 1 THEN GOTO WIN3:
LET k = 1: GOTO POWER3
JUMP3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6: LET BL = 0
COLOR 6
PRINT "                        ▄   ░   "
PRINT "                       █╪▒ ░  "
PRINT "                     ▒▓▒▒░░  "
PRINT "                    ░▓▓▒░               "
PRINT "                   ░ █▓▒▒     ▄                         "
PRINT "                    ██ █▓    █░█                         "
PRINT "                   █▓  ▒▒   ██████                       "
PRINT "                  ▓▓▓   ░░▄██ ███ █                              "
PRINT "                              ██   █                             "
PRINT "                             █ █   |                              "
PRINT "                            █   █                               "
PRINT "___________________________██___██_____________________________     "
FOR HJ = 10 TO 5000: NEXT HJ: G$ = INKEY$: IF G$ = " " THEN GOTO JUMPKICK3: SOUND 30000, 5:
GOTO POWER3
NEXTLEVEL3: LET RTY = 0: PRINT "PRESS (RETURN) TO PLAY THE NEXT CONFRENTATION"
COLOR 0: INPUT NL:
CLS
LOCATE 10, 10
COLOR 4
PRINT "WELL, WELL, "; PN$; ", I CAN SEE YOU ARE GOOD ENOUGH FOR MY LOWER"
PRINT "        STANDARD FIGHTERS, BUT SEE HOW YOU STAND UP AGAINST FRILL."
PLAY "O0E O0E O0E.O1E O1G O1G O2G O3F O1E":
IF PN$ = "KEERO" THEN RUN "A:CSHOGUN"
IF PN$ = "SHO'KI" THEN RUN "A:CCSHOGUN"
END
FATALITIES3:
INPUT FT$
IF (FT$ = "668 ") AND (PN$ = "KEERO") THEN GOTO FATAL3
IF (FT$ = "6264 ") AND (PN$ = "SHO'KI") THEN GOTO FATAL25
IF FT$ = "4655" THEN GOTO FT
LET F = 1: GOTO MMENU3
FATAL3: PLAY "T200 O1E O1E.O1E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                 ▄             ▄ __█                   "
PRINT "                █╪▓         __█░█  ▄█                     "
PRINT "               █▓▒▒▒▒▒░░░|-- ██████                       "
PRINT "              █ █▓▒     __▄██ ███                                 "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           █ █                                    "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT ""
PRINT " "
PRINT "                                    ▄"
PRINT "                 ▄              ░* █░█                 "
PRINT "                █╪▓         *  ░*  **                     "
PRINT "               █▓▒▒▒▒        ██████                       "
PRINT "              █ █▓▒  ░░░---██ ███                                 "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           █ █                                    "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                             *   ░  *"
PRINT "                 ▄           ░  ░*      *              "
PRINT "                █╪▓            **     *                   "
PRINT "               █▓▒▒▒▒        ██████  *    ▄               "
PRINT "              █ █▓▒  ░░ __▄██ ███      * █░█                      "
PRINT "             ▄█ ██▒    ░       ██        **                         "
PRINT "                █ ▓     \     █ █                                    "
PRINT "               █▓ ▓▒     \   █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                       |"
PRINT "                       |"
PRINT "                       |          *"
PRINT "                     __|__    *   "
PRINT "                 ▄    ░░       ** *  *  ░              "
PRINT "                █╪▓   ░   ░   **  *    * ░   *            "
PRINT "               █▓▒▒▒▒▒░      ██████   *                   "
PRINT "              █ █▓▒     __▄██ ███    * *                          "
PRINT "             ▄█ ██▒            ██        **                         "
PRINT "                █ ▓           █ █         █▒█                        "
PRINT "               █▓ ▓▒         █   █         ▀                     "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               DEAD"
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                       |     "
PRINT "                       |"
PRINT "                       |           "
PRINT "                     __|__        "
PRINT "                 ▄    ░░                               "
PRINT "                █╪▓   ░                                "
PRINT "               █▓▒▒▒▒▒░      ██████                       "
PRINT "              █ █▓▒     __▄██ ███                                 "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           █ █                                    "
PRINT "               █▓ ▓▒         █   █           ▄                "
PRINT "______________█▓▒_▓▒░_______██___██_________█▒█________________     "
PLAY "O0E"
GOTO NEXTLEVEL3
END
PLAYER3: CLS
LOCATE 10, 10
COLOR 4
PLAY "T250 O0E O0G O0E- O0E O0G- O0G"
PRINT "THINK YOUR SOMETHING, WE SHALL SEE HOW YOU FARE AGAINST YAMANA!!"
PLAY "T250 O1E- O1E- O1E O1E O1E- O1E- O1E O1E"
NEXTROUND4: LET ONE = 10: LET TWO = 10
POWER4: IF ONE = 10 THEN LET P$ = "░▒▒▓▓▓▓███  "
IF ONE = 9 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4 THEN LET P$ = "░▒▒▓        "
IF ONE = 3 THEN LET P$ = "░▒▒         "
IF ONE = 2 THEN LET P$ = "░▒          "
IF ONE = 1 THEN LET P$ = "░           "
IF ONE = 9.5 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8.5 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7.5 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6.5 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5.5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4.5 THEN LET P$ = "░▒▒▓        "
IF ONE = 3.5 THEN LET P$ = "░▒▒         "
IF ONE = 2.5 THEN LET P$ = "░▒          "
IF ONE = 1.5 THEN LET P$ = "░           "
IF ONE = .5 THEN LET P$ = "░           "
IF ONE = 0 THEN LET P$ = "            "
IF TWO = 10 THEN LET PA$ = "░▒▒▓▓▓▓███"
IF TWO = 9 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4 THEN LET PA$ = "░▒▒▓"
IF TWO = 3 THEN LET PA$ = "░▒▒"
IF TWO = 2 THEN LET PA$ = "░▒ "
IF TWO = 1 THEN LET PA$ = "░   "
IF TWO = 0 THEN LET PA$ = "          "
IF TWO = 9.5 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8.5 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7.5 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6.5 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5.5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4.5 THEN LET PA$ = "░▒▒▓"
IF TWO = 3.5 THEN LET PA$ = "░▒▒"
IF TWO = 2.5 THEN LET PA$ = "░▒ "
IF TWO = 1.5 THEN LET PA$ = "░   "
IF TWO = .5 THEN LET PA$ = "░   "
IF k = 1 THEN GOTO BLOCK4
REDO4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA       "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                 ▄             ▄ --█                   "
PRINT "                █╪▓           █░█  ▄█                     "
PRINT "               █▓▒▒░  ▒      ██████                       "
PRINT "              █ █▓▒ ▓▄▓ __▄██ ███                                 "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           █ █                                    "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "

MENU4: IF F = 1 THEN GOTO MMENU4
IF (ONE < 1) AND (RDT = 1) THEN GOTO TWIN4
IF ONE < 1 THEN GOTO TWIN4
IF (TWO < 1) AND (RD = 1) THEN GOTO FWIN4
IF TWO < 1 THEN GOTO WIN4
IF BL = 1 THEN GOTO SKIP4
LET x% = 0
SKIP4: COLOR 15: COLOR 0:
LET BL = 0:
IMPUG4: G$ = INKEY$: IF G$ = " " THEN GOTO HIT4
MMENU4: IF G$ = "2" THEN GOTO SIT4
MMMENU4: IF G$ = "8" THEN GOTO JUMP4
IF G$ = "4" THEN GOTO BLOCK4
IF G$ = "0" THEN GOTO REDO4
IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO BLOCK4
RANDOMIZE TIMER: x% = INT(RND * 6)
IF x% = 2 THEN GOTO EHIT4
IF x% = 1 THEN GOTO EHIT4
IF x% = 0 THEN GOTO EKICK4
GOTO IMPUG4
HIT4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                   ▄        █--   ▄█  *                   "
PRINT "                  █╪▓        █▄▄███▒*    *    "
PRINT "                ▄█▓▒▒▒▒░░░|----████--* *     *            "
PRINT "               ██▓▒          *-███ █ *                           "
PRINT "             ▄█ ██▒      * * **██ █ *         *                   "
PRINT "                █ ▓         ███ █ |        *                       "
PRINT "              █▓  ▓▒      ▄█▀    █                               "
PRINT "____________███___███____________██____________________________"
LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN4:
LET TWO = TWO - .5: GOTO POWER4

LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN4:
LET TWO = TWO - .5: GOTO POWER4
JUMPKICK4: CLS : COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6: LET BL = 0
COLOR 6
PRINT "                        ▄     ░▀"
PRINT "                       █╪▒  ░░"
PRINT "                  ▓███▓▒▒░░░▀"
PRINT "                 █▓   ▓▒░              *"
PRINT "                █▓   █▓▒▒     ▒░  ▄ *  *   *                "
PRINT "                    █▓ █▓▓▓▒▒▒░░█░█ *  *   *                "
PRINT "                   █▓        ██████ *  ***                "
PRINT "                    ▓▓▓  __▄██ ███ █                              "
PRINT "                      ▒       ██    █                             "
PRINT "                             █ █    |                              "
PRINT "                            █   █                               "
PRINT "___________________________██___██_____________________________     "
PLAY "O0E": LET y = 0: FOR y = y TO 5000: NEXT y
PLAY "O1E": IF F = 1 THEN GOTO WIN4:
LET TWO = TWO - 1: GOTO POWER4
BLOCK4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET k = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄    ░░                  ▄ --█                           "
PRINT "     █╪▓   ▒                  █░█  ▄█                                  "
PRINT "    █▓▒▒░░▒▒                ███████                                "
PRINT "    ██████▄             __▄██ ███                                           "
PRINT "     ██▒                       ██                                          "
PRINT "     █ ▓                      █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
KL4: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO KL4
IF G$ = "6" THEN GOTO POWER4
LET HKL = 1: LET HKL = 0: LET V = 0: IF G$ = "2" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "8" THEN GOTO FIREBALL4
LET BL = 2: GOTO MMENU4
SIT4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$; ""
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                               ▄ --█                         "
PRINT "                              █░█  ▄█                     "
PRINT "                            ███████                                   "
PRINT "                        __▄██ ███                      "
PRINT "              ▓▓▒▒▒░░          ██                                          "
PRINT "             ▓▓▒▓▓▓░░░        █ █"
PRINT "             ▓ █▒▓▒▒ ░       █   █  "
PRINT "______________█▓▒_▓▒░_______██___██____________________________                      "
SITO4: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO SITO4
IF G$ = " " THEN GOTO UPPERCUT4
LET SD = 1: GOTO MMMENU4
UPPERCUT4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT "            "
PRINT "     "
PRINT "                               \           "
PRINT "                      ▓▒   ██████████████▒█"
PRINT "                ▄    ▓   ██ ██ ███████████████         "
PRINT "               █╪▓  ▒     ███                       "
PRINT "              █▓▒▒░░                           \            "
PRINT "             █ █▓▒                                   "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░___________________________________________     "
CLS : COLOR 4: PLAY "O0E": PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT "        "
PRINT "     "
PRINT "                                       "
PRINT "                      ▓▒                    "
PRINT "                ▄    ▓                                 "
PRINT "               █╪▓  ▒      ███      /               "
PRINT "              █▓▒▒░░     ███  █                  \          "
PRINT "             █ █▓▒          ██ █ ███████████▒█       "
PRINT "            ▄█ ██▒            ███████████████████                  "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░___________________________________________     "
PLAY "O0E": IF F = 1 THEN GOTO WIN4
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                       "
PRINT "              █▓ ▓▒    \ ▄▄    ████████████  █▒█               "
PRINT "_____________█▓▒_▓▒░_____███████████████████████___\___________"
LET TWO = TWO - 2: PLAY "O0E": GOTO POWER4
FWIN4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     YAMANA  "
COLOR 6
PRINT "  "
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                 ▄          *  ▄ *                     "
PRINT "                █╪▓           █░█                         "
PRINT "               █▓▒▒░  ▒      ██████                       "
PRINT "              █ █▓▒ ▓▄▓     █ ███  █                              "
PRINT "             ▄█ ██▒         █  ██  █                                "
PRINT "                █ ▓         | █ █  |                                 "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
SOUND 30000, 5
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO NF2
GOTO FATALITIES3
NF2: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     YAMANA  "
COLOR 6
PRINT "  "
PRINT "                          YOU WIN!"
PRINT "                  F I N I S H   H I M ! !"
PRINT "                               *"
PRINT "                 ▄          *    ▄ *                     "
PRINT "                █╪▓             █░█                         "
PRINT "               █▓▒▒░  ▒        ██████                       "
PRINT "              █ █▓▒ ▓▄▓       █ ███  █                              "
PRINT "             ▄█ ██▒          █  ██  █                                "
PRINT "                █ ▓          | █ █  |                                 "
PRINT "               █▓ ▓▒          █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
SOUND 30000, 5
IF NNNN = 10 THEN GOTO FWIN4
LET NNNN = NNNN + 1
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO FWIN4
GOTO FATALITIES3

WIN4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET F = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT "                                      "
PRINT "                    YOU    WIN!                 "
PRINT "                                   "
PRINT ""
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                       "
PRINT "              █▓ ▓▒    \ ▄▄    ████████████  █▒█               "
PRINT "_____________█▓▒_▓▒░_____███████████████████████___\___________"
LET RR = RR + 1
IF RD = 0 THEN LET RD = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND4
END
EHIT4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "                "
PRINT "                "
PRINT "                ▄     ▒░       ▄                               "
PRINT "               █╪▓  ░░        █░█                                "
PRINT "              █▓▒▒█▒       ██████                                "
PRINT "             █ █▓▒    __▄██  ███                                         "
PRINT "            ▄█ ██▒       --██ ██                                "
PRINT "              ██ ▓            █ █                                           "
PRINT "              █▓ ▓▒          █   █                          "
PRINT "_____________█▓▒_▓▒░________██___██____________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *      ▄"
PRINT "           ▄  * "
PRINT "     *        ▄    ▒                                         "
PRINT "          ▄  █╪▓  ▒  ██                                        "
PRINT "       *      █▓▒▒-███▒█                                         "
PRINT "             █ █▓▒   ████                                                "
PRINT "            ▄█ ██▒-██    ██                                     "
PRINT "              ██ ▓       █ ████                                        "
PRINT "              █▓ ▓▒       █   █                         "
PRINT "_____________█▓▒_▓▒░_______█___________________________________"
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *      ▄"
PRINT "           ▄  * "
PRINT "     *        ▄    ▒                                         "
PRINT "          ▄  █╪▓  ▒  ██            █                           "
PRINT "       *      █▓▒▒-███▒█      █████                              "
PRINT "             █ █▓▒   █████████     ▄                                     "
PRINT "            ▄█ ██▒-██         █████                             "
PRINT "              ██ ▓                                                     "
PRINT "              █▓ ▓▒                                     "
PRINT "_____________█▓▒_▓▒░___________________________________________"
PLAY "O1E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *               █   █"
PRINT "              *         █  █"
PRINT "     *          ▄  ▒   ████                                  "
PRINT "               █╪▓▒  █████                                     "
PRINT "       *      █▓▒▒-███▒██                                        "
PRINT "             █ █▓▒   ████                                                "
PRINT "            ▄█ ██▒      █                                       "
PRINT "              ██ ▓      █                                              "
PRINT "              █▓ ▓▒     |                               "
PRINT "_____________█▓▒_▓▒░___________________________________________"
PLAY "o0e"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "               ▄             "
PRINT "           ▄    "
PRINT "               ▄  █▒    █                                    "
PRINT "          ▄   █╪▓ ▒ █   █                                      "
PRINT "              █▓▒▒   █  █                                        "
PRINT "             █ █▓▒    ██                                                 "
PRINT "            ▄█ ██▒   ████                                       "
PRINT "              ██ ▓   █▒██                                              "
PRINT "              █▓ ▓▒  █  █                               "
PRINT "_____________█▓▒_▓▒░_█___█_____________________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT "            **"
PRINT "        *  *   ▄             "
PRINT "  *        ▄  * "
PRINT "     *    *   ▄                                             "
PRINT "          ▄  █╪▓██▒ █                                          "
PRINT "   *   *      █▓▒▒█  █                                           "
PRINT "             █ █▓▒ █ █   █                                               "
PRINT "            ▄█ ██▒  ██  █                                       "
PRINT "              ██ ▓   ███                                               "
PRINT "              █▓ ▓▒   ███▒█                             "
PRINT "_____________█▓▒_▓▒░__█________________________________________"
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "        *                    "
PRINT "              * "
PRINT "     *          ▄ █▒    █                                    "
PRINT "               █╪▓▒ █   █                                      "
PRINT "       *      █▓▒▒   █  █                                        "
PRINT "             █ █▓▒    ██                                                 "
PRINT "            ▄█ ██▒   ████                                       "
PRINT "              ██ ▓   █▒██                                              "
PRINT "              █▓ ▓▒  █  █                               "
PRINT "_____________█▓▒_▓▒░_█___█_____________________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "               ▄        █   █"
PRINT "           ▄  *         █  █"
PRINT "                ▄  ▒   ████                                  "
PRINT "               █╪█▒  █████                                     "
PRINT "              █▓▒▒  ██▒██                                        "
PRINT "             █ █▓▒ █ ████                                                "
PRINT "            ▄█ ██▒ █    █                                       "
PRINT "              ██ ▓ |    █                                              "
PRINT "              █▓ ▓▒     |                               "
PRINT "_____________█▓▒_▓▒░__________________________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6
PRINT " "
PRINT " "
PRINT "                "
PRINT "                "
PRINT "                ▄            ▄                               "
PRINT "               █╪▓          █░█                                "
PRINT "              █▓▒▒█        ██████                                "
PRINT "             █ █▓▒ █  __▄██  ███                                         "
PRINT "            ▄█ ██▒ ▒░    --██ ██                                "
PRINT "              ██ ▓            █ █                                           "
PRINT "              █▓ ▓▒          █   █             "
PRINT "_____________█▓▒_▓▒░________██___██___________________________"
LET ONE = ONE - 2
FOR R = R TO 5000: NEXT R: GOTO POWER4
EKICK4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT "                         |"
PRINT "                        _|_"
PRINT "                   * *  ██"
PRINT "                * ▄      ██   ▄               "
PRINT "            *    █╪▓       █ █░█    "
PRINT "               * █▓▒▒░███   ██████    "
PRINT "             *    █▓▒▒▓ ███  ███  ██ "
PRINT "                  ██▒ ▒   █████    ██"
PRINT "                  █ ▓▒▒▒▒    ███    ██|---"
PRINT "                   █▓▒   ░░    ██       "
PRINT "____________________▓▒░________███____________________________"
LET ONE = ONE - 1
PLAY "O0E": LET R = 0: FOR R = R TO 5000: NEXT R: GOTO POWER4
TWIN4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT "                          |          |"
PRINT "                         _|_        _|_"
PRINT "                         ██    ▄    ██      "
PRINT "                          ██  █░█  ██                "
PRINT "                            ███████                "
PRINT "                              ███                        "
PRINT "                               ██                           "
PRINT "                              █ █                              "
PRINT "          ▄▄▄                █   █                              "
PRINT "____▒█▄▄▒▒▒▓▒█▓▒▓▄▄▄▒▒______██___██___________________________"
LET RR = RR + 1
IF RDT = 0 THEN LET RDT = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND4
END
FIREBALL4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                        ▄ --█                           "
PRINT "     █╪▓                      █░█  ▄█                                  "
PRINT "    █▓▒▒░                   ███████                                "
PRINT "   █ ▓▒▒ ░              __▄██ ███                                           "
PRINT "    ███▒░                      ██                                          "
PRINT "     █ ▓                      █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                          "
PRINT "      ▄                        ▄ --█                           "
PRINT "     █╪▓                      █░█  ▄█                                  "
PRINT "    █▓▒▒▒                   ███████                                "
PRINT "  ██ ▓▒▒ ▒▒             __▄██ ███                                           "
PRINT "     ██▒                       ██                                          "
PRINT "     █ ▓                      █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
PLAY "O6G     "
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                          "
PRINT "  █   ▄   ▒                    ▄ --█                           "
PRINT "   █ █╪▓ ▒                    █░█  ▄█                                  "
PRINT "    █▓▒▒▒                   ███████                                "
PRINT "     ▓▒▒                __▄██ ███                                           "
PRINT "     ██▒                       ██                                          "
PRINT "     █ ▓                      █ █"
PRINT "    █▓ ▓▒                    █   █  "
PRINT "___█▓▒_▓▒░__________________██___██____________________________                           "
PLAY "O6G# O6G#"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                          "
PRINT "                               ▄ --█                           "
PRINT "                              █░█  ▄█                                  "
PRINT "                            ███████                                "
PRINT "                        __▄██ ███                                           "
PRINT "                               ██                                          "
PRINT "                              █ █"
PRINT "                             █    █   █"
PRINT "____________________________██__ █  ▄  █________________________                           "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                               \           "
PRINT "                           ██████████████▒█"
PRINT "                         ██ ██ ███████████████         "
PRINT "                          ███                       "
PRINT "                                  █   █        \            "
PRINT "                                 █  ▄  █             "
PRINT "                                 █ █╪█ █                           "
PRINT "                                  █████                             "
PRINT "                            -   -  ███    -                     "
PRINT "__________________________________ ███  _______________________     "
SOUND 30000, 5
CLS : COLOR 4: PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                       "
PRINT "                                            "
PRINT "                                                       "
PRINT "                           ███      /               "
PRINT "                         ███  █                  \          "
PRINT "                            ██ █ ███████████▒█       "
PRINT "                              ███████████████████                  "
PRINT "                                 █   █                          "
PRINT "                           -    █  ▄  █    -                "
PRINT "_______________________________ █ █╪█ █ ___________________     "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      YAMANA         "
COLOR 6
PRINT ""
PRINT "                                      "
PRINT "                                                "
PRINT "                                   "
PRINT "                                                        "
PRINT "                           "
PRINT "                                                         "
PRINT "                                              "
PRINT "                                                                   "
PRINT "                                         "
PRINT "                       \ ▄▄    ████████████  █▒█               "
PRINT "_________________________███████████████████████___\___________"
LET TWO = TWO - 1.5
PLAY "O0E"
LET k = 1: GOTO POWER4
JUMP4: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      YAMANA   "
COLOR 6: LET BL = 0
COLOR 6
PRINT "                   ▒   ▄  ░    "
PRINT "                    ▒ █╪▒ ▒  "
PRINT "                     ▓▓▒▒░   "
PRINT "                     ▓▓▒░               "
PRINT "                     █▓▒▒     ▄                         "
PRINT "                     █▒▒     █░█                         "
PRINT "                    █  ▒░   ██████                       "
PRINT "                   ▒▒   ░░▄██ ███ █                              "
PRINT "                              ██   █                             "
PRINT "                             █ █   |                              "
PRINT "                            █   █                               "
PRINT "___________________________██___██_____________________________     "
FOR HJ = 10 TO 5000: NEXT HJ: G$ = INKEY$: IF G$ = " " THEN GOTO JUMPKICK4: SOUND 30000, 5:
GOTO POWER4
END
FATAL25: PLAY "T200 O1E O1E.O1E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "              \"
PRINT "                \"
PRINT "                  \ /"
PRINT "                  /▒"
PRINT "                ▄▄  ░          ▄ --█                   "
PRINT "                █╪▓ ░         █░█  ▄█                     "
PRINT "               █▓▒▒░         ██████                       "
PRINT "              █ █▓▒     __▄██ ███                                 "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           █ █                                    "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "               "
PRINT "                 "
PRINT "                   "
PRINT "                    "
PRINT "                 ▄          ___▄ --█                   "
PRINT "                █╪▓   ░░|---  █░█  ▄█                     "
PRINT "               █▓▒▒░░░       ██████                       "
PRINT "              █ █▓▒     __▄██ ███                                 "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           █ █                                    "
PRINT "               █▓ ▓▒         █   █                               "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "               "
PRINT "                 "
PRINT "                   "
PRINT "                                *  ▄"
PRINT "                 ▄          *     █▒█                  "
PRINT "                █╪▓            * ███                             "
PRINT "               █▓▒▒░░        ██ * ███                     "
PRINT "              █ █▓▒  ░░|--▄██ ██ * █                              "
PRINT "             ▄█ ██▒       ---- ██ * █                               "
PRINT "                █ ▓           █ █   █                                "
PRINT "               █▓ ▓▒         █   █ █                             "
PRINT "______________█▓▒_▓▒░_______██___██____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "               "
PRINT "                 "
PRINT "                                    * "
PRINT "                                    "
PRINT "                 ▄       *    *                        "
PRINT "                █╪▓            *                                 "
PRINT "               █▓▒▒░         ██ *        **              "
PRINT "              █ █▓▒ ░   __▄██ ██ *    *  ▄                        "
PRINT "             ▄█ ██▒  ░         ██ *  *  █▒█                         "
PRINT "                █ ▓   /       █ █      █████                         "
PRINT "               █▓ ▓▒   \     █   █  * █ ███                      "
PRINT "______________█▓▒_▓▒░___\___██___██__█__**_█___________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU   "
COLOR 6
PRINT "                    |"
PRINT "                    |"
PRINT "                    |"
PRINT "                   ---              "
PRINT "                 ▄  ░                                  "
PRINT "                █╪▓ ░                                            "
PRINT "               █▓▒▒░         ██ *                        "
PRINT "              █ █▓▒         █ ██ *                                "
PRINT "             ▄█ ██▒         █  ██                                   "
PRINT "                █ ▓         | █ █                                    "
PRINT "               █▓ ▓▒         █   █  * * ▄ * *                    "
PRINT "______________█▓▒_▓▒░_______██___██_*████▒███**________________     "
GOTO NEXTLEVEL3
FT:
FATALSHOGUN (PN$)
END SUB

SUB SHOGUNL3
CLS
PRINT "WELL, WELL, "; PN$; ", I CAN SEE YOU ARE GOOD ENOUGH FOR MY LOWER"
PRINT "STANDARD FIGHTERS, BUT SEE HOW YOU STAND UP AGAINST FRILL."
PLAY "O0E O0E O0E"
RUN "C:\dos\CSHOGUN.bas"
END SUB

SUB TPLAY
CLS
SCREEN 12
LET RR = 1
PLAY "T250"
TPL: LET V = V + 1: COLOR 14: PRINT "                  CHOOSE YOUR FIGHTER PLAYER"; V
COLOR 6: PRINT "                ▄               ▓▒    ▄     ▒░"
PRINT "               █╪░               ▓▒  █╫░   ▒▒"
PRINT "             ██▓▓▒▒░              ███▓▓▒▒░░░"
PRINT "            █▓▓▒▒░░▓▒              ██▓▓▒▒░░"
PRINT "            █▓ ▓▒░ ▓▒                ▓▒▒░"
PRINT "           █▓  ▓▒░  ▓▒               ▓▓░░"
PRINT "              ▓▒▒░░                 ▓▒▒▒░░"
PRINT "              ▓▒ ░░                 ▓▒  ░░"
PRINT "             ▓▒░ ▓▒░               ▓▒░  ░▒░"
PRINT "             ▓▒░ ▓▒░               ▓▒░  ▒░░"
PRINT ""
COLOR 15: PRINT "              Keero                 Sho'ki"
PRINT : PRINT : PRINT : PRINT
PRINT "  Press 'K' for Keero, 'S' for Sho'ki"
IF OV = 0 THEN DRAW "bm10,260 c4 d40 r310 u40 l310"
PRINT : PRINT
BH: CHOICE$ = INKEY$
IF CHOICE$ = "" THEN GOTO BH
IF (CHOICE$ = CHR$(75)) OR (CHOICE$ = CHR$(107)) THEN
 IF OV = 0 THEN DRAW "bm80,19 c3 d161 r100 u161 l100":
    PN$ = "KEERO"
      END IF
IF (CHOICE$ = CHR$(83)) OR (CHOICE$ = CHR$(115)) THEN
    PN$ = "SHO'KI"
    IF OV = 0 THEN DRAW "bm250,15 c3 d168 r123 u168 l123":
      END IF
IF V = 1 THEN LET PO$ = PN$
IF V = 2 THEN LET PT$ = PN$
FOR d = 1 TO 10000
NEXT d
IF V = 2 THEN GOTO FIG
CLS : GOTO TPL
FIG: CLS : COLOR 4: PRINT "                         FIGHT OF "; PO$; " VS. "; PT$: FOR T = 1 TO 2000: NEXT T
COLOR 6: PRINT "                    ▄                   ▄   ▓▒    "
PRINT "                   █╪░                 █╫░   ▒▒"
PRINT "                 ██▓▓▒▒░              █▓▓▒▒░░░"
PRINT "                █▓▓▒▒░░▓▒   █ █      ██▓▓▒▒░░"
PRINT "                 ███▒░  ▒▒░ █ █    ██  ▓▒▒░"
PRINT "                   ▓▒░       █  █      ▓▓░░"
PRINT "                  ▓▒▒░░        █      ▓▒▒▒░░"
PRINT "                  ▓▒ ░░         █     ▓▒  ░░"
PRINT "                 ▓▒░ ▓▒░       █     ▓▒░  ░▒░"
PRINT "                 ▓▒░ ▓▒░             ▓▒░  ▒░░"
PRINT ""
FOR G = 1 TO 10000: NEXT G
HEXTROUND: LET ONE = 10: LET TWO = 10
TOWER: IF ONE = 10 THEN LET P$ = "░▒▒▓▓▓▓███  "
IF ONE = 9 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4 THEN LET P$ = "░▒▒▓        "
IF ONE = 3 THEN LET P$ = "░▒▒         "
IF ONE = 2 THEN LET P$ = "░▒          "
IF ONE = 1 THEN LET P$ = "░           "
IF ONE = 9.5 THEN LET P$ = "░▒▒▓▓▓▓██   "
IF ONE = 8.5 THEN LET P$ = "░▒▒▓▓▓▓█    "
IF ONE = 7.5 THEN LET P$ = "░▒▒▓▓▓▓     "
IF ONE = 6.5 THEN LET P$ = "░▒▒▓▓▓      "
IF ONE = 5.5 THEN LET P$ = "░▒▒▓▓       "
IF ONE = 4.5 THEN LET P$ = "░▒▒▓        "
IF ONE = 3.5 THEN LET P$ = "░▒▒         "
IF ONE = 2.5 THEN LET P$ = "░▒          "
IF ONE = 1.5 THEN LET P$ = "░           "
IF ONE = .5 THEN LET P$ = "░           "
IF ONE = 0 THEN LET P$ = "            "
IF TWO = 10 THEN LET PA$ = "░▒▒▓▓▓▓███"
IF TWO = 9 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4 THEN LET PA$ = "░▒▒▓"
IF TWO = 3 THEN LET PA$ = "░▒▒"
IF TWO = 2 THEN LET PA$ = "░▒ "
IF TWO = 1 THEN LET PA$ = "░   "
IF TWO = 0 THEN LET PA$ = "          "
IF TWO = 9.5 THEN LET PA$ = "░▒▒▓▓▓▓██"
IF TWO = 8.5 THEN LET PA$ = "░▒▒▓▓▓▓█"
IF TWO = 7.5 THEN LET PA$ = "░▒▒▓▓▓▓"
IF TWO = 6.5 THEN LET PA$ = "░▒▒▓▓▓"
IF TWO = 5.5 THEN LET PA$ = "░▒▒▓▓"
IF TWO = 4.5 THEN LET PA$ = "░▒▒▓"
IF TWO = 3.5 THEN LET PA$ = "░▒▒"
IF TWO = 2.5 THEN LET PA$ = "░▒ "
IF TWO = 1.5 THEN LET PA$ = "░   "
IF TWO = .5 THEN LET PA$ = "░   "
IF k = 1 THEN GOTO FLOCK
FEDO: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "                ▄                     ▄   ▒░"
PRINT "               █╪░                   █╫░   ▒▒"
PRINT "             ██▓▓▒▒░               ██▓▓▒▒░░░"
PRINT "            █▓▓▒▒░░▓▒             ▓██▓▓▒▒░░"
PRINT "            █▓ ▓▒░ ▓▒            ▓▓  ▓▒▒░"
PRINT "           █▓  ▓▒░  ▓▒          ▒▒   ▓▓░░"
PRINT "              ▓▒▒░░                 ▓▒▒▒░░"
PRINT "              ▓▒ ░░                 ▓▒  ░░"
PRINT "             ▓▒░ ▓▒░               ▓▒░  ░▒░"
PRINT "_____________▓▒░_▓▒░_______________▓▒░__▒░░_______________"
FENU: IF F = 1 THEN GOTO FMENU
IF (ONE < 1) AND (RDT = 1) THEN GOTO HWIN
IF ONE < 1 THEN GOTO HWIN
IF (TWO < 1) AND (RD = 1) THEN GOTO HWIN
IF TWO < 1 THEN GOTO FIN
IF BL = 1 THEN GOTO FKIP
LET x% = 0
FKIP: COLOR 15: COLOR 0:
LET BL = 0:
FMPUG: LET G$ = "I": G$ = INKEY$: IF G$ = " " THEN GOTO FIT
FMENU: IF G$ = "2" THEN GOTO FIT
FMMENU: IF G$ = "8" THEN GOTO FUMP
IF G$ = "4" THEN GOTO FLOCK
IF G$ = "0" THEN GOTO FEDO
IF G$ = "7" THEN GOTO KICK
IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO FLOCK
IF (TWO < 1) AND (RD = 1) THEN GOTO FMPUG
RANDOMIZE TIMER: x% = INT(RND * 6)
GOTO FMPUG
FIT: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "                ▄ *             ▄  ▒░"
PRINT "              █╪░      *  *    █╫░   ▒▒"
PRINT "            ██▓▓▒▒░* *   *   ▓██▓▓▒▒░░░"
PRINT "           █▓▓▒▒░░▓▒*---▒▓▓▓▓█ ▓▓▒▒░░"
PRINT "            █▓ ▓▒░ ▓▒           ▓▒▒░"
PRINT "           █▓  ▓▒░  ▓▒          ▓▓░░"
PRINT "              ▓▒▒░░ *          ▓▒▒▒░░"
PRINT "              ▓▒ ░░   *        ▓▒  ░░"
PRINT "             ▓▒░  ▓▒░         ▓▒░  ░▒░"
PRINT "_____________▓▒░___▓▒░________▓▒░__▒░░_______________"
LET ONE = ONE - .5
PLAY "O0E"
GOTO TOWER
KICK: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "                  ▄   *         ▓    ▄   ▒░"
PRINT "                 █╪░ *           ▓  ██▒   ▒▒"
PRINT "               ██▓▓▒▒░ * *        ██▓▓▒▒░░░"
PRINT "             █▓▓▒▒░░▓▒ *         ██▓▓▒▒░░"
PRINT "            █▓ ▓▒░ ▓▒██▄▄▄▄▄      ▓▒▒░"
PRINT "           █▓  ▓▒░* ▓▒▓     ▒▒▒▒▓▓░░"
PRINT "              ▓▒▒░░ *   * *       ▒▒░░"
PRINT "              ▓▒   ░░* * *           ░░"
PRINT "             ▓▒░   ▓▒░                ░▒░"
PRINT "_____________▓▒░______▓▒░_______________▒░░_______________"
PLAY "O0E"
INKET: G$ = INKEY$
LET MN = MN + 1
IF G$ = " " THEN GOTO KICKER
IF G$ <> "" THEN GOTO FMPUG
IF MN = 4 THEN GOTO FMPUG
GOTO TOWER
KICKER: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "                  ▄   *              ▄ ▒░"
PRINT "                 █╪░ *              ▓██ ▒▒"
PRINT "               ██▓▓▒▒░ * *       ▓██▓▓▒▒░░░"
PRINT "             █▓▓▒▒░░▓▒ *      ▓▓▓██▓▓▒▒░░"
PRINT "            █▓ ▓▒░ ▓▒             ▓▒▒░"
PRINT "           █▓  ▓▒░* ▓▒▓          ▓░░"
PRINT "              ▓▒▒░░ *   * *      ▓▒▒░░░"
PRINT "              ▓▒   ░░* * *     ▓▓      ▓▓"
PRINT "             ▓▒░   ▓▒░        ▒▒         "
PRINT "_____________▓▒░______▓▒░____▒▒___________________________"
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT ""
PRINT "                  ▄             ▓    ▄   ▒░"
PRINT "                 █╪░   ░░        ▓  ███   ▒▒"
PRINT "               ██▓▓▒▒░   ▒▒▒      ██▓▓▒▒░░░"
PRINT "             █▓▓▒▒░░▓▒      ▒▒   ██▓▓▒▒░░"
PRINT "            █▓ ▓▒░ ▓▒         ▒▒  ▓▒▒░"
PRINT "           █▓  ▓▒░  ▓▒▓         ▓▓░░"
PRINT "              ▓▒▒░░              ▒▒▒  "
PRINT "              ▓▒   ░░           ▒▒      "
PRINT "             ▓▒░   ▓▒░         ░░        "
PRINT "_____________▓▒░______▓▒░_____░░__________________________"
PLAY "O03"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      WAN'FU  "
COLOR 6
PRINT "                    *"
PRINT "               ▄    **        ▓    ▄   ▒░"
PRINT "              █╪█  * **▒       ▓  ███   ▒▒"
PRINT "               ███******░░      ██▓▓▒▒░░░"
PRINT "             █▓▓▒░█░▓▒*   ▒▒   ██▓▓▒▒░░"
PRINT "            █▓ ▓▒▀*▓▒***    ▒▒░▓▒▒░"
PRINT "           █▓  ▓▒░* ▓▒▓**      ▓▓░░"
PRINT "              ▓▒▒░░*            ▒▒▒  "
PRINT "              ▓▒   ░░            ▒▒      "
PRINT "             ▓▒░   ▓▒░           ░░        "
PRINT "_____________▓▒░______▓▒░***____░░░__________________________"
PLAY "O0E"
ONE = ONE - 1
GOTO TOWER
FLOCK:
HWIN:
FIN:
FHIT:
FUMP:
FKICK:
GOTO TOWER

END
END SUB

