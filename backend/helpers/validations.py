import re
from backend.models import User

def validate_email(email):
    """
    Check if an email address is valid.

    Args:
        email (str): The email address to validate.

    Returns:
        bool: True if the email matches the regex pattern, False otherwise.
    """
    regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    return re.match(regex, email) is not None


def is_username_unique(username):
    """
    Check if the username is already taken.

    Args:
        username (str): The username to check.

    Returns:
        bool: True if the username is unique (not taken), False otherwise.
    """
    return User.query.filter_by(username=username).first() is None

