#include "superbike-gui.h"

void distanceToString(int16_t z, char* Buffer )
{
    unsigned char i = 0;
    unsigned char j;
    char tmp;
    char displayInKilometers = false;
    z = (unsigned int16_t) z;

    //Write "in " at the start of the string
    Buffer[i++]='i';
    Buffer[i++]='n';
    Buffer[i++]=' ';

    if(z >= 1000){
      displayInKilometers = true;
      //To Display kilometers, the last digit is cut of
      z /= 10;
    }

    // die einzelnen Stellen der Zahl berechnen
    do
    {
        Buffer[i++] = '0' + z % 10;
        z /= 10;
    }
    while( z > 0 );

    // den String in sich spiegeln
    for( j = 0; j < (i-3) / 2; ++j )
    {
        tmp = Buffer[j+3];
        Buffer[j+3] = Buffer[i-j-1];
        Buffer[i-j-1] = tmp;
    }
    //Display in meter or kilometer
    if(displayInKilometers){
      //If displayed in kilometer, add a comma before the last two digits
      Buffer[i] = Buffer[i-1];
      Buffer[i-1] = Buffer[i-2];
      Buffer[i-2] = ',';
      i++;
      Buffer[i++] = 'k';
    }
    //kiloMeter and Meter both use a m as last character ;-)
    Buffer[i++] = 'm';
    Buffer[i] = '\0';
}

SuperbikeGui::SuperbikeGui(Paint *paint, Epd *epd){
  this->paint = paint;
  this->epd = epd;
}


void SuperbikeGui::paintStatusBar(char *textLeft , char *textMiddle, char *textRight){
  this->paint->SetWidth(200);
  this->paint->SetHeight(20);
  this->paint->Clear(COLORED);
  this->paint->DrawStringAt(2, 3, textLeft, &Font16, UNCOLORED,MAX_ROW_LENGTH);
  this->paint->DrawStringAt(7*11, 3, textMiddle, &Font16, UNCOLORED,MAX_ROW_LENGTH);
  this->paint->DrawStringAt(13*11, 3, textRight, &Font16, UNCOLORED,MAX_ROW_LENGTH);
  this->epd->SetFrameMemory(this->paint->GetImage(), 0, 0, this->paint->GetWidth(), this->paint->GetHeight());
}

void SuperbikeGui::paintDistanceToNextStep(int16_t distance){
    #define DISTANCE_STRING_LENGTH 11
    char distanceAsString[DISTANCE_STRING_LENGTH];
    distanceToString(distance, distanceAsString);
    //paint
    this->paint->SetWidth(200);
    this->paint->SetHeight(30);
    this->paint->Clear(COLORED);
    this->paint->DrawStringAt(10, 5, distanceAsString, &Font24, UNCOLORED,MAX_ROW_LENGTH);
    this->epd->SetFrameMemory(this->paint->GetImage(), 0, 110, this->paint->GetWidth(), this->paint->GetHeight());

}


void SuperbikeGui::paintNavigationStep(char *text, unsigned char arrowType){
 //For the Top Text (first 11 Characters)
 this->paint->SetWidth(200);
 this->paint->SetHeight(30);
 this->paint->Clear(UNCOLORED);
 this->paint->DrawStringAt(5, 5, text, &Font20, COLORED,MAX_ROW_LENGTH);
 this->epd->SetFrameMemory(this->paint->GetImage(), 0, 140, this->paint->GetWidth(), this->paint->GetHeight());
  //For the Bottom Text (next 11 characters)
  this->paint->SetWidth(200);
  this->paint->SetHeight(30);
  this->paint->Clear(UNCOLORED);
  this->paint->DrawStringAt(5, 5, text+MAX_ROW_LENGTH , &Font20, COLORED,MAX_ROW_LENGTH);
  this->epd->SetFrameMemory(this->paint->GetImage(), 0, 170, this->paint->GetWidth(), this->paint->GetHeight());
  //Draw the arrow - using the super cool arrow lib :-)
  this->paint->SetWidth(60);
  this->paint->SetHeight(60);
  this->paint->Clear(COLORED);
  Arrow arrow(arrowType,this->paint,this->epd);
  arrow.drawAt(15, 45, COLORED, 2, 5);
  }


void SuperbikeGui::paintSpeed(char speed){
  const unsigned char myColor = COLORED;
  const unsigned char myZoom = 30;
  if(speed > 9){
    sjDrawNumber(80, 40, speed / 10, myColor, 5, myZoom, this->paint, this->epd); //Draw tens
  }
  else{
    //Clear the area of the tens
    this->paint->SetWidth(1 * myZoom + 4);
    this->paint->SetHeight(2 * myZoom + 4);
    this->paint->Clear(!myColor);
    this->epd->SetFrameMemory(this->paint->GetImage(), 80, 40, this->paint->GetWidth(), this->paint->GetHeight());
}

  sjDrawNumber(120, 40, speed % 10, COLORED, 5, 30, this->paint, this->epd); //Draw ones
  //kmh Print
  this->paint->SetWidth(30);
  this->paint->SetHeight(20);
  this->paint->Clear(UNCOLORED);
  const char kmh[]= "kmh";
  this->paint->DrawStringAt(0,0, kmh, &Font16, COLORED,MAX_ROW_LENGTH);
  //SetFrameMemory twice
  this->epd->SetFrameMemory(this->paint->GetImage(), 160, 90, this->paint->GetWidth(), this->paint->GetHeight());
}
