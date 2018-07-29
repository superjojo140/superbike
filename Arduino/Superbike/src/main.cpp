#include <arduino.h>
#include <SoftwareSerial.h>

SoftwareSerial BTSerial(2, 3); // RX | TX


#include <superbike-gui.h>

#define COLORED     0
#define UNCOLORED   1

#define ZOOM_FACTOR 5
#define THICKNESS 2

#define START_CHARACTER 2
#define END_CHARACTER 3
#define MANEUVER 'M'
#define DISTANCE_TO_NEXT_STEP 'N'
#define DISTANCE_TO_DESTINATION 'D'
#define TIME 'T'
#define SPEED 'S'

#define SERIAL_CONNECTION BTSerial
#define BUSY_WAIT while(!SERIAL_CONNECTION.available()){}



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
  gui.paintWelcomeScreen();
  epd.DisplayFrame();
 //Once Again because of the two memory areas
 gui.paintStatusBar("86%","","12:03");
 gui.paintWelcomeScreen();
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

  if (SERIAL_CONNECTION.available()){
    char readChar = SERIAL_CONNECTION.read();
    //Read until a new START_CHARACTER is recognized
    if (readChar == START_CHARACTER){
      BUSY_WAIT
      readChar = SERIAL_CONNECTION.read();
      switch(readChar){
        case MANEUVER:{
          BUSY_WAIT
          unsigned char currentManeuverId = SERIAL_CONNECTION.read();
          char message[2*MAX_ROW_LENGTH];
          unsigned char counter = 0;
          BUSY_WAIT
          readChar = SERIAL_CONNECTION.read();
          while(readChar != END_CHARACTER && counter < 2*MAX_ROW_LENGTH){
            message[counter] = readChar;
            counter++;
            BUSY_WAIT
            readChar = SERIAL_CONNECTION.read();
          }
          gui.paintNavigationStep(message, currentManeuverId);
          epd.DisplayFrame();
          gui.paintNavigationStep(message, currentManeuverId);
          epd.DisplayFrame();
        }
        break;

        case DISTANCE_TO_NEXT_STEP:
        {
          BUSY_WAIT
          //distance is send as 16 Bit int
          int16_t newDistance;
          newDistance = SERIAL_CONNECTION.read();
          newDistance = newDistance << 8;
          BUSY_WAIT
          newDistance += SERIAL_CONNECTION.read();
          gui.paintDistanceToNextStep(newDistance);
          epd.DisplayFrame();
          gui.paintDistanceToNextStep(newDistance);
          epd.DisplayFrame();
        }
        break;

        case DISTANCE_TO_DESTINATION:
        break;

        case TIME:
        break;

        case SPEED:
          BUSY_WAIT
          readChar = SERIAL_CONNECTION.read();
          gui.paintSpeed(readChar);
          epd.DisplayFrame();
          gui.paintSpeed(readChar);
          epd.DisplayFrame();
        break;
      }
    }
    else{
      SERIAL_CONNECTION.write("\r\nunknown: ");
      SERIAL_CONNECTION.write(readChar);
    }
  }


  // Keep reading from HC-05 and send to Arduino Serial Monitor
  /*if (BTSerial.available())
    Serial.write(BTSerial.read());

  // Keep reading from Arduino Serial Monitor and send to HC-05
  if (Serial.available())
    BTSerial.write(Serial.read());*/
}
