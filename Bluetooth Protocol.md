# Welche Daten müssen übertragen werden?
### Navigation
- Maneuver
- Anweisung
- Zeit bis zum Ziel

### Uhrzeit

### Geschwindigkeit


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
