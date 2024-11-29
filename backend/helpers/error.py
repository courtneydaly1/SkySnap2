from flask import jsonify

def error_response(message, status_code):
    """
    Return a JSON response for an error.

    Args:
        message (str): The error message to include in the response.
        status_code (int): The HTTP status code for the response.

    Returns:
        Response: A Flask Response object with the error message and status code.
    """
    response = jsonify({'error': message})
    response.status_code = status_code
    return response
