import React, { useState } from "react";
import './App.css'
const App = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [weather, setWeather] = useState(null);
    const [state, setState] = useState("");
    const [season, setSeason] = useState("");
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        try {
            const response = await fetch("http://localhost:3000/getWeather", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ city: location }),
            });

            const data = await response.json();

            console.log("Weather Data Received:", data);  // Log the weather data

            if (response.ok) {
                setWeather(data);
                setStep(3);
            } else {
                setError("Failed to fetch weather details");
            }
        } catch (err) {
            setError("Error fetching weather details");
        }
    };

    const fetchRecommendation = async () => {
        try {
            setError(null);
            const response = await fetch("http://localhost:3000/recommend-crop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state, season }),
            });

            const data = await response.json();

            if (response.ok) {
                setRecommendation(data);
            } else {
                setError(data.error || "Something went wrong");
                setRecommendation(null);
            }
        } catch (err) {
            setError("Failed to fetch crop recommendation");
            setRecommendation(null);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
            <h1>🌱 Farmer's Assistant</h1>

            {step === 1 && (
                <div>
                    <h2>👨‍🌾 Enter Your Name</h2>
                    <input
                        type="text"
                        placeholder="Farmer's Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: "10px", fontSize: "16px" }}
                    />
                    <button onClick={() => setStep(2)} style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}>
                        Next
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>📍 Enter Your Location</h2>
                    <input
                        type="text"
                        placeholder="Enter Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ padding: "10px", fontSize: "16px" }}
                    />
                    <button onClick={fetchWeather} style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}>
                        Get Weather
                    </button>
                </div>
            )}

            {step === 3 && weather && (
                <div>
                    <h2>👋 Hello, {name}!</h2>
                    <h3>🌤️ Weather Details</h3>
                    <p><strong>Temperature:</strong> {weather.weather.temperature}</p>
                    <p><strong>Condition:</strong> {weather.weather.condition}</p>
                    <p><strong>Wind Speed:</strong> {weather.weather.wind_speed}</p>

                    <h2>🧑‍🌾 Enter Crop Details</h2>
                    <input
                        type="text"
                        placeholder="Enter State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
                    />
                    <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        style={{ padding: "10px", fontSize: "16px" }}
                    >
                        <option value="">Select Season</option>
                        <option value="Kharif">Kharif</option>
                        <option value="Rabi">Rabi</option>
                        <option value="Zaid">Zaid</option>
                    </select>
                    <button onClick={fetchRecommendation} style={{ marginLeft: "10px", padding: "10px", fontSize: "16px" }}>
                        Get Recommendation
                    </button>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {recommendation && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", display: "inline-block" }}>
                    <h3>✅ Recommended Crop</h3>
                    <p><strong>State:</strong> {recommendation.state}</p>
                    <p><strong>Season:</strong> {recommendation.season}</p>
                    <p><strong>Best Crop:</strong> {recommendation.recommendedCrop}</p>
                </div>
            )}
        </div>
    );
};

export default App;
