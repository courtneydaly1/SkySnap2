import requests
import os

def get_coordinates_from_location(location):
    """Use Geocoding API to get latitude and longitude from a location name."""
    api_key = os.getenv('GEOCODING_API_KEY')
    base_url = 'https://maps.googleapis.com/maps/api/geocode/json'
    
    params = {
        'address': location,
        'key': api_key
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        if data['results']:
            location_data = data['results'][0]['geometry']['location']
            return location_data['lat'], location_data['lng']
    return None
