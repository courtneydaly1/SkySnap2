from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))  
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')
    GEOCODING_API_KEY = os.environ.get('GEOCODING_API_KEY')

    @classmethod
    def validate_config(cls):
        """Ensure that all required environment variables are set."""
        required_keys = ['DATABASE_URL', 'SECRET_KEY', 'WEATHER_API_KEY', 'GEOCODING_API_KEY']
        for key in required_keys:
            if not os.environ.get(key):
                raise ValueError(f"Missing required environment variable: {key}")

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOGGING_LEVEL = "DEBUG" 

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True 
    REMEMBER_COOKIE_SECURE = True 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
