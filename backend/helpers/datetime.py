from datetime import datetime

def format_datetime(dt):
    """Convert a datetime object into a formatted string."""
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def calculate_days_difference(date1, date2):
    """Calculate the difference in days between two dates."""
    delta = date2 - date1
    return delta.days
