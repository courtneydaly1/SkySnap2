import requests
import os

def get_weather_data(location):
    """Fetch current weather data from Tomorrow.io API."""
    api_key = os.getenv('WEATHER_API_KEY')
    base_url = 'https://api.tomorrow.io/v4/timelines'
    
   
    params = {
        'location': location,
        'fields': ['temperature', 'precipitationProbability', 'windSpeed'],
        'timesteps': '1d',
        'units': 'metric',
        'apikey': api_key
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        return None
