# Environment Monitoring 

# Table of contents

[TOC]


## 1. About

This project is the result of a 4-week "IoT and Cloud services"-course taught by Emil Nildersen (github: [voxic](https://https://github.com/voxic)) and Johan (github: [JH83](https://github.com/jh83)). The assignment was to store and visualize sensordata and thirdparty-API-data through cloudservices. 

## 2. Usecase

Monitor the temperature and humidity of a terrarium to secure a good environment for the animal. Compare the temperature and humidity of the terrarium with local weather to check for eventual correlations in the data.

* a. Monitor temperature and humidity with a sensor and store the data
* b. Alert for temperature-thresholds (too hot/too cold)
* c. Fetch local temperature and humidity values from a 3rd party API and store the data
* d. Visualize data to allow comparison between measured values and local weather values.

## 3. Solution

### 3.1. Cloud Architecture

![](https://i.imgur.com/Nz5yqnx.png)

**Website:** https://garythegecko-4i4wnj6vka-lz.a.run.app/all

The choice of working with google cloud is academical and has allowed me to get better insight in the platform.

### 3.2. Hardware

* Sensor: [DHT-11 ](https://www.electrokit.com/produkt/digital-temperatur-och-fuktsensor-dht11/)
* MCU: [Esp32 feather Huzzah](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather)


### 3.3. Protocol

Publisher/subscribe Protocol MQTT is used to send data to Firestore database.
MQTT is a standard messaging protocol for Iot-systems as it allows a small code footprint and minimal network bandwidth.

### 3.4. Cloud IoT Core

This service allows communication with your device/devices through either http or MQTT protocol. MQTT-protocol comes with an added layer of security: encrypted Jason web tokens that are required for message authentication. IoT Core is crucial for scalability as it simplifies the management of a fleet of devices, in our usecase it could come in handy in a zoo.

### 3.5. Cloud functions

A scalable function as a service (FaaS), serverless. Optimizes resources based on load which means a voluminous transfer of data if needed.

### 3.6. Firestore

Firestore database is a noSQL document database. It has built in live synchronization, this strengthens it's place as a "warm path" datbase. Firestore is part of google and firebase a database service.

### 3.7. Cloud Run

The website written in node.js is hosted through cloud runs containers.
Containers have become a standard to package and deploy code and its dependencies. Cloud Run works with the following container ecosystem: Cloud Build, Cloud Code, Artifact Registry, and Docker.[^1]

### 3.8. API

* https://openweathermap.org/api: Free weather API
* https://core.telegram.org/bots: in our usecase we create a telegram bot that alerts when temperature reaches a threshold.

## 4. Guides

* [ESP32 with DHT11/DHT22 Temperature and Humidity Sensor using Arduino IDE](https://randomnerdtutorials.com/esp32-dht11-dht22-temperature-humidity-sensor-arduino-ide/)
* [Google Cloud IoT Core ESP32: Send data to Google IoT Platform using MQTT](https://www.survivingwithandroid.com/cloud-iot-core-esp32/)
* [Cloud Functions: from Pubsub to Firebase Cloud Firestore in Python](https://www.youtube.com/watch?v=TYItEci216w)
* [Telegram bots: An introduction for developers](https://core.telegram.org/bots)

## 5. Contact

Author: Jonathan Koitsalu

e-mail: jonathan.koitsalu@gmail.com

[linked-in](https://www.linkedin.com/in/jonathan-koitsalu-5885b3160/)

## 6. Thanks

to Daniel Johansson ([CodeByMini](https://github.com/CodeByMini)) for helping me with node.js/chart.js.

[^1]: https://cloud.google.com/run


