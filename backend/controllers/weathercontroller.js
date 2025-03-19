const axios = require('axios');

const getWeather = async (req, res) => {
    try {
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({ error: "City name is required" });
        }

        const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&format=json`;
        const geoResponse = await axios.get(geoApiUrl);

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            return res.status(404).json({ error: "City not found" });
        }

        const { latitude, longitude, name, country } = geoResponse.data.results[0];

        const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await axios.get(weatherApiUrl);

        const { temperature, windspeed, weathercode } = weatherResponse.data.current_weather;

        const weatherConditions = {
            0: "Clear sky ☀️",
            1: "Mainly clear 🌤️",
            2: "Partly cloudy ⛅",
            3: "Overcast ☁️",
            45: "Fog 🌫️",
            48: "Depositing rime fog 🌫️",
            51: "Light drizzle 🌦️",
            53: "Moderate drizzle 🌦️",
            55: "Dense drizzle 🌦️",
            61: "Light rain 🌧️",
            63: "Moderate rain 🌧️",
            65: "Heavy rain 🌧️",
            71: "Light snow ❄️",
            73: "Moderate snow ❄️",
            75: "Heavy snow ❄️",
            80: "Light showers 🌦️",
            81: "Moderate showers 🌦️",
            82: "Heavy showers 🌦️"
        };

        res.json({
            city: name,
            country,
            latitude,
            longitude,
            weather: {
                temperature: `${temperature}°C`,
                wind_speed: `${windspeed} km/h`,
                condition: weatherConditions[weathercode] || "Unknown condition"
            }
        });
    } catch (error) {
        console.error("Error fetching weather:", error);
        res.status(500).json({ error: "Failed to fetch weather data", details: error.message });
    }
};

module.exports = { getWeather };
