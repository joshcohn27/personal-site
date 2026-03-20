import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";

// --- CONFIGURATION ---
const DATA_FILE = "data/pbp.txt";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

// --- INITIALIZE APP ---
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// --- IN-MEMORY DATA STORAGE ---
let playsData = [];

// --- HELPER FUNCTIONS ---

// Parse PBP text file into structured objects
function parsePBP(rawText) {
  const lines = rawText.split("\n");
  let currentQuarter = 1;
  let phiScore = 0;
  let oppScore = 0;
  let isEaglesOffense = false;
  let oppCode = null;
  const dataList = [];

  const scorePattern = /([A-Z]{3}) (\d+) PHI (\d+)/;
  const playPattern = /(\d)-(\d+)-([A-Z]{3} \d+|\d+) (.+)/;
  const quarterPattern = /Play By Play (First|Second|Third|Fourth) Quarter/;
  const clockPattern = /\((\d*):(\d{2})\)/;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const quarterMatch = quarterPattern.exec(line);
    if (quarterMatch) {
      currentQuarter = { First: 1, Second: 2, Third: 3, Fourth: 4 }[
        quarterMatch[1]
      ];
    }

    const scoreMatch = scorePattern.exec(line);
    if (scoreMatch) {
      oppCode = scoreMatch[1];
      oppScore = parseInt(scoreMatch[2]);
      phiScore = parseInt(scoreMatch[3]);
    }

    if (line.startsWith("Philadelphia Eagles at")) {
      isEaglesOffense = true;
    } else if (line.startsWith("END OF QUARTER")) {
      isEaglesOffense = false;
    } else if (line.includes(" at ")) {
      if (!line.startsWith("Philadelphia Eagles")) {
        isEaglesOffense = false;
      }
    }

    const playMatch = playPattern.exec(line);
    if (isEaglesOffense && playMatch) {
      const down = parseInt(playMatch[1]);
      const distance = parseInt(playMatch[2]);
      const yardlineStr = playMatch[3].trim();
      const playDescription = playMatch[4].toLowerCase();
      if (line.toLowerCase().includes("penalty") || line.toLowerCase().includes("timeout")) {
        continue;
      }

      let yardline_100 = 50;
      if (yardlineStr.includes("PHI")) {
        yardline_100 = 100 - parseInt(yardlineStr.split(" ")[1]);
      } else if (oppCode && yardlineStr.includes(oppCode)) {
        yardline_100 = parseInt(yardlineStr.split(" ")[1]);
      }

      let playType = "Other";
      if (["pass", "sacked", "scrambles"].some(k => playDescription.includes(k))) {
        playType = "Pass";
      } else if (["tackle", "guard", "end", "up the middle"].some(k => playDescription.includes(k))) {
        playType = "Run";
      } else if (playDescription.includes("field goal")) {
        playType = "Field Goal";
      } else if (playDescription.includes("punt")) {
        playType = "Punt";
      } else if (playDescription.includes("kneels")) {
        playType = "Kneel";
      }

      if (playType === "Other") continue;

      const clockMatch = clockPattern.exec(line);
      const timeRemainingQuarter = clockMatch
        ? parseInt(clockMatch[1] || 0) * 60 + parseInt(clockMatch[2])
        : 900;

      dataList.push({
        Quarter: currentQuarter,
        Down: down,
        Distance: distance,
        Yardline_100: yardline_100,
        Score_Differential: phiScore - oppScore,
        Time_Remaining_Quarter: timeRemainingQuarter,
        Play_Type: playType,
      });
    }
  }

  return dataList;
}

// Load data from file at startup
function loadInitialData() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`PBP file not found: ${DATA_FILE}`);
    return;
  }
  const rawText = fs.readFileSync(DATA_FILE, "utf-8");
  playsData = parsePBP(rawText);
  console.log(`[INFO] Loaded ${playsData.length} plays from PBP file.`);
}

// Apply football rules to adjust predictions (rule-based)
function applyFootballRules(input) {
  let { Quarter, Down, Distance, Yardline_100, Score_Differential, Time_Remaining_Quarter } = input;

  let adjusted = { Run: 0.25, Pass: 0.25, "Field Goal": 0.25, Punt: 0.25 };

  const downNum = parseInt(Down);
  const distanceNum = parseInt(Distance);
  const yardlineNum = parseInt(Yardline_100);
  const quarterNum = parseInt(Quarter);
  const timeSec = parseInt(Time_Remaining_Quarter);
  const scoreDiff = parseInt(Score_Differential);

  // ---------- RULES ----------
  // 1. Punt elimination inside opponent 40
  if (yardlineNum < 50) adjusted["Punt"] = 0.0;

  // 2. End-of-quarter/game rules
  if (downNum === 4 && distanceNum <= 10 && yardlineNum < 10) adjusted["Punt"] = 0.0;
  if (quarterNum === 4 && downNum === 4 && timeSec < 120 && scoreDiff <= 0) adjusted["Punt"] = 0.0;
  if (quarterNum === 4 && downNum === 4 && timeSec <= 5 && scoreDiff >= -2 && scoreDiff <= 0) {
    adjusted = { Run: 0, Pass: 0, "Field Goal": 1.0, Punt: 0 };
    return adjusted;
  }

  // 3. Go-For-It 4th down boost
  if (downNum === 4 && distanceNum <= 6 && yardlineNum <= 50) {
    adjusted["Punt"] = 0.0;
    adjusted["Field Goal"] = 0.005;
    adjusted["Run"] = 0.4975;
    adjusted["Pass"] = 0.4975;
  }

  // 4. Goal line plunge boost
  if (downNum === 4 && distanceNum <= 2 && yardlineNum <= 2) {
    adjusted["Run"] *= 2.0;
    adjusted["Pass"] *= 0.5;
  }

  // 5. 4th & 1 almost guaranteed Run
  if (downNum === 4 && distanceNum === 1) {
    adjusted["Run"] = 0.995;
    ["Pass", "Field Goal", "Punt"].forEach(k => (adjusted[k] = 0.005 / 3));
  }

  // 6. Reduce Punt probability in own 25–50
  if (yardlineNum >= 50 && yardlineNum <= 75) adjusted["Punt"] = 0.005;

  // 7. Eliminate impossible FGs (>47 yards)
  if (yardlineNum > 47) adjusted["Field Goal"] = 0.0;

  // Normalize
  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  for (let k in adjusted) adjusted[k] /= total;

  return adjusted;
}

// Determine predicted play
function getPredictedPlay(adjusted) {
  let maxPlay = "Run";
  let maxVal = -1;
  for (let k in adjusted) {
    if (adjusted[k] > maxVal) {
      maxVal = adjusted[k];
      maxPlay = k;
    }
  }
  return maxPlay;
}

// ---------- ROUTES ----------

// Predict play (rule-based)
app.post("/predict", (req, res) => {
  const input = req.body;
  const adjusted = applyFootballRules(input);
  const predicted = getPredictedPlay(adjusted);
  res.json({ adjustedProba: adjusted, predicted });
});

// Train / add new play (admin only)
app.post("/train", (req, res) => {
  const { username, password, playData } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Validate required fields
  const requiredFields = ["Quarter", "Down", "Distance", "Yardline_100", "Score_Differential", "Time_Remaining_Quarter", "Play_Type"];
  for (let f of requiredFields) {
    if (!(f in playData)) {
      return res.status(400).json({ error: `Missing field: ${f}` });
    }
  }

  playsData.push(playData);
  res.json({ message: "Play added successfully", totalPlays: playsData.length });
});

// Get all plays (for debugging)
app.get("/plays", (req, res) => {
  res.json(playsData);
});

// ---------- START SERVER ----------
loadInitialData();
app.listen(PORT, () => {
  console.log(`[INFO] NFL Predictor backend running on port ${PORT}`);
});
