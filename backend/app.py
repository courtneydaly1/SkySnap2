from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
import requests
from weather_api import get_weather_history

load_dotenv()

app = Flask(__name__)

app.config.from_object('config.DevelopmentConfig')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sky_snap_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate

# Import models after initializing db
from models import User, Post, Media, WeeklyWeather, DailyWeather

# API for Tomorrow.io
WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')
BASE_URL = "https://api.tomorrow.io/v4/"
GEOCODING_API_KEY= os.environ.get('GEOCODING_API_KEY')


@app.route('/')
def home():
    return "Hello, SkySnap! Welcome to weather with friends."

@app.route('/weather/history/<location>', methods=['GET'])
def weather_history(location):
    api_key = WEATHER_API_KEY
    weather_data = get_weather_history(location, api_key)
     
     for data in weather_data['data']:
        new_entry = WeatherHistory(
            location=location,
            date=datetime.fromisoformat(data['date']),  
            temperature=data['temperature'],
            temperatureApparent=data['temperatureApparent'],
            precipitationProbability = data['precipitationProbability'],
            humidity=data['humidity'],
            cloudCover= data["cloudCover"],
            uvIndex= data["uvIndex"],
            windSpeed= data["windSpeed"],
            weather_description=data['weather']['description'] 
            
        db.session.add(new_entry)  
        db.session.commit()  
        
    return jsonify({"message": "Weather data saved successfully!"}, weather_data), 201


if __name__ == '__main__':
     with app.app_context():
        db.create_all() 
    app.run(debug=True)
    



