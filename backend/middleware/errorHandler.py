from flask import jsonify

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Handle 400 Bad Request error
def handle_bad_request(e):
    return jsonify({"error": "Invalid input"}), 400

# Handle 401 Unauthorized error
def handle_unauthorized(e):
    return jsonify({"error": "Unauthorized access"}), 401

# Handle 403 Forbidden error
def handle_forbidden(e):
    return jsonify({"error": "Forbidden"}), 403

# Handle 500 Internal Server Error
def handle_internal_error(e):
    return jsonify({"error": "An unexpected error occurred"}), 500

# Generic handler for any other unhandled HTTPException
def handle_generic_exception(e):
    response = e.get_response()
    response.data = jsonify({
        "error": e.description,
        "code": e.code,
        "message": "Something went wrong."
    }).data
    return response, e.code

