// backend/api/train.js
import fs from "fs";
import path from "path";
import { applyFootballRules } from "../utils/footballRules.js";

const DATA_FILE = path.resolve("./backend/data/learned_pbp.json");

// Helper: read existing data
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

// Helper: save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Simple frequency-based "model"
function retrainModel(data) {
  const counts = { Run: 1, Pass: 1, "Field Goal": 1, Punt: 1 }; // Laplace smoothing
  data.forEach((row) => {
    counts[row.Play_Type] += 1;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const baseProba = {};
  for (let k in counts) baseProba[k] = counts[k] / total;

  return baseProba;
}

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { inputs, actualPlay, adminPassword } = req.body;

  if (adminPassword !== "admin") return res.status(403).json({ error: "Unauthorized" });

  if (!inputs || !actualPlay) return res.status(400).json({ error: "Missing data" });

  // Load existing data, append new play
  const data = readData();
  data.push({ ...inputs, Play_Type: actualPlay });
  saveData(data);

  // Retrain "model"
  const newProba = retrainModel(data);

  // Apply rules on new base probabilities
  const adjustedProba = applyFootballRules(inputs, newProba);

  // Determine top prediction
  const predictedPlay = Object.keys(adjustedProba).reduce((a, b) =>
    adjustedProba[a] > adjustedProba[b] ? a : b
  );

  return res.status(200).json({ message: "Training data added", predictedPlay, adjustedProba });
}
