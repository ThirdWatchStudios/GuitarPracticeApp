# 15-Minute Guitar — Roadmap & Lesson Planning

High-level ideas for future sessions. The app currently has: daily category
scheduling, an 84-exercise library (7 categories × 3 levels), fretboard
explorer with alternate tunings, metronome + timer FABs, practice log with
notes and personal bests, lesson paths (per-category levels, ordered
progression, mastery via the log, review pool, level-up prompts), all styled
to the Third Watch Studios brand.

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

MVP shipped 2026-06-11: ordered progressions (array order in `exercises.js`
is the path), mastery (3 logged sessions or a logged BPM at/above
`targetBpm`), review pool (least-recently-played once a level is fully
mastered), per-category levels (`gp.levels`, migrated from `gp.level`), and
level-up prompts at 75% mastered. Still open below: spaced repetition,
named programs, weak-spot nudges.

- ~~**Ordered progressions per category**~~ — done; the picker serves the
  earliest unmastered step. Array order stands in for an `order` field.
- ~~**Mastery criteria**~~ — done; `targetBpm` set on 8 tempo-driven
  exercises so far, worth extending in the content pass.
- **Spaced repetition for review** — mastered exercises resurface on a decay
  schedule (1 week, 2 weeks, a month). A daily session could become
  10 min new material + 5 min review. (The current review pool is
  least-recently-played, not decay-scheduled — this is the upgrade.)
- ~~**Level-up suggestions**~~ — done; quiet banner with a "Move up" button
  when ≥75% of the category's current level is mastered.
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

1. ~~Lesson paths MVP~~ — shipped 2026-06-11.
2. Spaced-repetition review pool.
3. Drone player FAB + "show me" fretboard linking.
4. PWA wrapper + data export.
5. Content expansion pass (more exercises, new categories) — best done after
   paths exist so new content slots into a structure.
