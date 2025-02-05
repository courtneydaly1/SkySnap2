# SkySnap

A modern weather application built with React, React Router, and JWT authentication. The app allows users to sign up, log in, and view weather forecasts based on their location or a custom ZIP code. The app includes a posts feature where users can create and view images/videos related to weather.
![Home](backend/static/uploads/Home.png)
---

### Features

- **Weather Forecast**: Displays weather information for a user's local ZIP code or any specified ZIP code.
![Weather](backend/static/uploads/Weather.png)
- **User Authentication**: Provides signup, login, and logout functionality.
- **Protected Routes**: Certain routes (Dashboard, Weather, Posts) are protected and only accessible by authenticated users.
- **Create and View Posts**: Users can create new posts related to weather and view others' posts.
![ViewSnap](backend/static/uploads/SearchSnaps.png)
![CreateSnap](backend/static/uploads/NewSnap.png)
- **Responsive Design**: The app is fully responsive, adjusting to different screen sizes.

---

### Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **React Router**: For handling routing and navigation.
- **JWT (JSON Web Tokens)**: For user authentication.
- **Flask**: Backend.
- **Axios**: To make API calls for weather data and user actions.
- **Styled Components / CSS**: For styling the app with a modern and clean design.

---

### Installation

#### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- Python (for server-side requirements)
- React JS frontend

#### Setup for Frontend (React)

1. **Clone the repository**:

    ```bash
    git clone https://github.com/courtneydaly1/SkySnap2.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd SkySnap2/frontend
    ```

3. **Install frontend dependencies**:

    ```bash
    npm install
    ```

#### Setup for Backend (Python)

1. **Navigate to the backend directory**:

    ```bash
    cd SkySnap2/backend
    ```

1. Create a virtual environment:

    ```bash
    python -m venv venv
    ```

2. **Activate the virtual environment**:

    - On macOS/Linux:
      ```bash
      source venv/bin/activate
      ```
    - On Windows:
      ```bash
      .\venv\Scripts\activate
      ```

3. **Install the backend dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

---
### Create Database:

```bash
CREATE DATABASE SkySnap
```

### Create an .env file in your root directory

# Database Configuration
DATABASE_URL=postgresql:///SkySnap
SQLALCHEMY_DATABASE_URI=postgresql:///SkySnap

# Secret Key for JWT or Session Management
SECRET_KEY= your-secret-key-here

# Tomorrow.io Weather API
BASE_URL=https://api.tomorrow.io/v4/
WEATHER_API_KEY= your-weather-api-key-here

-Important: Replace the placeholders (your-secret-key-here, your-weather-api-key-here, your-geocoding-api-key-here) with your actual keys and values.

# Make sure the .env file is added to .gitignore to prevent sensitive data from being committed:

```bash
# .gitignore
.env
```

### Run the App

Once the dependencies are installed for both frontend and backend, you can run the app.

#### For Frontend:

1. **Start the React development server**:

# Navigate to frontend directory

```bash
cd <SkySnap2>/frontend
```
```bash
npm start
```

   This will start the application on [http://localhost:3000](http://localhost:3000).

#### For Backend:

1. **Run the Flask server** (backend):

# Navigate to backend directory

```bash
cd SkySnap2/backend
```
```bash
flask run
```

   This will start the backend API server, on [http://localhost:5000](http://localhost:5000).

---

### Key Components

- **App.js**: Handles user authentication using JWT and manages state.
- **UserContext.js**: Context provider to manage user data globally throughout the app.
- **ProtectedRoute.js**: Protects routes such as Dashboard, Weather, and CreatePost from unauthorized users.
- **WeatherApi.js**: API calls for interacting with the backend weather service.
- **SearchWeather.js**: A page that allows users to search for weather by ZIP code.
- **WeatherPage.js**: A page that displays the weather data for a specific location (user’s local ZIP code or a custom ZIP code).
- **Dashboard.js**: Displays user-specific data (like posts or weather).
- **Posts.js & CreatePost.js**: A feature that lets users create and view posts related to weather.
- **LoadingSpinner.js**: A simple spinner component used when data is loading.

---

### Authentication

- The app uses JWT (JSON Web Tokens) to authenticate users.
- Users can sign up and log in with their email and password.
- Upon successful login, a token is stored in `localStorage` and used to authenticate requests.

---

### Available Routes

- `/login`: Login page for returning users.
- `/signup`: Signup page for new users.
- `/dashboard`: Protected page showing user-specific data.
- `/weather`: Protected page showing the weather for the user’s location.
- `/posts`: Protected page for viewing user posts.
- `/posts/create`: Protected page for creating a new post.
- `/weather/search`: Page to search for weather by ZIP code.

---

### How to Use

1. Sign up for an account if you're a new user.
2. Log in with your credentials. You will be redirected to the Dashboard.
3. On the Dashboard, you can access the weather page and create posts for your ZIP code.
4. The **Weather Page** allows you to view the weather for your current location (based on ZIP code) or any other ZIP code.
5. The **Posts Page** lets you view weather-related posts from other users and create your own.

---

### Click HERE for SkySnap Schema ---> [SkySnapSchema.pdf](https://github.com/user-attachments/files/17579600/SkySnapSchema.pdf)

---

### API

You can get weather data from the [Tomorrow.io API](https://docs.tomorrow.io/).

---

### Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Available Scripts

In the project directory, you can run:

1. **Start the app:**

    ```bash
    npm start
    ```

    Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

2. **Run tests:**

    ```bash
    npm test
    ```

    Launches the test runner in interactive watch mode.

3. **Build for production:**

    ```bash
    npm run build
    ```

    Builds the app for production to the `build` folder. Your app is ready to be deployed.

4. **Eject the project configuration (optional):**

    ```bash
    npm run eject
    ```

    **Note:** This is a one-way operation. Once you eject, you can't go back. It gives you full control over the project’s configuration.

---

### Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

---

### Additional Links:

- [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Deployment](https://facebook.github.io/create-react-app/docs/deployment)
- [Troubleshooting: `npm run build` fails to minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---



