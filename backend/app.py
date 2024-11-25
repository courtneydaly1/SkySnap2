from flask import Flask, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # This will allow all origins. For more control, you can specify allowed origins.
app.config.from_object('config.DevelopmentConfig')

db = SQLAlchemy(app)

from models import *

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
        app.run(debug=True)

import routes 


    



