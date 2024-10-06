import os
from werkzeug.utils import secure_filename

def allowed_file(filename):
    """Check if the file extension is allowed."""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, upload_folder):
    """Save a file securely to the upload folder."""
    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        return file_path
    return None

def paginate(query, page, per_page):
    """Paginate a query."""
    return query.paginate(page=page, per_page=per_page, error_out=False)
