from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager


# Initialize Flask app
app = Flask(__name__)


# Enable CORS for frontend (localhost:3000)
CORS(app, resources={r"/*": {"origins": "*"}})


# Load config from 'config' object
app.config.from_object('config.DevelopmentConfig')
app.config["JWT_TOKEN_LOCATION"] = ["headers"]  # or ["cookies"], ["query_string"], etc.

# Initialize with app
jwt = JWTManager(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Import models after initializing db
from models import *

# Add additional security headers (e.g., Content Security Policy)
@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = "script-src 'self'"  
    return response
    app.logger.info('This is info output')
with app.app_context():
    db.create_all()  # Make sure your DB is set up
   

# Main entry point for app
if __name__ == '__main__':
    with app.app_context():
        # db.create_all()  # Make sure your DB is set up
        # app.logger.info('This is info output')
        app.run(debug=True)

# Import routes after app initialization
import routes



    



