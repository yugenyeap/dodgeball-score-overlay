/* eslint-env node */
const fs = require("fs");
const path = require("path");

// Usage: node scripts/transform-score-events.js [recordingStartSeconds]

const recordingStartArg = process.argv[2];
const recordingStartSeconds = recordingStartArg ? Number(recordingStartArg) : undefined;

const inputPath = path.join(__dirname, "..", "src", "data", "score-events.json");
const outputPath = path.join(__dirname, "..", "src", "data", "match-data.json");

function loadEvents() {
  const raw = fs.readFileSync(inputPath, "utf8");
  return JSON.parse(raw);
}

function transform(events, recordingStartTimeSec) {
  // group by gameId
  const gameMap = new Map();
  for (const ev of events) {
    if (!gameMap.has(ev.gameId)) gameMap.set(ev.gameId, []);
    gameMap.get(ev.gameId).push(ev);
  }

  const matches = [];

  for (const gameEvents of gameMap.values()) {
    const gameStartEvent = gameEvents.find((e) => e.eventType === "game_started");
    if (!gameStartEvent) continue;

    const redTeam = gameStartEvent.redTeam || "Red Team";
    const blueTeam = gameStartEvent.blueTeam || "Blue Team";

    const gameStartMs = new Date(gameStartEvent.createdAt).getTime();
    const recordingStartMs =
      typeof recordingStartTimeSec === "number"
        ? recordingStartTimeSec * 1000
        : gameStartMs;

    const sorted = gameEvents.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let redScore = 0;
    let blueScore = 0;
    let maxSeconds = (gameStartMs - recordingStartMs) / 1000;
    const timeline = [];

    for (const ev of sorted) {
      const evMs = new Date(ev.createdAt).getTime();
      const secondsIntoVideo = (evMs - recordingStartMs) / 1000;
      if (secondsIntoVideo > maxSeconds) maxSeconds = secondsIntoVideo;

      if (ev.eventType === "score_increase") {
        if (ev.scoringTeam === "red") redScore++;
        if (ev.scoringTeam === "blue") blueScore++;
        timeline.push({ time: secondsIntoVideo, redTeam: redScore, blueTeam: blueScore });
      } else if (ev.eventType === "score_decrease") {
        if (ev.scoringTeam === "red") redScore--;
        if (ev.scoringTeam === "blue") blueScore--;
        timeline.push({ time: secondsIntoVideo, redTeam: redScore, blueTeam: blueScore });
      }
    }

    matches.push({ start: (gameStartMs - recordingStartMs) / 1000, end: maxSeconds, redTeam, blueTeam, events: timeline });
  }

  return { matches };
}

function save(out) {
  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), "utf8");
}

try {
  const events = loadEvents();
  const transformed = transform(events, recordingStartSeconds);
  save(transformed);
  console.log(`Wrote ${outputPath} with ${transformed.matches.length} matches`);
} catch (err) {
  console.error("Failed:", err);
  process.exit(1);
}
