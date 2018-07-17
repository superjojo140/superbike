/***
 *       _____ _       _           _  __      __        _       _     _           
 *      / ____| |     | |         | | \ \    / /       (_)     | |   | |          
 *     | |  __| | ___ | |__   __ _| |  \ \  / /_ _ _ __ _  __ _| |__ | | ___  ___ 
 *     | | |_ | |/ _ \| '_ \ / _` | |   \ \/ / _` | '__| |/ _` | '_ \| |/ _ \/ __|
 *     | |__| | | (_) | |_) | (_| | |    \  / (_| | |  | | (_| | |_) | |  __/\__ \
 *      \_____|_|\___/|_.__/ \__,_|_|     \/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
 *                                                                                
 *                                                                                
 */
var myRoute;
/***
 *       _____                _              _       
 *      / ____|              | |            | |      
 *     | |     ___  _ __  ___| |_ __ _ _ __ | |_ ___ 
 *     | |    / _ \| '_ \/ __| __/ _` | '_ \| __/ __|
 *     | |___| (_) | | | \__ \ || (_| | | | | |_\__ \
 *      \_____\___/|_| |_|___/\__\__,_|_| |_|\__|___/
 *                                                   
 *                                                   
 */
var MAX_RANGE_TO_ACCEPT_POSITION = 100; //meter
var MIN_RANGE_TO_ACCEPT_POSITION = 15; //meter
var RANGE_TO_ACCEPT_FACTOR = 20;
var NEXT_TRIGGER_TIME = 10;
var MAX_TRIGGER_TIME = 10000 //10 seconds
$("#maxTriggerInput").val(MAX_TRIGGER_TIME);
$("#triggerFactorInput").val(NEXT_TRIGGER_TIME);
$("#maxRangeInput").val(MAX_RANGE_TO_ACCEPT_POSITION);
$("#minRangeInput").val(MIN_RANGE_TO_ACCEPT_POSITION);
$("#factorRangeInput").val(RANGE_TO_ACCEPT_FACTOR);

function setConstants() {
	MAX_TRIGGER_TIME = $("#maxTriggerInput").val();
	NEXT_TRIGGER_TIME = $("#triggerFactorInput").val();
	MAX_RANGE_TO_ACCEPT_POSITION = $("#maxRangeInput").val();
	MIN_RANGE_TO_ACCEPT_POSITION = $("#minRangeInput").val();
	RANGE_TO_ACCEPT_FACTOR = $("#factorRangeInput").val();
	$("#maxTriggerInput").val(MAX_TRIGGER_TIME);
	$("#triggerFactorInput").val(NEXT_TRIGGER_TIME);
	$("#maxRangeInput").val(MAX_RANGE_TO_ACCEPT_POSITION);
	$("#minRangeInput").val(MIN_RANGE_TO_ACCEPT_POSITION);
	$("#factorRangeInput").val(RANGE_TO_ACCEPT_FACTOR);
}
/***
 *      _____  _     _                          _____      _            _       _   _             
 *     |  __ \(_)   | |                        / ____|    | |          | |     | | (_)            
 *     | |  | |_ ___| |_ __ _ _ __   ___ ___  | |     __ _| | ___ _   _| | __ _| |_ _  ___  _ __  
 *     | |  | | / __| __/ _` | '_ \ / __/ _ \ | |    / _` | |/ __| | | | |/ _` | __| |/ _ \| '_ \ 
 *     | |__| | \__ \ || (_| | | | | (_|  __/ | |___| (_| | | (__| |_| | | (_| | |_| | (_) | | | |
 *     |_____/|_|___/\__\__,_|_| |_|\___\___|  \_____\__,_|_|\___|\__,_|_|\__,_|\__|_|\___/|_| |_|
 *                                                                                                
 *                                                                                                
 */
//Convert angle from Degree to Radial
function Deg2Rad(deg) {
	return deg * Math.PI / 180;
}
/*
 *@param lat1 Latitude Point 1 in Decimal Coordinates
 *@param lng1 Longitude Point 1 in Decimal Coordinates
 *@param lat2 Latitude Point 2 in Decimal Coordinates
 *@param lng2 Longitude Point 2 in Decimal Coordinates
 *@return Distance in meter
 *Thanks to https://www.andrerinas.de/tutorials/javascript-genaue-latlng-geokoordinaten-entfernungen-errechnen.html
 */
function distanceBetweenCoordinates(lat1, lng1, lat2, lng2) {
	lat1 = Deg2Rad(lat1);
	lat2 = Deg2Rad(lat2);
	lng1 = Deg2Rad(lng1);
	lng2 = Deg2Rad(lng2);
	var R = 6371000; // earth's diameter in meter
	var x = (lng2 - lng1) * Math.cos((lat1 + lat2) / 2);
	var y = (lat2 - lat1);
	var d = Math.sqrt(x * x + y * y) * R;
	return d;
}
/***
 *       _____ _               _              _____ _             
 *      / ____| |             | |            / ____| |            
 *     | (___ | |_ ___ _ __   | |__  _   _  | (___ | |_ ___ _ __  
 *      \___ \| __/ _ \ '_ \  | '_ \| | | |  \___ \| __/ _ \ '_ \ 
 *      ____) | ||  __/ |_) | | |_) | |_| |  ____) | ||  __/ |_) |
 *     |_____/ \__\___| .__/  |_.__/ \__, | |_____/ \__\___| .__/ 
 *                    | |             __/ |                | |    
 *                    |_|            |___/                 |_|    
 */
/*
 *@param route Object Google Maps Directions request object
 */
function initRoute(requestObject) {
	myRoute = requestObject.routes[0].legs[0];
	//
	//Proportion of meters and degrees
	myRoute.deltaLatitude = distanceBetweenCoordinates(myRoute.start_location.lat(), myRoute.start_location.lng(), myRoute.end_location.lat(), myRoute.start_location.lng()); //in meter
	myRoute.deltaLongitude = distanceBetweenCoordinates(myRoute.start_location.lat(), myRoute.start_location.lng(), myRoute.start_location.lat(), myRoute.end_location.lng()); //in meter
	myRoute.oneMeterInLatitudeDegrees = Math.abs(myRoute.start_location.lat() - myRoute.end_location.lat()) / myRoute.deltaLatitude;
	myRoute.oneMeterInLongitudeDegrees = Math.abs(myRoute.start_location.lng() - myRoute.end_location.lng()) / myRoute.deltaLongitude;
	//
	//Set first step as startpoint
	myRoute.currentValues = {
		currentStepIndex: 0
	};
	//
	//Route is now initialised
	myRoute.inititalised = true;
	console.log(myRoute);
	//Start Step by step algorithm
	getLocation(handleNewPosition);
}

function handleNewPosition(newPosition) {
	//check wether route is initialised
	if (!myRoute.inititalised) {
		throw "Route not initialised";
	}
	//convert new Position to {lat:lat,lng:lng} format
	//
	newPosition = {
		lat: newPosition.coords.latitude
		, lng: newPosition.coords.longitude
	};
	//
	//save values from last iteration
	var oldValues = myRoute.currentValues;
	//
	//Calculate new Timestamp
	var newTimestamp = new Date().getTime();
	//
	//Calculate new speed
	var newSpeed;
	if (oldValues.position) { //Check wether an old position is set
		newSpeed = distanceBetweenCoordinates(newPosition.lat, newPosition.lng, oldValues.position.lat, oldValues.position.lng) / (newTimestamp - oldValues.timestamp) / 1000; // /1000 to get speed in m/s instead of m/ms
	}
	else {
		//If there is no old position (for example at the first iteration)
		newSpeed = 0;
	}
	//
	//Calculate Range and current step's position
	var currentStep = myRoute.steps[oldValues.currentStepIndex];
	var currentStepPosition = {
		lat: currentStep.end_location.lat()
		, lng: currentStep.end_location.lng()
	};
	//
	var distanceCurrentStep = distanceBetweenCoordinates(currentStep.end_location.lat(), currentStep.end_location.lng(), currentStep.start_location.lat(), currentStep.start_location.lng());
	var nextStep = myRoute.steps[oldValues.currentStepIndex + 1];
	var distanceNextStep = distanceBetweenCoordinates(nextStep.end_location.lat(), nextStep.end_location.lng(), nextStep.start_location.lat(), nextStep.start_location.lng());
	var currentRange = Math.min(distanceCurrentStep, distanceNextStep) / RANGE_TO_ACCEPT_FACTOR;
	//MIN_RANGE and MAX_RANGE
	currentRange = Math.min(currentRange,MAX_RANGE_TO_ACCEPT_POSITION);
	currentRange = Math.max(currentRange,MIN_RANGE_TO_ACCEPT_POSITION);
	//
	//Calculate new Distance to destination
	var newDistanceToDestination = distanceBetweenCoordinates(newPosition.lat, newPosition.lng, currentStepPosition.lat, currentStepPosition.lng);
	//Calculate new step index
	var newStepIndex;
	if (newDistanceToDestination < currentRange) {
		//reached step's end_location
		newStepIndex = oldValues.currentStepIndex + 1;
	}
	else {
		newStepIndex = oldValues.currentStepIndex;
	}
	//
	//Calculate time (in milliseconds) till next handleNewPosition iteration
	//If the distance to destination == 0 the next iteration should be triggered instantly (after 0 milliseconds), else it should be a shorter time if the distanceToDestination is smaller or the speed is higher
	var nextTriggerTime = Math.min(newDistanceToDestination * NEXT_TRIGGER_TIME / Math.max(1, newSpeed), MAX_TRIGGER_TIME); //use max(1,speed) to avoid dividing by zero
	//
	//Set new Values
	var newValues = {
		timestamp: newTimestamp
		, speed: newSpeed
		, position: newPosition
		, currentStepIndex: newStepIndex
		, distanceToDestination: newDistanceToDestination
		, nextTriggerTime: nextTriggerTime
		, currentRange: currentRange
	}
	myRoute.currentValues = newValues;
	//
	//Check wether the final destination is reached
	//If newDistanceToDestination == 0 the stepIndex is always incremented. If the final destination is reached. The current stepIndex is higher than the step's array's index
	if (newStepIndex >= myRoute.steps.length) {
		//Reached the final destination
		finalDestinationReached();
	}
	else {
		//Check wether we are still on the right way
		if (stillOnTheRightWay() == false) {
			//do something good ;-) TODO implement
		}
		//
		//Not yet reached final destination
		//Write new values to screen
		//
		writeRouteValuesToScreen(newValues);
		//
		//trigger next iteration
		setTimeout(function () {
			getLocation(handleNewPosition)
		}, nextTriggerTime);
	}
}
/*
 *@param currentPosition Your current geolocation
 *@param destinationPosition Position of your destination
 *@param {number} range range in meters
 *@return {number} 0 if the current position is within the range of the destination's position, else: distance to destination
 */
function distanceToPosition(currentPosition, destinationPosition, range) {
	//check wether route is initialised
	if (!myRoute.inititalised) {
		throw "Route not initialised";
	}
	var rangeLat = myRoute.oneMeterInLatitudeDegrees * range;
	var rangeLng = myRoute.oneMeterInLongitudeDegrees * range;
	if (currentPosition.lng < destinationPosition.lng + rangeLng && currentPosition.lng > destinationPosition.lng - rangeLng && currentPosition.lat < destinationPosition.lat + rangeLat && currentPosition.lat > destinationPosition.lat - rangeLat) {
		//Current Position is withun range of destination Position
		return 0;
	}
	else return distanceBetweenCoordinates(currentPosition.lat, currentPosition.lng, destinationPosition.lat, destinationPosition.lng);
}

function finalDestinationReached() {
	//TODO implement
	swal("Juchuu!", "Du bist angekommen.", "success");
}

function stillOnTheRightWay() {
	return true;
} //TODO Implement