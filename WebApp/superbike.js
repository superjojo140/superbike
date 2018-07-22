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
var enc = new TextEncoder(); // always utf-8
//Bluetooth API Connection
var bluetoothConnection;
var geocoder;
//Google Maps Globals
var markerArray;
var directionsService;
var directionsDisplay;
var stepDisplay;
var map;
var currentPositionMarker;
var DEBUG_MODE = true;
const START_CHARACTER = String.fromCharCode(2);
const END_CHARACTER = String.fromCharCode(3);
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
   *      ______               _     ____  _           _ _             
   *     |  ____|             | |   |  _ \(_)         | (_)            
   *     | |____   _____ _ __ | |_  | |_) |_ _ __   __| |_ _ __   __ _ 
   *     |  __\ \ / / _ | '_ \| __| |  _ <| | '_ \ / _` | | '_ \ / _` |
   *     | |___\ V |  __| | | | |_  | |_) | | | | | (_| | | | | | (_| |
   *     |______\_/ \___|_| |_|\__| |____/|_|_| |_|\__,_|_|_| |_|\__, |
   *                                                              __/ |
   *                                                             |___/ 
   */
$("document").ready(function () {
    $("#sendTextToBluetoothButton").click(function () {
      var tempMsg = $("#inputBT").val();
      sendToBluetooth(tempMsg);
    });
    $("#connectButton").click(connectToBluetoothDevice);
    $("#showPositionButton").click(function () {
      getLocation(alertPosition)
    });
    $("#usePositionAsStartButton").click(function () {
      getLocation(showCurrentAdress)
    });
    $("#calculateRouteButton").click(function () {
      getLocation(calculateAndDisplayRoute)
    });
    $("#saveNaviSettingsButton").click(setConstants);
    $("#toggleDebugModeButton").click(toggleDebugMode);
  })
  /***
   *       _____                   _        __  __                 
   *      / ____|                 | |      |  \/  |                
   *     | |  __  ___   ___   __ _| | ___  | \  / | __ _ _ __  ___ 
   *     | | |_ |/ _ \ / _ \ / _` | |/ _ \ | |\/| |/ _` | '_ \/ __|
   *     | |__| | (_) | (_) | (_| | |  __/ | |  | | (_| | |_) \__ \
   *      \_____|\___/ \___/ \__, |_|\___| |_|  |_|\__,_| .__/|___/
   *                          __/ |                     | |        
   *                         |___/                      |_|        
   */
function initMap() {
  markerArray = [];
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService;
  // Create a map and center it on Manhattan.
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13
    , center: {
      lat: 40.771
      , lng: -73.974
    }
  });
  // Create a renderer for directions and bind it to the map.
  directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });
  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow;
  // Display the route between the initial start and end selections.
  //Autocomplete inputs
  var autocompleteEnd = new google.maps.places.Autocomplete(endInput);
  //Set geocoder
  geocoder = new google.maps.Geocoder;
  //Set marker for current Position
}

function calculateAndDisplayRoute(startPosition) {
  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }
  // Retrieve the start and end locations and create a DirectionsRequest using
  //Converting the start Position
  startPosition = {
    lat: startPosition.coords.latitude
    , lng: startPosition.coords.longitude
  };
  // BIYCYCLING directions.
  directionsService.route({
    origin: startPosition
    , destination: document.getElementById('endInput').value
    , travelMode: 'BICYCLING'
  }, function (response, status) {
    // Route the directions and pass the response to a function to create
    // markers for each step.
    if (status === 'OK') {
      //document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>';
      directionsDisplay.setDirections(response);
      showSteps(response, markerArray, stepDisplay, map);
    }
    else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
  // For each step, place a marker, and add the text to the marker's infowindow.
  // Also attach the marker to an array so we can keep track of it and remove it
  // when calculating new routes.
  initRoute(directionResult);
  //printDirectionsResult(directionResult);
  var myRoute = directionResult.routes[0].legs[0];
  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
  }
}

function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function () {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}
/***
 *      ____  _            _              _   _       _______                            _         _             
 *     |  _ \| |          | |            | | | |     |__   __|                          (_)       (_)            
 *     | |_) | |_   _  ___| |_ ___   ___ | |_| |__      | |_ __ __ _ _ __  ___ _ __ ___  _ ___ ___ _  ___  _ __  
 *     |  _ <| | | | |/ _ | __/ _ \ / _ \| __| '_ \     | | '__/ _` | '_ \/ __| '_ ` _ \| / __/ __| |/ _ \| '_ \ 
 *     | |_) | | |_| |  __| || (_) | (_) | |_| | | |    | | | | (_| | | | \__ | | | | | | \__ \__ | | (_) | | | |
 *     |____/|_|\__,_|\___|\__\___/ \___/ \__|_| |_|    |_|_|  \__,_|_| |_|___|_| |_| |_|_|___|___|_|\___/|_| |_|
 *                                                                                                               
 *                                                                                                               
 */
function connectToBluetoothDevice() {
  if (!navigator.bluetooth) {
    swal("Gerät nicht unterstützt", "Dein Gerät kann leider keine Bluetooth Verbindung herstellen. Bitte nutze Google Chrome auf einem Android Smartphone", "error");
  }
  else {
    // Step 1: Scan for a device with 0xffe5 service
    navigator.bluetooth.requestDevice({
      filters: [{
        services: [0x1819]
            }]
    }).then(function (device) {
      // Step 2: Connect to it
      return device.gatt.connect();
    }).then(function (server) {
      // Step 3: Get the Service
      document.getElementById("connectButton").innerHTML = "Connected"
      return server.getPrimaryService(0x1819);
    }).then(function (service) {
      // Step 4: get the Characteristic
      return service.getCharacteristic(0x2A68);
    }).then(function (characteristic) {
      bluetoothConnection = characteristic;
      // Step 5: Write to the characteristic			
    }).catch(function (error) {
      // And of course: error handling!
      console.error('Connection to Bluetooth Bike Computer failed!', error);
    });
  }
}
//Returns an array of chunks with specified length
function splitString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function sendToBluetooth(message) {
  if (!bluetoothConnection) {
    swal("Nicht verbunden", "Bitte verbinde dich zuerst mit deinem Bike Computer", "error");
  }
  else {
    //Add start and end character to message
    message = START_CHARACTER + message + END_CHARACTER;
    //Split message in chunks of 20 characters. The AT-09 Bluetooth Modul can only receive 20 caracters at once
    var messageArray = splitString(message, 20);
    sendProcessedMessageToBluetoooth(messageArray);
  }
}
//
function sendProcessedMessageToBluetoooth(messageArray) {
  if (!bluetoothConnection) {
    throw "Keine Bluetooth Verbindung. Bitte verbinde dich zuerst mit deinem Bike Computer";
  }
  //check wether there is content in the messageArray
  if (messageArray.length > 0) {
    var arrayBuff = enc.encode(messageArray[0]);
    var writeToBluetoothPromise = bluetoothConnection.writeValue(arrayBuff);
    writeToBluetoothPromise.catch(function (error) {
      console.error('Error sending message to bluetooth device: ' + message, error);
    });
    writeToBluetoothPromise.then(function () {
      //Remove messageArray's first Element
      messageArray.shift();
      //Call sendProcessedMessageToBluetoooth function again
      sendProcessedMessageToBluetoooth(messageArray);
    });
  }
}
//
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

function toggleDebugMode() {
  DEBUG_MODE = !DEBUG_MODE;
  if (DEBUG_MODE) {
    $(".debug").fadeIn();
    $("#toggleDebugModeButton").removeClass("btn-outline");
    $("#toggleDebugModeButton").addClass("btn-raised");
  }
  else {
    $(".debug").fadeOut();
    $("#toggleDebugModeButton").removeClass("btn-raised");
    $("#toggleDebugModeButton").addClass("btn-outline");
  }
}
/*

   _____ ______ ____  _      ____   _____       _______ _____ ____  _   _ 
  / ____|  ____/ __ \| |    / __ \ / ____|   /\|__   __|_   _/ __ \| \ | |
 | |  __| |__ | |  | | |   | |  | | |       /  \  | |    | || |  | |  \| |
 | | |_ |  __|| |  | | |   | |  | | |      / /\ \ | |    | || |  | | . ` |
 | |__| | |___| |__| | |___| |__| | |____ / ____ \| |   _| || |__| | |\  |
  \_____|______\____/|______\____/ \_____/_/    \_\_|  |_____\____/|_| \_|
                                                                          
                                                                          
*/
function showCurrentAdress(position) {
  var latlng = {
    lat: position.coords.latitude
    , lng: position.coords.longitude
  };
  geocoder.geocode({
    'location': latlng
  }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        swal("Wir haben dich gefunden", results[0].formatted_address, "success");
        //$("#startInput").val(results[0].formatted_address);
      }
      else {
        swal("Wo bist du denn?", 'Wir konnten deinen Standort zwar finden, aber keiner Startadresse zuordnen.', "error");
      }
    }
    else {
      swal('Error', status, "error");
    }
  });
}

function getLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callback, showGeolocationError);
  }
  else {
    swal("Nicht unterstützt", "Dein Browser unterstützt leider keine Positionsbestimmung. Probier es mal mit Google Chrome.", "error");
  }
}

function showGeolocationError(error) {
  switch (error.code) {
  case error.PERMISSION_DENIED:
    swal("Zugriff verboten", "Wir haben leider keine Erlaubnis deine Position auszulesen.", "error");
    break;
  case error.POSITION_UNAVAILABLE:
    swal("Position nicht gefunden", "Wir haben alles versucht, aber wir können dich nicht finden.", "error");
    break;
  case error.TIMEOUT:
    swal("Timeout", "Das hat leider zu lange gedauert.", "error");
    break;
  case error.UNKNOWN_ERROR:
    swal("Error", "Da ist irgendwas schiefgelaufen. Mehr wissen wir leider auch nicht.", "error");
    break;
  }
}

function alertPosition(position) {
  swal("Latitude: " + position.coords.latitude + "        Longitude: " + position.coords.longitude);
  console.log(position);
}