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
from models import Post, User, Media, WeeklyWeather, DailyWeather, RealtimeWeather
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity



# Base Routes
@app.route('/', methods=['GET'])
def home():
    """Home route."""
    return  "Welcome to SkySnap!"


@app.route('/test', methods=['GET'])
def test():
    """Test route to verify API is working."""
    return jsonify({"message": "It works!"})


@app.route("/dashboard", methods=["GET"])
@jwt_required()
def show_dashboard():
    """
    Dashboard endpoint for user data.
    Returns dummy user data or an error if no token is provided.
    """
      # Get the current user's identity from the JWT
    # current_user_id = get_jwt_identity()
    username = get_jwt_identity()

    # Fetch user data from the database based on user_id
    # user_data = User.query.filter_by(id=current_user_id).first()
    user = User.query.filter_by(username=username).first()

    if user:
        return {"username": user.username, "first_name": user.first_name, "local_zipcode": user.local_zipcode}
    else:
        return {"error": "User not found."}, 404
    if not user_data:
        return {"error": "User not found"}, 404

    # Serialize the user data (modify as needed based on your model)
    serialized_data = {
        "id": user_data.id,
        "username": user_data.username,
        # "email": user_data.email
        # Add other user attributes as necessary
    }

    return jsonify(serialized_data), 200

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
@cross_origin(origins="http://localhost:3000")
def signup():
    """User Signup Endpoint."""
    
    if request.method == 'OPTIONS':
        return "", 204

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

    return {"success": True, "message": "User created successfully"}



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


