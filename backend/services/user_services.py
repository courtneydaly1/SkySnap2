from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from models import User
from flask_jwt_extended import create_access_token


def create_user(data):
    """
    Create a new user with the provided data.

    Args:
        data (dict): A dictionary containing user details.

    Returns:
        Response object: A JSON response indicating success or failure.
    """
    try:
        # Extract required fields from the input data
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        local_zipcode = data.get('local_zipcode')
        password = data.get('password')

        # Validate the input
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
            return jsonify({"error": "Username already exists."}), 400

        # Hash the password
        hashed_password = generate_password_hash(password, method='sha256')

        # Create a new User object
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

        # Return a success message with user details
        return jsonify({
            "message": "User created successfully!",
            "user": {"id": new_user.id, "username": new_user.username}
        }), 201

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": "An error occurred while creating the user.", "details": str(e)}), 500


def login_user():
    """
    Authenticate a user and return a JWT access token.

    Returns:
        Response object: A JSON response indicating success or failure.
    """
    try:
        # Extract username and password from the request
        data = request.get_json()
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
            access_token = create_access_token(identity=user.id, expires_delta=False)
            return jsonify({
                "message": "Login successful",
                "access_token": access_token
            }), 200

        # Invalid password
        return jsonify({"error": "Invalid username or password."}), 401

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": "An error occurred while logging in.", "details": str(e)}), 500




