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

var geocoder;
var markerArray;
var directionsService;
var directionsDisplay;
var stepDisplay;
var map;
var currentPositionMarker;
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