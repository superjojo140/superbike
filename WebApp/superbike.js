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
var DEBUG_MODE = true;
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
  $('body').bootstrapMaterialDesign();
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
  $("#stopNavigationButton").click(stopNavigation);
  $("#sendExampleMessageButton").click(sendExampleMessage);
});


 
function toggleDebugMode() {
  DEBUG_MODE = !DEBUG_MODE;
  if (DEBUG_MODE) {
    $(".debug").fadeIn();
    $("#toggleDebugModeButton").removeClass("btn-outline");
    $("#toggleDebugModeButton").addClass("btn-raised");
  } else {
    $(".debug").fadeOut();
    $("#toggleDebugModeButton").removeClass("btn-raised");
    $("#toggleDebugModeButton").addClass("btn-outline");
  }
}

