---
title: Internet of Things module - CAT
description: Quick tour of the continuous assessment test
coverImage: "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIJIwSpW4OstxEZrb4kYXLV8RynuaWBqiT019K"
tags:
  - university-module
  - iot
  - arduino
  - exam
  - cat
  - tinkercad
postOfTheDay: true
date: "2025-02-23T12:08:54.322Z"
lastEdited: "2025-02-23T13:18:26.077Z"
---

What a day!🥲 Hope it was fantastic for all of us.
The aim here is to give an overview of the exam. We won't dive into the theoretical questions, just the practical one.

---

## Pratical question

The compulsory question was going like this:

- a) Draw an architecture design of an object detection system using an Ultrasonic Sensor.
- b) Using the Tinkercad software (simulator), develop a prototype of object detection using an Ultrasonic Sensor and three LEDs. When the object is in a distance beyond 50cm, the green LED should be on and the rest off; when the object is in a distance between 20 and 50 cm, the yellow LED should be on and the rest off; when the object is in a distance between 0 and 20 cm, the red LED should be on and the rest off.

## Proposed Solution

### a. Drawing an architecture design of an object detection system using an Ultrasonic Sensor

We've been summoned to hand-draw it. So based on what we can understand from the question, let's show it in the next point.

### b. Developing a prototype of object detection using an Ultrasonic Sensor and three LEDs

#### 1. Hardware Setup

Here's what you might have ended up with:

<p align="center"><img src="https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIJIwSpW4OstxEZrb4kYXLV8RynuaWBqiT019K" alt="From left, via top to right: Arduino Uno R3 (01), LEDs (03 - green, yellow, red), Resistors (03), Ultrasonic Distance Sensor HC-SR04 (01)" class="rounded-md" /></p>

  <div class="flex justify-center mb-20">
    <span class="text-sm text-center text-white/70"><em>From left, via top to right: Arduino Uno R3 (01), LEDs (03 - green, yellow, red), Resistors (03), Ultrasonic Distance Sensor HC-SR04 (01)</em></span>
  </div>

The setup consists of an Arduino Uno R3 (01), some LEDs (03 - green, yellow, red), Resistors (03), and an Ultrasonic Distance Sensor HC-SR04 (01).

- **Why an HC-SR04 (4-pin) over a 3-pin one?** This sensor uses sound waves to determine how far away an object is from it. Choosing a 4-pin ultrasonic sensor over a 3-pin one typically _offers advantages in programming simplicity, flexibility in handling multiple sensors, and overall ease of integration into projects_. More info in the official Arduino <a href="https://forum.arduino.cc/t/ultrasonic-sensor-3pins-vs-4pins/281748" target="_blank">forum</a> and <a href="https://arduino.stackexchange.com/questions/34257/what-is-the-difference-between-a-3-pin-and-4-pin-ultrasonic-range-sensor" target="_blank">stack exchange</a>.
- **How does it work?** This device emits sound with a very high pitch. So high, in fact that you cannot hear it. Sound takes time to travel through the air. This clever device listens for the first echo to bounce off a nearby object. It then figures out how far away the object is by measuring the time it takes for the sound to reflect off the target and echo back to it.
- **How to connect it?** There are four pins on the bottom of this device. Power the device by connecting the Power pin to the Arduino 5V terminal and Ground to any GND terminal on an Arduino. The Trigger and Echo pins are connected to any digital or analog terminals on the Arduino. The code tells the sensor to emit its sound using the trigger pin, and waits for the echo detection from the echo pin. It converts the time it took it to a number representing the distance in inches or centimeters.
- **How is it used?** Select the device during simulation to show a region with a circle in it. The region represents the space in which the sensor can detect a large object. The circle is the target object. Select the target to move it around the region and change the distance between it and the sensor.

#### 2. C++ Code

To make it up and running, you could write something alike the following:

```c++
/**
 *  Object detection system using an HC-SR04 Ultrasonic Sensor (4-pin)
 *  Written by cuttypie.dev
 */

// Define pins for the ultrasonic sensor
const int trigPin = 9;
const int echoPin = 7;

// Define pins for the LEDs
const int greenLed = 13;
const int yellowLed = 12;
const int redLed = 11;

void setup() {
    // Start serial communication for debugging
    Serial.begin(9600);

    // Set LED pins as OUTPUT
    pinMode(greenLed, OUTPUT);
    pinMode(yellowLed, OUTPUT);
    pinMode(redLed, OUTPUT);

    // Set ultrasonic sensor pins
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
}

void loop() {
    // Clear the trigPin
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);

    // Set the trigPin HIGH for 10 microseconds
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    // Read the echoPin, return the sound wave travel time in microseconds
    long duration = pulseIn(echoPin, HIGH);

    // Calculate the distance in cm
    float distance = duration * 0.034 / 2; // Speed of sound is 0.034 cm/µs

    // Print distance for debugging purposes
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    // Control LEDs based on distance
    if (distance > 50) {
        digitalWrite(greenLed, HIGH);   // Turn on Green LED
        digitalWrite(yellowLed, LOW);    // Turn off Yellow LED
        digitalWrite(redLed, LOW);       // Turn off Red LED
    }
    else if (distance > 20 && distance <= 50) {
        digitalWrite(greenLed, LOW);     // Turn off Green LED
        digitalWrite(yellowLed, HIGH);   // Turn on Yellow LED
        digitalWrite(redLed, LOW);       // Turn off Red LED
    }
    else if (distance >= 0 && distance <= 20) {
        digitalWrite(greenLed, LOW);     // Turn off Green LED
        digitalWrite(yellowLed, LOW);     // Turn off Yellow LED
        digitalWrite(redLed, HIGH);      // Turn on Red LED
    }
    else {
        // If distance is out of range (negative), turn all LEDs off.
        digitalWrite(greenLed, LOW);
        digitalWrite(yellowLed, LOW);
        digitalWrite(redLed, LOW);
    }

    delay(500); // Wait for half a second before next measurement
}
```

---

## Conclusion

In summary, the exam was about building an object detection system using an Ultrasonic Sensor for the practical question. The rest of the exam was theoretical, focusing on the fundamentals of IoT.

Wishing you all success!🥳 Let's catch up for the final examination taking place next weekend. Major announcements also coming soon.
