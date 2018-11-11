//By superjojo140


#ifndef SUPERBIKE_GUI_H
#define SUPERBIKE_GUI_H

#include <arrows.h>

#define COLORED     0
#define UNCOLORED   1

#define MAX_ROW_LENGTH 14

class SuperbikeGui{
public:
SuperbikeGui(Paint *paint, Epd *epd);
void paintDistanceToNextStep(int16_t distance);
void paintStatusBar(char *textLeft , char *textMiddle, char *textRight);
void paintNavigationStep(char *text, unsigned char arrowType);
void paintSpeed(char speed);
void paintWelcomeScreen();
void paintTime(char *currentTime);

private:
  Paint *paint;
  Epd *epd;

};






#endif
