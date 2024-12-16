const { fetchWeatherData, resetWeatherDatabaseService } = require("../services/weatherServices");


const fetchWeather = async (req, res) => {
    const { location } = req.params;
    const token = req.headers.authorization?.split(' ')[1];   
    if (!token) {
      return res.status(400).send({ success: false, message: "Token is required" });
    }
    try {
        const data = await fetchWeatherData(location, token);
        return res.status(200).send({
            success: true,
            message: "Weather data fetched and saved successfully",
            ...data,
        });
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return res.status(500).send({
            success: false,
            message: "An error occurred while fetching weather data",
            error: error.message,
        });
    }
};

const resetWeatherDatabase = async (req, res) => {
    try {
        await resetWeatherDatabaseService();
        return res.status(200).send({
            success: true,
            message: "Database reset successfully, auto-increment set to 1.",
        });
    } catch (error) {
        console.error("Error resetting database:", error.message);
        return res.status(500).send({
            success: false,
            message: "Error resetting database.",
            error: error.message,
        });
    }
};

module.exports = { fetchWeather, resetWeatherDatabase };
