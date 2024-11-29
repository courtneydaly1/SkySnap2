from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend (localhost:3000)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load config from 'config' object
app.config.from_object('config.DevelopmentConfig')

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Import models after initializing db
from models import *

# Add additional security headers (e.g., Content Security Policy)
@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = "script-src 'self'"  # Fine-tune for your app
    return response

# Main entry point for app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Make sure your DB is set up
        app.run(debug=True)

# Import routes after app initialization
import routes



    



