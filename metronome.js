// Metronome: Web Audio clicks scheduled with a lookahead loop so timing
// stays tight regardless of UI-thread jitter. Accented beat 1, tap tempo,
// and a suggested-BPM shortcut parsed from the day's exercise.

const METRO_KEY = "gp.metronome";

let metroState = Object.assign({ bpm: 92, beats: 4 }, load(METRO_KEY, {}));
let metroCtx = null;
let metroTimer = null; // non-null while running
let metroNextTime = 0;
let metroBeat = 0;
let metroTaps = [];
let metroSuggestedBpm = null;

function metroClick(time, accent) {
  const osc = metroCtx.createOscillator();
  const gain = metroCtx.createGain();
  osc.type = "square";
  osc.frequency.value = accent ? 1568 : 1047;
  gain.gain.setValueAtTime(accent ? 0.2 : 0.13, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  osc.connect(gain).connect(metroCtx.destination);
  osc.start(time);
  osc.stop(time + 0.05);
}

function metroSchedule() {
  while (metroNextTime < metroCtx.currentTime + 0.12) {
    const beatInBar = metroBeat % metroState.beats;
    metroClick(metroNextTime, beatInBar === 0);
    const waitMs = Math.max(0, (metroNextTime - metroCtx.currentTime) * 1000);
    setTimeout(() => metroFlashDot(beatInBar), waitMs);
    metroNextTime += 60 / metroState.bpm;
    metroBeat += 1;
  }
}

function metroFlashDot(beat) {
  if (metroTimer === null) return;
  document.querySelectorAll("#metro-dots .metro-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === beat);
  });
  // Pulse the FAB in time so the beat is visible even with the panel closed.
  const fab = document.getElementById("fab-metro");
  fab.classList.remove("pulse");
  void fab.offsetWidth; // restart the animation
  fab.classList.add("pulse");
}

function metroStart() {
  if (!metroCtx) metroCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (metroCtx.state === "suspended") metroCtx.resume();
  metroBeat = 0;
  metroNextTime = metroCtx.currentTime + 0.08;
  metroTimer = setInterval(metroSchedule, 25);
  document.getElementById("metro-toggle").textContent = "Stop";
  document.getElementById("fab-metro").classList.add("running");
}

function metroStop() {
  clearInterval(metroTimer);
  metroTimer = null;
  document.getElementById("metro-toggle").textContent = "Start";
  document.querySelectorAll("#metro-dots .metro-dot").forEach((d) => d.classList.remove("active"));
  document.getElementById("fab-metro").classList.remove("running", "pulse");
}

function metroSetBpm(bpm) {
  metroState.bpm = Math.max(30, Math.min(240, Math.round(bpm)));
  save(METRO_KEY, metroState);
  document.getElementById("metro-bpm-value").textContent = metroState.bpm;
  document.getElementById("metro-slider").value = metroState.bpm;
  document.getElementById("fab-metro-label").textContent = metroState.bpm;
}

function metroRenderDots() {
  const wrap = document.getElementById("metro-dots");
  wrap.innerHTML = "";
  for (let i = 0; i < metroState.beats; i++) {
    const dot = document.createElement("span");
    dot.className = "metro-dot";
    wrap.appendChild(dot);
  }
}

function metroTap() {
  const now = performance.now();
  metroTaps = metroTaps.filter((t) => now - t < 2500);
  metroTaps.push(now);
  if (metroTaps.length >= 2) {
    const interval = (metroTaps[metroTaps.length - 1] - metroTaps[0]) / (metroTaps.length - 1);
    metroSetBpm(60000 / interval);
  }
}

// Called by app.js whenever the day's exercise changes.
window.metroSetSuggestedBpm = function (bpm) {
  metroSuggestedBpm = bpm;
  const btn = document.getElementById("metro-suggest");
  if (bpm && bpm >= 30 && bpm <= 240) {
    btn.textContent = `Use ${bpm} BPM — today's exercise`;
    btn.classList.remove("hidden");
  } else {
    btn.classList.add("hidden");
  }
};

function metroInit() {
  metroSetBpm(metroState.bpm);
  document.getElementById("metro-beats").value = String(metroState.beats);
  metroRenderDots();

  document.getElementById("metro-slider").addEventListener("input", (e) => {
    metroSetBpm(Number(e.target.value));
  });

  document.querySelectorAll(".metro-step").forEach((btn) => {
    btn.addEventListener("click", () => metroSetBpm(metroState.bpm + Number(btn.dataset.d)));
  });

  document.getElementById("metro-beats").addEventListener("change", (e) => {
    metroState.beats = Number(e.target.value);
    save(METRO_KEY, metroState);
    metroRenderDots();
  });

  document.getElementById("metro-toggle").addEventListener("click", () => {
    if (metroTimer !== null) metroStop();
    else metroStart();
  });

  document.getElementById("metro-tap").addEventListener("click", metroTap);

  document.getElementById("metro-suggest").addEventListener("click", () => {
    if (metroSuggestedBpm) metroSetBpm(metroSuggestedBpm);
  });

  // app.js renders the exercise before this script loads; pick up its BPM now.
  if (typeof currentExercise !== "undefined" && typeof extractBpm === "function") {
    window.metroSetSuggestedBpm(extractBpm(currentExercise));
  }
}

metroInit();
