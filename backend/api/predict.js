// backend/api/predict.js
import { applyFootballRules } from "../utils/footballRules.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    Quarter,
    Down,
    Distance,
    Yardline_100,
    Score_Differential,
    Time_Remaining_Quarter,
  } = req.body;

  // Simple baseline "ML model" placeholder
  const baseProba = {
    Run: 0.33,
    Pass: 0.33,
    "Field Goal": 0.17,
    Punt: 0.17,
  };

  // Apply rules from Python ported to JS
  const adjustedProba = applyFootballRules(
    {
      Quarter,
      Down,
      Distance,
      Yardline_100,
      Score_Differential,
      Time_Remaining_Quarter,
    },
    baseProba
  );

  // Determine top prediction
  const predictedPlay = Object.keys(adjustedProba).reduce((a, b) =>
    adjustedProba[a] > adjustedProba[b] ? a : b
  );

  return res.status(200).json({ predictedPlay, adjustedProba });
}
