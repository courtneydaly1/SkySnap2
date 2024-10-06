import requests

def get_weather_history(location, WEATHER_API_KEY):
    url = f"https://api.tomorrow.io/v4/weather/history/recent?location={location}&apikey={WEATHER_API_KEY}"
    headers = {"accept": "application/json"}
    
    response = requests.get(url, headers=headers)
    return response.json()  
