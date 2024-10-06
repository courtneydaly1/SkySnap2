from flask import jsonify

def error_response(message, status_code):
    """Return a JSON response for an error."""
    response = jsonify({'error': message})
    response.status_code = status_code
    return response
