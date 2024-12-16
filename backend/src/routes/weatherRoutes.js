const express = require("express");
const { fetchWeather, resetWeatherDatabase } = require("../controllers/weatherController");


const weather = express.Router();

weather.get("/:location", fetchWeather);
weather.post("/resetweather", resetWeatherDatabase);


module.exports = weather;
