//Convert angle from Degree to Radial
function Deg2Rad( deg ) {
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
function distanceBetweenCoordinates( lat1, lng1, lat2, lng2 ) {
	lat1 = Deg2Rad(lat1);
	lat2 = Deg2Rad(lat2);
	lng1 = Deg2Rad(lng1);
	lng2 = Deg2Rad(lng2);
	var R = 6371000; // meter
	var x = (lng2-lng1) * Math.cos((lat1+lat2)/2);
	var y = (lat2-lat1);
	var d = Math.sqrt(x*x + y*y) * R;
	return d;
}
