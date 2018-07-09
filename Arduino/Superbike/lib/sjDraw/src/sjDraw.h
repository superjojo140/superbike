#ifndef SJ_DRAW
#define SJ_DRAW

//Simple line to insert numbers binary
//Thanks to https://www.c-plusplus.net/forum/topic/69903/bin%C3%A4rzahlen-eingeben/5
#define Bin(a,b,c,d,e,f,g,h) ((a<<7)|(b<<6)|(c<<5)|(d<<4)|(e<<3)|(f<<2)|(g<<1)|h)
//Thanks to https://stackoverflow.com/questions/523724/c-c-check-if-one-bit-is-set-in-i-e-int-variable
#define CHECK_BIT(var,pos) ((var) & (1<<(pos)))


#include <epdpaint.h>
#include <epd1in54.h>

//Digits like a 7-Segment display would show it
const unsigned char digitData[] = {
  Bin(0,1,1,1,1,1,1,0), //0
  Bin(0,0,1,1,0,0,0,0), //1
  Bin(0,1,1,0,1,1,0,1), //2
  Bin(0,1,1,1,1,0,0,1), //3
  Bin(0,0,1,1,0,0,1,1), //4
  Bin(0,1,0,1,1,0,1,1), //5
  Bin(0,1,0,1,1,1,1,1), //6
  Bin(0,1,1,1,0,0,0,0), //7
  Bin(0,1,1,1,1,1,1,1), //8
  Bin(0,1,1,1,1,0,1,1)  //9
};

void sjDrawLine(char x0, char y0, char x1, char y1,char color, char thickness, char zoom, Paint *paint);
void sjDrawNumber(char x, char y, char number, char color, char thickness, char zoom, Paint *paint, Epd *epd);

#endif
