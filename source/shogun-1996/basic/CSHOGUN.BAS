REM***THIS IS WHERE YOU LEFT OFF....STAGE 4
DECLARE SUB FATALSHOGUN (PN$)
DECLARE SUB SHOGUNL4 (PN$)
SHOGUNL4 (PN$)

SUB FATALSHOGUN (PN$) STATIC
FATAL4: PLAY "T200 O1E O1E.O1E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                                             "
PRINT "                              ██░░                       "
PRINT "                               █▒░░                                   "
PRINT "                            ▓▓▒▒█░░░                   "
PRINT "              ▓▓▒▒▒░░         ██ ░░░░                                     "
PRINT "             ▓▓▒▓▓▓░░░        ▒ ▒"
PRINT "             ▓ █▒▓▒▒ ░       ░  ░  "
PRINT "______________█▓▒_▓▒░_______░░__░░____________________________                      "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
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
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "                                       "
PRINT "                      ▓▒   ░███████████████"
PRINT "                ▄    ▓   ░░ ░█ ███████████████         "
PRINT "               █╪▓  ▒     ░░░         ██ ▒▒▒           "
PRINT "              █▓▒▒░░                 ██   ▒ ▒                "
PRINT "             █ █▓▒                       ▒ ▒ "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░____________________________________________     "
PRINT ""
PRINT " "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "; PA$
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "                                       "
PRINT "                           ░███████████████"
PRINT "_________________________░░_░█_███████████████__________________"
PRINT "                          ░░░           ██          "
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
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "                                        ▒▒▒"
PRINT "                           ░███████████████▒"
PRINT "                         ░░ ░█ ███████████████                  "
PRINT "                          ░░░       ██              "
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
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "                   *     *              ▒▒▒▒"
PRINT "                      *    ░███████████████▒▒"
PRINT "                  *      ░░ ██ ███████████████   *              "
PRINT "                      *   ░░░          ██        "
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
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
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
PRINT " /            █         * * ████████░███████▒▒ *    █           "
PRINT "______________█___________█████_____█____▒▒██▒▒▒______________/"
LET RTY = 1
END
SHOGUNL4 (PN$)
END SUB

SUB SHOGUNL4 (PN$) STATIC
SCREEN 12
PLAY "T230"
FOR K = 1 TO 10000: NEXT K: PLAY "O0E"
COLOR 4: PRINT "                  FIGHT!!!!": FOR O = 1 TO 10000: NEXT O
LET PN$ = "KEERO"
IF RTY = 1 THEN GOTO NEXTLEVEL3
LET RR = 1
LET RD = 0
CLS
LOCATE 10, 10
COLOR 4
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
IF K = 1 THEN GOTO BLOCK3
REDO3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL        "
COLOR 6

PRINT "                   "
PRINT "              "
PRINT ""
PRINT " "
PRINT "                 ▄                                      "
PRINT "                █╪▓           ██░░                         "
PRINT "               █▓▒▒░  ▒        █▒░░                       "
PRINT "              █ █▓▒ ▓▄▓     ▓▓▒▒█░░░                             "
PRINT "             ▄█ ██▒           ██ ░░░░                              "
PRINT "                █ ▓           ▒ ▒                                    "
PRINT "               █▓ ▓▒         ░  ░                               "
PRINT "______________█▓▒_▓▒░_______░░__░░____________________________     "

MENU3: IF F = 1 THEN GOTO MMENU3
IF (ONE < 1) AND (TWO < 1) THEN PRINT "DRAW": FOR G = 1 TO 50000: NEXT G: GOTO NEXTROUND3
IF (ONE < 1) AND (RDT = 1) THEN GOTO TWIN3
IF ONE < 1 THEN GOTO TWIN3
IF (TWO < 1) AND (RD = 1) THEN GOTO FWIN3
IF TWO < 1 THEN GOTO WIN3
IF BL = 1 THEN GOTO SKIP3
LET X% = 0
SKIP3: COLOR 15: COLOR 0:
LET BL = 0:
IMPUG3: G$ = INKEY$:
IF G$ = " " THEN GOTO HIT3
MMENU3: IF G$ = "2" THEN GOTO SIT3
MMMENU3: IF G$ = "8" THEN GOTO JUMP3
IF G$ = "4" THEN GOTO BLOCK3
IF G$ = "0" THEN GOTO REDO3
IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO BLOCK3
IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG3
RT: RANDOMIZE TIMER: X% = INT(RND * 4)
IF X% = 2 THEN GOTO EHIT3
IF X% = 1 THEN GOTO EHIT3
IF X% = 0 THEN GOTO EKICK3
GOTO IMPUG3

HIT3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      FRILL          "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                              ▒▒▒"
PRINT "                   ▄         ▓ ▒▒▒  *                   "
PRINT "                  █╪▓         ▓  ██*    *    "
PRINT "                ▄█▓▒▒▒▒░░░|----▓▒▒--* *     *            "
PRINT "               ██▓▒          *-▒▒▒█  *                           "
PRINT "             ▄█ ██▒      * * **▒▒█ *         *                   "
PRINT "                █ ▓         ░░▒ ▒          *                       "
PRINT "              █▓  ▓▒      ░░    ░                                "
PRINT "____________███___███___________░░░___________________________"
LET Y = 0: FOR Y = Y TO 5000: NEXT Y
LET H = H + 1
IF H = 3 THEN LET H = 0: GOTO RT
PLAY "O1E": IF F = 1 THEN GOTO WIN3:
LET TWO = TWO - .5: GOTO POWER3

LET Y = 0: FOR Y = Y TO 5000: NEXT Y
PLAY "O1E": IF F = 1 THEN GOTO WIN3:
LET TWO = TWO - .5: GOTO POWER3
JUMPKICK3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL    "
COLOR 6: LET BL = 0
COLOR 6
PRINT "                        ▄     ░▀  "
PRINT "                       █╪▒  ░░"
PRINT "                  ▓███▓▒▒░░░"
PRINT "                 █▓   ▓▒░           ▒▒ *"
PRINT "                █▓   █▓▒▒     ▒░ ▄▒▒▒ *   *                "
PRINT "                    █▓ █▓▓▓▒▒▒░░██ *  *   *                "
PRINT "                   █▓        ▓▓▒▒▒▒ *  ***                "
PRINT "                    ▓▓▓    ▓▓▓ ▒▒▒ █                              "
PRINT "                      ▒       ▒▒    █                             "
PRINT "                             ▒ ▒    |                              "
PRINT "                            ░   ░                               "
PRINT "___________________________░░___░░_____________________________     "
PLAY "O0E": LET Y = 0: FOR Y = Y TO 5000: NEXT Y
RANDOMIZE TIMER: X% = INT(RND * 3): IF X% = 2 THEN SOUND 30000, 5: GOTO ETR
PLAY "O1E": IF F = 1 THEN GOTO WIN3:
LET TWO = TWO - 1: GOTO POWER3
BLOCK3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET K = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄    ░░                                         "
PRINT "     █╪▓   ▒                  ██░░             "
PRINT "    █▓▒▒░░▒▒                   █▒░░            "
PRINT "    ██████▄                 ▓▓▒▒█░░░                        "
PRINT "     ██▒                      ██ ░░░░                   "
PRINT "     █ ▓                      ▒ ▒         "
PRINT "    █▓ ▓▒                    ░  ░       "
PRINT "___█▓▒_▓▒░__________________░░__░░_______________________ "
KL3: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO KL3
IF G$ = "6" THEN GOTO POWER3
LET HKL = 1: LET HKL = 0: LET V = 0: IF G$ = "4" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN FOR V = V TO 4000: NEXT V: LET V = 0: G$ = INKEY$: IF G$ = "6" THEN GOTO FIREBALL3
LET BL = 2: GOTO MMENU3
COLOR 0: INPUT G
IF G = 466 THEN GOTO FIREBALL3
LET BL = 1: GOTO MMENU3
SIT3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$; ""
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                                             "
PRINT "                              ██░░                       "
PRINT "                               █▒░░                                   "
PRINT "                            ▓▓▒▒█░░░                   "
PRINT "              ▓▓▒▒▒░░         ██ ░░░░                                     "
PRINT "             ▓▓▒▓▓▓░░░        ▒ ▒"
PRINT "             ▓ █▒▓▒▒ ░       ░  ░  "
PRINT "______________█▓▒_▓▒░_______░░__░░____________________________                      "
SITO3: COLOR 0: G$ = INKEY$: IF G$ = "" THEN GOTO SITO3
IF G$ = " " THEN GOTO UPPERCUT3
LET SD = 1: GOTO MMMENU3
UPPERCUT3:
RANDOMIZE TIMER: X% = INT(RND * 3)
IF X% = 1 THEN GOTO UPPERDEFENSE
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      FRILL          "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                           "
PRINT "                      ▓▒   ░▒▒▒▒▒▒▒▒▒▒▒▒▒██"
PRINT "                ▄    ▓   ░░ ░▒ ▒▒▒▒▒▒▒▓▓▓█████         "
PRINT "               █╪▓  ▒     ░░░           ░░░░       "
PRINT "              █▓▒▒░░                   ░ ░ ░                "
PRINT "             █ █▓▒                       ░░          "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░___________________________________________     "
PLAY "O0E"
CLS : COLOR 4: PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      FRILL          "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                       "
PRINT "                      ▓▒                    "
PRINT "                ▄    ▓                                 "
PRINT "               █╪▓  ▒      ░░░           ▓          "
PRINT "              █▓▒▒░░     ░░░  ░           ▓  ▒ ▒▒▒          "
PRINT "             █ █▓▒          ░░ ▒ ▒▒▒▒▒▒▒▒▒▒▒██▒▒     "
PRINT "            ▄█ ██▒            ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓██                  "
PRINT "               █ ▓                                                  "
PRINT "              █▓ ▓▒                                             "
PRINT "_____________█▓▒_▓▒░___________________________________________     "
PLAY "O0E": IF F = 1 THEN GOTO WIN3
CLS : COLOR 4: PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      FRILL          "
COLOR 6
PRINT ""
PRINT "                                     "
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                       "
PRINT "              █▓ ▓▒      ░░    ▒▒▒▒▒▒▒▒▒▒                "
PRINT "_____________█▓▒_▓▒░_____░░░░░▒▒▒▒▒▓█████▒██▒▒▒▒________"
LET TWO = TWO - 2: PLAY "O0E": GOTO POWER3
FWIN3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     FRILL   "
COLOR 6
PRINT ""
PRINT "                  F I N I S H  H E R !!!!!"
PRINT ""
PRINT " "
PRINT "                 ▄         *        *                     "
PRINT "                █╪▓       *   ██░░   *                      "
PRINT "               █▓▒▒░  ▒        █▒░░                       "
PRINT "              █ █▓▒ ▓▄▓     ▓▓▒▒█░░░                             "
PRINT "             ▄█ ██▒           ██ ░░░░                              "
PRINT "                █ ▓           ▒ ▒                                    "
PRINT "               █▓ ▓▒         ░  ░                               "
PRINT "______________█▓▒_▓▒░_______░░__░░____________________________     "
SOUND 30000, 5
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO NF
GOTO FATALITIES3
NF: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                     FRILL   "
COLOR 6
PRINT ""
PRINT "                  F I N I S H  H E R !!!!!"
PRINT ""
PRINT " "
PRINT "                 ▄                                      "
PRINT "                █╪▓          *  ██░░                         "
PRINT "               █▓▒▒░  ▒    *    █▒░░  *                    "
PRINT "              █ █▓▒ ▓▄▓      ▓▓▒▒█░░░                             "
PRINT "             ▄█ ██▒           ██ ░░░░                              "
PRINT "                █ ▓           ▒ ▒                                    "
PRINT "               █▓ ▓▒          ░  ░                               "
PRINT "______________█▓▒_▓▒░_______░░__░░____________________________     "
IF NNN = 10 THEN GOTO WIN3
LET NNN = NNN + 1
SOUND 30000, 5
COLOR 0: FT$ = INKEY$: IF FT$ = "" THEN GOTO FWIN3
GOTO FATALITIES3

WIN3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   ";
LET F = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL    "
COLOR 6
PRINT ""
PRINT "                         YOU WIN!!!            "
PRINT "                                                "
PRINT "                                   "
PRINT "                ▄                                       "
PRINT "               █╪▓         "
PRINT "              █▓▒▒░  ▒                                   "
PRINT "             █ █▓▒ ▓▄▓                        "
PRINT "            ▄█ ██▒                                                 "
PRINT "               █ ▓                       "
PRINT "              █▓ ▓▒      ░░    ▒▒▒▒▒▒▒▒▒▒                "
PRINT "_____________█▓▒_▓▒░_____░░░░░▒▒▒▒▒▓█████▒██▒▒▒▒________"
LET RR = RR + 1
IF RD = 1 THEN GOTO NEXTLEVEL3
IF RD = 0 THEN LET RD = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND3
END
EHIT3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                ▄                                      "
PRINT "               █╪▓     *    ██░░                         "
PRINT "              █▓▒▒░  ▒*      █▒░░                       "
PRINT "              █ █▓ ▓▄*▓▓▓▓▓▓▒▒█░░░                             "
PRINT "             ▄█ ██▒  *      ██ ░░░░                              "
PRINT "                █ ▓  * * *   ▒ ▒                                    "
PRINT "               █▓  ▓▓▒  *    ░  ░                               "
PRINT "______________█▓▒___________░░__░░____________________________     "
PLAY "O3E"
LET ONE = ONE - 1.5
FOR R = R TO 5000: NEXT R: GOTO POWER3
EKICK3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "               ▄                                      "
PRINT "              █╪▓ *      *  ██░░                         "
PRINT "               █▓▒▒░ ▒  *    █▒░░                       "
PRINT "              █ █▓▒▓▄▓ *  ▓▓▒▒█░░░                             "
PRINT "            ▄█ ██▒ * ░░░░▒▒▒███▒                                  "
PRINT "                █ ▓  *         ▒░░                                 "
PRINT "               █▓ ▓▒   *          ░                           "
PRINT "______________█▓▒_▓▒░_________________________________________     "
PLAY "O2E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "               ▄         ░        ▒ ▒ ▒            "
PRINT "              █╪▓ *       ▒    █ ▒ ▒▒▒                  "
PRINT "               █▓▒▒░ ▒  *  ▒   █ ██▒▒                  "
PRINT "              █ █▓▒▓▄▓░░▒▒▒▒▒▒▒▀█                             "
PRINT "            ▄█ ██▒ * *           █                                 "
PRINT "                █ ▓  *          █                                   "
PRINT "               █▓ ▓▒   *                                        "
PRINT "______________█▓▒_▓▒░_________________________________________     "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                         ▒ ▒"
PRINT "                 ▄        ▒▒▒▒   █                   "
PRINT "                █╪▓      ▒▒▒▒██ █                         "
PRINT "               █▓▒▒░ ▒    ▒    ▒▒▒                     "
PRINT "              █ █▓▒▓▄▓         █  ▒▒▒░░░                      "
PRINT "             ▄█ ██▒           █     ░   ░                         "
PRINT "                █ ▓                  ░                            "
PRINT "               █▓ ▓▒                  ░                      "
PRINT "______________█▓▒_▓▒░_________________________________________     "
LET ONE = ONE - 2
LET R = 0:  GOTO POWER3
TWIN3: COLOR 4: CLS : PRINT TAB(15); : PRINT "            "; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                                        "
PRINT "                            ▓ ██░█                         "
PRINT "                            ▓  █▒█░                       "
PRINT "                             ▓▒▒█░░░                             "
PRINT "                              ▒▒ ░░░░                              "
PRINT "                              ▒ ▒                                    "
PRINT "     ██   ▒▒▒▒▒     ░░       ░  ░                               "
PRINT "_____██████▓▓▓▓▒▒▒▒░░░______░░__░░____________________________     "
LET RR = RR + 1
IF RDT = 0 THEN LET RDT = 1: PRINT "PRESS (ENTER) TO BEGIN NEXT ROUND": COLOR 0: INPUT B: GOTO NEXTROUND3
RUN "A:LEND"
END
FIREBALL3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                                               "
PRINT "     █╪▓                       ██░░             "
PRINT "    █▓▒▒░░▒▒ ▓██▓               █▒░░            "
PRINT "    ██████▄  ▓██▓            ▓▓▒▒█░░░                        "
PRINT "     ██▒                       ██ ░░░░                   "
PRINT "     █ ▓                       ▒ ▒         "
PRINT "    █▓ ▓▒                     ░  ░       "
PRINT "___█▓▒_▓▒░___________________░░__░░_______________________ "
PLAY "O6E O6E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                                               "
PRINT "     █╪▓       ▒ ▒▓▓███▓       ██░░             "
PRINT "    █▓▒▒░░▒▒    ▒▒▒▓███▓        █▒░░            "
PRINT "    ██████▄    ▒ ▒▓▓███▓     ▓▓▒▒█░░░                        "
PRINT "     ██▒                       ██ ░░░░                   "
PRINT "     █ ▓                       ▒ ▒         "
PRINT "    █▓ ▓▒                     ░  ░       "
PRINT "___█▓▒_▓▒░___________________░░__░░_______________________ "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                 ▒"
PRINT "      ▄            ▒                                  "
PRINT "     █╪▓            ▒▒▓▓███▓   ██░░             "
PRINT "    █▓▒▒░░▒▒        ▒▒▒▓███▓    █▒░░            "
PRINT "    ██████▄         ▒▒▓▓███▓ ▓▓▒▒█░░░                        "
PRINT "     ██▒           ▒           ██ ░░░░                   "
PRINT "     █ ▓         ▒             ▒ ▒         "
PRINT "    █▓ ▓▒                     ░  ░       "
PRINT "___█▓▒_▓▒░___________________░░__░░_______________________ "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                  "
PRINT "      ▄                                               "
PRINT "     █╪▓              ▒▒▓▓███▓ ██░░             "
PRINT "    █▓▒▒░░▒▒            ▓▓███▓  █▒░░            "
PRINT "    ██████▄           ▒▒▓▓███▓▓▒▒█░░░                        "
PRINT "     ██▒                       ██ ░░░░                   "
PRINT "     █ ▓                       ▒ ▒         "
PRINT "    █▓ ▓▒                     ░  ░       "
PRINT "___█▓▒_▓▒░___________________░░__░░_______________________ "
SOUND 30000, 5
RANDOMIZE TIMER
X% = INT(RND * 3)
IF X% = 2 THEN GOTO FIREBALL
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
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
PLAY "O0E"
CLS : COLOR 4: PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      FRILL          "
COLOR 6
PRINT ""
PRINT "     "
PRINT "                                       "
PRINT "                                  "
PRINT "      ▄    ▓                                 "
PRINT "     █╪▓  ▒                ░░░           ▓          "
PRINT "    █▓▒▒░░               ░░░  ░           ▓  ▒ ▒▒▒          "
PRINT "   █ █▓▒                    ░░ ▒ ▒▒▒▒▒▒▒▒▒▒▒██▒▒     "
PRINT "  ▄█ ██▒                      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓██                  "
PRINT "     █ ▓                                                  "
PRINT "    █▓ ▓▒                                             "
PRINT "___█▓▒_▓▒░_____________________________________________________     "
SOUND 30000, 5
CLS : COLOR 4: PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
PRINT TAB(15); : COLOR 15: PRINT PN$; "                      FRILL          "
COLOR 6
PRINT ""
PRINT "                                    "
PRINT "                                                "
PRINT "                                   "
PRINT "      ▄                                       "
PRINT "     █╪▓         "
PRINT "    █▓▒▒░  ▒                                   "
PRINT "   █ █▓▒ ▓▄▓                        "
PRINT "  ▄█ ██▒                                                 "
PRINT "     █ ▓                       "
PRINT "    █▓ ▓▒                ░░    ▒▒▒▒▒▒▒▒▒▒                "
PRINT "___█▓▒_▓▒░_______________░░░░░▒▒▒▒▒▓█████▒██▒▒▒▒________"
LET TWO = TWO - 1.5
FE: PLAY " O0G-"
IF F = 1 THEN GOTO WIN3:
LET K = 1: GOTO POWER3
JUMP3: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL    "
COLOR 6: LET BL = 0
PRINT "                      ▄    ▓  "
PRINT "                     █╪▒ ▓▒"
PRINT "                   ▓█▓▒▒░░ "
PRINT "                  █▓ ▓▒░              "
PRINT "                  █▓ █▓▒▒     ██▒                        "
PRINT "                    █▓ ██      █▒▒▒                      "
PRINT "                   █▓   ▓▓  ▓▓▒▒▒▒▒▒                     "
PRINT "                    ▓▓▓ ▓▒▓▓▓ ▒▒▒ █                              "
PRINT "                      ▒       ▒▒   █                             "
PRINT "                             ▒ ▒                                   "
PRINT "                            ░   ░                               "
PRINT "___________________________░░___░░_____________________________     "
FOR HJ = 10 TO 5000: NEXT HJ: G$ = INKEY$: IF G$ = " " THEN GOTO JUMPKICK3: SOUND 30000, 5:
RANDOMIZE TIMER: X% = INT(RND * 3): IF X% = 2 THEN SOUND 30000, 5: GOTO ETR
GOTO POWER3
NEXTLEVEL3: LET RTY = 0: PRINT "PRESS (RETURN) TO PLAY THE NEXT CONFRENTATION"
COLOR 0: INPUT NL:
CLS
PRINT "WELL, WELL, "; PN$; ", I CAN SEE YOU ARE GOOD ENOUGH FOR MY LOWER"
PRINT "STANDARD FIGHTERS, BUT SEE HOW YOU STAND UP AGAINST FRILL."
PLAY "O0E O0E O0E":
RUN "A:CSHOGUN"

FATALITIES3:
INPUT FT$
IF FT$ = "46  " THEN FATALSHOGUN (PN$): END
IF (FT$ = "668 ") AND (PN$ = "KEERO") THEN GOTO FATAL3
LET F = 1: GOTO MMENU3
FATAL3: PLAY "T200 O1E O1E.O1E": COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "              \"
PRINT "                \"
PRINT "                  \"
PRINT "                   ░"
PRINT "                 ▄  ░                                   "
PRINT "                █╪▓ ░         ██░░                         "
PRINT "               █▓▒▒░           █▒░░                       "
PRINT "              █ █▓▒         ▓▓▒▒█░░░                             "
PRINT "             ▄█ ██▒           ██ ░░░░                              "
PRINT "                █ ▓           ▒ ▒                                    "
PRINT "               █▓ ▓▒         ░  ░                               "
PRINT "______________█▓▒_▓▒░_______░░__░░____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "                - \  \"
PRINT "                  -   |"
PRINT "                -  |  |"
PRINT "                  -   |"
PRINT "                 ▄    ░                                 "
PRINT "                █╪▓  ░        ██░░                         "
PRINT "               █▓▒▒░░          █▒░░                       "
PRINT "              █ █▓▒         ▓▓▒▒█░░░                             "
PRINT "             ▄█ ██▒           ██ ░░░░                              "
PRINT "                █ ▓           ▒ ▒                                    "
PRINT "               █▓ ▓▒         ░  ░                               "
PRINT "______________█▓▒_▓▒░_______░░__░░____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                             *   ░  *"
PRINT "                 ▄           ░  ░*      *▒             "
PRINT "                █╪▓            **     *▒▒ ▒               "
PRINT "               █▓▒▒▒▒         ▒  ▒   *  ▒▒▒▒▒             "
PRINT "              █ █▓▒  ░░     ▓▓▒▒▒█     * █░█                      "
PRINT "             ▄█ ██▒    ░       ██        **                         "
PRINT "                █ ▓     \     ▒ ▒                                    "
PRINT "               █▓ ▓▒     \   ░   ░                               "
PRINT "______________█▓▒_▓▒░_______░░___░░____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               "
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "                       |"
PRINT "                       |"
PRINT "                       |          *"
PRINT "                     __|__    *   "
PRINT "                 ▄    ░░       ** *  *  ░              "
PRINT "                █╪▓   ░   ░   **  *    * ░   *            "
PRINT "               █▓▒▒▒▒▒░       ▒  ▒    *                   "
PRINT "              █ █▓▒         ▓▓▒▒▒█   * *  ▒  ▒                    "
PRINT "             ▄█ ██▒            ██        ▒▒ ▒ ▒                     "
PRINT "                █ ▓           ▒ ▒        ▒█▒█▒                       "
PRINT "               █▓ ▓▒         ░   ░        ▒▒▒                    "
PRINT "______________█▓▒_▓▒░_______░░___░░____________________________     "
PLAY "O0E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "               DEAD"
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT "                       |     "
PRINT "                       |"
PRINT "                       |           "
PRINT "                     __|__        "
PRINT "                 ▄    ░░                               "
PRINT "                █╪▓   ░                                "
PRINT "               █▓▒▒▒▒▒░       ▒  ▒                        "
PRINT "              █ █▓▒         ▓▓▒▒▒█                        "
PRINT "             ▄█ ██▒            ██                                   "
PRINT "                █ ▓           ▒ ▒                                    "
PRINT "               █▓ ▓▒         ░   ░           ▄                "
PRINT "______________█▓▒_▓▒░_______░░___░░______▒▒▒█▒█▒▒______________     "
PLAY "O0E"
GOTO NEXTLEVEL3
FIREBALL: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT "                  "
PRINT "      ▄                                               "
PRINT "     █╪▓                       ██░░             "
PRINT "    █▓▒▒░░▒▒             ▓███▓  █▒░░            "
PRINT "    ██████▄              ▓██████▒█░░░                        "
PRINT "     ██▒                       ██ ░░░░                   "
PRINT "     █ ▓                       ▒ ▒         "
PRINT "    █▓ ▓▒                     ░  ░       "
PRINT "___█▓▒_▓▒░___________________░░__░░_______________________ "
PLAY "O6E O6G"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                                               "
PRINT "     █╪▓       ▓▓█████▒▒ ▒     ██░░             "
PRINT "    █▓▒▒░░▒▒   ▓▓█████▒▒    ▒   █▒░░            "
PRINT "    ██████▄    ▓▓█████▒▒  ▒  ▓▓▒▒█░░░                        "
PRINT "     ██▒                       ██ ░░░░                   "
PRINT "     █ ▓                       ▒ ▒         "
PRINT "    █▓ ▓▒                     ░  ░       "
PRINT "___█▓▒_▓▒░___________________░░__░░_______________________ "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL  "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "      ▄                                               "
PRINT "     █╪▓    ▓▓██▓▓▒▒ ▒         ██░░             "
PRINT "    █▓▒▒░░▒▒▓▓██▓▓▒ ▒           █▒░░            "
PRINT "    ██████▄ ▓▓██▓▓▒▒ ▒       ▓▓▒▒█░░░                        "
PRINT "     ██▒                       ██ ░░░░                   "
PRINT "     █ ▓                       ▒ ▒         "
PRINT "    █▓ ▓▒                     ░  ░       "
PRINT "___█▓▒_▓▒░___________________░░__░░_______________________ "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL  "
PRINT ""
PRINT ""
PRINT ""
PRINT "       █"
PRINT "    ▄    ▒█                                         "
PRINT "   █╪▓  ▒█                     ██░░             "
PRINT "  █▓▒▒░░▒█                      █▒░░            "
PRINT "    ██████▄                  ▓▓▒▒█░░░                        "
PRINT "     ██▒ █                     ██ ░░░░                   "
PRINT "     █ ▓▓█                     ▒ ▒         "
PRINT "    █▓   ▓█                   ░  ░       "
PRINT "___█▓▒█______________________░░__░░_______________________ "
PLAY "O3E"
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                                        "
PRINT "                            ▓ ██░█                         "
PRINT "                            ▓  █▒█░                       "
PRINT "                             ▓▒▒█░░░                             "
PRINT "                              ▒▒ ░░░░                              "
PRINT "                              ▒ ▒                                    "
PRINT "     ██   ▒▒▒▒▒     ░░       ░  ░                               "
PRINT "_____██████▓▓▓▓▒▒▒▒░░░______░░__░░____________________________     "
PLAY "O0E-"
LET ONE = ONE - 3.5
GOTO FE
UPPERDEFENSE: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                 ▄   ▒                                  "
PRINT "                █╪▓ ▒    ██░░                         "
PRINT "               █▓▒▒░      █▒░░                       "
PRINT "              █ █▓▒▓▓▓▓▓▓▒▒ ░░░                             "
PRINT "             ▄█ ██▒██████▒▒ ░░░░                              "
PRINT "                █ ▓      ▒ ▒                                    "
PRINT "               █▓ ▓▒     ░  ░                               "
PRINT "______________█▓▒_▓▒░____░░__░░____________________________     "
SOUND 30000, 5
ETR: COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL    "
COLOR 6: LET BL = 0
PRINT "                      ▄       "
PRINT "                     █╪▒   "
PRINT "                   ▓█▓▒▒░░ "
PRINT "                  █▓ ▓▒░ ░▒█          "
PRINT "                  █▓ █▓▒▒ ▒ █ ██▒                        "
PRINT "                    █▓ ██    █ █▒▒▒                      "
PRINT "                   █▓   ▓▓  ▓▓▒▒▒▒▒▒                     "
PRINT "                    ▓▓▓ ▓▒▓▓▓ ▒▒▒                                "
PRINT "                      ▒       ▒▒                                 "
PRINT "                             ▒ ▒                                   "
PRINT "                            ░   ░                               "
PRINT "___________________________░░___░░_____________________________     "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
LET BL = 0
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL    "
COLOR 6: LET BL = 0
PRINT "                      ▄       "
PRINT "                     █╪▒   "
PRINT "                   ▓█▓▒▒░░ "
PRINT "                  █▓ ▓▒░ ░▒           "
PRINT "                  █▓ █▓▒▒ ▒   ██▒                        "
PRINT "                    █▓ ██      █▒▒▒                      "
PRINT "                   █▓   ▓▓  ▓▓▒▒▒▒▒▒                     "
PRINT "                    ▓▓▓ ▓▒    ▒▒▒█                               "
PRINT "                      ▒       ▒▒  █                              "
PRINT "                             ▒ ▒                                   "
PRINT "                            ░   ░                               "
PRINT "___________________________░░___░░_____________________________     "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "               ▄   ▒                                  "
PRINT "           *  █╪▓ ▒      ██░░                         "
PRINT "            * *█▓▒▒░      █▒░░                       "
PRINT "            * █ █▓▒    ▓▓▒▒ ░░░                             "
PRINT "             ▄█ ██▒▒▓▓▓ █▒▒ ░░░░                              "
PRINT "            * *  █  ▒▒██ ▒ ▒                                    "
PRINT "                * ▓   ▒  ░  ░                               "
PRINT "___________________▓_____░░__░░____________________________     "
SOUND 30000, 5
COLOR 4: CLS : PRINT TAB(15); : PRINT P$; "  ROUND  "; RR; "   "; PA$;
COLOR 15: PRINT TAB(15); : PRINT PN$; "                      FRILL   "
COLOR 6
PRINT ""
PRINT ""
PRINT ""
PRINT " "
PRINT "                                                        "
PRINT "                            ▓ ██░█                         "
PRINT "                            ▓  █▒█░                       "
PRINT "                             ▓▒▒█░░░                             "
PRINT "                              ▒▒ ░░░░                              "
PRINT "                              ▒ ▒                                    "
PRINT "     ██   ▒▒▒▒▒     ░░       ░  ░                               "
PRINT "_____██████▓▓▓▓▒▒▒▒░░░______░░__░░____________________________     "
PLAY "O0E-"
LET ONE = ONE - 3
GOTO POWER3
END SUB

