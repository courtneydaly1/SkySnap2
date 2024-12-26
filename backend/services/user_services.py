from flask import request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from models import User
from flask_jwt_extended import create_access_token
from datetime import timedelta


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
            return jsonify({"error": "Username is required."})
        if not first_name:
            return jsonify({"error": "First name is required."})
        if not last_name:
            return jsonify({"error": "Last name is required."})
        if not password:
            return jsonify({"error": "Password is required."})

        # Check if the username is already taken
        if User.query.filter_by(username=username).first():
            return {"error": "Username already exists."} 

        # Hash the password
        hashed_password = generate_password_hash(password, method='scrypt')

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
        return {
            "message": "User created successfully!",
            "user": {"id": new_user.id, "username": new_user.username}
        }

    except Exception as e:
        # Handle unexpected errors
        return {"error": "An error occurred while creating the user.", "details": str(e)}


def login_user(data):
    """
    Authenticate a user and return a JWT access token.

    Returns:
        Response object: A JSON response indicating success or failure.
    """
    try:
        # Extract username and password from the request
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {"error": "Username and password are required."}

        # Fetch the user from the database
        user = User.query.filter_by(username=username).first()

        if not user:
            return {"error": "Invalid username or password."}

        # Validate the user's password
        if check_password_hash(user.password, password):
            # Generate a JWT access token with an optional expiration time (e.g., 24 hours)
            access_token = create_access_token(identity=user.username, expires_delta=timedelta(hours=24))
            # access_token = create_access_token(
            #     identity=user.username,  # Only store the username as identity
            #     additional_claims={"user_id": user.id, "local_zipcode": user.local_zipcode},
            #     expires_delta=timedelta(hours=24)
            # )


            return {
                "message": "Login successful",
                "access_token": access_token,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "local_zipcode": user.local_zipcode
            }

        # Invalid password
        return {"error": "Invalid username or password."}

    except Exception as e:
        # Handle unexpected errors
        return {"error": "An error occurred while logging in.", "details": str(e)}




