# 15-Minute Guitar — Roadmap & Lesson Planning

High-level ideas for future sessions. The app currently has: daily category
scheduling, an 84-exercise library (7 categories × 3 levels), fretboard
explorer with alternate tunings, metronome + timer FABs, practice log with
notes and personal bests, all styled to the Third Watch Studios brand.

---

## 1. Lesson content to add

### Deepen existing categories
- **More exercises per level** — 4 per category/level is enough to rotate but
  thin over months. Target 8–10 each so a quarter of daily picks feel fresh.
- **Sub-levels / difficulty tags** — within "intermediate," tag exercises
  early/mid/late so progression can be granular without a full level jump.
- **Variations on one exercise** — e.g. the 24 finger permutations exercise
  could track *which* 8 permutations you did and serve the next batch.

### New categories to consider
- **Bending & vibrato** — currently scattered; deserves its own track.
- **Reading** — tab fluency, then standard notation, then sight-reading drills.
- **Rhythm-section skills** — playing to a drum loop, locking with a bassline,
  tempo-keeping tests (metronome drops out for 4 bars, are you still on it?).
- **Maintenance & setup** — occasional "lessons" on restringing, intonation,
  action; low frequency, high value for newer players.

### Content quality ideas
- Embed small fretboard diagrams *inside* exercise cards (reuse the SVG
  renderer) so "play A minor pentatonic box 2" shows the box.
- Optional video/reference links per exercise (kept external, app stays static).
- A "why this matters" line per exercise connecting it to real playing.

## 2. Lesson paths (the big one)

The current model is a random-with-no-repeats picker. Paths turn it into a
curriculum:

- **Ordered progressions per category** — exercises get a `prerequisites` or
  `order` field; the picker prefers the next unmastered step instead of pure
  random. Example path (picking): alternate picking foundations → string
  crossing → scale sequences → economy → cross-picking.
- **Mastery criteria** — an exercise is "mastered" when logged N times, or
  logged at/above a target BPM (the log already captures BPM). Mastered
  exercises retire into a review pool.
- **Spaced repetition for review** — mastered exercises resurface on a decay
  schedule (1 week, 2 weeks, a month). A daily session could become
  10 min new material + 5 min review.
- **Level-up suggestions** — when most exercises at a level are mastered,
  the app suggests moving that category's level up (per-category levels
  instead of one global level).
- **Named multi-week programs** — e.g. "Fingerstyle Foundations, 4 weeks" —
  a curated sequence across categories that temporarily overrides the weekly
  schedule. Good for focused goals (learn Travis picking, demystify CAGED).
- **Weak-spot nudges** — the log knows category balance; surface a quiet
  prompt: "Ear training hasn't come up in 12 days — swap it in today?"

## 3. Usability / feature backlog

Carried over from earlier discussion plus new:

- **Drone / vamp player** — sustained root or simple chord loop for improv
  and ear days; lives naturally as a third FAB.
- **PWA** — manifest + service worker for phone home-screen install and
  offline use. High value, small effort.
- **"Show me" fretboard linking** — button on the exercise card that jumps
  the Fretboard Explorer to the relevant scale/chord.
- **Day override** — "practice something else today" swap without editing
  the weekly schedule.
- **Data export/import** — download/restore the practice log as JSON;
  insurance against cleared browser storage, and the bridge to multi-device.
- **Session flow mode** — a guided 15 minutes: the plan's segments become
  timed stages (5/5/5) with the timer auto-advancing and a chime per stage.
- **Keyboard shortcuts** — space to start/stop timer, M for metronome, etc.
- **Weekly review card** — Sunday summary: sessions, best tempos, streak,
  one suggestion for next week.

## 4. Technical notes for future work

- All state is in localStorage under `gp.*` keys; the practice log
  (`gp.log`: date, exercise id, level, category, note, BPM) is the foundation
  for everything in section 2.
- Exercise data lives in `exercises.js` — paths need only added fields
  (`order`, `prereq`, `targetBpm`), no architecture change.
- The app is fully static (no build step). Keep it that way until multi-device
  sync genuinely demands a backend.
- Brand: Third Watch Studios palette, amber accent deepened to `#B87A2E`
  (Tom's preference over the official `#D69B4B`). Quiet, sparse, no emoji.

## 5. Suggested next-session order

1. Lesson paths MVP: per-category levels + ordered progression + mastery via
   log data (highest leverage, builds on what exists).
2. Spaced-repetition review pool.
3. Drone player FAB + "show me" fretboard linking.
4. PWA wrapper + data export.
5. Content expansion pass (more exercises, new categories) — best done after
   paths exist so new content slots into a structure.
