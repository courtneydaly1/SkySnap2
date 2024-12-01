import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:5000";

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class WeatherApi {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${WeatherApi.token}` };
    const params = method === "get" ? data : {};

    try {
      const response = await axios({
        url,
        method,
        data,
        params,
        headers,
        timeout: 10000,  // Adding a 10-second timeout
      });
      return response.data;
    } catch (err) {
      console.debug("API Call Details:", { url, method, data, params, headers });
      console.error("API Error:", err.response || err);
      let message = "An error occurred";
      


      if (err.response) {
        message = err.response?.data?.error?.message || err.response?.data?.message || message;
      } else if (err.message) {
        message = err.message;  // For cases like network errors
      }

      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Register a new user. */
  static async signup(data) {
    let res = await this.request("auth/signup", data, "post");
    return res.token; // Return the token for storage
  }
  /** Check if username is available. */
  static async checkUsername(username) {
    let res = await this.request("auth/check-username", { username }, "post");
    return res.message; 
  }
  /** Login a user. */
  static async login(data) {
    let res = await this.request("auth/login", data, "post");
    return res.token;
  }

  /** Fetch all posts. */
  static async getPosts() {
    let res = await this.request("posts");
    return res.posts;
  }

  /** Create a new post. */
  static async createPost(data) {
    let res = await this.request("posts", data, "post");
    return res.post;
  }

  /** Fetch real-time weather by location (latitude and longitude). */
  static async getRealtimeWeather(lat, lon) {
    let res = await this.request("weather/realtime", { lat, lon });
    return res.weather;
  }

  /** Fetch weekly weather forecast by location (latitude and longitude). */
  static async getWeeklyWeather(lat, lon) {
    let res = await this.request("weather/weekly", { lat, lon });
    return res.weather;
  }

  /** Fetch weather by location name. */
  static async getWeather(location) {
    return await this.request("weather", { location }, "get");
  }
}

export default WeatherApi;

