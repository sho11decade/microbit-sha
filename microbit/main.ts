/**
 * Micro:bit V2 Shooting Game Controller
 * - Pin1: Tact switch (NO, software pull-up) for fire
 * - Accelerometer: Aiming (x, y tilt)
 * - Communication: UART over BLE (Nordic UART Service)
 *
 * Sends messages over BLE UART:
 *   Fire event:   "F\n"
 *   Aim data:     "A:<x>,<y>\n"  (x, y in range approx -1024..1024)
 *
 * Setup:
 *   1. Open MakeCode (https://makecode.microbit.org/)
 *   2. Create a new project
 *   3. Add the Bluetooth extension (Extensions -> bluetooth)
 *   4. Switch to JavaScript mode and paste this code
 *   5. Download the hex file and copy it to the micro:bit
 */

// --- BLE UART Setup ---
bluetooth.startUartService()

// --- Pin1 Setup: Tact switch (NO, pull-up) ---
pins.setPull(DigitalPin.P1, PinPullMode.PullUp)

// --- Config ---
const AIM_INTERVAL_MS = 50  // Send aim data every 50ms
const DEBOUNCE_MS = 100     // Button debounce time

// --- State ---
let lastAimTime = 0
let lastFireTime = 0
let prevButtonState = 1  // Pull-up: 1 = not pressed, 0 = pressed
let bleConnected = false

// --- BLE Connection Events ---
bluetooth.onBluetoothConnected(function () {
    bleConnected = true
    basic.showIcon(IconNames.Yes)
    basic.pause(300)
    basic.showIcon(IconNames.Target)
})

bluetooth.onBluetoothDisconnected(function () {
    bleConnected = false
    basic.showIcon(IconNames.No)
    basic.pause(300)
    basic.showIcon(IconNames.Target)
})

// --- Initial Display ---
basic.showIcon(IconNames.Target)

// --- Main Loop ---
basic.forever(function () {
    const now = input.runningTime()

    // Fire detection (falling edge on Pin1)
    const currentBtn = pins.digitalReadPin(DigitalPin.P1)
    if (prevButtonState === 1 && currentBtn === 0) {
        if (now - lastFireTime >= DEBOUNCE_MS) {
            bluetooth.uartWriteString("F\n")
            basic.showIcon(IconNames.SmallDiamond)
            basic.pause(50)
            basic.showIcon(IconNames.Target)
            lastFireTime = now
        }
    }
    prevButtonState = currentBtn

    // Aim data (throttled)
    if (now - lastAimTime >= AIM_INTERVAL_MS) {
        const x = input.acceleration(Dimension.X)
        const y = input.acceleration(Dimension.Y)
        bluetooth.uartWriteString("A:" + x + "," + y + "\n")
        lastAimTime = now
    }

    basic.pause(10)
})
