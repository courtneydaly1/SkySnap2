from flask_cors import CORS

CORS(app, resources={r"/*": {
    "origins": allowed_origins,
    "methods": ["GET", "POST", "OPTIONS"],  # Allow specific methods
    "allow_headers": ["Content-Type", "Authorization"]  # Allow specific headers
}})
