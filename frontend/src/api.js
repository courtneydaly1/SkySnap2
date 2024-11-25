import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class WeatherApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${WeatherApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response?.data?.error?.message || "An error occurred";
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }
    // WeatherApi.js
  static async signup(data) {
    let res = await this.request("auth/signup", data, "post");
    return res.token; // Return the token for storage
  }

  /** Register a new user. */
  static async register(data) {
    let res = await this.request("auth/register", data, "post");
    return res.token;
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

  
  static async getWeather(location) {
    return await this.request("weather", { location }, "get");
  }


}

export default WeatherApi;
