from app import app, db
import requests
from models import RealtimeWeather, DailyWeather
from flask import jsonify
import logging

WEATHER_API_KEY = app.config['WEATHER_API_KEY']
BASE_URL = "https://api.tomorrow.io/v4/weather"

# Configure logging
logging.basicConfig(level=logging.INFO)

def fetch_weather_data(endpoint: str, params: dict) -> dict:
    """
    Generic function to fetch weather data from Tomorrow.io API.
    
    Args:
        endpoint (str): The API endpoint to access.
        params (dict): Query parameters for the API request.

    Returns:
        dict: Parsed JSON response from the API or None if an error occurs.
    """
    url = f"{BASE_URL}/{endpoint}"
    headers = {"accept": "application/json"}
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise HTTPError for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching data from {endpoint}: {e}")
        return None


def save_weather_data(entries: list, model, location_data: dict, weather_type: str):
    """
    Save weather data entries to the database.

    Args:
        entries (list): A list of weather data entries.
        model (db.Model): The database model (RealtimeWeather or DailyWeather).
        location_data (dict): The location data including name, lat, lon.
        weather_type (str): The type of weather data (e.g., 'real-time', 'daily').
    """
    for entry in entries:
        weather_entry = model(
            time=entry.get('time'),
            location_name=location_data.get('name', 'Unknown'),
            lat=location_data.get('lat'),
            lon=location_data.get('lon'),
            **entry['values']
        )
        db.session.add(weather_entry)

    db.session.commit()
    logging.info(f"{weather_type.capitalize()} forecast data saved successfully.")


def get_daily_forecast(location: str = 'sarasota') -> dict:
    """
    Fetch and save the daily weather forecast.
    
    Args:
        location (str): The location to fetch the weather forecast for.

    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': location, 'timestep': '1d', 'apikey': WEATHER_API_KEY}
    data = fetch_weather_data("forecast", params)

    if not data or 'timelines' not in data or 'daily' not in data['timelines']:
        logging.error("Error: 'daily' not found in API response")
        return None

    forecast_entries = data['timelines']['daily']
    location_data = data.get('location', {})
    save_weather_data(forecast_entries, DailyWeather, location_data, "daily")
    return data


def get_realtime_forecast(location: str = 'sarasota') -> dict:
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
        logging.error("Error: 'minutely' not found in API response")
        return None

    forecast_entries = data['timelines']['minutely']
    location_data = data.get('location', {})
    save_weather_data(forecast_entries, RealtimeWeather, location_data, "real-time")
    return data


def get_weather_history(location: str) -> dict:
    """
    Fetch recent weather history.

    Args:
        location (str): The location for the weather history.

    Returns:
        dict or None: The API response data or None if there was an error.
    """
    params = {'location': location, 'apikey': WEATHER_API_KEY}
    return fetch_weather_data("history/recent", params)

