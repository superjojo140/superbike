
#include "arrows.h"

Arrow::Arrow(char *arrowType, Paint *paint, Epd *epd){
  this->arrowType = arrowType;
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
