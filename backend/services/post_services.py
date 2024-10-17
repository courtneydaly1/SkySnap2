from flask import request, jsonify
from app import app, db
from models import Post, User
from datetime import datetime


def create_post():
    try:
        data = request.get_json()

        # Extract necessary fields from the request
        location = data.get('location')
        description = data.get('description')
        user_id = data.get('user_id')
        image_url = data.get('image_url')
        caption = data.get('caption')
        realtime_weather_id = data.get('realtime_weather_id')

        # Validate the required fields
        if not location or not user_id:
            return jsonify({"error": "Location and User ID are required."}), 400

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

        # Add and commit the new post to the database
        db.session.add(new_post)
        db.session.commit()

        # Return the created post's serialized data as a response
        return jsonify(new_post.serialize()), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
