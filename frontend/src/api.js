import axios from "axios";

// Set up the base URL for the API
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:5000";

/** API Class. */
class WeatherApi {
  static token = localStorage.getItem('token');  // Attempt to load token from localStorage

  /** Get the current user. */
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }
  // Helper function to get the token
  static getToken() {
    if (!WeatherApi.token) {
      WeatherApi.token = localStorage.getItem('token');
    }
    return WeatherApi.token;
  }

  // Helper function to set the token
  static setToken(token) {
    WeatherApi.token = token;
    localStorage.setItem('token', token);  // Store the token in localStorage
  }

  // Helper function to remove the token (for logout)
  static removeToken() {
    WeatherApi.token = null;
    localStorage.removeItem('token');
  }

  // Make a generic API request
  static async request(endpoint, data = {}, method = "get", timeout = 10000) {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${WeatherApi.getToken()}` };
    const params = method === "get" ? data : {}; // If GET, use query parameters

    try {
      const response = await axios({
        url,
        method,
        data,
        params,
        headers,
        timeout,
      });
      return response.data;
    } catch (err) {
      console.debug("API Call Details:", { url, method, data, params, headers });
      console.error("API Error:", err.response || err);

      let message = "An error occurred";
      let errorCategory = 'general';

      if (err.response) {
        message = err.response?.data?.error?.message || err.response?.data?.message || message;
        if (err.response.status >= 500) errorCategory = 'server';
        if (err.response.status === 404) errorCategory = 'notFound';
        if (err.response.status === 401) errorCategory = 'unauthorized';
      } else if (err.message) {
        message = err.message;
        errorCategory = 'network';
      }

      throw { message: Array.isArray(message) ? message : [message], category: errorCategory };
    }
  }

  // Refactor repeated CRUD methods into one
  static async crudRequest(endpoint, data = {}, method = "get") {
    return await this.request(endpoint, data, method);
  }

  // Individual API routes
  static async signup(data) {
    let res = await this.crudRequest("auth/signup", data, "post");
    WeatherApi.setToken(res.token);
    return { token: res.token, userId: res.userId, user: res.user };
  }

  static async login(data) {
    let res = await this.crudRequest("auth/login", data, "post");
     // Log the entire response to verify its structure
    console.log("Raw response from login:", res);
    // Destructure the response data
    const { token, userId, first_name, last_name, local_zipcode } = res;
  
    // If successful, return the data
    return {
      token: token,
      user: {
        userId,
        first_name,
        last_name,
        local_zipcode
      }
    };
  }
  

  static async getPosts() {
    return await this.crudRequest("posts");
  }

  static async createPost(data) {
    return await this.crudRequest("posts", data, "post");
  }

  static async getWeather(location) {
    return await this.crudRequest("weather", { location }, "get");
  }

  static async getRealtimeWeather(location) {
    return await this.crudRequest("weather/realtime", { location });
  }

  static async getWeeklyWeather(location) {
    return await this.crudRequest("weather/weekly", { location });
  }
}

export default WeatherApi;



