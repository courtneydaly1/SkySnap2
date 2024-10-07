from app import app
from services.weather_services import get_forcast

@app.route('/test', methods=['GET'])
def test():
    return 'it works!'


@app.route('/')
def home():
    return "Welcome to SkySnap!"

@app.route('/forcast', methods=['GET'])
def forcast():
    return get_forcast()

@app.route('/forcast/weekly', methods=['GET'])

    


# @app.route('/posts', methods=['GET'])
# def get_posts():
   
#     posts = Post.query.all()
#     return jsonify([post.serialize() for post in posts])

# @app.route(')
# def get_daily_weather():
#     location = request.args.get('location')  
#     timestep = request.args.get('timestep', '1d')
#     WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY') 
#     BASE_URL = os.envirn.get("BASE_URL") 
    
#     if not location:
#         return jsonify({"error": "Location parameter is required."}), 400

    
#     url = f"{BASE_URL}/weather/forecast?location={location}&timesteps={timestep}&apikey={WEATHER_API_KEY}"
#     headers = {"accept": "application/json"}

#     try:
#         response = requests.get(url, headers=headers)
#         response.raise_for_status()  

#         weather_data = response.json()  
#         # daily_weather = DailyWeather(...)  # Create your model instance here

#         return jsonify(weather_data)  
#     except requests.exceptions.RequestException as e:
#         return jsonify({"error": str(e)}), 500 


# @app.route('/weather/weekly', methods=['GET'])
# def get_weekly_weather():
#     location = request.args.get('location')  
#     timestep = request.args.get('timestep', '5d') #5 days by default
#     WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY') 
#     BASE_URL = os.environ.get("BASE_URL") 
    
#     if not location:
#         return jsonify({"error": "Location parameter is required."}), 400

    
#     url = f"{BASE_URL}/weather/forecast?location={location}&timesteps={timestep}&apikey={WEATHER_API_KEY}"
#     headers = {"accept": "application/json"}

#     try:
#         response = requests.get(url, headers=headers)
#         response.raise_for_status()  

#         weather_data = response.json()  
#         WeeklyWeather.query.delete()
#         db.session.commit()

       
#         for day_data in weather_data.get('daily', []):
            
#             weekly_weather = WeeklyWeather(
#                 date=day_data['time'],  
#                 temperature=day_data['temperature'], 
#                 temperatureApparent=day_data['temperatureApparent'],
#                 precipitationProbability = day_data['precipitationProbability'],
#                 humidity=day_data['humidity'],
#                 cloudCover= day_data["cloudCover"],
#                 uvIndex= day_data["uvIndex"],
#                 windSpeed= day_data["windSpeed"],
#                 weather_description=day_data['weather']['description'] 
#             )
#             db.session.add(weekly_weather)

#             db.session.commit()  

#         return jsonify(weather_data)  # Return the weather data to the client
#     except requests.exceptions.RequestException as e:
#         return jsonify({"error": str(e)}), 500
    
#     @app.route('/weather/history/<location>', methods=['GET'])
#     def weather_history(location):
#         api_key = WEATHER_API_KEY
#         weather_data = get_weather_history(location, api_key)
        
#         for data in weather_data['data']:
#             new_entry = WeatherHistory(
#                 location=location,
#                 date=datetime.fromisoformat(data['date']),  
#                 temperature=data['temperature'],
#                 temperatureApparent=data['temperatureApparent'],
#                 precipitationProbability = data['precipitationProbability'],
#                 humidity=data['humidity'],
#                 cloudCover= data["cloudCover"],
#                 uvIndex= data["uvIndex"],
#                 windSpeed= data["windSpeed"],
#                 weather_description=data['weather']['description'] 
#             )
#             db.session.add(new_entry)  
#             db.session.commit()  
            
#         return jsonify({"message": "Weather data saved successfully!"}, weather_data), 201