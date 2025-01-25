### SkySnap
A modern weather application built with React, React Router, and JWT authentication. The app allows users to sign up, log in, and view weather forecasts based on their location or a custom ZIP code. The app includes a posts feature where users can create and view posts related to weather.

### Features
Weather Forecast: 
    Displays weather information for a user's local ZIP code or any specified ZIP code.
User Authentication: 
    Provides signup, login, and logout functionality.
Protected Routes: 
    Certain routes (Dashboard, Weather, Posts) are protected and only accessible by authenticated users.
Create and View Posts: 
    Users can create new posts related to weather and view others' posts.
Responsive Design: 
    The app is fully responsive, adjusting to different screen sizes.

### Technologies Used
React: A JavaScript library for building user interfaces.
React Router: For handling routing and navigation.
JWT (JSON Web Tokens): For user authentication.
Axios: To make API calls for weather data and user actions.
Styled Components / CSS: For styling the app with a modern and clean design.

### Installation
Prerequisites
Node.js and npm (Node Package Manager) installed on your machine. You can download and install them from Node.js official website.

### Setup
Clone the repository:

bash
Copy
git clone https://github.com/yourusername/weather-app.git
Navigate to the project directory:

bash
Copy
cd weather-app
Install the dependencies:

bash
Copy
npm install
Set up environment variables (if required): Create a .env file in the root of the project and add the following:

makefile
Copy
REACT_APP_API_BASE_URL=<Your_API_URL>
Run the app:

bash
Copy
npm start
This will start the application on http://localhost:3000.


### Key Components
App.js
    Handles user authentication using JWT and manages state.
    Routes users to the Dashboard, Weather, and Posts pages based on their authentication status.
UserContext.js
    Context provider to manage user data globally throughout the app.
ProtectedRoute.js
    Protects routes such as Dashboard, Weather, and CreatePost from unauthorized users.
WeatherApi.js
    API calls for interacting with the backend weather service.
    Handles actions like logging in, signing up, fetching weather data, etc.
SearchWeather.js
    A page that allows users to search for weather by ZIP code.
WeatherPage.js
    A page that displays the weather data for a specific location (user’s local ZIP code or a custom ZIP code).
Dashboard.js
    Displays user-specific data (like posts or weather).
Posts.js & CreatePost.js
    A feature that lets users create and view posts related to weather.
LoadingSpinner.js
    A simple spinner component used when data is loading.
Authentication
    The app uses JWT (JSON Web Tokens) to authenticate users.
    Users can sign up and log in with their email and password.
    Upon successful login, a token is stored in localStorage and used to authenticate requests.


### Available Routes
/login: Login page for returning users.
/signup: Signup page for new users.
/dashboard: Protected page showing user-specific data.
/weather: Protected page showing the weather for the user’s location.
/posts: Protected page for viewing user posts.
/posts/create: Protected page for creating a new post.
/weather/search: Page to search for weather by ZIP code.

### How to Use
Sign up for an account if you're a new user.
Login with your credentials. You will be redirected to the Dashboard.
On the Dashboard, you can access the weather page and create posts for your zipcode.
The Weather Page allows you to view the weather for your current location (based on ZIP code) or any other ZIP code.
The Posts Page lets you view weather-related posts from other users and create your own.


# Click HERE for SkySnap Schema --->  [SkySnapSchema.pdf](https://github.com/user-attachments/files/17579600/SkySnapSchema.pdf)

# API
https://docs.tomorrow.io/

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




