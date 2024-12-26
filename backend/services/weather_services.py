from app import app, db
import requests
from models import RealtimeWeather, DailyWeather, User
from flask import jsonify
import logging


WEATHER_API_KEY = app.config['WEATHER_API_KEY']
BASE_URL = "https://api.tomorrow.io/v4/weather/"

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
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching data from {endpoint}: {e}")
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
        raise ValueError("User not found.")
    if not user.local_zipcode or len(user.local_zipcode) != 5:
        raise ValueError("Invalid or missing ZIP code in user profile.")

    return user.local_zipcode


def get_daily_forecast() -> dict:
    """
    Fetch and save the daily weather forecast for the user's location.
    
    Returns:
        dict or None: The API response data or None if there was an error.
    """
    try:
        zipcode = get_user_zipcode()
    except ValueError as e:
        logging.error(e)
        return jsonify({"error": str(e)}), 400

    params = {'location': zipcode, 'timestep': '1d', 'apikey': WEATHER_API_KEY}
    data = fetch_weather_data("forecast", params)

    if not data or 'timelines' not in data or 'daily' not in data['timelines']:
        logging.error("Error: 'daily' not found in API response")
        return None

    forecast_entries = data['timelines']['daily']
    location_data = {"name": f"ZIP {zipcode}", "lat": None, "lon": None}
    save_weather_data(forecast_entries, DailyWeather, location_data, "daily")
    return data


def get_realtime_forecast() -> dict:
    """
    Fetch and save real-time weather forecast data for the user's location.

    Returns:
        dict or None: The API response data or None if there was an error.
    """
    try:
        zipcode = get_user_zipcode()
    except ValueError as e:
        logging.error(e)
        return jsonify({"error": str(e)}), 400

    params = {'location': zipcode, 'timestep': '1h', 'apikey': WEATHER_API_KEY}
    data = fetch_weather_data("forecast", params)

    if not data or 'timelines' not in data or 'minutely' not in data['timelines']:
        logging.error("Error: 'minutely' not found in API response")
        return None

    forecast_entries = data['timelines']['minutely']
    location_data = {"name": f"ZIP {zipcode}", "lat": None, "lon": None}
    save_weather_data(forecast_entries, RealtimeWeather, location_data, "real-time")
    return data


def handle_user_zipcode_forecast() -> dict:
    """
    Fetch the 5-day weather forecast for the logged-in user's ZIP code.

    Returns:
        dict: JSON response containing the 5-day weather forecast or an error message.
    """
    try:
        zipcode = get_user_zipcode()
    except ValueError as e:
        logging.error(e)
        return jsonify({"error": str(e)}), 400

    params = {
        'location': zipcode,
        'timestep': '1d',
        'apikey': WEATHER_API_KEY
    }

    weather_data = fetch_weather_data("forecast", params)

    if not weather_data or 'timelines' not in weather_data or 'daily' not in weather_data['timelines']:
        return jsonify({"error": "Unable to fetch the weather forecast. Please try again later."}), 500

    forecast_entries = weather_data['timelines']['daily']
    location_data = {"name": f"ZIP {zipcode}", "lat": None, "lon": None}

    try:
        save_weather_data(forecast_entries, DailyWeather, location_data, "daily")
    except Exception as e:
        logging.error(f"Error saving forecast data: {e}")
        return jsonify({"error": "An error occurred while saving the forecast data."}), 500

    formatted_forecast = [
        {
            "date": entry.get('time'),
            "temperatureHigh": entry['values'].get('temperatureMax'),
            "temperatureLow": entry['values'].get('temperatureMin'),
            "conditions": entry['values'].get('weatherCode')
        }
        for entry in forecast_entries
    ]

    return jsonify({
        "message": "5-day weather forecast fetched successfully.",
        "location": f"ZIP {zipcode}",
        "forecast": formatted_forecast
    }), 200


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


def handleZipcode(zipcode):
    try:
        # Fetch weather data using existing service functions
        forecast = fetch_weather_data(zipcode)
        # Convert to JSON-like dictionary
        return {
            "forecast": forecast,
            "message": f"Weather data for {zipcode}",
        }
    except Exception as e:
        return {"error": f"Unable to fetch weather data: {str(e)}"}


def handle_user_zipcode():
    """
    Fetch the 5-day weather forecast using the logged-in user's ZIP code.

    Returns:
        dict: JSON response containing the 5-day weather forecast or an error message.
    """
    # Retrieve the current user
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": "User not found."}), 404

    if not user.local_zipcode or len(user.local_zipcode) != 5:
        return jsonify({"error": "User's ZIP code is not set or invalid."}), 400

    zipcode = user.local_zipcode

    # Parameters for the API call
    params = {
        'location': zipcode,
        'timestep': '1d',
        'apikey': WEATHER_API_KEY
    }

    # Fetch weather data
    weather_data = fetch_weather_data("forecast", params)

    if not weather_data or 'timelines' not in weather_data or 'daily' not in weather_data['timelines']:
        return jsonify({"error": "Unable to fetch the weather forecast. Please try again later."}), 500

    forecast_entries = weather_data['timelines']['daily']
    location_data = weather_data.get('location', {})

    # Save weather data to the database
    try:
        save_weather_data(forecast_entries, DailyWeather, location_data, "daily")
    except Exception as e:
        logging.error(f"Error saving forecast data: {e}")
        return jsonify({"error": "An error occurred while saving the forecast data."}), 500

    # Format the forecast for a user-friendly response
    formatted_forecast = []
    for entry in forecast_entries:
        formatted_forecast.append({
            "date": entry.get('time'),
            "temperatureHigh": entry['values'].get('temperatureMax'),
            "temperatureLow": entry['values'].get('temperatureMin'),
            "conditions": entry['values'].get('weatherCode')
        })

    return jsonify({
        "message": "5-day weather forecast fetched successfully.",
        "location": location_data.get('name', f"ZIP {zipcode}"),
        "forecast": formatted_forecast
    }), 200

def fetch_and_store_weather(zipcode):
    response = handleZipcode(zipcode)  
    weather_data = response.json() if isinstance(response, Response) else response

    if "error" in weather_data:
        raise ValueError(weather_data["error"])

    # Save to the RealtimeWeather model
    weather = RealtimeWeather(
        time=datetime.utcnow(),
        location_name=weather_data["location_name"],
        lat=weather_data["lat"],
        lon=weather_data["lon"],
        cloudBase=weather_data.get("cloudBase"),
        cloudCeiling=weather_data.get("cloudCeiling"),
        cloudCover=weather_data.get("cloudCover"),
        dewPoint=weather_data.get("dewPoint"),
        humidity=weather_data.get("humidity"),
        precipitationProbability=weather_data.get("precipitationProbability"),
        pressureSurfaceLevel=weather_data.get("pressureSurfaceLevel"),
        temperature=weather_data.get("temperature"),
        windSpeed=weather_data.get("windSpeed"),
        windDirection=weather_data.get("windDirection"),
        uvIndex=weather_data.get("uvIndex"),
        weatherCode=weather_data.get("weatherCode"),
        visibility=weather_data.get("visibility"),
    )
    db.session.add(weather)
    db.session.commit()

    return weather.serialize()
