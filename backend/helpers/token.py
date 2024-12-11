import jwt
import os
from datetime import datetime, timedelta

def create_jwt_token(user_id, username):
    """
    Create a JWT token for user authentication.

    Args:
        user_id (int): The user ID to encode into the token.

    Returns:
        str: The encoded JWT token.
    """
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
    }
    secret = os.getenv('SECRET_KEY')  # Get the secret key from environment variables
    return jwt.encode(payload, secret, algorithm='HS256')


def decode_jwt_token(token):
    """
    Decode the JWT token and return the payload.

    Args:
        token (str): The JWT token to decode.

    Returns:
        dict or None: The decoded payload if valid, None if the token is expired or invalid.
    """
    secret = os.getenv('SECRET_KEY')  # Get the secret key from environment variables
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

