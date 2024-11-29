from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """
    Hash a plaintext password using a secure method.

    Args:
        password (str): The plaintext password to hash.

    Returns:
        str: The hashed password.
    """
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    """
    Verify if a plaintext password matches the hashed one.

    Args:
        hashed_password (str): The hashed password stored in the database.
        password (str): The plaintext password to check.

    Returns:
        bool: True if the passwords match, False otherwise.
    """
    return check_password_hash(hashed_password, password)

