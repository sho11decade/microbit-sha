"""
Micro:bit V2 Shooting Game Controller
- Pin1: Tact switch (NO, software pull-up) for fire
- Accelerometer: Aiming (x, y tilt)
- Communication: UART over BLE

Sends JSON-like messages over BLE UART:
  Fire event:   "F\n"
  Aim data:     "A:<x>,<y>\n"  (x, y in range approx -1024..1024)
"""

from microbit import *

# --- BLE UART Setup ---
uart.init(baudrate=115200)

# --- Pin1 Setup: Tact switch (NO, pull-up) ---
pin1.set_pull(pin1.PULL_UP)

# --- Config ---
AIM_INTERVAL_MS = 50  # Send aim data every 50ms
DEBOUNCE_MS = 100     # Button debounce time

# --- State ---
last_aim_time = 0
last_fire_time = 0
prev_button_state = 1  # Pull-up: 1 = not pressed, 0 = pressed


def send_message(msg):
    """Send a message string over UART (BLE)."""
    uart.write(msg)


def read_aim():
    """Read accelerometer and return (x, y) tilt values."""
    x = accelerometer.get_x()
    y = accelerometer.get_y()
    return x, y


def check_fire():
    """Check if fire button (Pin1) is pressed (falling edge detection)."""
    global prev_button_state, last_fire_time
    current = pin1.read_digital()
    now = running_time()
    fired = False
    if prev_button_state == 1 and current == 0:
        if now - last_fire_time >= DEBOUNCE_MS:
            fired = True
            last_fire_time = now
    prev_button_state = current
    return fired


# --- Main Loop ---
display.show(Image.TARGET)

while True:
    now = running_time()

    # Fire detection
    if check_fire():
        send_message("F\n")
        display.show(Image.DIAMOND_SMALL)
        sleep(50)
        display.show(Image.TARGET)

    # Aim data (throttled)
    if now - last_aim_time >= AIM_INTERVAL_MS:
        x, y = read_aim()
        send_message("A:{},{}\n".format(x, y))
        last_aim_time = now

    sleep(10)
