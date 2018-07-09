//By superjojo140


#ifndef SUPERBIKE_GUI_H
#define SUPERBIKE_GUI_H

#include <arrows.h>

#define COLORED     0
#define UNCOLORED   1

class SuperbikeGui{
public:
SuperbikeGui(Paint *paint, Epd *epd);
void paintStatusBar(char *textLeft , char *textMiddle, char *textRight);
void paintNavigationStep(char *textTop, char *textBottom, unsigned char arrowType, char *streetName);
void paintSpeed(char speed);

private:
  Paint *paint;
  Epd *epd;

};






#endif
