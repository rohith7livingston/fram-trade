import React, { useState } from "react";

const App = () => {
    const [state, setState] = useState("");
    const [season, setSeason] = useState("");
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRecommendation = async () => {
        try {
            setError(null);
            setLoading(true);

            const response = await fetch("http://localhost:3000/recommend-crop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state, season }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setRecommendation(data);
            } else {
                setError(data.error || "Something went wrong");
                setRecommendation(null);
            }
        } catch (err) {
            setLoading(false);
            setError("Failed to fetch crop recommendation");
            setRecommendation(null);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
            <h1>🌱 Crop Recommendation System</h1>

            <input
                type="text"
                placeholder="Enter State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ padding: "10px", fontSize: "16px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
                type="text"
                placeholder="Enter Season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                style={{ padding: "10px", fontSize: "16px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button 
                onClick={fetchRecommendation} 
                style={{ padding: "10px 15px", fontSize: "16px", borderRadius: "5px", cursor: "pointer" }}>
                {loading ? "Loading..." : "Get Recommendation"}
            </button>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            {recommendation && (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "10px", display: "inline-block", background: "#f9f9f9" }}>
                    <h3>State: {recommendation.state}</h3>
                    <h3>Season: {recommendation.season}</h3>
                    <h2>🌾 Recommended Crop: {recommendation.recommendedCrop}</h2>
                </div>
            )}
        </div>
    );
};

export default App;
