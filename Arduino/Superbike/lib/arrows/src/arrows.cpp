
#include "arrows.h"

Arrow::Arrow(char *arrowType, Paint *paint, Epd *epd){
  this->arrowType = arrowType;
  this->paint = paint;
  this->epd = epd;
}

void Arrow::DrawBetterLine(char x0, char y0, char x1, char y1,char color, char thickness, char zoom) {
  x0 = x0 * zoom;
  x1 = x1 * zoom;
  y0 = y0 *zoom;
  y1 = y1 * zoom;
  char i=0;
  if(x0 == x1){
    //vertical line
    if(y0 < y1){
      for(i=0;i<thickness;i++){
        paint->DrawVerticalLine(x0+i,y0,y1-y0,color);
      }
    }
    else{
      for(i=0;i<thickness;i++){
        paint->DrawVerticalLine(x1+i,y1,y0-y1,color);
      }
    }
  }
  else if(y0 == y1){
    //HORIZONTAL Line
    if(x0 < x1){
      for(i=0;i<thickness;i++){
        paint->DrawHorizontalLine(x0,y0+i,x1-x0+thickness,color);
      }
    }
    else{
      for(i=0;i<thickness;i++){
        paint->DrawHorizontalLine(x1,y1+i,x0-x1+thickness,color);
      }
    }
  }
  else{
    //diagonal Line
    for(i=0;i<thickness;i++){
      paint->DrawLine(x0+i,y0,x1+i,y1,color);
    }
  }
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
