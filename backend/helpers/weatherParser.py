def parse_weather_data(data):
    """Extract useful information from the weather API response."""
    if data and 'data' in data and 'timelines' in data['data']:
        weather_info = []
        for entry in data['data']['timelines'][0]['intervals']:
            weather_info.append({
                'date': entry['startTime'],
                'temperature': entry['values']['temperature'],
                'precipitationProbability': entry['values']['precipitationProbability'],
                'windSpeed': entry['values']['windSpeed']
            })
        return weather_info
    return None
