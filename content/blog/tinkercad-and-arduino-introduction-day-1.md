---
title: TinkerCad and Arduino Introduction - Day 1
description: Demystifying the complexity of Arduino and TinkerCad (C++ programming)
coverImage: 'https://th.bing.com/th/id/OIP.z0Y7xAkbBQaezeXA6kQ78AAAAA?rs=1&pid=ImgDetMain'
tags:
  - iot
  - arduino
  - tinkercad
  - autodesk
  - programming
  - c&cpp
postOfTheDay: true
date: '2025-02-16T00:54:24.667Z'
lastEdited: '2025-02-22T07:15:18.813Z'
---

<p align="center"><img src="https://th.bing.com/th/id/OIP.z0Y7xAkbBQaezeXA6kQ78AAAAA?rs=1&pid=ImgDetMain" alt="AUTODESK TINKERCAD" class="rounded-md" /></p>

  <div class="flex justify-center mb-20">
    <span class="text-sm text-center text-white/70"><em>Learn the basics of Arduino with Autodesk TinkerCad</em></span>
  </div>

Sunday, February sixteenth 2025, 03am o'clock when I’m writing this article...

Oh homies! Yesterday was…💔💆🏽‍♂💆🏾‍♀exciting for some of us, challenging for others… bref! It was quite tricky😵‍💫

Let's delve into it.

---

## Quick programming basics

Regarding what has been done, I genuilely believe that we should commence by recalling the basics of programming. As we used a simplified version of C++ for this case, let me remind you the syntax and some important concepts to understand:

```c++
int a = 5;
int b = 10;

void setup() {
  // put your setup code here, to run once:
  pinMode(a, OUTPUT);
  pinMode(b, OUTPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(a, HIGH);
  digitalWrite(b, LOW);
  delay(1000);
  digitalWrite(a, LOW);
  digitalWrite(b, HIGH);
  delay(1000);
}
```

### Types

Types are a fundamental concept in programming. In C++, for example, there are different types of variables, such as integers, floats, strings, and booleans.

```c++
int a = 5; // integer
float b = 10.5; // floating-point number
char c = 'A'; // character
bool d = true; // boolean

```

### Variables

Variables are containers, or boxes, that hold values. They can be used to store data and perform operations on it. In the example above, the variables `a` and `b` are used to represent pins on the Arduino board.

### Conditions

Conditions are used to determine whether a certain action should be taken. In the example below, the `if` statement is used to check if the value of `a` is greater than `b`.

```c++
...
  if(a > b) {
    // do something
  }
...
```

There also exists the `else if` and `else` statements.

```c++
...
  if(a > b) {
    // do something
  }
  else if(a < b) {
    // do something else
  }
  else {
    // both previous conditions failed, so deduce the output
  }
...
```

### Loops

Loops are used to repeat a set of instructions over and over again. In the example below, the `for` loop is used to repeat a set of instructions 5 times.

```c++
...
  for(int i = 0; i < 5; i++) {
    cout << i << endl; // print the current value of i 5 times
  }
...
```

There also exists the `while` loop.

```c++
...
  int i = 0; // counter
  while(i < 5) {
    cout << i << endl; // print the current value of i 5 times
    i++;
  }
...
```

### Functions

In programming, a function is **a self-contained block of code designed to perform a specific task**. Functions take inputs, called parameters, process them, and often return a result. They help _organize code into reusable segments, making programs easier to read, maintain, and debug_. Once defined, a function can be called multiple times throughout a program without needing to rewrite the same code, promoting efficiency and modularity in programming practices. In the example above, the functions `digitalWrite()` and `delay()` are used to control the behavior of the Arduino board.

```c++
...
  // The digitalWrite() function is being called more than once, take parameters and returns some value
  digitalWrite(a, HIGH);
  digitalWrite(b, LOW);
...
```

### Pins

Pins are electrical connections on the Arduino board, represented by numbers (integers). They are used to control the behavior of the board. So to call them in the program, we can directly mention them in the function call, or declare them as variables first. In the example above, the pins `a` and `b` are used to represent pins on the Arduino board.

```c++
...
// Direct call
pinMode(5, OUTPUT);
pinMode(10, OUTPUT);
...
```

```c++
...
// Declaration as variable first
int a = 5;
int b = 10;

// and then call in the function
pinMode(a, OUTPUT);
pinMode(b, OUTPUT);
...
```

---

## Arduino and TinkerCad

Let's break down Arduino and TinkerCad for the sake of clarity.

### 1. Arduino explained

Arduino is a digital microcontroller board. It's a platform for building interactive systems, like games, sensors, and actuators. Projects that can run on a single chip. Think of it as a beginner-friendly way to play with electronics and programming. It's like a tiny, programmable computer that can interact with the real world.

### 2. TinkerCad explained

TinkerCad is a free online 3D modeling and 3D printing platform. It's a great tool for prototyping and testing ideas before you build something physical. It's like a virtual sandbox where you can experiment with different designs and see how they work in real-time.

### In Summary

Arduino is the physical programmable board, while Tinkercad is a virtual simulator. Tinkercad is a great place to start because you can learn the basics of Arduino and electronics without spending any money on hardware. Once you're comfortable, you can then move on to working with a real Arduino board.

---

## Arduino functions

Arduino uses a simplified version of C++ as its programming language. This makes it easier to learn and use, especially for beginners. Arduino functions are similar to C++ functions, but with some differences. Here's a brief overview of the main Arduino functions:

### 1. Entry-point functions

#### setup()

The `setup()` function is used to set up the Arduino board. It's called once at the beginning of the program, and is where you can set up pins, serial communication,and configure other settings.

```c++
void setup() {
  // put your setup code here, to run once:

  pinMode(a, OUTPUT); // pin a set as output
  Serial.begin(9600); // start serial communication at 9600 baud
}
```

#### loop()

The `loop()` function is used to repeat a set of instructions over and over again. It's called repeatedly in a loop, and is where you can add your main program logic.

```c++
void loop() {
  // put your main code here, to run repeatedly:

  digitalWrite(a, HIGH); // turn the LED on (HIGH is the voltage level)
  delay(1000); // wait for a second
  digitalWrite(a, LOW); // turn the LED off by making the voltage LOW
  delay(1000); // wait for a second
}
```

In both functions, you noticed there's a keyword called `void`. It means the function doesn't return any value. In C++, functions that don't return a value are called _void functions_.

### 2. Local functions

#### pinMode()

The `pinMode()` function is used to configure the mode of a pin. This means you can use this pin to send a signal to control other components, like an LED. It's like you're telling the Arduino that both light switches (pins a and b) will be used to send power out to the light bulbs. It takes two parameters: the pin number and the mode (OUTPUT or INPUT). In the example, the `pinMode(a, OUTPUT)` function is used to configure the pin `a` as an output.

```c++
...
  // pin a is configured as an output
  pinMode(a, OUTPUT);
  // pin b too
  pinMode(b, OUTPUT);
...
```

#### analogRead()

The `analogRead()` function reads the voltage on an analog pin and converts it into a digital value. It's used with sensors that output a range of voltages, such as light sensors, temperature sensors, or potentiometers.
- **Input Pins**: Analog pins (typically labeled A0-A5 on most Arduino boards).
- **Return Value**: An integer between 0 and 1023. The value represents the voltage level at the pin:
	- 0 corresponds to approximately 0V.
	- 1023 corresponds to approximately the reference voltage (usually 5V for most Arduinos).
- **Use cases**:
	- Reading sensor data where precise measurement is needed.
	- Controlling brightness of LEDs based on sensor input.

```c++
  const int analogPin = A0; // Analog Pin

  void setup() {
 ...  
}

  void loop() { 
  // Read Analog Input
  int analogValue = analogRead(analogPin);
}
```

#### digitalRead()

The `digitalRead()` function reads whether a digital pin is HIGH (approximately equal to VCC) or LOW (ground). It's typically used with components like push buttons or simple switches.
- **Input Pins**: Digital pins can be configured as inputs using `pinMode()`.
- **Return Value**: Either HIGH (`true`) or LOW (`false`), indicating whether there is power applied at that pin.
- Use cases:
	- Detecting button presses in user interfaces.
	- Reading binary states from simple electronic circuits.

```c++
  const int digitalPin = 2; // Digital Pin

  void setup() {
   pinMode(digitalPin, INPUT); // Set up digital pin as input
}

  void loop() { 
   // Read Digital Input
  bool digitalWriteValue = !!(digitalRead(digitalPin)); // Convert HIGH/LOW to true/false
}
```

#### digitalWrite()

The `digitalWrite()` function is used to control the state of a pin. In the example below, the `digitalWrite(a, HIGH)` flips the light switch `a (pin 5)` to the ON position (sending power) and the light switch `b (pin 10)` to the OFF position (no power).

```c++
...
  digitalWrite(a, HIGH); // switch a on
  digitalWrite(b, LOW); // switch b off
  ...
```

#### delay()

The `delay()` function is used to pause the program for a specified amount of time. Below we pause the program for one second with `delay(1000)`.

```c++
...
  delay(1000); // wait for a second
  ...
```

#### Serial

The `Serial` object is used to communicate with the computer. It has methods like `Serial.begin()` to start the serial communication and `Serial.println()` to send a message to the computer.

```c++
...
  Serial.begin(9600); // start serial communication at a baud rate of 9600
  Serial.println("Hello World!"); // send the string "Hello World!" to the computer
  ...
```

### 3. Key differences between `analogRead()` and `digitalRead()`

As these two functions are used to read values, some important differences need to be underscored tho:

- **Type of Input**:
	- `analogRead()`: Reads continuous values within a range (e.g., light intensity levels).
	- `digitalRead()`: Reads binary states only—HIGH or LOW.
- **Pin Usage**:
	- `analogRead()`: Uses analog input pins only (A0-A5).
	- `digitalRead()`: Can use any digital pin after setting it as an INPUT using `pinMode()`.
- **Resolution**:
	- `analogRead()`: Offers higher resolution with values ranging from 0 to 1023 for most Arduinos.
	- `digitalRead()`: Only provides two possible outcomes—HIGH (`true`) or LOW (`false`).
- **Applications**:
	- Use analog inputs for applications requiring precise measurements like environmental sensing.
	- Use digital inputs when you need simple ON/OFF detection like in button presses.

---

## Practical application

I chose the last exercise we did in class because I think it summarizes the material we have covered so far, and is more challenging to practice what we have learned.

So the aim was to **build a circuit with an Arduino Uno, a motor, a buzzer and a PIR sensor (multimeter is optional). The circuit should be able to detect when a person enters or exits the room and should also make the motor run and the buzzer sound when a person enters or exits the room**. All components available in Tinkercad.

Putting everything together, you may end up with something like this:

![From left, down, up, to right: Arduino Uno R3, PIR sensor,DC Motor, Piezo (Buzzer) and Multimeter.](https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIEtZGNaUoc1SfvOW0qnGQ2CL3mlBDkXt7beiM)

<div class="flex justify-center mb-20">
    <span class="text-sm text-center text-white/70"><em>From left, down, up, to right: Arduino Uno R3, PIR sensor,DC Motor, Piezo (Buzzer) and Multimeter.</em></span>
  </div>

To run this, you can use the following code which enhances the one used in class:

```c++
// Arduino with PIR Sensor - Matheo's version

// Pin Definitions
const int motorPin = 4;    // Motor control pin
const int sensorPin = 5;   // PIR sensor input pin
const int buzzerPin = 6;   // Buzzer pin
const int voltagePin = 7;  // Voltage control pin

// Parameters to adjust the responsiveness
const unsigned long motionTimeout = 500; // Milliseconds (0.5 seconds)

// Variables
bool motionDetected = false; // To check if motion is detected
unsigned long lastMotionTime = 0;  // Time of the last motion detection

void setup() {
  // Initialize pin modes
  pinMode(motorPin, OUTPUT);
  pinMode(sensorPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(voltagePin, OUTPUT);

  // Start serial communication for debugging
  Serial.begin(9600);
}

void loop() {
  // Read the PIR sensor value
  int sensorValue = digitalRead(sensorPin);

  // Check if motion is detected
  if (sensorValue == HIGH) {
    // Motion detected, update the lastMotionTime
    lastMotionTime = millis();  // Record the current time
    if (!motionDetected) {
      Serial.println("Motion Detected!");
      motionDetected = true;
    }
  }

  // Check if enough time has passed since last motion
  if (motionDetected && (millis() - lastMotionTime >= motionTimeout)) {
    // No motion for the specified timeout period
    Serial.println("Motion Stopped (Timeout)!");
    motionDetected = false;
  }

  // Control the motor, buzzer, and voltage based on motionDetected
  digitalWrite(motorPin, motionDetected ? HIGH : LOW);
  digitalWrite(buzzerPin, motionDetected ? HIGH : LOW);
  digitalWrite(voltagePin, motionDetected ? HIGH : LOW);

  delay(50); // Small delay to avoid busy-waiting
}

```

Everything's clearly explained here, so you can start playing around with it!

---

## Conclusion

That's it for today! I hope you enjoyed this detailled article. I've tried my best to demystify all this stuff, especially the programming part. Don't forget to share this knowledge with others and keep learning! See you in a few hours✌🏼️🙂
