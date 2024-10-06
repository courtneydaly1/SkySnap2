import jwt
import os
from datetime import datetime, timedelta

def create_jwt_token(user_id):
    """Create a JWT token for user authentication."""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
    }
    secret = os.getenv('SECRET_KEY')
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_jwt_token(token):
    """Decode the JWT token and return the payload."""
    secret = os.getenv('SECRET_KEY')
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
