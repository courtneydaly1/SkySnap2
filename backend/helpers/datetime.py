from datetime import datetime

def format_datetime(dt):
    """
    Convert a datetime object into a formatted string.

    Args:
        dt (datetime): The datetime object to format.

    Returns:
        str: The formatted datetime string in 'YYYY-MM-DD HH:MM:SS' format.
    """
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def calculate_days_difference(date1, date2):
    """
    Calculate the difference in days between two dates.

    Args:
        date1 (datetime): The first datetime object.
        date2 (datetime): The second datetime object.

    Returns:
        int: The difference in days between the two dates.
    """
    delta = date2 - date1
    return delta.days

