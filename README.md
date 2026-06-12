# 15-Minute Guitar

One focused 15-minute guitar practice session a day. A Third Watch Studios
project.

- Daily category scheduling (left hand, fingerstyle, picking, chords,
  fretboard, ear, repertoire) with a 126-exercise library
- Lesson paths: ordered progressions, mastery tracked from your practice
  log, review pool, per-category levels with level-up prompts
- Fretboard explorer with alternate tunings, metronome and session timer
- Practice log with notes, personal-best tempos, streaks and a heatmap
- Installable PWA, works offline; practice data stays in your browser, with
  JSON backup/restore in Settings

## Development

Fully static, no build step. Serve the directory any way you like:

```
python3 -m http.server 8642
```

The service worker only registers on non-localhost hosts, so local dev never
fights a stale cache.
