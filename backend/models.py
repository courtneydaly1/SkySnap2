from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import app, db

class User(db.Model):
    __tablename__ = "user"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    first_name = db.Column(db.String(40), nullable=False)
    last_name = db.Column(db.String(40), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    local_zipcode = db.Column(db.String(10), nullable=False)
    posts = db.relationship('Post', backref='user', lazy=True)

class Post(db.Model):
    __tablename__ = "post"
    
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    image_url = db.Column(db.String(200))
    caption = db.Column(db.String(300))
    realtime_weather_id = db.Column(db.Integer, db.ForeignKey('realtime_weather.id'))
    
    media = db.relationship('Media', backref='post', lazy=True)
    
    def __repr__(self):
        return f"<Post {self.id}>"
    
    def serialize(self):
        return {
            'id': self.id,
            'location': self.location,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id,
            'image_url': self.image_url,
            'caption': self.caption,
            'realtime_weather': {
                'id': self.realtime_weather.id,
                'temperature': self.realtime_weather.temperature,
            } if self.realtime_weather else None,
        }

class Media(db.Model):
    __tablename__ = "media"
    
    id = db.Column(db.Integer, primary_key=True)
    media_url = db.Column(db.String(255), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

class WeeklyWeather(db.Model):
    __tablename__ = "weekly_weather"
    
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100))  # e.g., City or lat/lon
    week_start_date = db.Column(db.Date)  # Start of the week (Monday)
    forecast = db.relationship('DailyWeather', backref='weekly_weather', lazy=True)

    def __repr__(self):
        return f"<WeeklyWeather {self.week_start_date} - {self.location}>"

class DailyWeather(db.Model):
    __tablename__ = "daily_weather"
    
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime, nullable=False)
    location_name = db.Column(db.String(100), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float)
    temperatureApparent = db.Column(db.Float)
    precipitationProbability = db.Column(db.Float)
    humidity = db.Column(db.Float)
    cloudCover = db.Column(db.Float)
    uvIndex = db.Column(db.Float)
    windSpeed = db.Column(db.Float)
    weekly_weather_id = db.Column(db.Integer, db.ForeignKey('weekly_weather.id'))

    def __repr__(self):
        return f"<DailyWeather {self.time}>"

class RealtimeWeather(db.Model):
    __tablename__ = 'realtime_weather'
    
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime, nullable=False)
    location_name = db.Column(db.String(100), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    cloudBase = db.Column(db.Float)
    cloudCeiling = db.Column(db.Float)
    cloudCover = db.Column(db.Float)
    dewPoint = db.Column(db.Float)
    humidity = db.Column(db.Float)
    precipitationProbability = db.Column(db.Float)
    pressureSurfaceLevel = db.Column(db.Float)
    temperature = db.Column(db.Float)
    windSpeed = db.Column(db.Float)
    windDirection = db.Column(db.Float)
    uvIndex = db.Column(db.Float)
    weatherCode = db.Column(db.Integer)
    visibility = db.Column(db.Float)
    posts = db.relationship('Post', backref='realtime_weather')

    def __repr__(self):
        return f"<RealtimeWeather {self.location_name} at {self.time}>"


