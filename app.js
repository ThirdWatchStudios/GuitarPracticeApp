// Guitar Practice app logic.
// State persists in localStorage: level, schedule, recent exercise history,
// today's pick, and practice streak.

const STORAGE_KEYS = {
  level: "gp.level",
  schedule: "gp.schedule",
  history: "gp.history", // last N exercise ids, most recent last
  todayPick: "gp.todayPick", // { date: "YYYY-MM-DD", exerciseId }
  streak: "gp.streak", // { lastDone: "YYYY-MM-DD", count: n }
  log: "gp.log", // [{ date, ts, id, level, category, note, bpm }]
};

const HISTORY_SIZE = 10;
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Storage helpers ──────────────────────────────────────────────────────

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function dateString(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayString() {
  return dateString(new Date());
}

function formatShortDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

// ── State ────────────────────────────────────────────────────────────────

let level = load(STORAGE_KEYS.level, "beginner");
let schedule = { ...DEFAULT_SCHEDULE, ...load(STORAGE_KEYS.schedule, {}) };
let history = load(STORAGE_KEYS.history, []);
let log = load(STORAGE_KEYS.log, []);
let currentExercise = null;
let lastLogIndex = null;

// "…metronome at 60 BPM…" -> 60, for pre-setting the metronome.
function extractBpm(exercise) {
  if (!exercise) return null;
  const m = `${exercise.description} ${exercise.plan}`.match(/(\d{2,3})\s*BPM/i);
  return m ? Number(m[1]) : null;
}

// ── Exercise picking ─────────────────────────────────────────────────────

function pickExercise(categoryId, lvl, excludeIds) {
  const pool = EXERCISES.filter((e) => e.category === categoryId && e.level === lvl);
  if (pool.length === 0) return null;
  const fresh = pool.filter((e) => !excludeIds.includes(e.id));
  const candidates = fresh.length > 0 ? fresh : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getTodaysExercise({ forceNew = false } = {}) {
  const today = todayString();
  const categoryId = schedule[new Date().getDay()];
  const saved = load(STORAGE_KEYS.todayPick, null);

  if (!forceNew && saved && saved.date === today && saved.level === level) {
    const existing = EXERCISES.find((e) => e.id === saved.exerciseId);
    if (existing && existing.category === categoryId) return existing;
  }

  const exclude = forceNew && currentExercise ? [...history, currentExercise.id] : history;
  const picked = pickExercise(categoryId, level, exclude);
  if (picked) {
    save(STORAGE_KEYS.todayPick, { date: today, exerciseId: picked.id, level });
  }
  return picked;
}

function recordInHistory(exerciseId) {
  history = history.filter((id) => id !== exerciseId);
  history.push(exerciseId);
  if (history.length > HISTORY_SIZE) history = history.slice(-HISTORY_SIZE);
  save(STORAGE_KEYS.history, history);
}

// ── Streak ───────────────────────────────────────────────────────────────

function getStreak() {
  const s = load(STORAGE_KEYS.streak, { lastDone: null, count: 0 });
  if (!s.lastDone) return s;
  // A streak survives only if the last completion was today or yesterday.
  const last = new Date(s.lastDone + "T00:00:00");
  const now = new Date(todayString() + "T00:00:00");
  const daysAgo = Math.round((now - last) / 86400000);
  if (daysAgo > 1) return { lastDone: s.lastDone, count: 0 };
  return s;
}

function markDone() {
  const today = todayString();
  const s = getStreak();
  if (s.lastDone !== today) {
    s.count = s.count + 1;
    s.lastDone = today;
    save(STORAGE_KEYS.streak, s);
  }

  if (currentExercise) {
    recordInHistory(currentExercise.id);
    // One log entry per exercise per day; re-marking reopens it.
    let idx = log.findIndex((e) => e.date === today && e.id === currentExercise.id);
    if (idx === -1) {
      log.push({
        date: today,
        ts: Date.now(),
        id: currentExercise.id,
        level,
        category: currentExercise.category,
        note: null,
        bpm: null,
      });
      idx = log.length - 1;
      save(STORAGE_KEYS.log, log);
    }
    lastLogIndex = idx;
    document.getElementById("note-text").value = log[idx].note || "";
    document.getElementById("note-bpm").value = log[idx].bpm || "";
    document.getElementById("note-form").classList.remove("hidden");
  }
  renderStreak();

  const msg = document.getElementById("done-msg");
  msg.textContent =
    s.count > 1
      ? `Session logged — ${s.count} days running.`
      : "Session logged. Same time tomorrow.";
  msg.classList.remove("hidden");
}

function saveNote() {
  if (lastLogIndex === null || !log[lastLogIndex]) return;
  const note = document.getElementById("note-text").value.trim();
  const bpm = Number(document.getElementById("note-bpm").value);
  log[lastLogIndex].note = note || null;
  log[lastLogIndex].bpm = bpm > 0 ? bpm : null;
  save(STORAGE_KEYS.log, log);
  document.getElementById("note-form").classList.add("hidden");
  document.getElementById("done-msg").textContent = "Noted. It'll resurface next time.";
}

// ── Rendering ────────────────────────────────────────────────────────────

function renderToday() {
  const day = new Date().getDay();
  const cat = CATEGORIES[schedule[day]];
  document.getElementById("today-label").textContent = `${DAY_NAMES[day]} · today's focus`;
  document.getElementById("category-name").textContent = cat.name;
  document.getElementById("category-blurb").textContent = cat.blurb;
}

function renderExercise() {
  currentExercise = getTodaysExercise();
  const card = document.getElementById("exercise-card");
  document.getElementById("done-msg").classList.add("hidden");
  document.getElementById("note-form").classList.add("hidden");
  if (!currentExercise) {
    card.querySelector("#exercise-name").textContent = "No exercise found";
    card.querySelector("#exercise-description").textContent =
      "No exercises exist for this category and level yet.";
    card.querySelector("#exercise-plan").textContent = "";
    document.getElementById("last-time").classList.add("hidden");
    return;
  }
  document.getElementById("exercise-name").textContent = currentExercise.name;
  document.getElementById("exercise-description").textContent = currentExercise.description;
  document.getElementById("exercise-plan").textContent = currentExercise.plan;
  renderLastTime();
  window.metroSetSuggestedBpm?.(extractBpm(currentExercise));
}

// Resurface the most recent past note/tempo for the current exercise.
function renderLastTime() {
  const box = document.getElementById("last-time");
  const today = todayString();
  const past = log.filter((e) => e.id === currentExercise.id && e.date !== today);
  const latest = [...past].reverse().find((e) => e.note || e.bpm);
  if (!latest) {
    box.classList.add("hidden");
    return;
  }
  const best = log
    .filter((e) => e.id === currentExercise.id)
    .reduce((max, e) => (e.bpm > max ? e.bpm : max), 0);
  let head = `Last time · ${formatShortDate(latest.date)}`;
  if (latest.bpm) head += ` — ${latest.bpm} BPM`;
  if (best && best !== latest.bpm) head += ` · best ${best} BPM`;
  box.innerHTML =
    `<div class="lt-label">${head}</div>` +
    (latest.note ? `<div>${escapeHtml(latest.note)}</div>` : "");
  box.classList.remove("hidden");
}

function renderLevelButtons() {
  document.querySelectorAll("#level-buttons button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.level === level);
  });
}

function renderStreak() {
  const s = getStreak();
  const el = document.getElementById("streak");
  el.textContent = s.count > 0 ? `${s.count}-day streak` : "No streak yet";
  el.classList.toggle("lit", s.count > 0);
}

function renderWeekStrip() {
  const strip = document.getElementById("week-strip");
  const today = new Date().getDay();
  strip.innerHTML = "";
  // Show Monday-first ordering: Mon..Sun
  const order = [1, 2, 3, 4, 5, 6, 0];
  for (const day of order) {
    const cat = CATEGORIES[schedule[day]];
    const chip = document.createElement("div");
    chip.className = "day-chip" + (day === today ? " today" : "");
    chip.title = cat.name;
    chip.innerHTML = `<span class="day-name">${DAY_SHORT[day]}</span><span class="day-cat">${cat.short}</span>`;
    strip.appendChild(chip);
  }
}

// ── Practice log dialog ──────────────────────────────────────────────────

function renderLog() {
  const s = getStreak();
  const today = new Date();
  const weekCutoff = new Date(today);
  weekCutoff.setDate(weekCutoff.getDate() - 6);
  const thisWeek = log.filter((e) => new Date(e.date + "T00:00:00") >= new Date(dateString(weekCutoff) + "T00:00:00")).length;

  document.getElementById("log-summary").textContent =
    log.length === 0
      ? "No sessions logged yet — mark an exercise done and it lands here."
      : `${log.length} session${log.length === 1 ? "" : "s"} logged · ${s.count}-day streak · ${thisWeek} in the last 7 days`;

  // Heatmap: last 16 weeks, columns = weeks, rows = Mon..Sun.
  const counts = {};
  log.forEach((e) => (counts[e.date] = (counts[e.date] || 0) + 1));
  const heat = document.getElementById("log-heatmap");
  heat.innerHTML = "";
  const start = new Date(today);
  start.setDate(start.getDate() - 111);
  while (start.getDay() !== 1) start.setDate(start.getDate() - 1);
  for (const d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const ds = dateString(d);
    const n = counts[ds] || 0;
    const cell = document.createElement("div");
    cell.className = "hm-cell" + (n ? ` hm-${Math.min(n, 3)}` : "");
    cell.title = `${formatShortDate(ds)}: ${n} session${n === 1 ? "" : "s"}`;
    heat.appendChild(cell);
  }

  // Category balance.
  const catCounts = {};
  log.forEach((e) => (catCounts[e.category] = (catCounts[e.category] || 0) + 1));
  const max = Math.max(1, ...Object.values(catCounts));
  const cats = document.getElementById("log-categories");
  cats.innerHTML = "";
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    const n = catCounts[id] || 0;
    const row = document.createElement("div");
    row.className = "log-cat-row";
    row.innerHTML =
      `<span class="log-cat-name">${cat.short}</span>` +
      `<span class="log-cat-bar" style="width:${(n / max) * 120}px"></span>` +
      `<span class="log-cat-count">${n}</span>`;
    cats.appendChild(row);
  }

  // Recent sessions.
  const recent = document.getElementById("log-recent");
  recent.innerHTML = "";
  if (log.length === 0) {
    recent.innerHTML = `<div class="log-recent-row log-cat-count">Nothing yet.</div>`;
  }
  const chronological = [...log].sort((a, b) => (a.ts || 0) - (b.ts || 0));
  for (const entry of chronological.slice(-8).reverse()) {
    const exercise = EXERCISES.find((e) => e.id === entry.id);
    const row = document.createElement("div");
    row.className = "log-recent-row";
    row.innerHTML =
      `<span class="lr-date">${formatShortDate(entry.date)}</span> ` +
      `${exercise ? exercise.name : entry.id}` +
      (entry.bpm ? ` — ${entry.bpm} BPM` : "") +
      (entry.note ? `<div class="lr-note">${escapeHtml(entry.note)}</div>` : "");
    recent.appendChild(row);
  }
}

// ── Settings dialog ──────────────────────────────────────────────────────

function renderScheduleEditor() {
  const editor = document.getElementById("schedule-editor");
  editor.innerHTML = "";
  const order = [1, 2, 3, 4, 5, 6, 0];
  for (const day of order) {
    const row = document.createElement("div");
    row.className = "schedule-row";

    const label = document.createElement("label");
    label.textContent = DAY_NAMES[day];

    const select = document.createElement("select");
    for (const [id, cat] of Object.entries(CATEGORIES)) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = cat.name;
      opt.selected = schedule[day] === id;
      select.appendChild(opt);
    }
    select.addEventListener("change", () => {
      schedule[day] = select.value;
      save(STORAGE_KEYS.schedule, schedule);
      localStorage.removeItem(STORAGE_KEYS.todayPick); // category may have changed
      renderToday();
      renderWeekStrip();
      renderExercise();
    });

    row.appendChild(label);
    row.appendChild(select);
    editor.appendChild(row);
  }
}

// ── Timer ────────────────────────────────────────────────────────────────

const TIMER_TOTAL = 15 * 60; // seconds
let timerRemaining = TIMER_TOTAL;
let timerInterval = null;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function renderTimer() {
  const display = document.getElementById("timer-display");
  const running = timerInterval !== null && timerRemaining > 0;
  display.textContent = formatTime(timerRemaining);
  display.classList.toggle("running", running);
  display.classList.toggle("finished", timerRemaining === 0);
  document.getElementById("timer-toggle").textContent =
    timerInterval !== null ? "Pause" : timerRemaining === 0 ? "Start" : timerRemaining < TIMER_TOTAL ? "Resume" : "Start";
  document.getElementById("timer-progress-fill").style.width =
    `${((TIMER_TOTAL - timerRemaining) / TIMER_TOTAL) * 100}%`;
  document.getElementById("fab-timer-label").textContent = formatTime(timerRemaining);
  document.getElementById("fab-timer").classList.toggle("running", running);
}

function timerTick() {
  timerRemaining -= 1;
  if (timerRemaining <= 0) {
    timerRemaining = 0;
    stopTimer();
    notifyTimerDone();
  }
  renderTimer();
}

function startTimer() {
  if (timerRemaining === 0) timerRemaining = TIMER_TOTAL;
  timerInterval = setInterval(timerTick, 1000);
  renderTimer();
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timerRemaining = TIMER_TOTAL;
  renderTimer();
}

function notifyTimerDone() {
  // Gentle beep via Web Audio — no assets needed.
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.3, 0.6].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch {
    // Audio unavailable; the visual state change is enough.
  }
}

// ── Wire-up ──────────────────────────────────────────────────────────────

document.querySelectorAll("#level-buttons button").forEach((btn) => {
  btn.addEventListener("click", () => {
    level = btn.dataset.level;
    save(STORAGE_KEYS.level, level);
    localStorage.removeItem(STORAGE_KEYS.todayPick);
    renderLevelButtons();
    renderExercise();
  });
});

document.getElementById("reroll-btn").addEventListener("click", () => {
  currentExercise = getTodaysExercise({ forceNew: true });
  renderExercise();
});

document.getElementById("done-btn").addEventListener("click", markDone);
document.getElementById("note-save").addEventListener("click", saveNote);
["note-text", "note-bpm"].forEach((id) => {
  document.getElementById(id).addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveNote();
  });
});

const logDialog = document.getElementById("log-dialog");
document.getElementById("log-btn").addEventListener("click", () => {
  renderLog();
  logDialog.showModal();
});
document.getElementById("log-close").addEventListener("click", () => logDialog.close());

const settingsDialog = document.getElementById("settings-dialog");
document.getElementById("settings-btn").addEventListener("click", () => {
  renderScheduleEditor();
  settingsDialog.showModal();
});
document.getElementById("settings-close").addEventListener("click", () => settingsDialog.close());
document.getElementById("settings-reset").addEventListener("click", () => {
  schedule = { ...DEFAULT_SCHEDULE };
  save(STORAGE_KEYS.schedule, schedule);
  localStorage.removeItem(STORAGE_KEYS.todayPick);
  renderScheduleEditor();
  renderToday();
  renderWeekStrip();
  renderExercise();
});

document.getElementById("timer-toggle").addEventListener("click", () => {
  if (timerInterval !== null) stopTimer();
  else startTimer();
});
document.getElementById("timer-reset").addEventListener("click", resetTimer);

// Floating action buttons: each FAB toggles its panel; opening one closes
// the other; clicking outside or pressing Escape closes both.
const FAB_PAIRS = [
  { btn: "fab-timer", panel: "timer-panel" },
  { btn: "fab-metro", panel: "metro-panel" },
];

function closeFabPanels() {
  FAB_PAIRS.forEach(({ panel }) => document.getElementById(panel).classList.add("hidden"));
}

FAB_PAIRS.forEach(({ btn, panel }) => {
  document.getElementById(btn).addEventListener("click", () => {
    const el = document.getElementById(panel);
    const wasHidden = el.classList.contains("hidden");
    closeFabPanels();
    if (wasHidden) el.classList.remove("hidden");
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".fab-stack")) closeFabPanels();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeFabPanels();
});

// ── Init ─────────────────────────────────────────────────────────────────

renderToday();
renderLevelButtons();
renderExercise();
renderStreak();
renderWeekStrip();
renderTimer();
