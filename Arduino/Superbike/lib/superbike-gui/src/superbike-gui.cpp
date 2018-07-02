#include "superbike-gui.h"

SuperbikeGui::SuperbikeGui(Paint *paint, Epd *epd){
  this->paint = paint;
  this->epd = epd;
}


void SuperbikeGui::paintStatusBar(char *textLeft , char *textMiddle, char *textRight){
  this->paint->Clear(COLORED);
  this->paint->SetWidth(200);
  this->paint->SetHeight(20);
  this->paint->DrawStringAt(2, 3, textLeft, &Font16, UNCOLORED);
  this->paint->DrawStringAt(7*11, 3, textMiddle, &Font16, UNCOLORED);
  this->paint->DrawStringAt(13*11, 3, textRight, &Font16, UNCOLORED);
  this->epd->SetFrameMemory(this->paint->GetImage(), 0, 0, this->paint->GetWidth(), this->paint->GetHeight());
}


void SuperbikeGui::paintNavigationStep(char *textTop, char *textBottom, char *arrowType, char *streetName){
 //For the Top Text - This is splittet because of size of the paints image buffer :-(
  this->paint->SetWidth(200);
  this->paint->SetHeight(30);
  this->paint->Clear(COLORED);
  this->paint->DrawStringAt(10, 5, textTop, &Font24, UNCOLORED);
  this->epd->SetFrameMemory(this->paint->GetImage(), 0, 120, this->paint->GetWidth(), this->paint->GetHeight());
  //For the Bottom Text
  this->paint->Clear(COLORED);
  this->paint->DrawStringAt(10, 5, textBottom, &Font24, UNCOLORED);
  this->epd->SetFrameMemory(this->paint->GetImage(), 0, 150, this->paint->GetWidth(), this->paint->GetHeight());
  //Draw the arrow - using the super cool arrow lib :-)
  this->paint->SetWidth(60);
  this->paint->SetHeight(60);
  this->paint->Clear(COLORED);
  Arrow arrow(arrowType,this->paint,this->epd);
  arrow.drawAt(142, 122, UNCOLORED, 2, 5);
  //Draw the street streetNamethis->paint->Clear(COLORED);
  this->paint->SetWidth(200);
  this->paint->SetHeight(20);
  this->paint->Clear(UNCOLORED);
  this->paint->DrawStringAt(3,3, streetName, &Font16, COLORED);
  this->epd->SetFrameMemory(this->paint->GetImage(), 0, 180, this->paint->GetWidth(), this->paint->GetHeight());


}


void SuperbikeGui::paintSpeed(char speed){}
