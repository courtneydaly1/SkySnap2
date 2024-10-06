import logging

@app.before_request
def log_request():
    logging.info(f"Request: {request.method} {request.path}")
    logging.info(f"Headers: {request.headers}")
    logging.info(f"Body: {request.get_data()}")

@app.after_request
def log_response(response):
    logging.info(f"Response Status: {response.status}")
    logging.info(f"Response Body: {response.get_data()}")
    return response
