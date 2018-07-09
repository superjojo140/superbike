//By superjojo140


#ifndef ARROWS_H
#define ARROWS_H

#include <sjDraw.h>

#define ARROW_WIDTH 11
#define ARROW_HEIGHT 11



#define TURN_LEFT 0
#define TURN_SHARP_LEFT 1
#define TURN_SLIGHT_LEFT 2
#define TURN_RIGHT 3
#define TURN_SHARP_RIGHT 4
#define TURN_SLIGHT_RIGHT 5
#define STRAIGHT 6
#define UTURN 7


class Arrow{
public:
  Arrow(unsigned char arrowType, Paint *paint, Epd *epd);
  void DrawBetterLine(char x0, char y0, char x1, char y1,char color, char thickness, char zoom);
  void drawAt(unsigned char x, unsigned char y,char color, char thickness, char zoom);

private:
    char *arrowType;
    Paint *paint;
    Epd *epd;
};




#endif
