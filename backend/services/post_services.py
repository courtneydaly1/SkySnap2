from flask import request, jsonify
from app import db
from models import Post, User
from datetime import datetime
import re

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
        username= data.get('username')
        image_url = data.get('image_url')
        caption = data.get('caption')

        # Validate required fields
        if not location:
            return jsonify({"error": "Location is required."}), 400
        if not username:
            return jsonify({"error": "Username is required."}), 400

        # Ensure the user exists
        user = User.query.get(username)
        if not user:
            return jsonify({"error": "Username not found."}), 404

        # Optional field validation: Ensure image_url, if provided, is a valid URL
        if image_url and not re.match(r"^https?://[^\s]+$", image_url):
            return jsonify({"error": "Invalid image URL format."}), 400

        # Optional field validation: Ensure caption and description lengths are reasonable
        if description and len(description) > 500:
            return jsonify({"error": "Description is too long. Max length is 500 characters."}), 400
        if caption and len(caption) > 300:
            return jsonify({"error": "Caption is too long. Max length is 300 characters."}), 400

        # Create a new Post object
        new_post = Post(
            location=location,
            description=description,
            user=username,
            image_url=image_url,
            caption=caption,
            realtime_weather_id=realtime_weather_id
        )

        # Save the new post to the database
        db.session.add(new_post)
        db.session.commit()

        # Return the serialized data of the created post
        return jsonify(new_post.serialize()), 201

    except Exception as e:
        # Log and return any unexpected errors
        print(f"Error occurred: {str(e)}")  # You can replace this with proper logging
        return jsonify({"error": "An error occurred while creating the post.", "details": str(e)}), 500


