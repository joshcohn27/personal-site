import { useCallback, useEffect, useMemo, useState } from "react";

interface LotteryTeam {
  name: string;
  odds: number;
  combos: number;
  protected?: { top: number; transferTo: string };
}

interface NonLotteryTeam {
  name: string;
  origPick: number;
}

interface Prospect {
  rank: number;
  name: string;
  pos: string;
  league: string;
}

interface DraftPick {
  team: string;
  pick: number;
  note: string;
  player: Prospect | null;
}

interface LotteryComboRow {
  id: number;
  balls: [number, number, number, number];
  team: string;
  teamCode: string;
  teamSequence: number | null;
}

const CSV_PATH = "/combos.csv";
const REDRAW_COMBO = "11,12,13,14";

const REAL_PICK_1_BALLS = [7, 2, 11, 12];
const REAL_PICK_2_BALLS = [11, 4, 3, 7];

const LOTTERY_TEAMS: LotteryTeam[] = [
  { name: "Vancouver", odds: 18.5, combos: 185 },
  { name: "Chicago", odds: 13.5, combos: 135 },
  { name: "NY Rangers", odds: 11.5, combos: 115 },
  { name: "Calgary", odds: 9.5, combos: 95 },
  { name: "Toronto", odds: 8.5, combos: 85, protected: { top: 5, transferTo: "Boston" } },
  { name: "Seattle", odds: 7.5, combos: 75 },
  { name: "Winnipeg", odds: 6.5, combos: 65 },
  { name: "Florida", odds: 6.0, combos: 60 },
  { name: "San Jose", odds: 5.0, combos: 50 },
  { name: "Nashville", odds: 3.5, combos: 35 },
  { name: "St. Louis", odds: 3.0, combos: 30 },
  { name: "New Jersey", odds: 2.5, combos: 25 },
  { name: "NY Islanders", odds: 2.0, combos: 20 },
  { name: "Columbus", odds: 1.5, combos: 15 },
  { name: "St. Louis (DET)", odds: 0.5, combos: 5 },
  { name: "Washington", odds: 0.5, combos: 5 },
];

const NON_LOTTERY: NonLotteryTeam[] = [
  { name: "Los Angeles", origPick: 17 },
  { name: "Washington (ANA)", origPick: 18 },
  { name: "Utah", origPick: 19 },
  { name: "San Jose (EDM)", origPick: 20 },
  { name: "Philadelphia", origPick: 21 },
  { name: "Pittsburgh", origPick: 22 },
  { name: "Boston", origPick: 23 },
  { name: "Seattle (TBL)", origPick: 24 },
  { name: "NY Rangers (DAL)", origPick: 25 },
  { name: "Calgary (VGK)", origPick: 26 },
  { name: "Buffalo", origPick: 27 },
  { name: "Vancouver (MIN)", origPick: 28 },
  { name: "Montreal", origPick: 29 },
  { name: "Carolina", origPick: 30 },
  { name: "St. Louis (COL)", origPick: 31 },
  { name: "Ottawa", origPick: 32 },
];

const BALL_COLORS: [string, string][] = [
  ["#c0392b", "#e74c3c"],
  ["#d4ac0d", "#f1c40f"],
  ["#1a5276", "#2980b9"],
  ["#145a32", "#27ae60"],
  ["#6c3483", "#8e44ad"],
  ["#117a65", "#1abc9c"],
  ["#7b241c", "#e74c3c"],
  ["#784212", "#e67e22"],
  ["#1c2833", "#566573"],
  ["#0e6655", "#1abc9c"],
  ["#4a235a", "#9b59b6"],
  ["#78281f", "#cb4335"],
  ["#154360", "#5dade2"],
  ["#1e8449", "#58d68d"],
];

const PROSPECTS: Prospect[] = [
  { rank: 1, name: "Gavin McKenna", pos: "LW", league: "NCAA" },
  { rank: 2, name: "Chase Reid", pos: "RD", league: "OHL" },
  { rank: 3, name: "Ivar Stenberg", pos: "LW/RW", league: "SHL" },
  { rank: 4, name: "Caleb Malhotra", pos: "C", league: "OHL" },
  { rank: 5, name: "Alberts Smits", pos: "LD", league: "Liiga" },
  { rank: 6, name: "Keaton Verhoeff", pos: "RD", league: "NCAA" },
  { rank: 7, name: "Daxon Rudolph", pos: "RD", league: "WHL" },
  { rank: 8, name: "Adam Novotny", pos: "LW/RW", league: "OHL" },
  { rank: 9, name: "Ethan Belchetz", pos: "LW", league: "OHL" },
  { rank: 10, name: "Viggo Bjorck", pos: "C/RW", league: "SHL" },
  { rank: 11, name: "Ryan Roobroeck", pos: "C", league: "OHL" },
  { rank: 12, name: "Ryan Lin", pos: "RD", league: "WHL" },
  { rank: 13, name: "Carson Carels", pos: "LD", league: "WHL" },
  { rank: 14, name: "Tynan Lawrence", pos: "C", league: "NCAA" },
  { rank: 15, name: "Xavier Villeneuve", pos: "LD", league: "QMJHL" },
  { rank: 16, name: "Oliver Suvanto", pos: "C", league: "Liiga" },
  { rank: 17, name: "Mathis Preston", pos: "F", league: "" },
  { rank: 18, name: "Oscar Hemming", pos: "F", league: "NCAA" },
  { rank: 19, name: "Elton Hermansson", pos: "RW/LW", league: "HA" },
  { rank: 20, name: "Malte Gustafsson", pos: "LD", league: "U20 Nationell" },
  { rank: 21, name: "JP Hurlbert", pos: "F", league: "WHL" },
  { rank: 22, name: "Juho Piiparinen", pos: "RD", league: "Liiga" },
  { rank: 23, name: "Ilya Morozov", pos: "F", league: "NCAA" },
  { rank: 24, name: "Marcus Nordmark", pos: "RW", league: "U20 Nationell" },
  { rank: 25, name: "Yegor Shilov", pos: "C", league: "QMJHL" },
  { rank: 26, name: "Nikita Klepov", pos: "F", league: "OHL" },
  { rank: 27, name: "Brooks Rogowski", pos: "C", league: "OHL" },
  { rank: 28, name: "Maddox Dagenais", pos: "C", league: "QMJHL" },
  { rank: 29, name: "Alexander Command", pos: "C", league: "U20 Nationell" },
  { rank: 30, name: "William Hakansson", pos: "LD", league: "SHL" },
  { rank: 31, name: "Giorgos Pantelas", pos: "RD", league: "WHL" },
  { rank: 32, name: "Niklas Aaram-Olsen", pos: "RW/LW", league: "U20 Nationell" },
  { rank: 33, name: "Jaxon Cover", pos: "LW", league: "OHL" },
  { rank: 34, name: "Gleb Pugachyov", pos: "RW/LW", league: "MHL" },
  { rank: 35, name: "Jack Hextall", pos: "C", league: "USHL" },
  { rank: 36, name: "Tomas Chrenko", pos: "C", league: "Slovak" },
  { rank: 37, name: "Simas Ignatavicius", pos: "F", league: "NL" },
  { rank: 38, name: "Markus Ruck", pos: "F", league: "WHL" },
  { rank: 39, name: "Casey Mutryn", pos: "F", league: "NTDP" },
  { rank: 40, name: "Adam Valentini", pos: "F", league: "NCAA" },
  { rank: 41, name: "Adam Goljer", pos: "RD", league: "Slovak" },
  { rank: 42, name: "Tommy Bleyl", pos: "RD", league: "QMJHL" },
  { rank: 43, name: "Ben Macbeath", pos: "LD", league: "WHL" },
  { rank: 44, name: "Nikita Shcherbakov", pos: "LD", league: "MHL" },
];

function parseComboCsv(csv: string): LotteryComboRow[] {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [id, ball1, ball2, ball3, ball4, teamCode, teamName, teamSequence] = line.split(",");

      return {
        id: Number(id),
        balls: [Number(ball1), Number(ball2), Number(ball3), Number(ball4)] as [
          number,
          number,
          number,
          number
        ],
        teamCode,
        team: teamName,
        teamSequence: teamSequence ? Number(teamSequence) : null,
      };
    });
}

function getAliveTeams(comboRows: LotteryComboRow[], drawnSorted: number[]): Set<string> {
  const alive = new Set<string>();

  for (const row of comboRows) {
    if (row.teamCode === "REDRAW") continue;
    if (drawnSorted.every((ball) => row.balls.includes(ball))) {
      alive.add(row.team);
    }
  }

  return alive;
}

function getPossibleFourthBallsByTeam(
  comboRows: LotteryComboRow[],
  drawnSorted: number[]
): Record<string, number[]> {
  if (drawnSorted.length !== 3) return {};

  const map: Record<string, Set<number>> = {};

  for (const row of comboRows) {
    if (row.teamCode === "REDRAW") continue;
    if (!drawnSorted.every((ball) => row.balls.includes(ball))) continue;

    const missingBall = row.balls.find((ball) => !drawnSorted.includes(ball));
    if (missingBall === undefined) continue;

    if (!map[row.team]) map[row.team] = new Set<number>();
    map[row.team].add(missingBall);
  }

  return Object.fromEntries(
    Object.entries(map).map(([team, balls]) => [team, [...balls].sort((a, b) => a - b)])
  );
}

function resolveCombo(comboRows: LotteryComboRow[], balls: number[]): LotteryComboRow | null {
  const sortedKey = [...balls].sort((a, b) => a - b).join(",");

  if (sortedKey === REDRAW_COMBO) {
    return {
      id: 1001,
      balls: [11, 12, 13, 14],
      team: "Pick Again",
      teamCode: "REDRAW",
      teamSequence: null,
    };
  }

  return comboRows.find((row) => row.balls.join(",") === sortedKey) ?? null;
}

function resolveProtection(teamName: string, pickNum: number): DraftPick {
  const td = LOTTERY_TEAMS.find((t) => t.name === teamName);
  if (!td?.protected) return { team: teamName, pick: pickNum, note: "", player: null };

  const { top, transferTo } = td.protected;
  if (pickNum <= top) return { team: teamName, pick: pickNum, note: "", player: null };

  return {
    team: transferTo,
    pick: pickNum,
    note: `(via ${teamName}, protected top-${top})`,
    player: null,
  };
}

function DrawnBall({ n, isNew }: { n: number; isNew: boolean }) {
  const [bg, light] = BALL_COLORS[n - 1] ?? ["#555", "#888"];

  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${light}, ${bg})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 28,
        fontWeight: 900,
        color: "#fff",
        textShadow: "0 1px 3px rgba(0,0,0,.6)",
        boxShadow: "0 8px 24px rgba(0,0,0,.45)",
        flexShrink: 0,
        animation: isNew ? "ballDrop .4s cubic-bezier(.22,.61,.36,1)" : "none",
      }}
    >
      {n}
    </div>
  );
}

function BallSlot({ idx }: { idx: number }) {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        border: "2px dashed #2d3a50",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#2d3a50",
        fontSize: 13,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {idx + 1}
    </div>
  );
}

export default function NHLMockAndLotto() {
  const [comboRows, setComboRows] = useState<LotteryComboRow[]>([]);
  const [csvStatus, setCsvStatus] = useState("Loading NHL combination table...");

  const [drawnBalls, setDrawnBalls] = useState<number[]>([]);
  const [currentDraw, setCurrentDraw] = useState(1);
  const [pick1Winner, setPick1Winner] = useState<string | null>(null);
  const [pick2Winner, setPick2Winner] = useState<string | null>(null);
  const [resultLabel, setResultLabel] = useState("Ready to draw");
  const [resultTeam, setResultTeam] = useState("");
  const [lottoPhase, setLottoPhase] = useState<"lottery" | "draft">("lottery");
  const [lottoDone, setLottoDone] = useState(false);
  const [newBallIdx, setNewBallIdx] = useState<number | null>(null);

  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
  const [currentPickIdx, setCurrentPickIdx] = useState(0);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [takenProspects, setTakenProspects] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy Results");

  useEffect(() => {
    fetch(CSV_PATH)
      .then((res) => {
        if (!res.ok) throw new Error("CSV not found");
        return res.text();
      })
      .then((text) => {
        const parsed = parseComboCsv(text);
        setComboRows(parsed);
        // setCsvStatus(`Loaded ${parsed.length - 1} NHL combinations plus redraw combo.`);
      })
      .catch(() => {
        setCsvStatus("Could not load CSV. Make sure combos.csv is in /public.");
      });
  }, []);

  const sortedDrawn = useMemo(() => [...drawnBalls].sort((a, b) => a - b), [drawnBalls]);

  const aliveTeams = useMemo(() => {
    if (drawnBalls.length === 0 || drawnBalls.length >= 4 || lottoDone) {
      return new Set(LOTTERY_TEAMS.map((t) => t.name));
    }

    return getAliveTeams(comboRows, sortedDrawn);
  }, [comboRows, drawnBalls.length, lottoDone, sortedDrawn]);

  const possibleFourthBallsByTeam = useMemo(() => {
    if (drawnBalls.length !== 3 || lottoDone) return {};
    return getPossibleFourthBallsByTeam(comboRows, sortedDrawn);
  }, [comboRows, drawnBalls.length, lottoDone, sortedDrawn]);

  const comboDisplay = [0, 1, 2, 3]
    .map((i) => (sortedDrawn[i] !== undefined ? String(sortedDrawn[i]).padStart(2, "0") : "__"))
    .join(" – ");

  const isDraftDone = currentPickIdx >= draftPicks.length && draftPicks.length > 0;
  const curPick = draftPicks[currentPickIdx];

  const finalizeBoth = useCallback((p1: string, p2: string) => {
    const order: DraftPick[] = [];

    order.push(resolveProtection(p1, 1));
    order.push(resolveProtection(p2, 2));

    LOTTERY_TEAMS.map((t) => t.name)
      .filter((n) => n !== p1 && n !== p2)
      .forEach((name, i) => order.push(resolveProtection(name, i + 3)));

    NON_LOTTERY.forEach((t) => {
      order.push({ team: t.name, pick: t.origPick, note: "", player: null });
    });

    setDraftPicks(order);
    setLottoDone(true);
  }, []);

  const resetLottery = useCallback(() => {
    setDrawnBalls([]);
    setCurrentDraw(1);
    setPick1Winner(null);
    setPick2Winner(null);
    setResultLabel("Ready to draw");
    setResultTeam("");
    setLottoDone(false);
    setLottoPhase("lottery");
    setDraftPicks([]);
    setCurrentPickIdx(0);
    setSelectedProspect(null);
    setTakenProspects(new Set());
    setSearch("");
    setNewBallIdx(null);
    setCopyLabel("Copy Results");
  }, []);

  const evaluateCombo = useCallback(
    (balls: number[], draw: number, p1w: string | null) => {
      const resolved = resolveCombo(comboRows, balls);

      if (!resolved || resolved.teamCode === "REDRAW") {
        setResultLabel("REDRAW — Invalid combo [11-12-13-14]");
        setResultTeam("");

        setTimeout(() => {
          setDrawnBalls([]);
          setNewBallIdx(null);
          setResultLabel(draw === 1 ? "Draw 1 ready" : "Draw 2 ready");
        }, 1800);

        return;
      }

      const winner = resolved.team;
      const teamIdx = LOTTERY_TEAMS.findIndex((t) => t.name === winner);

      if (draw === 1) {
        if (teamIdx >= 11) {
          const worst = LOTTERY_TEAMS[0].name;
          setPick1Winner(worst);
          setPick2Winner(winner);
          setResultLabel(`Rank 12+ winner — ${worst} gets Pick 1`);
          setResultTeam(`${winner} gets Pick 2`);
          finalizeBoth(worst, winner);
        } else {
          setPick1Winner(winner);
          setResultLabel("Pick 1 awarded to");
          setResultTeam(winner);

          setTimeout(() => {
            setCurrentDraw(2);
            setDrawnBalls([]);
            setNewBallIdx(null);
            setResultLabel("Draw 2 ready");
            setResultTeam("");
          }, 1400);
        }

        return;
      }

      if (winner === p1w) {
        setResultLabel("REDRAW — Same team won both!");
        setResultTeam(winner);

        setTimeout(() => {
          setDrawnBalls([]);
          setNewBallIdx(null);
          setResultLabel("Draw 2 ready");
          setResultTeam("");
        }, 1800);

        return;
      }

      setPick2Winner(winner);
      setResultLabel("Pick 2 awarded to");
      setResultTeam(winner);
      finalizeBoth(p1w!, winner);
    },
    [comboRows, finalizeBoth]
  );

  const drawOneBall = useCallback(() => {
    if (drawnBalls.length >= 4 || lottoDone || comboRows.length === 0) return;

    const remaining = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].filter(
      (b) => !drawnBalls.includes(b)
    );
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    const newBalls = [...drawnBalls, pick];

    setDrawnBalls(newBalls);
    setNewBallIdx(newBalls.length - 1);

    if (newBalls.length === 4) {
      evaluateCombo(newBalls, currentDraw, pick1Winner);
    }
  }, [comboRows.length, currentDraw, drawnBalls, evaluateCombo, lottoDone, pick1Winner]);

  const simDraw = useCallback(() => {
    if (lottoDone || comboRows.length === 0) return;

    const balls = [...drawnBalls];

    while (balls.length < 4) {
      const remaining = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].filter(
        (b) => !balls.includes(b)
      );
      balls.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    setDrawnBalls(balls);
    setNewBallIdx(null);
    evaluateCombo(balls, currentDraw, pick1Winner);
  }, [comboRows.length, currentDraw, drawnBalls, evaluateCombo, lottoDone, pick1Winner]);

  const useRealResults = useCallback(() => {
    if (comboRows.length === 0) return;

    resetLottery();

    setDrawnBalls(REAL_PICK_2_BALLS);
    setCurrentDraw(2);
    setPick1Winner("Toronto");
    setPick2Winner("San Jose");
    setResultLabel("Real 2026 NHL lottery result");
    setResultTeam("Toronto — Pick 1 · San Jose — Pick 2");
    finalizeBoth("Toronto", "San Jose");
    setLottoDone(true);
    setNewBallIdx(null);
  }, [comboRows.length, finalizeBoth, resetLottery]);

  const makePick = useCallback(() => {
    if (!selectedProspect || currentPickIdx >= draftPicks.length) return;

    setDraftPicks((prev) =>
      prev.map((p, i) => (i === currentPickIdx ? { ...p, player: selectedProspect } : p))
    );
    setTakenProspects((prev) => new Set([...prev, selectedProspect.rank]));
    setSelectedProspect(null);
    setCurrentPickIdx((i) => i + 1);
  }, [currentPickIdx, draftPicks.length, selectedProspect]);

  const autoPick = useCallback(() => {
    const next = PROSPECTS.find((p) => !takenProspects.has(p.rank));
    if (!next || currentPickIdx >= draftPicks.length) return;

    setDraftPicks((prev) => prev.map((p, i) => (i === currentPickIdx ? { ...p, player: next } : p)));
    setTakenProspects((prev) => new Set([...prev, next.rank]));
    setSelectedProspect(null);
    setCurrentPickIdx((i) => i + 1);
  }, [currentPickIdx, draftPicks.length, takenProspects]);

  const autoPickAll = useCallback(() => {
    const taken = new Set(takenProspects);
    let idx = currentPickIdx;

    setDraftPicks((prev) => {
      const updated = [...prev];

      while (idx < updated.length) {
        const next = PROSPECTS.find((p) => !taken.has(p.rank));
        if (!next) break;

        updated[idx] = { ...updated[idx], player: next };
        taken.add(next.rank);
        idx++;
      }

      return updated;
    });

    setTakenProspects(taken);
    setCurrentPickIdx(idx);
  }, [currentPickIdx, takenProspects]);

  const copyResults = useCallback(() => {
    const lines = draftPicks
      .map(
        (p) =>
          `${p.pick}. ${p.team}${p.note ? " " + p.note : ""}: ${
            p.player ? `${p.player.name} (${p.player.pos}${p.player.league ? ", " + p.player.league : ""})` : "—"
          }`
      )
      .join("\n");

    navigator.clipboard.writeText(`2026 NHL Mock Draft - Round 1\n\n${lines}`).then(() => {
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Results"), 2000);
    });
  }, [draftPicks]);

  const filteredProspects = PROSPECTS.filter(
    (p) =>
      !takenProspects.has(p.rank) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.pos.toLowerCase().includes(search.toLowerCase()) ||
        p.league.toLowerCase().includes(search.toLowerCase()))
  );

  const S: Record<string, React.CSSProperties> = {
    app: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: 24,
      fontFamily: "'Barlow', sans-serif",
      background: "#0a0e1a",
      minHeight: "100vh",
      color: "#e2e8f0",
    },
    header: {
      textAlign: "center",
      padding: "28px 0 22px",
      borderBottom: "1px solid #2d3a50",
      marginBottom: 24,
    },
    h1: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 46,
      fontWeight: 900,
      letterSpacing: 2,
      color: "#f5c842",
      textTransform: "uppercase",
      margin: 0,
    },
    sub: {
      color: "#94a3b8",
      fontSize: 14,
      letterSpacing: 0.5,
      marginTop: 4,
    },
    machineSection: {
      display: "grid",
      gridTemplateColumns: "1fr 390px",
      gap: 20,
      marginBottom: 24,
    },
    machine: {
      background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
      border: "1px solid #2d3a50",
      borderRadius: 16,
      boxShadow: "0 18px 50px rgba(0,0,0,.24)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
    },
    machineTitleStyle: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 2,
      color: "#7dd3f5",
      textTransform: "uppercase",
    },
    phaseLabel: {
      fontSize: 13,
      color: "#94a3b8",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    ballDisplay: {
      width: 340,
      height: 156,
      background: "#1a2236",
      border: "1px solid #2d3a50",
      borderRadius: 78,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: "0 26px",
      overflow: "hidden",
    },
    comboBox: {
      background: "#1a2236",
      border: "1px solid #2d3a50",
      borderRadius: 12,
      padding: "12px 22px",
      textAlign: "center",
      width: "100%",
    },
    comboLabel: {
      fontSize: 13,
      color: "#94a3b8",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    comboNumbers: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 34,
      fontWeight: 700,
      color: "#f5c842",
      letterSpacing: 4,
      minHeight: 42,
    },
    resultBanner: {
      background: "#1a2236",
      border: "1px solid #2d3a50",
      borderRadius: 12,
      padding: "12px 16px",
      textAlign: "center",
      minHeight: 62,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    resultPickLabel: {
      fontSize: 13,
      color: "#94a3b8",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    resultTeamName: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 28,
      fontWeight: 700,
      color: "#22c55e",
      letterSpacing: 1,
    },
    btnRow: {
      display: "flex",
      gap: 12,
      width: "100%",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    oddsPanel: {
      background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
      border: "1px solid #2d3a50",
      borderRadius: 16,
      boxShadow: "0 18px 50px rgba(0,0,0,.24)",
      padding: 16,
      overflowY: "auto",
      maxHeight: 620,
    },
    drawingIndicator: {
      background: "#1a2236",
      border: "1px solid #2d3a50",
      borderRadius: 10,
      padding: "8px 12px",
      textAlign: "center",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 1,
      color: "#7dd3f5",
      textTransform: "uppercase",
    },
    oddsTitle: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: "#94a3b8",
      marginBottom: 10,
      paddingBottom: 8,
      borderBottom: "1px solid #2d3a50",
      marginTop: 14,
    },
    draftSection: {
      background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
      border: "1px solid #2d3a50",
      borderRadius: 16,
      boxShadow: "0 18px 50px rgba(0,0,0,.24)",
      padding: 24,
    },
    draftLayout: {
      display: "grid",
      gridTemplateColumns: "1fr 340px",
      gap: 20,
    },
    draftBoardWrap: {
      overflowY: "auto",
      maxHeight: 650,
    },
  };

  const btn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    border: "1px solid #2d3a50",
    borderRadius: 10,
    padding: "10px 18px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    background: "#222d42",
    color: "#94a3b8",
    ...extra,
  });

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap');

        @keyframes ballDrop {
          from { transform: translateY(-70px) scale(.7); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes aliveGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
          50% { box-shadow: 0 0 6px 2px rgba(34,197,94,0.25); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #2d3a50; border-radius: 2px; }

        @media (max-width: 820px) {
          .nhl-machine-section,
          .nhl-draft-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <header style={S.header}>
        <h1 style={S.h1}>2026 NHL Draft Lottery Simulator</h1>
        {/* <div style={S.sub}>Official combination table, real-result mode, and Round 1 mock draft</div> */}
        {/* <div style={{ ...S.sub, marginTop: 8 }}>{csvStatus}</div> */}
      </header>

      {lottoPhase === "lottery" && (
        <div className="nhl-machine-section" style={S.machineSection}>
          <section style={S.machine}>
            <div style={S.machineTitleStyle}>Lottery Draw</div>
            <div style={S.phaseLabel}>
              {currentDraw === 1 ? "Drawing 1 — 1st Overall Pick" : "Drawing 2 — 2nd Overall Pick"}
            </div>

            <div style={S.ballDisplay}>
              {[0, 1, 2, 3].map((idx) =>
                drawnBalls[idx] !== undefined ? (
                  <DrawnBall key={idx} n={drawnBalls[idx]} isNew={newBallIdx === idx} />
                ) : (
                  <BallSlot key={idx} idx={idx} />
                )
              )}
            </div>

            <div style={S.comboBox}>
              <div style={S.comboLabel}>Current combination</div>
              <div style={S.comboNumbers}>{comboDisplay}</div>
            </div>

            <div style={S.resultBanner}>
              <div style={S.resultPickLabel}>{resultLabel}</div>
              {resultTeam && <div style={S.resultTeamName}>{resultTeam}</div>}
            </div>

            <div style={S.btnRow}>
              <button
                style={btn({ background: "#f5c842", color: "#0a0e1a", borderColor: "#f5c842" })}
                onClick={drawOneBall}
                disabled={drawnBalls.length >= 4 || lottoDone || comboRows.length === 0}
              >
                Draw Ball
              </button>
              <button
                style={btn({ color: "#7dd3f5", borderColor: "#2d3a50" })}
                onClick={simDraw}
                disabled={drawnBalls.length >= 4 || lottoDone || comboRows.length === 0}
              >
                Simulate Draw
              </button>
              <button
                style={btn({ background: "#1d4ed8", color: "#dbeafe", borderColor: "#2563eb" })}
                onClick={useRealResults}
                disabled={comboRows.length === 0}
              >
                Use Real Result
              </button>
            </div>

            <div style={S.btnRow}>
              <button style={btn({ color: "#ef4444", borderColor: "#ef4444" })} onClick={resetLottery}>
                Reset
              </button>
              {lottoDone && (
                <button
                  style={btn({ background: "#3b82f6", color: "#fff", borderColor: "#3b82f6" })}
                  onClick={() => setLottoPhase("draft")}
                >
                  Start Mock Draft
                </button>
              )}
            </div>

            <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", lineHeight: 1.5 }}>
              {drawnBalls.length === 3 && !lottoDone
                ? "After three balls, the team list shows which fourth ball would complete each alive combination."
                : "Draw manually, simulate the remaining balls, or use the real-life lottery result."}
              <div style={{ marginTop: 6 }}>
                Real-result mode uses Toronto for Pick 1 ({REAL_PICK_1_BALLS.join(", ")}) and San Jose for Pick 2 ({REAL_PICK_2_BALLS.join(", ")}).
              </div>
            </div>
          </section>

          <aside style={S.oddsPanel}>
            <div style={S.drawingIndicator}>
              {drawnBalls.length === 3
                ? "3 balls drawn — possible fourth balls"
                : drawnBalls.length > 0 && drawnBalls.length < 4
                  ? "Teams still alive"
                  : lottoDone
                    ? "Lottery complete"
                    : `Draw ${currentDraw} of 2`}
            </div>

            <div style={S.oddsTitle}>Lottery Teams</div>
            {LOTTERY_TEAMS.map((team, idx) => {
              const isP1 = pick1Winner === team.name;
              const isP2 = pick2Winner === team.name;
              const won = isP1 || isP2;
              const ballsDrawn = drawnBalls.length;
              const isAlive = ballsDrawn > 0 && ballsDrawn < 4 && aliveTeams.has(team.name);
              const isEliminated = ballsDrawn > 0 && ballsDrawn < 4 && !aliveTeams.has(team.name) && !lottoDone;
              const wonAndDone = lottoDone && won;
              const elimAndDone = lottoDone && !won;
              const fourthBalls = possibleFourthBallsByTeam[team.name] ?? [];

              return (
                <div
                  key={team.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "26px 1fr 70px 72px",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 6px",
                    borderRadius: 10,
                    marginBottom: 6,
                    transition: "all .2s",
                    opacity: elimAndDone ? 0.28 : isEliminated ? 0.3 : 1,
                    background: wonAndDone ? "rgba(34,197,94,.08)" : isAlive ? "rgba(34,197,94,.05)" : "transparent",
                    border: wonAndDone
                      ? "1px solid rgba(34,197,94,.3)"
                      : isAlive
                        ? "1px solid rgba(34,197,94,.2)"
                        : "1px solid transparent",
                    animation: isAlive ? "aliveGlow 2s ease-in-out infinite" : "none",
                  }}
                >
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: 13,
                      fontFamily: "'Barlow Condensed', sans-serif",
                    }}
                  >
                    {idx + 1}
                  </span>

                  <div>
                    <div
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: wonAndDone ? "#22c55e" : isAlive ? "#d1fae5" : "#e2e8f0",
                      }}
                    >
                      {team.name}
                      {team.protected ? "*" : ""}
                      {isAlive && !lottoDone && (
                        <span
                          style={{
                            marginLeft: 5,
                            fontSize: 9,
                            color: "#22c55e",
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            textTransform: "uppercase",
                          }}
                        >
                          Alive
                        </span>
                      )}
                      {isEliminated && (
                        <span
                          style={{
                            marginLeft: 5,
                            fontSize: 9,
                            color: "#ef4444",
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            textTransform: "uppercase",
                          }}
                        >
                          Out
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>
                      {team.odds}% · {team.combos} combos
                    </div>

                    {fourthBalls.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
                        {fourthBalls.map((ball) => (
                          <span
                            key={ball}
                            style={{
                              border: "1px solid #f5c842",
                              color: "#f5c842",
                              borderRadius: 999,
                              padding: "2px 6px",
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            Ball {ball}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      textAlign: "right",
                      color: "#f5c842",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {team.odds}%
                  </span>

                  <span style={{ textAlign: "center" }}>
                    {isP1 && (
                      <span
                        style={{
                          background: "rgba(34,197,94,.15)",
                          color: "#22c55e",
                          border: "1px solid rgba(34,197,94,.4)",
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "3px 7px",
                          borderRadius: 4,
                        }}
                      >
                        Pick 1
                      </span>
                    )}
                    {isP2 && (
                      <span
                        style={{
                          background: "rgba(34,197,94,.15)",
                          color: "#22c55e",
                          border: "1px solid rgba(34,197,94,.4)",
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "3px 7px",
                          borderRadius: 4,
                        }}
                      >
                        Pick 2
                      </span>
                    )}
                    {!won && (
                      <span
                        style={{
                          background: "#222d42",
                          color: "#f5c842",
                          border: "1px solid #2d3a50",
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "3px 7px",
                          borderRadius: 4,
                        }}
                      >
                        {lottoDone ? idx + 3 : idx + 1}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}

            <div style={S.oddsTitle}>Non-Lottery Order</div>
            {NON_LOTTERY.map((team) => (
              <div
                key={team.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "26px 1fr 70px 72px",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 6px",
                }}
              >
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: 11,
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {team.origPick}
                </span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: "#94a3b8" }}>
                  {team.name}
                </span>
                <span style={{ textAlign: "right", color: "#94a3b8", fontSize: 13 }}>—</span>
                <span />
              </div>
            ))}
          </aside>
        </div>
      )}

      {lottoPhase === "draft" && (
        <div style={S.draftSection}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: 2,
                color: "#f5c842",
                textTransform: "uppercase",
              }}
            >
              2026 Mock Draft - Round 1
            </h2>
            <div style={S.btnRow}>
              <button style={btn({ color: "#7dd3f5", borderColor: "#7dd3f5" })} onClick={() => setLottoPhase("lottery")}>
                Back to Lottery
              </button>
              <button style={btn({ color: "#22c55e", borderColor: "#22c55e" })} onClick={autoPickAll} disabled={isDraftDone}>
                Auto-Pick All
              </button>
              <button style={btn({ color: "#f5c842", borderColor: "#f5c842" })} onClick={copyResults}>
                {copyLabel}
              </button>
              <button style={btn({ color: "#ef4444", borderColor: "#ef4444" })} onClick={resetLottery}>
                New Simulation
              </button>
            </div>
          </div>

          <div className="nhl-draft-layout" style={S.draftLayout}>
            <div style={S.draftBoardWrap}>
              {draftPicks.map((pick, idx) => {
                const onClock = idx === currentPickIdx && !isDraftDone;
                const numCls =
                  pick.pick === 1
                    ? "#f5c842"
                    : pick.pick === 2
                      ? "#c0c0c0"
                      : pick.pick === 3
                        ? "#cd7f32"
                        : "#94a3b8";

                return (
                  <div
                    key={`${pick.pick}-${pick.team}`}
                    style={{
                      background: onClock ? "rgba(245,200,66,.05)" : "#1a2236",
                      border: `1px solid ${onClock ? "#f5c842" : "#2d3a50"}`,
                      borderRadius: 7,
                      padding: "11px 14px",
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: 12,
                      alignItems: "center",
                      marginBottom: 8,
                      animation: pick.player ? "fadeIn .25s ease" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 32,
                        fontWeight: 900,
                        color: numCls,
                        textAlign: "center",
                        lineHeight: 1,
                      }}
                    >
                      {pick.pick}
                    </div>
                    <div>
                      {onClock && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#f5c842",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            marginBottom: 1,
                          }}
                        >
                          On the clock
                        </div>
                      )}
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#e2e8f0",
                        }}
                      >
                        {pick.team}
                      </div>
                      {pick.player ? (
                        <div style={{ fontSize: 13, color: "#7dd3f5", marginTop: 2 }}>
                          {pick.player.pos} — {pick.player.name}
                          {pick.player.league ? ` (${pick.player.league})` : ""}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: "#2d3a50", fontStyle: "italic", marginTop: 2 }}>—</div>
                      )}
                      {pick.note && <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>{pick.note}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              {!isDraftDone ? (
                <div
                  style={{
                    background: "#1a2236",
                    border: "1px solid #2d3a50",
                    borderRadius: 10,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "#7dd3f5",
                      paddingBottom: 6,
                      borderBottom: "1px solid #2d3a50",
                    }}
                  >
                    Available Prospects
                  </div>

                  <div
                    style={{
                      background: "rgba(245,200,66,.07)",
                      border: "1px solid rgba(245,200,66,.28)",
                      borderRadius: 7,
                      padding: "10px 12px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Pick #{curPick?.pick}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#f5c842",
                      }}
                    >
                      {curPick?.team}
                    </div>
                    {curPick?.note && <div style={{ fontSize: 12, color: "#94a3b8" }}>{curPick.note}</div>}
                  </div>

                  <button
                    style={{
                      ...btn({ color: "#7dd3f5", borderColor: "#7dd3f5", width: "100%", justifyContent: "center" }),
                      textAlign: "center",
                    }}
                    onClick={autoPick}
                  >
                    Auto-Pick Next
                  </button>

                  <input
                    style={{
                      width: "100%",
                      background: "#222d42",
                      border: "1px solid #2d3a50",
                      borderRadius: 10,
                      padding: "10px 12px",
                      color: "#e2e8f0",
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 15,
                      outline: "none",
                    }}
                    placeholder="Search prospects"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedProspect(null);
                    }}
                  />

                  <div style={{ overflowY: "auto", maxHeight: 380, display: "flex", flexDirection: "column", gap: 3 }}>
                    {filteredProspects.map((prospect) => (
                      <div
                        key={prospect.rank}
                        onClick={() => setSelectedProspect(prospect)}
                        style={{
                          background: selectedProspect?.rank === prospect.rank ? "rgba(59,130,246,.12)" : "#222d42",
                          border: `1px solid ${selectedProspect?.rank === prospect.rank ? "#3b82f6" : "#2d3a50"}`,
                          borderRadius: 10,
                          padding: "10px 12px",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontSize: 13,
                              color: "#f5c842",
                              fontWeight: 700,
                            }}
                          >
                            #{prospect.rank}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontSize: 17,
                              fontWeight: 700,
                              color: "#e2e8f0",
                            }}
                          >
                            {prospect.name}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                          {prospect.pos}
                          {prospect.league ? ` · ${prospect.league}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    style={{
                      width: "100%",
                      background: selectedProspect ? "#3b82f6" : "#222d42",
                      color: selectedProspect ? "#fff" : "#94a3b8",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      border: "none",
                      borderRadius: 7,
                      padding: 10,
                      cursor: selectedProspect ? "pointer" : "not-allowed",
                    }}
                    onClick={makePick}
                    disabled={!selectedProspect}
                  >
                    {selectedProspect ? `Draft ${selectedProspect.name}` : "Select a Prospect"}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: "#1a2236",
                    border: "1px solid #2d3a50",
                    borderRadius: 10,
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#f5c842",
                      marginBottom: 10,
                    }}
                  >
                    Draft Complete
                  </div>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <button style={btn({ color: "#f5c842", borderColor: "#f5c842" })} onClick={copyResults}>
                      {copyLabel}
                    </button>
                    <button style={btn({ color: "#ef4444", borderColor: "#ef4444" })} onClick={resetLottery}>
                      New Simulation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}