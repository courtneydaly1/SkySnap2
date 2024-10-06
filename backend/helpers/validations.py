import re
from backend.models import User

def validate_email(email):
    """Check if an email address is valid."""
    regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return re.match(regex, email)

def is_username_unique(username):
    """Check if the username is already taken."""
    return User.query.filter_by(username=username).first() is None
