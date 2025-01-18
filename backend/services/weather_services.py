from app import app, db
import requests
from requests.models import Response
from models import RealtimeWeather, DailyWeather, User
from flask import jsonify
import logging
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

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
        logging.info(f"Fetching weather data from {url} with params: {params}")
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching data from {url} with params {params}: {e}")
        return None

def get_user_zipcode() -> str:
    """
    Retrieve the ZIP code of the logged-in user.

    Returns:
        str: The ZIP code of the user or an error message.
    """
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": "User not found."}), 404

    zipcode = user.local_zipcode
    if not zipcode or len(zipcode) != 5 or not zipcode.isdigit():
        return jsonify({"error": "Invalid or missing ZIP code in user profile."}), 400

    return zipcode

def save_weather_data(entries: list, model, location_data: dict, weather_type: str):
    """
    Save weather data entries to the database.

    Args:
        entries (list): A list of weather data entries.
        model (db.Model): The database model (RealtimeWeather or DailyWeather).
        location_data (dict): The location data including name, lat, lon.
        weather_type (str): The type of weather data (e.g., 'real-time', 'daily').
    """
    weather_entries = []
    for entry in entries:
        weather_entry = model(
            time=entry.get('time'),
            location_name=location_data.get('name', 'Unknown'),
            lat=location_data.get('lat'),
            lon=location_data.get('lon'),
            **entry['values']
        )
        weather_entries.append(weather_entry)

    # Use bulk save to improve performance
    db.session.bulk_save_objects(weather_entries)
    db.session.commit()
    logging.info(f"{weather_type.capitalize()} forecast data saved successfully.")

def get_weather_forecast(weather_type: str) -> dict:
    """
    Fetch weather data based on the weather type ('real-time' or 'daily') for the user's location.
    
    Args:
        weather_type (str): The type of weather data ('real-time' or 'daily').
        
    Returns:
        dict or None: The API response data or None if there was an error.
    """
    try:
        zipcode = get_user_zipcode()
    except ValueError as e:
        logging.error(e)
        return jsonify({"error": str(e)}), 400

    timestep = '1h' if weather_type == 'real-time' else '1d'
    params = {'location': zipcode, 'timestep': timestep, 'apikey': WEATHER_API_KEY}
    data = fetch_weather_data("forecast", params)

    if not data or 'timelines' not in data or (weather_type == 'real-time' and 'minutely' not in data['timelines']) or (weather_type == 'daily' and 'daily' not in data['timelines']):
        logging.error(f"Error: '{weather_type}' not found in API response")
        return jsonify({"error": f"Unable to fetch {weather_type} weather data."}), 500

    forecast_entries = data['timelines'][weather_type]
    location_data = {"name": f"ZIP {zipcode}", "lat": None, "lon": None}
    save_weather_data(forecast_entries, RealtimeWeather if weather_type == 'real-time' else DailyWeather, location_data, weather_type)
    return jsonify({
        "message": f"{weather_type.capitalize()} weather forecast fetched successfully.",
        "forecast": forecast_entries
    }), 200

def handle_user_zipcode_forecast() -> dict:
    """
    Fetch the 5-day weather forecast for the logged-in user's ZIP code.
    
    Returns:
        dict: JSON response containing the 5-day weather forecast or an error message.
    """
    return get_weather_forecast('daily')

def handle_user_realtime_forecast() -> dict:
    """
    Fetch real-time weather data for the logged-in user's ZIP code.
    
    Returns:
        dict: JSON response containing the real-time weather data or an error message.
    """
    return get_weather_forecast('real-time')

def fetch_and_store_weather(zipcode: str) -> dict:
    """
    Fetch and store weather data for the given ZIP code.

    Args:
        zipcode (str): The ZIP code to fetch the weather for.

    Returns:
        dict: A response containing the stored weather data or an error message.
    """
    params = {'location': zipcode, 'apikey': WEATHER_API_KEY}
    weather_data = fetch_weather_data("forecast", params)
    
    if not weather_data:
        return jsonify({"error": "Unable to fetch weather data for this location."}), 500

    # Save to the RealtimeWeather model
    weather = RealtimeWeather(
        time=datetime.utcnow(),
        location_name=f"ZIP {zipcode}",
        lat=None,
        lon=None,
        **weather_data
    )
    db.session.add(weather)
    db.session.commit()

    return jsonify(weather.serialize()), 200

def handleZipcode(zipcode: str) -> dict:
    """
    Fetch weather data for a specific ZIP code.

    Args:
        zipcode (str): The ZIP code to fetch weather data for.
        
    Returns:
        dict: Weather data or error message.
    """
    params = {'location': zipcode, 'apikey': WEATHER_API_KEY}
    weather_data = fetch_weather_data("forecast", params)

    if not weather_data:
        return jsonify({"error": "Unable to fetch weather data."}), 500

    # Format and return data
    formatted_forecast = [
        {
            "date": entry.get('time'),
            "temperatureHigh": entry['values'].get('temperatureMax'),
            "temperatureLow": entry['values'].get('temperatureMin'),
            "conditions": entry['values'].get('weatherCode')
        }
        for entry in weather_data.get('timelines', {}).get('daily', [])
    ]

    return jsonify({
        "message": "Weather data fetched successfully",
        "forecast": formatted_forecast
    }), 200


