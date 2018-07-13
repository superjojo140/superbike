# Conversion between Coordinates and Meters

### Problem
While the distance between one circle of latitude is nearly the same all over the world, the distance between one circle of longitude is very dependent of the latitude on this place.
You can read more on https://www.kompf.de/gps/distcalc.html

### Solution
To solve this we use a special function to calculate distance between two coordinates:
`distanceBetweenCoordinates(lat1,long1,lat2,lng2)` in `navigation.js`
This function is inspired by https://www.andrerinas.de/tutorials/javascript-genaue-latlon-geokoordinaten-entfernungen-errechnen.html

### Proportion of meters and degrees

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

