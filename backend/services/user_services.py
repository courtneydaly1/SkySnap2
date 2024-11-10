from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from models import User
from flask_jwt_extended import create_access_token

def create_user(data):
    try:

        # Extract necessary fields from the request
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        local_zipcode= data.get('local_zipcode')
        password = data.get('password')

        # Validate the required fields
        if not username or not first_name or not last_name or not password:
            return jsonify({"error": "All fields (username, first_name, last_name, zipcode,  password) are required."}), 400

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
            password=hashed_password  # Store hashed password
        )

        # Add and commit the new user to the database
        db.session.add(new_user)
        db.session.commit()

        # Return a success message or the created user's details
        return jsonify({"message": "User created successfully!", "user": {"id": new_user.id, "username": new_user.username}}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


def login_user():
    data = request.json  # Get the JSON data from the request
    username = data.get('username')
    password = data.get('password')
    
    # Check if the username exists
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password, password):  # Verify the password
        access_token = create_access_token(identity=user.id)  # Generate JWT token
        return jsonify({"message": "Login successful", "access_token": access_token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


