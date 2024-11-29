from flask import jsonify
from werkzeug.exceptions import HTTPException

# Handle 404 Not Found error
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

# Handle 500 Internal Server Error
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Handle 400 Bad Request error
@app.errorhandler(400)
def handle_bad_request(e):
    return jsonify({"error": "Invalid input"}), 400

# Handle 401 Unauthorized error
@app.errorhandler(401)
def handle_unauthorized(e):
    return jsonify({"error": "Unauthorized access"}), 401

# Handle 403 Forbidden error
@app.errorhandler(403)
def handle_forbidden(e):
    return jsonify({"error": "Forbidden"}), 403

# Handle 500 Internal Server Error (catch-all for server-side issues)
@app.errorhandler(500)
def handle_internal_error(e):
    return jsonify({"error": "An unexpected error occurred"}), 500

# Generic handler for any other unhandled HTTPException
@app.errorhandler(HTTPException)
def handle_generic_exception(e):
    response = e.get_response()
    response.data = jsonify({
        "error": e.description,
        "code": e.code,
        "message": "Something went wrong."
    }).data
    return response, e.code


