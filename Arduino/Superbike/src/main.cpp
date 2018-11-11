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
#define NAVIGATION 'A'

#define HOURS 0
#define MINUTES 1

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
char currentDisplayMode = TIME;

//Variables for saving data to display
//NAVIGATION
unsigned char currentManeuverId = SERIAL_CONNECTION.read();
char currentManeuverMessage[2*MAX_ROW_LENGTH];
//distance is send as 16 Bit int
int16_t currentDistanceToNextStep;
//SPEED
char currentSpeed;
//TIME
char currentTime[2];

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



  gui.paintWelcomeScreen();
  epd.DisplayFrame();
 //Once Again because of the two memory areas
 gui.paintWelcomeScreen();
 epd.DisplayFrame();

  //Start partial update mode
  /*if (epd.Init(lut_partial_update) != 0) {
        Serial.print("e-Paper init failed");
        return;
    */


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
          currentManeuverId = SERIAL_CONNECTION.read();
          unsigned char counter = 0;
          //TODO currentManeuverMessage leeren
          BUSY_WAIT
          readChar = SERIAL_CONNECTION.read();
          while(readChar != END_CHARACTER && counter < 2*MAX_ROW_LENGTH){
            currentManeuverMessage[counter] = readChar;
            counter++;
            BUSY_WAIT
            readChar = SERIAL_CONNECTION.read();
          }
          if(currentDisplayMode == NAVIGATION){
            gui.paintNavigationStep(currentManeuverMessage, currentManeuverId);
            epd.DisplayFrame();
            gui.paintNavigationStep(currentManeuverMessage, currentManeuverId);
            epd.DisplayFrame();
          }

        }
        break;

        case DISTANCE_TO_NEXT_STEP:
        {
          BUSY_WAIT
          currentDistanceToNextStep = SERIAL_CONNECTION.read();
          currentDistanceToNextStep = currentDistanceToNextStep << 8;
          BUSY_WAIT
          currentDistanceToNextStep += SERIAL_CONNECTION.read();
          if(currentDisplayMode == NAVIGATION){
            gui.paintDistanceToNextStep(currentDistanceToNextStep);
            epd.DisplayFrame();
            gui.paintDistanceToNextStep(currentDistanceToNextStep);
            epd.DisplayFrame();
          }
        }
        break;

        case DISTANCE_TO_DESTINATION:
        break;

        case TIME:
        BUSY_WAIT
        currentTime[HOURS] = SERIAL_CONNECTION.read();
        BUSY_WAIT
        currentTime[MINUTES] = SERIAL_CONNECTION.read();
        if(currentDisplayMode == TIME){
          gui.paintTime(currentTime);
          epd.DisplayFrame();
          gui.paintTime(currentTime);
          epd.DisplayFrame();
        }
        break;

        case SPEED:
          BUSY_WAIT
          currentSpeed = SERIAL_CONNECTION.read();
          if(currentDisplayMode == SPEED){
            gui.paintSpeed(currentSpeed);
            epd.DisplayFrame();
            gui.paintSpeed(currentSpeed);
            epd.DisplayFrame();
          }
        break;
      }
    }
    else{
      SERIAL_CONNECTION.write("\r\nunknown: ");
      SERIAL_CONNECTION.write(readChar);
    }
  }

  //Displaying data
  //NAVIGATION




  // Keep reading from HC-05 and send to Arduino Serial Monitor
  /*if (BTSerial.available())
    Serial.write(BTSerial.read());

  // Keep reading from Arduino Serial Monitor and send to HC-05
  if (Serial.available())
    BTSerial.write(Serial.read());*/
}
