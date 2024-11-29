from flask import request, jsonify
import jwt
import os
from functools import wraps

# Decorator to require authentication
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Define routes that don't require authentication
        if request.endpoint in ['home', 'login', 'signup']:
            return f(*args, **kwargs)  # Skip authentication for public routes

        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Ensure token format is 'Bearer <token>'
            if token.startswith("Bearer "):
                token = token[7:]  # Remove "Bearer " from the token

            # Decode the token
            decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            request.user_id = decoded_token['identity']  
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(*args, **kwargs)

    return decorated_function

# Apply the token_required decorator to any protected route
@app.route('/protected', methods=['GET'])
@token_required
def protected_route():
    return jsonify({'message': f'Hello user {request.user_id}, you have access to this route!'}), 200

