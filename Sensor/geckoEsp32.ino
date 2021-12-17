#include <Arduino.h>
#include <WiFiClientSecure.h>
#include "esp32-mqtt.h"
#include <Adafruit_Sensor.h>
#include "DHT.h"
#include <ArduinoJson.h>
#include "time.h"
#define DHTTYPE DHT11
#define DHT_PIN 21

DHT dht(DHT_PIN,DHTTYPE);
char buffer[100];

//Get time now variables
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 3600;
const int daylightOffset_sec = 3600;
char str[50];


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Setup.....");
  dht.begin();
  pinMode(LED_BUILTIN, OUTPUT);
  setupCloudIoT();
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
}

unsigned long lastMillis = 0;
void loop() {
  mqtt->loop();
  delay(10);  // <- fixes some issues with WiFi stability
  if (!mqttClient->connected()) {
    connect();
  }
  if (millis() - lastMillis > 60000) {
    Serial.println("Publishing value");
    lastMillis = millis();
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    StaticJsonDocument<100> doc;
    time_t rawtime;
    struct tm * timeinfo;
    time (&rawtime);
    timeinfo = localtime(&rawtime);
    
    strftime(str, sizeof(str), "%Y-%m-%d %H:%M:%S", timeinfo); 
    doc["time"] = str;
    Serial.println(str);
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    
    serializeJson(doc, buffer);
    //publishTelemetry(mqttClient, "/sensors", getDefaultSensor());
    publishTelemetry( buffer);
  }
}

void printLocalTime()
{
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  strftime(str, sizeof(str), "%Y-%m-%d %H:%M:%S", &timeinfo); 
  Serial.println(str);
}
