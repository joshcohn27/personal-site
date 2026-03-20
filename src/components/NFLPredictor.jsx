import React, { useState } from "react";
import axios from "axios";
import "./NFLPredictor.css";

export default function NFLPredictor() {
    const [formData, setFormData] = useState({
        Quarter: 1,
        Down: 1,
        Distance: 1,
        Yardline_100: 50,
        Score_Differential: 0,
        Time_Remaining_Quarter: 900,
    });
    const [prediction, setPrediction] = useState(null);
    const [adjustedProba, setAdjustedProba] = useState(null);
    const [adminMode, setAdminMode] = useState(false);
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [playType, setPlayType] = useState("Run");
    const [message, setMessage] = useState("");

    // Update form fields for standard inputs
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Convert number inputs, keep Score_Differential as string initially if needed, but for simplicity in this context, let's keep it to Number conversion for all for now unless it's an issue later.
        const val = type === 'number' ? Number(value) : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    // Handler for the new Quarter/Down buttons
    const handleButtonClick = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Predict button
    const handlePredict = async () => {
        setMessage(""); // Clear previous messages
        setPrediction(null);
        setAdjustedProba(null);
        try {
            // Ensure the backend expects all fields correctly, especially if Score_Differential is sent as a number
            const res = await axios.post("http://localhost:5000/predict", formData);
            setPrediction(res.data.predicted);
            setAdjustedProba(res.data.adjustedProba);
        } catch (err) {
            console.error(err);
            setMessage("Error contacting backend or invalid input.");
        }
    };

    // Add new play (Admin)
    const handleAddPlay = async () => {
        if (!adminMode) return;

        const payload = {
            username: adminUsername,
            password: adminPassword,
            playData: { ...formData, Play_Type: playType },
        };

        try {
            const res = await axios.post("http://localhost:5000/train", payload);
            setMessage(`Play added! Total plays: ${res.data.totalPlays}`);
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.error || "Error adding play");
        }
    };

    // Component for Quarter/Down selection buttons
    const SelectorButtons = ({ label, name, currentValue, options, onSelect }) => (
        <div className="selector-group">
            <strong>{label}:</strong>
            <div className="button-row">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        className={`selector-btn ${currentValue === opt ? 'active' : ''}`}
                        onClick={() => onSelect(name, opt)}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="nfl-predictor">
            <h2>🏈 NFL Play Predictor</h2>

            <div className="input-grid">
                {/* Quarter Selector */}
                <SelectorButtons
                    label="Quarter"
                    name="Quarter"
                    currentValue={formData.Quarter}
                    options={[1, 2, 3, 4]}
                    onSelect={handleButtonClick}
                />

                {/* Down Selector */}
                <SelectorButtons
                    label="Down"
                    name="Down"
                    currentValue={formData.Down}
                    options={[1, 2, 3, 4]}
                    onSelect={handleButtonClick}
                />

                {/* Distance Input */}
                <label>
                    Distance to Go:
                    <input type="number" name="Distance" min="1" max="100" value={formData.Distance} onChange={handleChange} />
                </label>

                {/* Yardline Input */}
                <label>
                    Yards to Goal Line:
                    <input type="number" name="Yardline_100" min="1" max="99" value={formData.Yardline_100} onChange={handleChange} />
                </label>

                {/* Score Differential Input */}
                <label>
                    Score Differential (PHI - OPP):
                    <input type="text" name="Score_Differential" value={formData.Score_Differential} onChange={handleChange} />
                </label>

                {/* Time Remaining Input */}
                <label>
                    Time Remaining (Seconds):
                    <input type="number" name="Time_Remaining_Quarter" min="1" max="900" value={formData.Time_Remaining_Quarter} onChange={handleChange} />
                </label>
            </div>

            <button className="nfl-btn predict-btn" onClick={handlePredict}>
                ▶️ Predict Play
            </button>

            {prediction && adjustedProba && (
                <div className="prediction-result">
                    <h3>Predicted Play: **{prediction}**</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Play Option</th>
                                <th>Probability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(adjustedProba).map(([play, prob]) => (
                                <tr key={play}>
                                    <td>{play}</td>
                                    <td>{(prob * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <hr />

            ### 🔒 Admin Mode (Add Training Play)
            <label className="admin-toggle">
                <input type="checkbox" checked={adminMode} onChange={() => setAdminMode(!adminMode)} />
                Enable Admin Controls
            </label>

            {adminMode && (
                <div className="admin-panel">
                    <label>
                        Username:
                        <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                    </label>
                    <label>
                        Actual Play:
                        <select value={playType} onChange={(e) => setPlayType(e.target.value)}>
                            <option value="Run">Run</option>
                            <option value="Pass">Pass</option>
                            <option value="Field Goal">Field Goal</option>
                            <option value="Punt">Punt</option>
                        </select>
                    </label>
                    <button className="nfl-btn train-btn" onClick={handleAddPlay}>
                        💾 Add Example Play to Model
                    </button>
                </div>
            )}

            {message && <p className={`message ${adminMode && message.includes("Error") ? 'error-message' : ''}`}>{message}</p>}
        </div>
    );
}