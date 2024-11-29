import os
from werkzeug.utils import secure_filename

def allowed_file(filename):
    """
    Check if the file extension is allowed.

    Args:
        filename (str): The name of the file.

    Returns:
        bool: True if the file extension is allowed, False otherwise.
    """
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, upload_folder):
    """
    Save a file securely to the upload folder.

    Args:
        file (FileStorage): The file to save.
        upload_folder (str): The path to the folder where the file should be saved.

    Returns:
        str: The file path where the file is saved, or None if the file is not allowed.
    """
    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        return file_path
    return None

def paginate(query, page, per_page):
    """
    Paginate a query.

    Args:
        query (Query): The query to paginate.
        page (int): The page number.
        per_page (int): The number of items per page.

    Returns:
        Pagination: A paginated query result.
    """
    return query.paginate(page=page, per_page=per_page, error_out=False)

