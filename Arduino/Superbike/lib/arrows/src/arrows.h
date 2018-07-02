//By superjojo140


#ifndef ARROWS_H
#define ARROWS_H

#include <epdpaint.h>
#include <epd1in54.h>

#define ARROW_WIDTH 11
#define ARROW_HEIGHT 11



class Arrow{
public:
  Arrow(char *arrowType, Paint *paint, Epd *epd);
  void DrawBetterLine(char x0, char y0, char x1, char y1,char color, char thickness, char zoom);
  void drawAt(unsigned char x, unsigned char y,char color, char thickness, char zoom);

private:
    char *arrowType;
    Paint *paint;
    Epd *epd;
};




#endif
