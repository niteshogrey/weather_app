const axios = require("axios");
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");

const fetchWeatherData = async (location, token) => {
  const apiKey = process.env.WEATHERAPIKEY;
  const weatherUrl = `http://api.weatherstack.com/current`;

  try {
    // Fetch data from weather API
    const decodedToken = jwt.decode(token);  
    const userName = decodedToken.name || 'Unknown'
    const response = await axios.get(weatherUrl, {
      params: {
        access_key: apiKey,
        query: location,
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error.info || "Failed to fetch weather data");
    }

    const weatherData = response.data;
    const observationTime = parseObservationTime(weatherData.current.observation_time);
    const formattedTime = convertToIST(observationTime);

    // Save weather data to the database
    const query = `INSERT INTO WeatherReports (user_name,location, region, country, timezone, temperature, weather_descriptions, observation_time, createdAt, updatedAt) 
                   VALUES (?, ?, ?, ?, ?,?, ?, ?, NOW(), NOW())`;
    const values = [
      userName,
      weatherData.location.name,
      weatherData.location.region,
      weatherData.location.country,
      weatherData.location.timezone_id,
      weatherData.current.temperature,
      weatherData.current.weather_descriptions.join(", "),
      formattedTime,
    ];

    const [result] = await pool.query(query, values);  // Destructure the result

    return {
      user_name: userName,
      location: weatherData.location.name,
      region: weatherData.location.region,
      country: weatherData.location.country,
      timezone: weatherData.location.timezone_id,
      temperature: weatherData.current.temperature,
      weather_descriptions: weatherData.current.weather_descriptions,
      observation_time: formattedTime,
    };

  } catch (error) {
    console.error("Error in weather data service:", error);
    throw new Error(`Error in weather data service: ${error.message}`);
  }
};

const resetWeatherDatabaseService = async () => {
  try {
    // Delete all records from WeatherReports
    await pool.query("TRUNCATE TABLE WeatherReports");

    // Reset the auto-increment value to 1
    await pool.query("ALTER TABLE WeatherReports AUTO_INCREMENT = 1");
    console.log("Database reset successfully, auto-increment set to 1.");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw new Error("Error resetting database: " + error.message);
  }
};

// Helper function to parse observation time (e.g., '12:30 PM')
const parseObservationTime = (observationTime) => {
  const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
  const match = observationTime.match(timeRegex);

  if (!match) {
    throw new Error(`Invalid observation_time format: ${observationTime}`);
  }

  let [_, hour, minute, period] = match;
  hour = parseInt(hour, 10);
  minute = parseInt(minute, 10);

  if (period.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  return { hour, minute };
};

// Helper function to convert the time to IST (Indian Standard Time)
const convertToIST = ({ hour, minute }) => {
  let date = new Date();
  date.setUTCHours(hour, minute, 0, 0);
  date = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000); // Add 5 hours 30 minutes to UTC time
  return date.toISOString().slice(11, 16); // Returns time in HH:mm format
};

module.exports = { fetchWeatherData, resetWeatherDatabaseService };
