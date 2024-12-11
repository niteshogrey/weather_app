const express = require("express");
const axios = require("axios");
const weather = express.Router();
require('dotenv').config();

weather.get("/:location", async (req, res) => {
    const { location } = req.params;
    const apiKey = process.env.WEATHERAPIKEY;
    const weatherUrl = `http://api.weatherstack.com/current`;

    try {
        // Make the API request
        const response = await axios.get(weatherUrl, {
            params: {
                access_key: apiKey,
                query: location,
            },
        });

        // Handle response from WeatherStack
        if (response.data.error) {
            return res.status(400).send({
                success: false,
                message: response.data.error.info || "Failed to fetch weather data",
            });
        }

        const weatherData = response.data;


        let observationTime = weatherData.current.observation_time;

        // Validate and parse observation_time in 12-hour format
        const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
        const match = observationTime.match(timeRegex);

        if (!match) {
            throw new Error(`Invalid observation_time format: ${observationTime}`);
        }

        let [_, hour, minute, period] = match; // Extract hour, minute, and AM/PM
        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);

        if (period.toUpperCase() === "PM" && hour !== 12) {
            hour += 12; // Convert PM to 24-hour format
        } else if (period.toUpperCase() === "AM" && hour === 12) {
            hour = 0; // Handle midnight case
        }

        // Create a Date object and convert to India Time Zone (UTC+5:30)
        let date = new Date();
        date.setUTCHours(hour, minute, 0, 0);
        date = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000); // Add 5 hours 30 minutes

        const formattedTime = date.toISOString().slice(11, 16); // Extract HH:mm in 24-hour format

        return res.status(200).send({
            success: true,
            location: weatherData.location.name,
            region: weatherData.location.region,
            country: weatherData.location.country,
            temperature: weatherData.current.temperature,
            weather_descriptions: weatherData.current.weather_descriptions,
            observation_time: formattedTime,
        });
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return res.status(500).send({
            success: false,
            message: "An error occurred while fetching weather data",
            error: error.message,
        });
    }
});

module.exports = weather;
