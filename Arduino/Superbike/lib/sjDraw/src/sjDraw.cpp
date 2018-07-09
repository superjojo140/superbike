#include "sjDraw.h"

void sjDrawLine(char x0, char y0, char x1, char y1,char color, char thickness, char zoom, Paint *paint) {
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

void sjDrawNumber(char x, char y, unsigned char number, char color, char thickness, char zoom, Paint *paint, Epd *epd){

  //Set paint dimensions
  paint->SetRotate(ROTATE_0);
  paint->SetWidth(1 * zoom + 4);
  paint->SetHeight(2 * zoom + 4);
  paint->Clear(!color);

  unsigned char n = digitData[number];

  if(CHECK_BIT(n,0)){
    //Segment g
    sjDrawLine(0, 1, 1, 1, color, thickness, zoom, paint);
  }
  if(CHECK_BIT(n,1)){
    //Segment f
    sjDrawLine(0 , 0, 0, 1, color, thickness, zoom, paint);
  }
  if(CHECK_BIT(n,2)){
    //Segment e
    sjDrawLine(0, 1, 0, 2, color, thickness, zoom, paint);
  }
  if(CHECK_BIT(n,3)){
    //Segment d
    sjDrawLine(0, 2, 1, 2, color, thickness, zoom, paint);
  }
  if(CHECK_BIT(n,4)){
    //Segment c
    sjDrawLine(1, 1, 1, 2, color, thickness, zoom, paint);
  }
  if(CHECK_BIT(n,5)){
    //Segment b
    sjDrawLine(1, 0, 1, 1, color, thickness, zoom, paint);
  }
  if(CHECK_BIT(n,6)){
    //Segment a
    sjDrawLine(0, 0, 1, 0, color, thickness, zoom, paint);
  }

  epd->SetFrameMemory(paint->GetImage(), x, y, paint->GetWidth(), paint->GetHeight());

}
