# Conversion between Coordinates and Meters

### Problem
The HTML5 geolocation API and also Google Maps API provide positions in decimal coordinates. We want to show user instructions in meters (or kilometers). So we have to convert theese values.
While the distance between one circle of latitude is nearly the same all over the world, the distance between one circle of longitude is very dependent of the latitude on this place.
You can read more on https://www.kompf.de/gps/distcalc.html

### Solution
To solve this we use a special function to calculate distance between two coordinates:
```javascript
function distanceBetweenCoordinates( lat1, lng1, lat2, lng2 ) {
	lat1 = Deg2Rad(lat1);
	lat2 = Deg2Rad(lat2);
	lng1 = Deg2Rad(lng1);
	lng2 = Deg2Rad(lng2);
	var R = 6371000; // earth's diameter in meter
	var x = (lng2-lng1) * Math.cos((lat1+lat2)/2);
	var y = (lat2-lat1);
	var d = Math.sqrt(x*x + y*y) * R;
	return d;
}
```
This function takes the start and endpoint's coordinates in decimal degrees and returns the distance between theese points in meters. `Deg2Rad(x)` simply converts a value in degrees into a value in radians.
This function is inspired by https://www.andrerinas.de/tutorials/javascript-genaue-latlon-geokoordinaten-entfernungen-errechnen.html

### The other way around

When defining distances in our step by step algorithm we want to define them in meters (not in degrees).

So, it seems handy to roughly know the proportion of one meter to degrees in latitude and longitude.  



When a new route is set the following variables are calculated:
```javascript
deltaLatitude = distanceBetweenCoordinates(lat1,lng1,lat2,lng1); //in meter
deltaLongitude = distanceBetweenCoordinates(lat1,lng1,lat1,lng2); //in meter
oneMeterInLatitudeDegrees = Math.abs(lat1 - lat2)/deltaLatitude;
oneMeterInLongtudeDegrees = Math.abs(lng1 - lng2)/deltaLongitude;
```
We use the start point's coordinates (`lat1`,`lng1`) and the end point's coordinates (`lat2`,`lng2`) for calculating proportion of meters and degrees.

Now we can easily define a function for converting distance in meter to distance in degrees:
```javascript
distanceMeterToDegrees(distance,orientation){
	if(orientation == LATITUDE){
	return distance * oneMeterInLatitudeDegrees;
	}
	else{
	return distance * oneMeterInLongitudeDegrees;
	}
}
```

