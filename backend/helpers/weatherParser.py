def parse_weather_data(data):
    """Extract useful information from the weather API response."""
    if data and 'data' in data and 'timelines' in data['data']:
        weather_info = []
        for entry in data['data']['timelines'][0].get('intervals', []):
            weather_info.append({
                'date': entry.get('startTime', 'N/A'),  # Use 'N/A' if startTime is missing
                'temperature': entry['values'].get('temperature', 'N/A'),
                'precipitationProbability': entry['values'].get('precipitationProbability', 'N/A'),
                'windSpeed': entry['values'].get('windSpeed', 'N/A')
            })
        return weather_info
    return None
