import React, { useState } from "react";
import axios from "axios";
import { FaLocationDot, FaTemperatureHigh } from "react-icons/fa6";
import { TiWeatherPartlySunny } from "react-icons/ti";

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWeather = async () => {
    setErrorMessage("");
    setWeatherData(null);
    const token = localStorage.getItem("Token");
  console.log("Token:", token); // Log token for debuggi
  if (!token) {
    setErrorMessage("Token is required");
    return;
  }

    try {
      const response = await axios.get(`http://localhost:1000/api/weather/${location}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {        
        setWeatherData(response.data);
      } else {
        setErrorMessage(response.data.message || "Failed to fetch weather data");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching weather data.");
    }
  };

  return (
    <div className="flex flex-col mt-5 items-center bg-blue-100  px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Weather App</h1>

      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-sm">
        <input
          type="text"
          placeholder="Enter location"
          className="p-2 w-full border rounded-md mb-4 shadow-sm focus:ring-2 focus:ring-blue-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
          onClick={fetchWeather}
        >
          Get Weather
        </button>
      </div>

      {errorMessage && (
        <p className="mt-4 text-red-500 font-medium text-center">{errorMessage}</p>
      )}

      {weatherData && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6 w-full max-w-md sm:max-w-sm mx-auto">
          <h2 className="flex items-center gap-1 text-2xl font-bold text-gray-700">
            <FaLocationDot />
            {weatherData.location}, {weatherData.region}, {weatherData.country}
          </h2>
          <p className="flex items-center gap-1 text-gray-500 mt-3">
            <TiWeatherPartlySunny />
            {weatherData.weather_descriptions.join(", ")}
          </p>
          <p className="flex items-center gap-1 text-xl font-bold text-gray-700 mt-2">
            <FaTemperatureHigh />
            Temperature: {weatherData.temperature}°C
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Observation Time: {weatherData.observation_time}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
