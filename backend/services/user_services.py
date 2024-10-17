from flask import request, jsonify
from app import app, db
from models import User

@app.route('/create_user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        # Extract necessary fields from the request
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        password = data.get('password')

        # Validate the required fields
        if not username or not first_name or not last_name or not password:
            return jsonify({"error": "All fields (username, first_name, last_name, password) are required."}), 400

        # Check if the username is already taken
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists."}), 400

        # Create a new User object
        new_user = User(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password  # You should hash the password in a real-world app!
        )

        # Add and commit the new user to the database
        db.session.add(new_user)
        db.session.commit()

        # Return a success message or the created user's details
        return jsonify({"message": "User created successfully!", "user": {"id": new_user.id, "username": new_user.username}}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
