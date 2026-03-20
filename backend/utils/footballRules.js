// backend/utils/footballRules.js
export function applyFootballRules(inputData, proba) {
  const {
    Quarter,
    Down,
    Distance,
    Yardline_100,
    Score_Differential,
    Time_Remaining_Quarter,
  } = inputData;

  let adjusted = { ...proba };

  // -------------------------
  // Punt elimination in opponent territory
  // -------------------------
  if (Yardline_100 < 50) adjusted.Punt = 0.0;

  // -------------------------
  // End-of-quarter/game rules
  // -------------------------
  if (Down === 4 && Distance <= 10 && Yardline_100 < 10) adjusted.Punt = 0.0;

  if (Quarter === 4 && Down === 4 && Time_Remaining_Quarter < 120 && Score_Differential <= 0) {
    adjusted.Punt = 0.0;
  }

  if (Quarter === 4 && Down === 4 && Time_Remaining_Quarter <= 5 && Score_Differential <= 0) {
    adjusted = { Run: 0, Pass: 0, Punt: 0, "Field Goal": 1.0 };
    return adjusted;
  }

  // -------------------------
  // Go-For-It 4th down boost
  // -------------------------
  if (Down === 4 && Distance <= 6 && Yardline_100 <= 50) {
    adjusted.Punt = 0.0;
    if (adjusted["Field Goal"] !== undefined) adjusted["Field Goal"] = 0.005;
    adjusted.Run = 1.0;
    adjusted.Pass = 1.0;
  }

  // -------------------------
  // 4th & 1 boost
  // -------------------------
  if (Down === 4 && Distance === 1) {
    adjusted.Run = 0.995;
    for (let k of Object.keys(adjusted)) {
      if (k !== "Run") adjusted[k] = 0.005 / (Object.keys(adjusted).length - 1);
    }
  }

  // -------------------------
  // Reduce Punt in own 25–50
  // -------------------------
  if (Yardline_100 >= 50 && Yardline_100 <= 75) adjusted.Punt = 0.005;

  // -------------------------
  // Impossible FGs
  // -------------------------
  if (Yardline_100 > 47) adjusted["Field Goal"] = 0.0;

  // Normalize
  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (let k of Object.keys(adjusted)) {
      adjusted[k] /= total;
    }
  }

  return adjusted;
}
