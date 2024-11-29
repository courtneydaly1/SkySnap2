from flask import request, jsonify
from app import db
from models import Post, User
from datetime import datetime

def create_post():
    """
    Create a new post with the provided data.

    Returns:
        Response object: A JSON response indicating success or failure.
    """
    try:
        # Parse the JSON data from the request
        data = request.get_json()

        # Validate if the request has data
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Extract necessary fields
        location = data.get('location')
        description = data.get('description')
        user_id = data.get('user_id')
        image_url = data.get('image_url')
        caption = data.get('caption')
        realtime_weather_id = data.get('realtime_weather_id')

        # Validate required fields
        if not location:
            return jsonify({"error": "Location is required."}), 400
        if not user_id:
            return jsonify({"error": "User ID is required."}), 400

        # Ensure the user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found."}), 404

        # Create a new Post object
        new_post = Post(
            location=location,
            description=description,
            user_id=user_id,
            image_url=image_url,
            caption=caption,
            realtime_weather_id=realtime_weather_id,
            created_at=datetime.utcnow()
        )

        # Save the new post to the database
        db.session.add(new_post)
        db.session.commit()

        # Return the serialized data of the created post
        return jsonify(new_post.serialize()), 201

    except Exception as e:
        # Log and return any unexpected errors
        return jsonify({"error": "An error occurred while creating the post.", "details": str(e)}), 500


           

