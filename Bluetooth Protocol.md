# Data transmisson from navigation app to bike computer

- Step Description
  - `STX` `M` `M-ID` `STEP MESSAGE` `ETX`
  - where `M` stands for maneuver, `M-ID` gives the id of the maneuver and the assigned arrow and `STEP MESSAGE` gives the info text for this step
  - Use ```sendStepDescription(MID,stepMessage)``` to send a step Description
  
ID|maneuver
--- | --- 
0|TURN_LEFT
1|TURN_SHARP_LEFT
2|TURN_SLIGHT_LEFT
3|TURN_RIGHT
4|TURN_SHARP_RIGHT
5|TURN_SLIGHT_RIGHT
6|STRAIGHT
7|UTURN

- Time to destination
  - `STX` `D` `HH` `MM` `ETX`
  - where `D` stands for time to **d**estination, `HH` gives the hours and `MM` gives the minutes
  - Once transmitted a time, the bike computer counts down the time independently until power down
  - you should regularly update the time to destination by sending a new time to destination command based on your navigation calculation
   - Use ```sendTimeToDestination(seconds)``` to send new time to destination from WebApp. `seconds` are the seconds to destination (Google maps API provides time to destination this way)
    - Use ```receiveTimeToDestination(hh,mm)``` to receive new time to destination on Arduino. `hh` are the seconds to destination (Google maps API provides time to destination this way)
- Time
  - `STX` `T` `HH` `MM` `ETX`
  - where `T` stands for time, `HH` gives the hours and `MM` gives the minutes
  - Once transmitted a time, the bike computer handles the time independently until power down
  - You can overwrite the bike computer's time by sending a new time command
- Speed
  - `STX` `S` `XX` `ETX`
  - where `S` stands for speed and `XX` gives the speed in km/h

### Notes
*Please keep in mind that messages are case sensitive*

# Values you need to know
- **Bluetooth Device Service ID :** `0x1819` 
  - org.bluetooth.service.location_and_navigation (https://www.bluetooth.com/specifications/gatt/services)
- **Bluetooth Device Characteristics :** `0x2A68` 
  - org.bluetooth.characteristic.navigation (https://www.bluetooth.com/specifications/gatt/characteristics)

Cause the AT-09 Bluetooth Module can only receive 20 Bytes at once, we need to specify a start- and end character. Now we can split up a message into serveral parts of 20 Bytes. The Arduino combines everything written between the start and end character. Thso is done by ```sendToBluetooth(message);``` function.

- **Start character:** `STX` or `2` in decimal
- **End character:** `ETX` or `3` in decimal



<!--stackedit_data:
eyJoaXN0b3J5IjpbMTY3NTYzODk0Ml19
-->
