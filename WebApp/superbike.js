var enc = new TextEncoder(); // always utf-8
var bluetoothConnection;

function initMap() {
    var markerArray = [];
    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;
    // Create a map and center it on Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13
        , center: {
            lat: 40.771
            , lng: -73.974
        }
    });
    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });
    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow;
    // Display the route between the initial start and end selections.
    //calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
    // Listen to change events from the start and end lists.
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
    };
    document.getElementById("calculateRouteButton").onclick = onChangeHandler;
    //Autocomplete inputs
    var autocompleteStart = new google.maps.places.Autocomplete(startInput);
    var autocompleteEnd = new google.maps.places.Autocomplete(endInput);
}

function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
        origin: document.getElementById('startInput').value
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
    console.log(directionResult);
    printDirectionsResult(directionResult);
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

function connectToBluetoothDevice() {
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
        document.getElementById("connectButton").innerHTML="Connected"
        return server.getPrimaryService(0x1819);
    }).then(function (service) {
        // Step 4: get the Characteristic
        return service.getCharacteristic(0x2A68);
    }).then(function (characteristic) {
        // Step 5: Write to the characteristic
        bluetoothConnection = characteristic;
        var data = enc.encode("Hallo");
        return characteristic.writeValue(data);
    }).catch(function (error) {
        // And of course: error handling!
        console.error('Connection failed!', error);
    });
}

function sendToBluetooth() {
    var arrayBuff = document.getElementById("inputBT").value;
    arrayBuff = enc.encode(arrayBuff);
    bluetoothConnection.writeValue(arrayBuff).catch(function (error) {
        // And of course: error handling!
        console.error('Connection failed!', error);
    });
}

function printDirectionsResult(dr){
    var ar = dr.routes[0].legs[0].steps;
    for (var i in ar){
        console.log(ar[i].instructions);
        console.log(ar[i].maneuver);
    }
}