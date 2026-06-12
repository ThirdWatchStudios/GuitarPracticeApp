// Guitar Practice app logic.
// State persists in localStorage: per-category levels, schedule, recent
// exercise history, today's pick, and practice streak.

const STORAGE_KEYS = {
  level: "gp.level", // legacy single level, migrated into gp.levels
  levels: "gp.levels", // { categoryId: "beginner" | "intermediate" | "advanced" }
  schedule: "gp.schedule",
  dayOverride: "gp.dayOverride", // { date: "YYYY-MM-DD", categoryId } — practice this instead today
  history: "gp.history", // last N exercise ids, most recent last
  todayPick: "gp.todayPick", // { date: "YYYY-MM-DD", exerciseId, level }
  streak: "gp.streak", // { lastDone: "YYYY-MM-DD", count: n }
  log: "gp.log", // [{ date, ts, id, level, category, note, bpm }]
};

const HISTORY_SIZE = 10;
const LEVELS = ["beginner", "intermediate", "advanced"];
const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
const MASTERY_SESSIONS = 3;
const LEVEL_UP_THRESHOLD = 0.75;
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

let schedule = { ...DEFAULT_SCHEDULE, ...load(STORAGE_KEYS.schedule, {}) };
let levels = loadLevels();
let history = load(STORAGE_KEYS.history, []);
let log = load(STORAGE_KEYS.log, []);
let currentExercise = null;
let lastLogIndex = null;

// Per-category levels, seeded from the legacy single gp.level if present.
function loadLevels() {
  const legacy = load(STORAGE_KEYS.level, "beginner");
  const saved = load(STORAGE_KEYS.levels, {});
  const all = {};
  for (const id of Object.keys(CATEGORIES)) {
    all[id] = LEVELS.includes(saved[id]) ? saved[id] : legacy;
  }
  return all;
}

function todayCategoryId() {
  const o = load(STORAGE_KEYS.dayOverride, null);
  if (o && o.date === todayString() && CATEGORIES[o.categoryId]) return o.categoryId;
  return schedule[new Date().getDay()];
}

// "…metronome at 60 BPM…" -> 60, for pre-setting the metronome.
function extractBpm(exercise) {
  if (!exercise) return null;
  const m = `${exercise.description} ${exercise.plan}`.match(/(\d{2,3})\s*BPM/i);
  return m ? Number(m[1]) : null;
}

// ── Lesson paths & mastery ───────────────────────────────────────────────

// Array order in EXERCISES within a category+level is the path order.
function pathExercises(categoryId, lvl) {
  return EXERCISES.filter((e) => e.category === categoryId && e.level === lvl);
}

function exerciseStats(id) {
  let count = 0;
  let bestBpm = 0;
  let lastTs = 0;
  for (const e of log) {
    if (e.id !== id) continue;
    count += 1;
    if (e.bpm > bestBpm) bestBpm = e.bpm;
    const ts = e.ts || new Date(e.date + "T00:00:00").getTime();
    if (ts > lastTs) lastTs = ts;
  }
  return { count, bestBpm, lastTs };
}

function isMastered(exercise) {
  const s = exerciseStats(exercise.id);
  if (exercise.targetBpm && s.bestBpm >= exercise.targetBpm) return true;
  return s.count >= MASTERY_SESSIONS;
}

// ── Exercise picking ─────────────────────────────────────────────────────

// The picker walks the path: earliest unmastered step first. Once a level
// is fully mastered, exercises resurface as review, least recent first.
function pickExercise(categoryId, lvl, excludeIds) {
  const pool = pathExercises(categoryId, lvl);
  if (pool.length === 0) return null;
  const unmastered = pool.filter((e) => !isMastered(e));
  const review = pool
    .filter((e) => isMastered(e))
    .sort((a, b) => exerciseStats(a.id).lastTs - exerciseStats(b.id).lastTs);
  const ordered = [...unmastered, ...review];
  return ordered.find((e) => !excludeIds.includes(e.id)) || ordered[0];
}

function getTodaysExercise({ forceNew = false } = {}) {
  const today = todayString();
  const categoryId = todayCategoryId();
  const lvl = levels[categoryId];
  const saved = load(STORAGE_KEYS.todayPick, null);

  if (!forceNew && saved && saved.date === today && saved.level === lvl) {
    const existing = EXERCISES.find((e) => e.id === saved.exerciseId);
    if (existing && existing.category === categoryId) return existing;
  }

  // The path decides the daily pick; history only matters when rerolling,
  // so "Give me another" cycles onward instead of returning the same step.
  const exclude = forceNew && currentExercise ? [...history, currentExercise.id] : [];
  const picked = pickExercise(categoryId, lvl, exclude);
  if (picked) {
    save(STORAGE_KEYS.todayPick, { date: today, exerciseId: picked.id, level: lvl });
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
        level: currentExercise.level,
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
  renderPath();
  renderLevelUp();

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
  // A logged BPM can cross an exercise's mastery target.
  renderPath();
  renderLevelUp();
}

// ── Rendering ────────────────────────────────────────────────────────────

function renderToday() {
  const day = new Date().getDay();
  const categoryId = todayCategoryId();
  const overridden = categoryId !== schedule[day];
  const cat = CATEGORIES[categoryId];
  document.getElementById("today-label").textContent =
    `${DAY_NAMES[day]} · ${overridden ? "your pick today" : "today's focus"}`;
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
    document.getElementById("path-strip").classList.add("hidden");
    document.getElementById("exercise-why").classList.add("hidden");
    return;
  }
  document.getElementById("exercise-name").textContent = currentExercise.name;
  document.getElementById("exercise-description").textContent = currentExercise.description;
  const whyEl = document.getElementById("exercise-why");
  whyEl.textContent = currentExercise.why || "";
  whyEl.classList.toggle("hidden", !currentExercise.why);
  document.getElementById("exercise-plan").textContent = currentExercise.plan;
  renderPath();
  renderLastTime();
  window.metroSetSuggestedBpm?.(extractBpm(currentExercise));
}

// Path position and mastery progress for the current exercise.
function renderPath() {
  const strip = document.getElementById("path-strip");
  if (!currentExercise) {
    strip.classList.add("hidden");
    return;
  }
  const pool = pathExercises(currentExercise.category, currentExercise.level);
  const step = pool.findIndex((e) => e.id === currentExercise.id) + 1;

  document.getElementById("path-dots").innerHTML = pool
    .map((e) => {
      let cls = "path-dot";
      if (isMastered(e)) cls += " mastered";
      if (e.id === currentExercise.id) cls += " current";
      return `<span class="${cls}" title="${escapeHtml(e.name)}"></span>`;
    })
    .join("");

  const s = exerciseStats(currentExercise.id);
  let status;
  if (isMastered(currentExercise)) {
    status = "review — mastered";
  } else {
    status = `sessions ${s.count}/${MASTERY_SESSIONS}`;
    if (currentExercise.targetBpm) {
      status += ` · target ${currentExercise.targetBpm} BPM`;
      if (s.bestBpm) status += ` (best ${s.bestBpm})`;
    }
  }
  document.getElementById("path-meta").textContent = `Step ${step} of ${pool.length} · ${status}`;
  strip.classList.remove("hidden");
}

// Quiet prompt to bump a category's level once most of it is mastered.
function renderLevelUp() {
  const box = document.getElementById("level-up");
  const categoryId = todayCategoryId();
  const lvl = levels[categoryId];
  const next = LEVELS[LEVELS.indexOf(lvl) + 1];
  const pool = pathExercises(categoryId, lvl);
  const mastered = pool.filter((e) => isMastered(e)).length;
  const ready = Boolean(next) && pool.length > 0 && mastered / pool.length >= LEVEL_UP_THRESHOLD;
  box.classList.toggle("hidden", !ready);
  if (!ready) return;
  document.getElementById("level-up-text").textContent =
    `${mastered} of ${pool.length} ${LEVEL_LABELS[lvl].toLowerCase()} ${CATEGORIES[categoryId].short} ` +
    `exercises mastered — ready for ${LEVEL_LABELS[next]}?`;
  document.getElementById("level-up-btn").textContent = `Move up`;
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
  const categoryId = todayCategoryId();
  document.getElementById("level-label").textContent = `${CATEGORIES[categoryId].short} level:`;
  document.querySelectorAll("#level-buttons button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.level === levels[categoryId]);
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

// ── Lesson paths dialog ──────────────────────────────────────────────────

// One row per category: its current level's path with mastery dots.
// Tapping a row swaps today's practice to that category (a day override);
// tapping the scheduled category returns to the schedule.
function renderPaths() {
  const list = document.getElementById("paths-list");
  list.innerHTML = "";
  const scheduledId = schedule[new Date().getDay()];
  const todayId = todayCategoryId();
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    const lvl = levels[id];
    const pool = pathExercises(id, lvl);
    const masteredCount = pool.filter((e) => isMastered(e)).length;
    const next = pool.find((e) => !isMastered(e));

    const dots = pool
      .map((e) => {
        let cls = "path-dot";
        if (isMastered(e)) cls += " mastered";
        if (next && e.id === next.id) cls += " current";
        return `<span class="${cls}" title="${escapeHtml(e.name)}"></span>`;
      })
      .join("");

    let tag = "";
    if (id === todayId) tag = " · today";
    else if (id === scheduledId) tag = " · scheduled";

    const row = document.createElement("button");
    row.className = "paths-row" + (id === todayId ? " active" : "");
    row.innerHTML =
      `<span class="paths-info"><span class="paths-name">${cat.short}</span>` +
      `<span class="paths-meta">${LEVEL_LABELS[lvl]} · ${masteredCount}/${pool.length} mastered${tag}</span></span>` +
      `<span class="path-dots">${dots}</span>`;
    row.addEventListener("click", () => {
      if (id === scheduledId) localStorage.removeItem(STORAGE_KEYS.dayOverride);
      else save(STORAGE_KEYS.dayOverride, { date: todayString(), categoryId: id });
      localStorage.removeItem(STORAGE_KEYS.todayPick);
      pathsDialog.close();
      renderToday();
      renderLevelButtons();
      renderExercise();
      renderLevelUp();
    });
    list.appendChild(row);
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
      renderLevelButtons();
      renderExercise();
      renderLevelUp();
    });

    row.appendChild(label);
    row.appendChild(select);
    editor.appendChild(row);
  }
}

// ── Backup & restore ─────────────────────────────────────────────────────
// All app state lives under gp.* keys (including metronome and fretboard
// settings), so a backup is just those keys verbatim.

function collectBackup() {
  const data = { app: "15-minute-guitar", exportedAt: new Date().toISOString(), keys: {} };
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith("gp.")) data.keys[k] = localStorage.getItem(k);
  }
  return data;
}

// Throws if the parsed file isn't a plausible backup; otherwise replaces
// all gp.* state with its contents.
function applyBackup(data) {
  const keys = data && data.keys;
  const entries = keys && typeof keys === "object" ? Object.entries(keys) : [];
  if (
    !data ||
    data.app !== "15-minute-guitar" ||
    entries.length === 0 ||
    entries.some(([k, v]) => !k.startsWith("gp.") || typeof v !== "string")
  ) {
    throw new Error("not a backup file");
  }
  entries.forEach(([, v]) => JSON.parse(v)); // every value must be valid JSON
  Object.keys(localStorage)
    .filter((k) => k.startsWith("gp."))
    .forEach((k) => localStorage.removeItem(k));
  entries.forEach(([k, v]) => localStorage.setItem(k, v));
}

function exportData() {
  const blob = new Blob([JSON.stringify(collectBackup(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `guitar-practice-backup-${todayString()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showDataMsg("Backup downloaded. Keep it somewhere safe.");
}

async function importData(file) {
  try {
    const data = JSON.parse(await file.text());
    const when = data && data.exportedAt ? formatShortDate(data.exportedAt.slice(0, 10)) : "an unknown date";
    const count = data && data.keys && data.keys["gp.log"] ? JSON.parse(data.keys["gp.log"]).length : 0;
    if (!confirm(`Replace this browser's practice data with the backup from ${when} (${count} logged sessions)?`)) {
      return;
    }
    applyBackup(data);
    location.reload();
  } catch {
    showDataMsg("That file doesn't look like a 15-Minute Guitar backup.");
  }
}

function showDataMsg(text) {
  const el = document.getElementById("data-msg");
  el.textContent = text;
  el.classList.remove("hidden");
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
    levels[todayCategoryId()] = btn.dataset.level;
    save(STORAGE_KEYS.levels, levels);
    localStorage.removeItem(STORAGE_KEYS.todayPick);
    renderLevelButtons();
    renderExercise();
    renderLevelUp();
  });
});

document.getElementById("level-up-btn").addEventListener("click", () => {
  const categoryId = todayCategoryId();
  const next = LEVELS[LEVELS.indexOf(levels[categoryId]) + 1];
  if (!next) return;
  levels[categoryId] = next;
  save(STORAGE_KEYS.levels, levels);
  localStorage.removeItem(STORAGE_KEYS.todayPick);
  renderLevelButtons();
  renderExercise();
  renderLevelUp();
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

const pathsDialog = document.getElementById("paths-dialog");
document.getElementById("paths-btn").addEventListener("click", () => {
  renderPaths();
  pathsDialog.showModal();
});
document.getElementById("paths-close").addEventListener("click", () => pathsDialog.close());

const logDialog = document.getElementById("log-dialog");
document.getElementById("log-btn").addEventListener("click", () => {
  renderLog();
  logDialog.showModal();
});
document.getElementById("log-close").addEventListener("click", () => logDialog.close());

const settingsDialog = document.getElementById("settings-dialog");
document.getElementById("settings-btn").addEventListener("click", () => {
  renderScheduleEditor();
  document.getElementById("data-msg").classList.add("hidden");
  settingsDialog.showModal();
});

document.getElementById("export-btn").addEventListener("click", exportData);
document.getElementById("import-btn").addEventListener("click", () => {
  document.getElementById("import-file").click();
});
document.getElementById("import-file").addEventListener("change", (e) => {
  if (e.target.files[0]) importData(e.target.files[0]);
  e.target.value = "";
});
document.getElementById("settings-close").addEventListener("click", () => settingsDialog.close());
document.getElementById("settings-reset").addEventListener("click", () => {
  schedule = { ...DEFAULT_SCHEDULE };
  save(STORAGE_KEYS.schedule, schedule);
  localStorage.removeItem(STORAGE_KEYS.todayPick);
  renderScheduleEditor();
  renderToday();
  renderWeekStrip();
  renderLevelButtons();
  renderExercise();
  renderLevelUp();
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
renderLevelUp();
renderStreak();
renderWeekStrip();
renderTimer();

// PWA: register the service worker in production only, so local dev never
// fights a stale cache.
if (
  "serviceWorker" in navigator &&
  location.hostname !== "localhost" &&
  location.hostname !== "127.0.0.1"
) {
  navigator.serviceWorker.register("sw.js");
}
