from google.cloud import firestore
from datetime import datetime
import json 
import requests

client = firestore.Client(project='gecko-334614')

# cloud function

def pubsub_fire(event, context):
    import base64

    print(f'This function was triggered by messageId {context.event_id}, published at {context.timestamp} to {context.resource["name"]}!')

    message = ''
    if 'data' in event:
        message = base64.b64decode(event['data']).decode('utf-8')
    print(f'message: {message}')
    
    time = json.loads(message)["time"]
    temperature = json.loads(message)["temperature"]
    humidity = json.loads(message)["humidity"]

    # telegram bot

    if temperature > 30:
        r = requests.get("https://api.telegram.org/bot5052823122:AAFJcXyyRbGUUHG2sP0lhSvCfCHobVmoGK4/sendMessage?chat_id=-681600803&text=Too+hot")
    if temperature < 20:
        r = requests.get("https://api.telegram.org/bot5052823122:AAFJcXyyRbGUUHG2sP0lhSvCfCHobVmoGK4/sendMessage?chat_id=-681600803&text=Too+cold")

    # API key

    api_key = "API KEY HERE"

    # Location

    lat = 00.000000

    lon = 00.000000

    complete_url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "lon=" + lon +"&appid=" + api_key

    response = requests.get(complete_url)
    x = response.json()
    y = x["main"]
    temperatureOutside = round(y["temp"]-273.15,1)
    humidityOutside = y["humidity"]
        
    doc_id = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    doc = client.collection('GeckoData').document(doc_id)
    doc.set({
        'message': message,
        'time': time,
        'temperature': temperature,
        'humidity': humidity,
        'temperatureOutside': temperatureOutside,
        'humidityOutside': humidityOutside
    })