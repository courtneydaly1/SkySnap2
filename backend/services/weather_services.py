from app import app
import requests

WEATHER_API_KEY= app.config['WEATHER_API_KEY']

def get_forcast():
    url= f"https://api.tomorrow.io/v4/weather/forecast"
    params = {
    'location': 'new york',
    'apikey': WEATHER_API_KEY
    }
    # url = f"https://api.tomorrow.io/v4/weather/forcast/recent?location={location}&apikey={WEATHER_API_KEY}"
    headers = {"accept": "application/json"}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json() 
    
def get_weather_history(location, WEATHER_API_KEY):
    url = f"https://api.tomorrow.io/v4/weather/history/recent?location={location}&apikey={WEATHER_API_KEY}"
    headers = {"accept": "application/json"}
    
    response = requests.get(url, headers=headers)
    return response.json() 

# https://api.tomorrow.io/v4/weather/forecast?location=new%20york&apikey=1BGZpjozyIwY6TIyMf5rMIS9ajB8gvsk