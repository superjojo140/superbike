#include <arduino.h>
#include <SoftwareSerial.h>

SoftwareSerial BTSerial(2, 3); // RX | TX


#include <superbike-gui.h>

#define COLORED     0
#define UNCOLORED   1

#define ZOOM_FACTOR 5
#define THICKNESS 2



/**
  * Due to RAM not enough in Arduino UNO, a frame buffer is not allowed.
  * In this case, a smaller image buffer is allocated and you have to
  * update a partial display several times.
  * 1 byte = 8 pixels, therefore you have to set 8*N pixels at a time.
  * With a 1000 Byte frame buffer you can set 8000 pixels
  * This means a maximum paint size of ca. 90 x 90 pixels (for a square) or 200 x 40 pixels
  */
unsigned char image[1024];
Paint paint(image, 0, 0);    // width should be the multiple of 8
Epd epd;
SuperbikeGui gui(&paint,&epd);

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
   epd.ClearFrameMemory(0xFF);
   epd.DisplayFrame();
   epd.ClearFrameMemory(0xFF);
   epd.DisplayFrame();
  paint.SetRotate(ROTATE_0);



  /* For simplicity, the arguments are explicit numerical coordinates */


  //Arrow myTestArrow(arrowTypes[TURN_RIGHT],&paint,&epd);
  //myTestArrow.drawAt(5,0,UNCOLORED,THICKNESS,ZOOM_FACTOR);


  gui.paintStatusBar("86%","","12:03");
  gui.paintNavigationStep("Rechts","in 100m",TURN_RIGHT,"  auf Mittelstr.");
  gui.paintSpeed(23);
  epd.DisplayFrame();
 //Once Again because of the two memory areas
  gui.paintStatusBar("86%","","12:03");
  gui.paintNavigationStep("Rechts","in 100m",TURN_RIGHT,"  auf Mittelstr.");
  gui.paintSpeed(23);
  epd.DisplayFrame();

  //Start partial update mode
  if (epd.Init(lut_partial_update) != 0) {
        Serial.print("e-Paper init failed");
        return;
    }


  //Bluetooth setup

  Serial.begin(9600);
  BTSerial.begin(9600);


}

void loop() {

  if (Serial.available()){
    char rec = Serial.read();
    gui.paintSpeed(rec);
    epd.DisplayFrame();
    Serial.write(rec);
  }


  // Keep reading from HC-05 and send to Arduino Serial Monitor
  /*if (BTSerial.available())
    Serial.write(BTSerial.read());

  // Keep reading from Arduino Serial Monitor and send to HC-05
  if (Serial.available())
    BTSerial.write(Serial.read());*/
}
