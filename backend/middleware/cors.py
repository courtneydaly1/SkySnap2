from flask_cors import CORS

CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (you can restrict this to specific origins)
