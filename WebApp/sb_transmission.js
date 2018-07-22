/***
 *       _____ _       _           _  __      __        _       _     _          
 *      / ____| |     | |         | | \ \    / /       (_)     | |   | |         
 *     | |  __| | ___ | |__   __ _| |  \ \  / __ _ _ __ _  __ _| |__ | | ___ ___ 
 *     | | |_ | |/ _ \| '_ \ / _` | |   \ \/ / _` | '__| |/ _` | '_ \| |/ _ / __|
 *     | |__| | | (_) | |_) | (_| | |    \  | (_| | |  | | (_| | |_) | |  __\__ \
 *      \_____|_|\___/|_.__/ \__,_|_|     \/ \__,_|_|  |_|\__,_|_.__/|_|\___|___/
 *                                                                               
 *                                                                               
 */
const MANEUVER_IDS = {
  "turn-left": 0
  , "turn-sharp-left": 1
  , "turn-slight-left": 2
  , "turn-right": 3
  , "turn-sharp-right": 4
  , "turn-slight-right": 5
  , "straight": 6
  , "uturn": 7
}
/***
 *      _____                                _____                            _____        __      
 *     |  __ \                              / ____|                          |_   _|      / _|     
 *     | |__) | __ ___   ___ ___  ___ ___  | (___   ___ _ __ ___  ___ _ __     | |  _ __ | |_ ___  
 *     |  ___/ '__/ _ \ / __/ _ \/ __/ __|  \___ \ / __| '__/ _ \/ _ \ '_ \    | | | '_ \|  _/ _ \ 
 *     | |   | | | (_) | (_|  __/\__ \__ \  ____) | (__| | |  __/  __/ | | |  _| |_| | | | || (_) |
 *     |_|   |_|  \___/ \___\___||___/___/ |_____/ \___|_|  \___|\___|_| |_| |_____|_| |_|_| \___/ 
 *                                                                                                 
 *                                                                                                 
 */
function sendExampleMessage() {
  myRoute.steps = [{
    maneuver: "straight"
    , instructions: "Jetzt geht die Reise erst los"
  }, {
    maneuver: "turn-right"
    , instructions: "Links abbiegen auf die Straße mit dem ganz ganz langen Namen"
  }];
  writeRouteValuesToScreen({
    currentRange: 15
    , currentStepIndex: 0
    , distanceToDestination: 40.54534142170716
    , nextTriggerTime: 2000
    , position: {
      lat: 51.4918116
      , lng: 9.0743193
    }
    , speed: 15
    , stepReached: false
    , timestamp: 1532254016336
  })
}

function printDirectionsResult(dr) {
  var ar = dr.routes[0].legs[0].steps;
  for (var i in ar) {
    console.log(ar[i].instructions);
    console.log(ar[i].maneuver);
    console.log("Lat: " + ar[i].start_location.lat());
    console.log("Lng: " + ar[i].start_location.lng());
    console.log("Lat: " + ar[i].start_point.lat());
    console.log("Lng: " + ar[i].start_point.lng());
  }
}

function getManeuverIdByName(name) {
  return MANEUVER_IDS[name];
}

function writeRouteValuesToScreen(values) {
  if (DEBUG_MODE) {
    console.log(values);
    var box = $("#infoBox");
    var message = "<table class='table table-striped'>";
    message += "<tr><td>Speed</td><td>" + Math.round(values.speed * 3.6) + " km/h</td></tr>";
    message += "<tr><td>Distance</td><td>" + Math.round(values.distanceToDestination) + " m</td></tr>";
    message += "<tr><td>Range</td><td>" + Math.round(values.currentRange) + "  m</td></tr>";
    if (myRoute.steps[values.currentStepIndex + 1] >= myRoute.steps.length) {
      message += "<tr><td>Text</td><td>Und dann bist du da!</td></tr>";
      message += "<tr><td>Maneuver</td><td>destination</td></tr>";
    }
    else {
      message += "<tr><td>Text</td><td>" + myRoute.steps[values.currentStepIndex + 1].instructions + "</td></tr>";
      message += "<tr><td>Maneuver</td><td>" + myRoute.steps[values.currentStepIndex + 1].maneuver + "</td></tr>";
    }
    message += "<tr><td>Next trigger in   </td><td>" + Math.round(values.nextTriggerTime / 1000) + " s</td></tr>";
    message += "</table>";
    box.html(message);
  }
  //Send data via Bluetooth
  var stepInstructions = myRoute.steps[values.currentStepIndex + 1].instructions;
  //Strip html tags
  stepInstructions = stepInstructions.replace(/<\/?[^>]+(>|$)/g, "");
  //generate Message for transmission
  //STX M M-ID STEP MESSAGE ETX
  //STX and ETX are added by sendToBluetooth function
  var msgToSend = "M" + getManeuverIdByName(myRoute.steps[values.currentStepIndex + 1].maneuver) + stepInstructions;
  sendToBluetooth(msgToSend);
  //
  //Distance to next step
  msgToSend = "N" + Math.round(values.distanceToDestination);
  sendToBluetooth(msgToSend);
}