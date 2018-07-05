# Welche Daten müssen übertragen werden?
- Maneuver
  - `STX` `M` `X` `ETX`
  - where `M` stands for maneuver and `X` gives the id of the manuever and the assigned arrow
- Anweisung
  - Zeit bis zum Ziel
- Uhrzeit
- Geschwindigkeit
  - `STX` `S` `XX` `ETX`
  - where `S` stands for speed and `XX` gives the speed in km/h

### Notes
*Please keep in mind that Messages are case sensitive*

# Wichtige Werte
- **Bluetooth Device Service ID :** `0x1819` 
  - org.bluetooth.service.location_and_navigation (https://www.bluetooth.com/specifications/gatt/services)
- **Bluetooth Device Characteristics :** `0x2A68` 
  - org.bluetooth.characteristic.navigation (https://www.bluetooth.com/specifications/gatt/characteristics)

Cause the AT-09 Bluetooth Module can only receive 20 Bytes at once, we need to specify a start- and end character. Now we can split up a message into serveral parts of 20 Bytes. The Arduino connects everything written between the start and end character.

- **Start character:** `STX` or `2` in decimal
- **End character:** `ETX` or `3` in decimal



<!--stackedit_data:
eyJoaXN0b3J5IjpbMTY3NTYzODk0Ml19
-->
