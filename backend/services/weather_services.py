from app import app, db
import requests
from models import RealtimeWeather, DailyWeather

WEATHER_API_KEY= app.config['WEATHER_API_KEY']

def get_daily_forecast():
    url= f"https://api.tomorrow.io/v4/weather/forecast"
    params = {
    'location': 'sarasota',
    'timestep': '1d',
    'apikey': WEATHER_API_KEY
    }
    
    headers = {"accept": "application/json"}
    try:
        # Fetch data from the API
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return None
    
    # Check if 'timelines' and 'daily' keys are present
    if 'timelines' in data and 'hourly' in data['timelines']:
        forecast_entries = data['timelines']['hourly']
    else:
        # Handle missing data
        print("Error: 'hourly' not found in API response")
        return None
    
    location_data = data.get('location', {})
    
    for entry in forecast_entries:
        time = entry.get('time', None)
        forecast_values = entry.get('values', {})
        
        # create a new DailyWeather instance
        weather_entry = DailyWeather(
            time=time,
            location_name=location_data.get('name', 'Unknown'),
            lat=location_data.get('lat', None),
            lon=location_data.get('lon', None),
            temperature=forecast_values.get('temperature', None),
            temperatureApparentAvg= forecast_values.get('temperatureApparentAvg', None),
            precipitationProbability=forecast_values.get('precipitationProbability', None),
            humidity=forecast_values.get('humidity', None),
            cloudCover=forecast_values.get('cloudCover', None),
            uvIndex=forecast_values.get('uvIndex', None),
            windSpeed=forecast_values.get('windSpeed', None),
            
        )
        
        # Save each entry to the database
        db.session.add(weather_entry)
    
   # Commit all the entries to the database
    # try:
        db.session.commit()
        print("Weather data saved successfully.")
    # except Exception as e:
    #     db.session.rollback()
    #     print(f"Error saving data to the database: {e}")
    #     return None

    return data


def get_current_forecast():
    url= f"https://api.tomorrow.io/v4/weather/forecast"
    params = {
    'location': 'sarasota',
    'timestep': '1h',
    'apikey': WEATHER_API_KEY
    }
    
    headers = {"accept": "application/json"}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

def get_realtime():
    url= f"https://api.tomorrow.io/v4/weather/realtime"
    params = {
    'location': 'sarasota',
    'apikey': WEATHER_API_KEY
    }
    
    headers = {"accept": "application/json"}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

def get_weekly_forecast():
    url= f"https://api.tomorrow.io/v4/weather/forecast"
    params = {
    'location': 'sarasota',
    'timestep': '5d',
    'apikey': WEATHER_API_KEY
    }
    
    headers = {"accept": "application/json"}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()  
    
def get_realtime_forecast(location='sarasota'):
    url = f"https://api.tomorrow.io/v4/weather/forecast"
    params = {
        'location': location,
        'timestep': '1h',
        'apikey': WEATHER_API_KEY
    }
    
    headers = {"accept": "application/json"}
    
    # Fetch data from the API
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
  
    # Check if 'timelines' and 'minutely' keys are present
    if 'timelines' in data and 'minutely' in data['timelines']:
        forecast_entries = data['timelines']['minutely']
    else:
        # Handle missing data
        print("Error: 'minutely' not found in API response")
        return None
    
    location_data = data.get('location', {})
    
    for entry in forecast_entries:
        time = entry.get('time', None)
        forecast_values = entry.get('values', {})
        weather_entry = RealtimeWeather(
            time=time,
            location_name=location_data.get('name', 'Unknown'),
            lat=location_data.get('lat', None),
            lon=location_data.get('lon', None),
            cloudBase=forecast_values.get('cloudBase', None),
            cloudCeiling=forecast_values.get('cloudCeiling', None),
            cloudCover=forecast_values.get('cloudCover', None),
            dewPoint=forecast_values.get('dewPoint', None),
            humidity=forecast_values.get('humidity', None),
            precipitationProbability=forecast_values.get('precipitationProbability', None),
            pressureSurfaceLevel=forecast_values.get('pressureSurfaceLevel', None),
            temperature=forecast_values.get('temperature', None),
            windSpeed=forecast_values.get('windSpeed', None),
            windDirection=forecast_values.get('windDirection', None),
            uvIndex=forecast_values.get('uvIndex', None),
            weatherCode=forecast_values.get('weatherCode', None),
            visibility=forecast_values.get('visibility', None)
        )
        
        # Save each entry to the database
        db.session.add(weather_entry)
    
    # Commit all entries to the database at once
    db.session.commit()

    return data



def get_weather_history(location, WEATHER_API_KEY):
    url = f"https://api.tomorrow.io/v4/weather/history/recent?location={location}&apikey={WEATHER_API_KEY}"
    params = {
    'location': '{location} ',
    'apikey': WEATHER_API_KEY
    }
    headers = {"accept": "application/json"}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json() 

# https://api.tomorrow.io/v4/weather/forecast?location=new%20york&apikey=1BGZpjozyIwY6TIyMf5rMIS9ajB8gvsk