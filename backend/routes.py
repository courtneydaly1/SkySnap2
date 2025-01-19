from app import app, db
from flask import jsonify, request
from flask_cors import cross_origin
import json
from services.weather_services import *
from services.post_services import create_post
from services.user_services import create_user, login_user
from models import Post, User, Media, WeeklyWeather, DailyWeather, RealtimeWeather, Token
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os
import uuid
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from app import app
import jwt
from werkzeug.security import generate_password_hash



# Define allowed image and video file types
app.config['UPLOADED_MEDIA_DEST'] = 'static/uploads'  # Directory to store uploaded files

# Configure upload settings
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit to 16 MB


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create a unique file name using uuid
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        return jsonify({"message": f"File {unique_filename} uploaded successfully!"}), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400


# Base Routes
@app.route('/', methods=['GET'])
def home():
    """Home route."""
    return "Welcome to SkySnap!"


@app.route('/test', methods=['GET'])
def test():
    """Test route to verify API is working."""
    return jsonify({"message": "It works!"})

# User Routes

# Generate a JWT token
def generate_token(user):
    """
    Generate a JWT token for the authenticated user.
    :param user: The user object or dictionary containing user data
    :return: A JWT token
    """
    try:
        # Create token with expiration time (default 15 minutes)
        access_token = create_access_token(identity=user['id'])
        return access_token

    except Exception as e:
        raise ValueError(f"Error generating token: {str(e)}")


@app.route('/auth/signup', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000")
def signup():
    """User Signup Endpoint."""
    if request.method == 'OPTIONS':
        return "", 204

    try:
        # Get the data from the request
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        # Check for required fields
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Missing required fields"}), 400

        # Create the user and add to DB
        hashed_password = generate_password_hash(data['password'])
        new_user = User(username=data['username'], 
                        first_name=data['first_name'], 
                        last_name=data['last_name'],
                        password=hashed_password,
                        local_zipcode=data['local_zipcode'])
        
        db.session.add(new_user)
        db.session.commit()

        # Generate JWT token for user
        token = generate_token({'username': new_user.username, 'id': new_user.id})

        # Save token to database
        new_token = Token(token=token, user_id=new_user.id)
        db.session.add(new_token)
        db.session.commit()

        return jsonify({
            "message": "User created successfully",
            "token": token,
            "user":{
                "userId": new_user.id,
                "username": new_user.username,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "local_zipcode": new_user.local_zipcode
        }}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/auth/login', methods=['POST'])
def login():
    """Log in an existing user."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        app.logger.info(f"Received data: {data}")
                         
        # Check if username and password are provided
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Missing required fields"}), 400

        # Call login_user to authenticate the user
        user = login_user(data)
        
        app.logger.info(f"User returned from login_user: {user}")

        # Handle errors from login_user
        if 'error' in user:
            app.logger.error(f"Login error: {user['error']}")
            return jsonify(user), 400

        # Ensure the user is a dictionary
        if not isinstance(user, dict):
            app.logger.error(f"Invalid data structure returned from login_user: {user}")
            return jsonify({"error": "Invalid user data returned from login_user"}), 500

        # Generate the token and respond
        token = user['access_token']
        app.logger.info(f"Generated token: {token}")
        
        return jsonify({
            "token": token,
            "username": user['username'],
            "first_name": user['first_name'],
            "last_name": user['last_name'],
            "userId": user['userId'],
            "local_zipcode": user.get('local_zipcode', '')  
        })
    except Exception as e:
        app.logger.error(f"An error occurred in the login route: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/auth/logout', methods=['POST'])
def logout():
    """Logout Endpoint - Revokes the active token."""
    try:
        token = request.headers.get('Authorization').split(' ')[1]  # Assuming it's a Bearer token
        token_entry = Token.query.filter_by(token=token).first()

        if token_entry:
            token_entry.revoked = True  # Mark the token as revoked
            db.session.commit()
            return jsonify({"message": "Logout successful, token revoked"}), 200
        else:
            return jsonify({"error": "Token not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/users/<username>', methods=['GET'])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    if user:
        user_data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'local_zipcode': user.local_zipcode
        }
        return jsonify(user_data)
    else:
        return jsonify({'message': 'User not found'}), 404



@app.route("/dashboard", methods=["GET"])
@jwt_required()
def show_dashboard():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": "User not found."}), 404

    zipcode = user.local_zipcode
    if not zipcode:
        return jsonify({"error": "User's ZIP code is not set"}), 400
    zip_code = request.args.get('zip_code')
    app.logger.info(f"Zip code from query: {zip_code}")

    # Fetch weather data and update the RealtimeWeather table
    try:
        weather_data = fetch_and_store_weather(zipcode)
    except Exception as e:
        weather_data = {"error": f"Failed to fetch weather data: {str(e)}"}

    # Fetch posts related to the user's ZIP code
    try:
        posts = Post.query.filter_by(location=zipcode).all()
        posts_data = [post.serialize() for post in posts]
    except Exception as e:
        posts_data = {"error": f"Unable to fetch posts: {str(e)}"}

    dashboard_data = {
        "user": {
            "username": user.username,
            "first_name": user.first_name,
            "local_zipcode": user.local_zipcode,
        },
        "weather_forecast": weather_data,
        "posts": posts_data,
    }

    return jsonify(dashboard_data), 200

############################## Post Routes

@app.route('/posts/create', methods=['POST'])
@jwt_required()  # Ensure the user is logged in
def create_new_post():
    """Create a new post with media upload."""
    try:
        # Get form data and file
        data = request.form  
        file = request.files.get('media') 
        
        # Validate required fields
        location = data.get('location')
        description = data.get('description')
        caption = data.get('caption')
        user_id = data.get('user_id') 
        
        if not location or not description or not caption:
            return jsonify({"error": "Missing required fields: location, description, caption."}), 400

        # Create the post object
        new_post = Post(
            location=location,
            description=description,
            caption=caption,
            user_id=user_id
        )

        # Handle file upload (media file)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            new_post.image_url = file_path  
        
        # Save the post to the database
        db.session.add(new_post)
        db.session.commit()

        return jsonify(new_post.serialize()), 201
    
    except SQLAlchemyError as e:
        db.session.rollback() 
        return jsonify({"error": "Database error: " + str(e)}), 500
    
    except Exception as e:
        app.logger.error(f"Error creating post: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/posts', methods=['GET'])
@jwt_required()  
def get_posts():
    """Retrieve posts with pagination (for infinite scrolling)."""
    try:
        # Get the logged-in user from the JWT token
        current_user = get_jwt_identity()
        app.logger.info(f"Authenticated user: {current_user}")
        
        user = User.query.filter_by(username=current_user).first()

        if not user:
            return jsonify({"error": "User not found."}), 404

        # Retrieve the zip code from the custom header
        zip_code = request.args.get('zip_code')
        if not zip_code:
            return jsonify({
                "error": "You must provide a zip code to view posts."
            }), 400
        app.logger.info(f"Retrieving Zipcode: {zip_code}")
        # If the user has a ZIP code, get the pagination params
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Validate pagination parameters
        if page <= 0 or per_page <= 0:
            return jsonify({"error": "Invalid pagination parameters."}), 400

        # Query posts for that ZIP code and paginate
        posts_query = Post.query.options(
            joinedload(Post.media),  # Eager load media related to each post
            joinedload(Post.realtime_weather)  # Eager load realtime_weather related to each post
        ).filter(Post.location == zip_code).paginate(page=page, per_page=per_page, error_out=False)

        if not posts_query.items:
            return jsonify({
                "message": "No posts yet.",
                "create_post_button": {
                    "text": "Create a Post",
                    "url": "/posts/create"
                }
            }), 200

        # Prepare the posts data (include media if any)
        posts_data = []
        for post in posts_query.items:
            post_data = post.serialize()
            if post.media:
                post_data["media"] = [media.serialize() for media in post.media] 
            posts_data.append(post_data)

        return jsonify(posts_data)

    except Exception as e:
        app.logger.error(f"Error retrieving posts: {str(e)}")
        return jsonify({"error": str(e)}), 500



#################### Weather Forecast Routes
@app.route('/forecast', methods=['GET'])
def forecast():
    """Retrieve daily weather forecast."""
    try:
        return jsonify(get_daily_forecast())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/current', methods=['GET'])
def current_forecast():
    """Retrieve current weather forecast."""
    try:
        return jsonify(get_current_forecast())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/realtime', methods=['GET'])
def real_time_forecast():
    """Retrieve real-time weather forecast."""
    try:
        return jsonify(get_realtime())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/realtime2', methods=['GET'])
def real_time_forecast2():
    """Retrieve alternative real-time weather forecast."""
    try:
        return jsonify(get_realtime_forecast())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/weather', methods=['GET'])
@jwt_required()
def get_user_forecast():
    """
    Fetch and return the 1-day forecast for the logged-in user's local ZIP code.
    """
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": "User not found."}), 404

    zipcode = user.local_zipcode
    if not zipcode or len(zipcode) != 5:
        return jsonify({"error": "Invalid or missing ZIP code for the user."}), 400

    params = {
        'location': zipcode,
        'timesteps': '1d',
        'units': 'imperial',
        'apikey': WEATHER_API_KEY
    }

    try:
        data = fetch_weather_data("forecast", params)
        forecast_entries = data['timelines']['daily']

        formatted_forecast = [
            {
                "date": entry.get('time'),
                "temperatureHigh": entry['values'].get('temperatureMax'),
                "temperatureLow": entry['values'].get('temperatureMin'),
                "temperatureApparent": entry['values'].get('temperatureApparentAvg'),
                "humidity": entry['values'].get('humidityAvg'),
                "precipitation": entry['values'].get('precipitationProbabilityAvg'),
                "sunrise": entry['values'].get('sunriseTime'),
                "sunset": entry['values'].get('sunsetTime'),
                "uvIndex": entry['values'].get('uvIndexAvg'),
                "visibility": entry['values'].get('visibilityAvg'),
                "windSpeed": entry['values'].get('windSpeedAvg'),
                "cloudBase": entry['values'].get('cloudBaseAvg'),
            }
            for entry in forecast_entries
        ]

        return jsonify({
            "forecast": formatted_forecast
        })
    except KeyError as e:
        return jsonify({"error": f"Missing data from weather API: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to fetch weather data: {str(e)}"}), 500



@app.route('/weather/:zipcode', methods=['GET'])
def get_forecast_by_zipcode():
    """
    Retrieve weather data for a specific ZIP code.
    """
    data = request.json
    zipcode = data.get('zipcode')

    if not zipcode:
        return jsonify({"error": "Missing ZIP code"}), 400

    try:
        weather_data = handleZipcode(zipcode)
        return (
            weather_data if isinstance(weather_data, Response) else jsonify(weather_data)
        )
    except Exception as e:
        return jsonify({"error": f"Failed to fetch weather data: {str(e)}"}), 500


@app.route("/api/weather/<zipcode>", methods=["GET"])
def get_weather(zipcode):
    # Fetch weather data from an external API
    url = f"https://api.tomorrow.io/v4/weather/forecast?location={zipcode}&apikey={TOMORROW_IO_API_KEY}"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Unable to fetch weather data"}), 500

    weather_data = response.json()

    # Fetch posts related to the zipcode (example)
    posts = get_posts_for_zipcode(zipcode)

    return jsonify({
        "weather": weather_data,
        "posts": posts
    })

def get_posts_for_zipcode(zipcode):
    # Example: Retrieve posts for this zipcode from the database
    # For now, returning mock data
    return [
        {"id": 1, "content": "Weather is looking good today!", "zipcode": zipcode},
        {"id": 2, "content": "Hope the storm passes soon.", "zipcode": zipcode}
    ]