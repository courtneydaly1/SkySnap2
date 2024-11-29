from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for frontend

# Load config from 'config' object
app.config.from_object('config.DevelopmentConfig')

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Import models after initializing db
from models import *

# Handle OPTIONS requests for preflight checks
@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = make_response('', 204)  
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

# Add additional security headers
@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = "script-src 'self'"  # Fine-tune for your app
    return response

# Main entry point for app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
        app.run(debug=True)  

# Import routes after app initialization
import routes



    



