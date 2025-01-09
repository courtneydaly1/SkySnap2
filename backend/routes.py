from app import app, db
from flask import jsonify, request, Flask
from flask_cors import cross_origin
import json
from services.weather_services import *
# from services.post_services import create_post
from services.user_services import create_user, login_user
from models import Post, User, Media, WeeklyWeather, DailyWeather, RealtimeWeather
from flask_jwt_extended import JWTManager,create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os 
from sqlalchemy.exc import SQLAlchemyError


# Define allowed image and video file types
app.config['UPLOADED_MEDIA_DEST'] = 'static/uploads'  # Directory to store uploaded files

# Configure upload settings
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    return  "Welcome to SkySnap!"


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
        # Generate the access token (with optional expiration)
        access_token = create_access_token(
            identity=user['username'],
            additional_claims={"user_id": user['id']},   
            expires_delta=timedelta(days=1) 
        )
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
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Missing required fields"}), 400

        # Create the user and generate the token
        response, status_code = create_user(data)
        if 'error' in response:
            return jsonify(response), status_code
        
         # Extract the user and message from the response
        message = response.get('message')
        user = response.get('user')
        
       
        # Generate the JWT token
        token = generate_token(response['user'])
        

        # Return the token and user data in the response
        return jsonify({
            "message": message,
            "token": token,
            "userId": response['user']['id'],
            "username": response['user']['username'],
            "first_name": response['user']['first_name'],
            "last_name": response['user']['last_name'],
            "local_zipcode": response['user']['local_zipcode']
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    """Log in an existing user."""
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate user credentials (e.g., check password, etc.)
        user = login_user(data)
        if 'error' in user:
            return jsonify(user), 400

        token = generate_token(user)  
        return jsonify({
            "token": token,
            "userId": user['id']
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

# @app.route('/posts', methods=['GET'])
# @jwt_required()  # Ensure the user is logged in
# def get_posts():
#     """Retrieve posts with pagination (for infinite scrolling)."""
#     try:
#         # Get the logged-in user from the JWT token
#         current_user = get_jwt_identity()
#         user = User.query.filter_by(username=current_user).first()

#         if not user:
#             return jsonify({"error": "User not found."}), 404

#         # Check if the user has a ZIP code
#         zip_code = user.local_zipcode
#         if not zip_code:
#             return jsonify({
#                 "error": "You must set a ZIP code to view posts.",
#                 "set_zip_button": {
#                     "text": "Set Your ZIP Code",
#                     "url": "/auth/signup"  # URL to sign up and get zipcode
#                 }
#             }), 400

#         # If the user has a ZIP code, get the pagination params
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)

#         # Query posts for that ZIP code and paginate
#         posts_query = Post.query.filter(Post.location == zip_code).paginate(page, per_page, False)

#         if not posts_query.items:
#             return jsonify({
#                 "message": "No posts yet.",
#                 "create_post_button": {
#                     "text": "Create a Post",
#                     "url": "/posts/create"
#                 }
#             }), 404

#         # Prepare the posts data (include media if any)
#         posts_data = []
#         for post in posts_query.items:
#             post_data = post.serialize()
#             post_data["media"] = [media.serialize() for media in post.media]  # Including media data
#             posts_data.append(post_data)

#         return jsonify(posts_data)

#     except Exception as e:
#         app.logger.error(f"Error retrieving posts: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/posts/create', methods=['POST'])
# def create_new_post():
#     """Create a new post."""
#     try:
#         # Get JSON data from the request
#         data = request.get_json()

#         # Validate JSON payload
#         if not data:
#             return jsonify({"error": "Invalid JSON payload"}), 400

#         # Validate required fields
#         if not data.get("location") or not data.get("user_id"):
#             return jsonify({"error": "Missing required fields: location, user_id"}), 400

#         # Optionally, validate other fields like 'content'
#         if not data.get("content"):
#             return jsonify({"error": "Missing required field: content"}), 400

#         # Call the helper function to create the post
#         post = create_post(data)

#         # Return the created post with a 201 status code
#         return jsonify(post.serialize()), 201
#     except Exception as e:
#         app.logger.error(f"Error creating post: {str(e)}")
#         return jsonify({"error": str(e)}), 500


# def create_post(data):
#     """Helper function to create a new post."""
#     try:
#         app.logger.info(f"Creating post with data: {data}") 
#         post = Post(
#             location=data.get("location"),
#             description=data.get("description"),
#             user_id=data.get("user_id"),
#             image_url=data.get("image_url", ""), 
#             caption=data.get("caption"),      
#             realtime_weather_id=data.get("realtime_weather_id") 
#         )
#         db.session.add(post)
#         db.session.commit()
        
#         # Optionally handle media attachments if provided
#         if data.get("media"):
#             for media_data in data["media"]:
#                 media = Media(
#                     media_url=media_data["media_url"],
#                     post_id=post.id
#                 )
#                 db.session.add(media)
        
#         return post
#     except Exception as e:
#         db.session.rollback()  
#         app.logger.error(f"Error in create_post: {str(e)}. Data: {data}")  
#         raise  # Re-raise the exception after logging it

@app.route('/posts/create', methods=['POST'])
@jwt_required()  # Ensure the user is logged in
def create_new_post():
    """Create a new post with media upload."""
    try:
        # Get form data and file
        data = request.form  # Get form data (text fields)
        file = request.files.get('media')  # Get file data (if any)
        
        # Validate required fields
        location = data.get('location')
        description = data.get('description')
        caption = data.get('caption')
        user_id = get_jwt_identity()
        
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
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        app.logger.error(f"Error creating post: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/posts', methods=['GET'])
@jwt_required()  # Ensure the user is logged in
def get_posts():
    """Retrieve posts with pagination (for infinite scrolling)."""
    try:
        # Get the logged-in user from the JWT token
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            return jsonify({"error": "User not found."}), 404

        # Check if the user has a ZIP code
        zip_code = request.args.get('zip_code')  # Get the zip_code from query string

        if not zip_code:
            return jsonify({
                "error": "You must provide a zip code to view posts."
            }), 400

        # If the user has a ZIP code, get the pagination params
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        # Query posts for that ZIP code and paginate
        posts_query = Post.query.filter(Post.location == zip_code).paginate(page=page, per_page=per_page, error_out=False)

        if not posts_query.items:
            return jsonify({
                "message": "No posts yet.",
                "create_post_button": {
                    "text": "Create a Post",
                    "url": "/posts/create"
                }
            }), 404

        # Prepare the posts data (include media if any)
        posts_data = []
        for post in posts_query.items:
            post_data = post.serialize()
            post_data["media"] = [media.serialize() for media in post.media]  # Including media data
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

