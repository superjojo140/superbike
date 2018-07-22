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