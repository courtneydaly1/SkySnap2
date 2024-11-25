from app import app, db
from flask import Flask, request, jsonify
import json
from services.weather_services import (
    get_realtime_forecast,
    get_realtime,
    get_daily_forecast,
    get_current_forecast,
)
from services.post_services import create_post
from services.user_services import create_user, login_user

# Base Routes
@app.route('/', methods=['GET'])
def home():
    """Home route."""
    return "Welcome to SkySnap!"


@app.route('/test', methods=['GET'])
def test():
    """Test route to verify API is working."""
    return "It works!"


# Weather Forecast Routes
@app.route('/forecast', methods=['GET'])
def forecast():
    """Retrieve daily weather forecast."""
    return get_daily_forecast()


@app.route('/forecast/current', methods=['GET'])
def current_forecast():
    """Retrieve current weather forecast."""
    return get_current_forecast()


@app.route('/forecast/realtime', methods=['GET'])
def real_time_forecast():
    """Retrieve real-time weather forecast."""
    return get_realtime()


@app.route('/forecast/realtime2', methods=['GET'])
def real_time_forecast2():
    """Retrieve alternative real-time weather forecast."""
    return get_realtime_forecast()


# User Routes
@app.route('/signup', methods=['POST'])
def create_new_user():
    """
    Create a new user.

    Expects a JSON payload with user details.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        return create_user(data=data)
    except json.JSONDecodeError:
        return jsonify({"error": "Malformed JSON"}), 400


@app.route('/login', methods=['POST'])
def login():
    """
    Log in an existing user.

    Expects a JSON payload with login credentials.
    """
    data = request.get_json()
    return login_user(data=data)


# Post Routes
@app.route('/posts', methods=['GET'])
def get_posts():
    """Retrieve all posts."""
    posts = Post.query.all()
    return jsonify([post.serialize() for post in posts])


@app.route('/posts/create', methods=['POST'])
def create_new_post():
    """Create a new post."""
    return create_post()

