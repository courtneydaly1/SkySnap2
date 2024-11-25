from app import app, db
import requests
from models import RealtimeWeather, DailyWeather
from flask import jsonify

WEATHER_API_KEY = app.config['WEATHER_API_KEY']
BASE_URL = "https://api.tomorrow.io/v4/weather"

def fetch_weather_data(endpoint, params):
    """
    Generic function to fetch weather data from Tomorrow.io API.
    
    Args:
        endpoint (str): The API endpoint to access.
        params (dict): Query parameters for the API request.

    Returns:
        dict: Parsed JSON response from the API.
    """
    url = f"{BASE_URL}/{endpoint}"
    headers = {"accept": "application/json"}
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise HTTPError for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {endpoint}: {e}")
        return None


def get_daily_forecast():
    """
    Fetch and save the daily weather forecast.
    
    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': 'sarasota', 'timestep': '1d', 'apikey': WEATHER_API_KEY}
    data = fetch_weather_data("forecast", params)

    if not data or 'timelines' not in data or 'daily' not in data['timelines']:
        print("Error: 'daily' not found in API response")
        return None

    forecast_entries = data['timelines']['daily']
    location_data = data.get('location', {})

    for entry in forecast_entries:
        weather_entry = DailyWeather(
            time=entry.get('time'),
            location_name=location_data.get('name', 'Unknown'),
            lat=location_data.get('lat'),
            lon=location_data.get('lon'),
            temperature=entry['values'].get('temperature'),
            temperatureApparent=entry['values'].get('temperatureApparent'),
            precipitationProbability=entry['values'].get('precipitationProbability'),
            humidity=entry['values'].get('humidity'),
            cloudCover=entry['values'].get('cloudCover'),
            uvIndex=entry['values'].get('uvIndex'),
            windSpeed=entry['values'].get('windSpeed'),
        )
        db.session.add(weather_entry)

    db.session.commit()
    print("Daily forecast data saved successfully.")
    return data


def get_current_forecast():
    """
    Fetch the current weather forecast.
    
    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': 'sarasota', 'timestep': '1h', 'apikey': WEATHER_API_KEY}
    return fetch_weather_data("forecast", params)


def get_realtime():
    """
    Fetch real-time weather data.
    
    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': 'sarasota', 'apikey': WEATHER_API_KEY}
    return fetch_weather_data("realtime", params)


def get_weekly_forecast():
    """
    Fetch the weekly weather forecast.
    
    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': 'sarasota', 'timestep': '5d', 'apikey': WEATHER_API_KEY}
    return fetch_weather_data("forecast", params)


def get_realtime_forecast(location='sarasota'):
    """
    Fetch and save real-time weather forecast data.

    Args:
        location (str): The location for the weather data.

    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': location, 'timestep': '1h', 'apikey': WEATHER_API_KEY}
    data = fetch_weather_data("forecast", params)

    if not data or 'timelines' not in data or 'minutely' not in data['timelines']:
        print("Error: 'minutely' not found in API response")
        return None

    forecast_entries = data['timelines']['minutely']
    location_data = data.get('location', {})

    for entry in forecast_entries:
        weather_entry = RealtimeWeather(
            time=entry.get('time'),
            location_name=location_data.get('name', 'Unknown'),
            lat=location_data.get('lat'),
            lon=location_data.get('lon'),
            cloudBase=entry['values'].get('cloudBase'),
            cloudCeiling=entry['values'].get('cloudCeiling'),
            cloudCover=entry['values'].get('cloudCover'),
            dewPoint=entry['values'].get('dewPoint'),
            humidity=entry['values'].get('humidity'),
            precipitationProbability=entry['values'].get('precipitationProbability'),
            pressureSurfaceLevel=entry['values'].get('pressureSurfaceLevel'),
            temperature=entry['values'].get('temperature'),
            windSpeed=entry['values'].get('windSpeed'),
            windDirection=entry['values'].get('windDirection'),
            uvIndex=entry['values'].get('uvIndex'),
            weatherCode=entry['values'].get('weatherCode'),
            visibility=entry['values'].get('visibility'),
        )
        db.session.add(weather_entry)

    db.session.commit()
    print("Real-time forecast data saved successfully.")
    return data


def get_weather_history(location):
    """
    Fetch recent weather history.

    Args:
        location (str): The location for the weather history.

    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': location, 'apikey': WEATHER_API_KEY}
    return fetch_weather_data("history/recent", params)
