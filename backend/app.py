from flask import Flask, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object('config.DevelopmentConfig')

db = SQLAlchemy(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate




if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
        app.run(debug=True)

# import declared routes
import routes


    



