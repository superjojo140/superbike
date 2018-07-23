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
var bluetoothQueue = [];
var bluetoothQueueBusy = false;
var enc = new TextEncoder(); // always utf-8
//Bluetooth API Connection
var bluetoothConnection;
const START_CHARACTER = String.fromCharCode(2);
const END_CHARACTER = String.fromCharCode(3);
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
	} else {
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
	//replace Umlauts
	message = message.replace(/ä/g, 'ae');
	message = message.replace(/Ä/g, 'Ae');
	message = message.replace(/ö/g, 'oe');
	message = message.replace(/Ö/g, 'Oe');
	message = message.replace(/ü/g, 'ue');
	message = message.replace(/Ü/g, 'Ue');
	message = message.replace(/ß/g, 'ss');

	if (!bluetoothConnection) {
		if (DEBUG_MODE) {
			console.log("%c Keine Bluetooth Verbindung. Folgende Nachricht wäre gesendet worden: " + message, "color:white; background-color:#0d719d");
			//swal("Nicht verbunden", "Bitte verbinde dich zuerst mit deinem Bike Computer", "error");
		}
	} else {

		//Add start and end character to message
		message = START_CHARACTER + message + END_CHARACTER;
		//Split message in chunks of 20 characters. The AT-09 Bluetooth Modul can only receive 20 caracters at once
		var messageArray = splitString(message, 20);
		//Append the messageChunks to bluetoothQueue
		bluetoothQueue = bluetoothQueue.concat(messageArray);
		if (!bluetoothQueueBusy) {
			triggerBluetoothQueue();
		}
	}
}
//
//Start sending next chunk of bluetoothQueue
//WARNING: Call this function only if bluetoothQueueBusy == false !!!
function triggerBluetoothQueue() {
	if (!bluetoothConnection) {
		swal("Keine Bluetooth Verbindung", "Bitte verbinde dich zuerst mit deinem Bike Computer", "error");
	}
	//check wether there is content in the bluetoothQueue
	if (bluetoothQueue.length > 0) {
		//block bluetooth queue
		bluetoothQueueBusy = true;
		if (DEBUG_MODE) {
			console.log("sending: " + bluetoothQueue[0]);
			console.log(bluetoothQueue.toString());
		}
		var arrayBuff = enc.encode(bluetoothQueue[0]);
		//Remove bluetoothQueue's first Element
		bluetoothQueue.shift();
		if (DEBUG_MODE) {
			console.log("Shifting...");
			console.log(bluetoothQueue.toString());
		}
		var writeToBluetoothPromise = bluetoothConnection.writeValue(arrayBuff);
		writeToBluetoothPromise.catch(function (error) {
			console.error('Error sending message to bluetooth device: ' + message, error);
		});
		writeToBluetoothPromise.then(function () {
			//Call triggerBluetoothQueue function again
			triggerBluetoothQueue();
		});
	} else {
		//free bluetoothQueue
		bluetoothQueueBusy = false;
	}
}
