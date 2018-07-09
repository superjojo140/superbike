
#include "arrows.h"

//Arrow Types
//11 is the end symbol
char arrowTypes[][25]={
  {6,10,6,4,4,4,4,6,1,3,4,0,4,2,8,2,8,10,6,10,11}, //TURN_LEFT
{6,10,6,3,3,6,5,8,0,8,0,2,2,4,6,0,8,0,8,10,6,10,11}, //TURN_SHARP_LEFT
{3,10,3,4,2,3,0,5,0,0,5,0,3,2,5,4,5,10,3,10,11}, //TURN_SLIGHT_LEFT
{3,10,3,2,7,2,7,0,10,3,7,6,7,4,5,4,5,10,3,10,11}, //TURN_RIGHT
{2,10,2,0,4,0,8,4,10,2,10,8,5,8,7,6,4,3,4,10,2,10,11}, //TURN_SHARP_RIGHT
{3,10,3,4,5,2,3,0,8,0,8,5,6,3,5,4,5,10,3,10,11}, //TURN_SLIGHT_RIGHT
{4,9,4,4,2,4,5,1,8,4,6,4,6,9,4,9,11}, //STRAIGHT
{2,10,2,3,9,3,9,8,10,8,8,10,6,8,7,8,7,5,4,5,4,10,2,10,11}//UTURN
};

Arrow::Arrow(unsigned char arrowType, Paint *paint, Epd *epd){
  this->arrowType = arrowTypes[arrowType];
  this->paint = paint;
  this->epd = epd;
}

void Arrow::DrawBetterLine(char x0, char y0, char x1, char y1,char color, char thickness, char zoom) {
  sjDrawLine(x0,y0,x1,y1,color,thickness,zoom,this->paint);
}

void Arrow::drawAt(unsigned char x, unsigned char y,char color, char thickness, char zoom){
  unsigned char i=2;
  this->paint->SetRotate(ROTATE_0);
  this->paint->SetWidth(ARROW_WIDTH * zoom);
  this->paint->SetHeight(ARROW_HEIGHT * zoom);
  this->paint->Clear(!color);

  while (this->arrowType[i] < 11){//11 is the symbol for end of data
    this->DrawBetterLine(this->arrowType[i-2],this->arrowType[i-1],this->arrowType[i],this->arrowType[i+1],color,thickness,zoom);
    i+=2;
  }

  this->epd->SetFrameMemory(this->paint->GetImage(), x, y, this->paint->GetWidth(), this->paint->GetHeight());
}
