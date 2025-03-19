const axios = require('axios');

const getWeather = async (req, res) => {
    try {
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({ error: "City name is required" });
        }

        // Fetch latitude & longitude using Open-Meteo's geocoding API
        const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&format=json`;
        const geoResponse = await axios.get(geoApiUrl);

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            return res.status(404).json({ error: "City not found" });
        }

        const { latitude, longitude, name, country } = geoResponse.data.results[0];

        // Fetch detailed weather information
        const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,pressure_msl`;
        const weatherResponse = await axios.get(weatherApiUrl);

        // Extract current weather details
        const { temperature, windspeed, weathercode } = weatherResponse.data.current_weather;
        const humidity = weatherResponse.data.hourly.relative_humidity_2m[0];
        const precipitation = weatherResponse.data.hourly.precipitation[0];
        const pressure = weatherResponse.data.hourly.pressure_msl[0];

        res.json({
            city: name,
            country,
            latitude,
            longitude,
            weather: {
                temperature: `${temperature}°C`,
                wind_speed: `${windspeed} km/h`,
                humidity: `${humidity}%`,
                precipitation: `${precipitation} mm`,
                pressure: `${pressure} hPa`,
                weather_code: weathercode
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data", details: error.message });
    }
};

module.exports = { getWeather };
