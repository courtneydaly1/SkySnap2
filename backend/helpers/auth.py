from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """Hash a plaintext password."""
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    """Verify if a plaintext password matches the hashed one."""
    return check_password_hash(hashed_password, password)
