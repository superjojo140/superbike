/**
 *  @filename   :   epd1in54-demo.ino
 *  @brief      :   1.54inch e-paper display demo
 *  @author     :   Yehui from Waveshare
 *
 *  Copyright (C) Waveshare     September 5 2017
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documnetation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to  whom the Software is
 * furished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS OR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include <arduino.h>
#include <superbike-gui.h>

#define COLORED     0
#define UNCOLORED   1

#define ZOOM_FACTOR 5
#define THICKNESS 2

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

#define TURN_LEFT 0
#define TURN_SHARP_LEFT 1
#define TURN_SLIGHT_LEFT 2
#define TURN_RIGHT 3
#define TURN_SHARP_RIGHT 4
#define TURN_SLIGHT_RIGHT 5
#define STRAIGHT 6
#define UTURN 7

/**
  * Due to RAM not enough in Arduino UNO, a frame buffer is not allowed.
  * In this case, a smaller image buffer is allocated and you have to
  * update a partial display several times.
  * 1 byte = 8 pixels, therefore you have to set 8*N pixels at a time.
  */
unsigned char image[1024]; //NEVER USE A PAINT; BIGGER THAN 800 PIXELS :-(
Paint paint(image, 0, 0);    // width should be the multiple of 8
Epd epd;

void setup() {
  // put your setup code here, to run once:
  if (epd.Init(lut_full_update) != 0) {
      Serial.print("e-Paper init failed");
      return;
  }

  /**
   *  there are 2 memory areas embedded in the e-paper display
   *  and once the display is refreshed, the memory area will be auto-toggled,
   *  i.e. the next action of SetFrameMemory will set the other memory area
   *  therefore you have to clear the frame memory twice.
   */
  epd.ClearFrameMemory(0xFF);   // bit set = white, bit reset = black
  epd.DisplayFrame();
  epd.ClearFrameMemory(0xFF);   // bit set = white, bit reset = black
  epd.DisplayFrame();
  paint.SetRotate(ROTATE_0);


  /* For simplicity, the arguments are explicit numerical coordinates */


  //Arrow myTestArrow(arrowTypes[TURN_RIGHT],&paint,&epd);
  //myTestArrow.drawAt(5,0,UNCOLORED,THICKNESS,ZOOM_FACTOR);

  SuperbikeGui gui(&paint,&epd);
  gui.paintStatusBar("86%","","12:03");
  gui.paintNavigationStep("Rechts","in 100m",arrowTypes[TURN_RIGHT],"  auf Mittelstr.");




  //paint.DrawStringAt(10, 5, "Rechts", &Font24, UNCOLORED);
  //paint.DrawStringAt(10, 35, "in 100 m", &Font24, UNCOLORED);
  //epd.SetFrameMemory(paint.GetImage(), 0, 0, paint.GetWidth(), paint.GetHeight());






  epd.DisplayFrame();



  /*if (epd.Init(lut_partial_update) != 0) {
      Serial.print("e-Paper init failed");
      return;
  }*/


}

void loop() {
}
