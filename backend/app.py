from flask import Flask, request, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize Flask app
app = Flask(__name__, static_folder='static', static_url_path='/static')

# Enable CORS for frontend (localhost:3000)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Authorization", "Content-Type"]}})

@app.route('/uploads/<filename>')
def serve_uploads(filename):
    return send_from_directory(os.path.join(app.root_path, 'static', 'uploads'), filename)

# Enable CORS for static files
@app.after_request
def apply_cors(response):
    if 'static' in request.path:
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'GET'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    return response

# Load config from 'config' object
app.config.from_object('config.DevelopmentConfig')
app.config["JWT_TOKEN_LOCATION"] = ["headers"]  # or ["cookies"], ["query_string"], etc.

# Initialize with app
jwt = JWTManager(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Import models after initializing db
from models import *

@app.route('/posts', methods=['OPTIONS'])
def handle_options():
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    return response

# Main entry point for app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Make sure your DB is set up
        app.run(debug=True)

# Import routes after app initialization
import routes



    



