from flask import request, jsonify
import jwt
import os

@app.before_request
def check_authentication():
    # Define routes that don't require authentication
    if request.endpoint in ['home', 'login', 'signup']:
        return  # Skip authentication for public routes

    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing!'}), 403

    try:
        jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 403
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 403
