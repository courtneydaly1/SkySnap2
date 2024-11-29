import logging
from flask import request, jsonify
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set the logging level
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Log to console
        logging.FileHandler("app.log")  # Log to a file
    ]
)

@app.before_request
def log_request():
    logging.info(f"Request: {request.method} {request.path}")
    logging.info(f"Headers: {request.headers}")
    
    # Only log body for non-login requests or small bodies
    if request.path != '/login' and len(request.get_data()) < 1000:
        logging.info(f"Body: {request.get_data()}")

@app.after_request
def log_response(response):
    logging.info(f"Response Status: {response.status}")
    if len(response.get_data()) < 1000:
        logging.info(f"Response Body: {response.get_data()}")
    return response
