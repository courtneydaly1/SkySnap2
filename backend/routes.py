from app import app, db
from flask import jsonify, request
from flask_cors import cross_origin
import json
from services.weather_services import (
    fetch_weather_data,
    save_weather_data,
    get_realtime_forecast,
    get_daily_forecast,
    get_weather_history,
)
from services.post_services import create_post
from services.user_services import create_user, login_user
from models import Post


# Base Routes
@app.route('/', methods=['GET'])
def home():
    """Home route."""
    return jsonify({"message": "Welcome to SkySnap!"})


@app.route('/test', methods=['GET'])
def test():
    """Test route to verify API is working."""
    return jsonify({"message": "It works!"})


# Weather Forecast Routes
@app.route('/forecast', methods=['GET'])
def forecast():
    """Retrieve daily weather forecast."""
    try:
        return jsonify(get_daily_forecast())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/forecast/current', methods=['GET'])
def current_forecast():
    """Retrieve current weather forecast."""
    try:
        return jsonify(get_current_forecast())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/forecast/realtime', methods=['GET'])
def real_time_forecast():
    """Retrieve real-time weather forecast."""
    try:
        return jsonify(get_realtime())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/forecast/realtime2', methods=['GET'])
def real_time_forecast2():
    """Retrieve alternative real-time weather forecast."""
    try:
        return jsonify(get_realtime_forecast())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# User Routes
@app.route('/auth/signup', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:5000")
def signup():
    """User Signup Endpoint."""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        # You can also validate the presence of required fields
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Missing required fields"}), 400

        response = create_user(data=data)
        return jsonify(response), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/auth/login', methods=['POST'])
def login():
    """Log in an existing user."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        # You can also validate the presence of required fields
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Missing required fields"}), 400
        
        return jsonify(login_user(data=data)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Post Routes
@app.route('/posts', methods=['GET'])
def get_posts():
    """Retrieve all posts."""
    try:
        posts = Post.query.all()
        return jsonify([post.serialize() for post in posts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/posts/create', methods=['POST'])
def create_new_post():
    """Create a new post."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        # Validate required fields
        if not data.get("location") or not data.get("user_id"):
            return jsonify({"error": "Missing required fields"}), 400
        
        post = create_post(data=data)
        return jsonify(post), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


