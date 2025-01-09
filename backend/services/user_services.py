from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from models import User
from flask_jwt_extended import create_access_token
from datetime import timedelta
import re  # For additional validation

from flask import jsonify

def create_user(data):
    try:
        # Ensure data is a dictionary
        if not isinstance(data, dict):
            return jsonify({"error": "Invalid data format. Expected a dictionary."}), 400

        # Debugging: Print the received data
        print("Data received:", data)

        # Extract required fields from the data
        username = data.get('username')
        first_name = data.get('first_name')  
        last_name = data.get('last_name')    
        local_zipcode = data.get('localZipcode')  
        password = data.get('password')

        # Validate input fields
        if not username:
            return jsonify({"error": "Username is required."}), 400
        if not first_name:
            return jsonify({"error": "First name is required."}), 400
        if not last_name:
            return jsonify({"error": "Last name is required."}), 400
        if not password:
            return jsonify({"error": "Password is required."}), 400

        # Check if the username is already taken
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists."}), 409

        # Hash the password
        hashed_password = generate_password_hash(password, method='scrypt')

        # Create a new user instance
        new_user = User(
            username=username,
            first_name=first_name,
            last_name=last_name,
            local_zipcode=local_zipcode,
            password=hashed_password
        )

        # Save the user to the database
        db.session.add(new_user)
        db.session.commit()

        # Debugging: Check if user was successfully created
        print(f"User created: {new_user.username} (ID: {new_user.id})")

        # Return success response using jsonify to make it a proper response
        return {
            "message": "User created successfully!",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "local_zipcode": new_user.local_zipcode
            }
        }, 201

    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {str(e)}")  
        return {"error": "An error occurred during signup.", "details": str(e)}, 500


def login_user(data):
    """
    Authenticate a user and return a JWT access token.

    Args:
        data (dict): A dictionary containing user credentials.

    Returns:
        Response object: A JSON response indicating success or failure.
    """
    try:
        # Extract username and password from the request
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and password are required."}), 400

        # Fetch the user from the database
        user = User.query.filter_by(username=username).first()

        if not user:
            return jsonify({"error": "Invalid username or password."}), 401

        # Validate the user's password
        if check_password_hash(user.password, password):
            # Generate a JWT access token with an optional expiration time (e.g., 24 hours)
            access_token = create_access_token(identity=user.username, expires_delta=timedelta(hours=24))

            return jsonify({
                "message": "Login successful",
                "access_token": access_token,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "local_zipcode": user.local_zipcode
            }), 200

        # Invalid password
        return jsonify({"error": "Invalid username or password."}), 401

    except Exception as e:
        return jsonify({"error": "An error occurred while logging in.", "details": str(e)}), 500







