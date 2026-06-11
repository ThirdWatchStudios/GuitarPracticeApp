// Fretboard Explorer: renders an interactive fretboard (SVG) showing chord
// shapes or scale patterns, with Web Audio playback for every position.
// Supports alternate tunings — scales remap automatically, and each open
// tuning carries its own chord voicings.

const FB_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Standard-tuning open-string MIDI numbers, low E first (E2 A2 D3 G3 B3 E4).
const FB_STD_MIDI = [40, 45, 50, 55, 59, 64];

const FB_INTERVAL_NAMES = ["R", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"];

const FB_SCALES = {
  major: { name: "Major (Ionian)", intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: "Natural Minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
  majorPent: { name: "Major Pentatonic", intervals: [0, 2, 4, 7, 9] },
  minorPent: { name: "Minor Pentatonic", intervals: [0, 3, 5, 7, 10] },
  blues: { name: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
  dorian: { name: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },
  mixolydian: { name: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
  lydian: { name: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11] },
  harmonicMinor: { name: "Harmonic Minor", intervals: [0, 2, 3, 5, 7, 8, 11] },
};

// Chord shapes: frets per string, low string first. -1 = muted, 0 = open.
// Each set is only valid for its own tuning.
const FB_CHORDS_STANDARD = [
  { name: "C", group: "Major", frets: [-1, 3, 2, 0, 1, 0] },
  { name: "A", group: "Major", frets: [-1, 0, 2, 2, 2, 0] },
  { name: "G", group: "Major", frets: [3, 2, 0, 0, 0, 3] },
  { name: "E", group: "Major", frets: [0, 2, 2, 1, 0, 0] },
  { name: "D", group: "Major", frets: [-1, -1, 0, 2, 3, 2] },
  { name: "F (barre)", group: "Major", frets: [1, 3, 3, 2, 1, 1] },
  { name: "B (barre)", group: "Major", frets: [-1, 2, 4, 4, 4, 2] },
  { name: "Am", group: "Minor", frets: [-1, 0, 2, 2, 1, 0] },
  { name: "Em", group: "Minor", frets: [0, 2, 2, 0, 0, 0] },
  { name: "Dm", group: "Minor", frets: [-1, -1, 0, 2, 3, 1] },
  { name: "Bm (barre)", group: "Minor", frets: [-1, 2, 4, 4, 3, 2] },
  { name: "F#m (barre)", group: "Minor", frets: [2, 4, 4, 2, 2, 2] },
  { name: "Cm (barre)", group: "Minor", frets: [-1, 3, 5, 5, 4, 3] },
  { name: "A7", group: "Dominant 7th", frets: [-1, 0, 2, 0, 2, 0] },
  { name: "B7", group: "Dominant 7th", frets: [-1, 2, 1, 2, 0, 2] },
  { name: "C7", group: "Dominant 7th", frets: [-1, 3, 2, 3, 1, 0] },
  { name: "D7", group: "Dominant 7th", frets: [-1, -1, 0, 2, 1, 2] },
  { name: "E7", group: "Dominant 7th", frets: [0, 2, 0, 1, 0, 0] },
  { name: "G7", group: "Dominant 7th", frets: [3, 2, 0, 0, 0, 1] },
  { name: "Am7", group: "Minor 7th", frets: [-1, 0, 2, 0, 1, 0] },
  { name: "Dm7", group: "Minor 7th", frets: [-1, -1, 0, 2, 1, 1] },
  { name: "Em7", group: "Minor 7th", frets: [0, 2, 0, 0, 0, 0] },
  { name: "Cmaj7", group: "Major 7th", frets: [-1, 3, 2, 0, 0, 0] },
  { name: "Dmaj7", group: "Major 7th", frets: [-1, -1, 0, 2, 2, 2] },
  { name: "Fmaj7", group: "Major 7th", frets: [-1, -1, 3, 2, 1, 0] },
  { name: "Gmaj7", group: "Major 7th", frets: [3, 2, 0, 0, 0, 2] },
  { name: "Amaj7", group: "Major 7th", frets: [-1, 0, 2, 1, 2, 0] },
  { name: "Asus2", group: "Sus & Add", frets: [-1, 0, 2, 2, 0, 0] },
  { name: "Dsus4", group: "Sus & Add", frets: [-1, -1, 0, 2, 3, 3] },
  { name: "Esus4", group: "Sus & Add", frets: [0, 2, 2, 2, 0, 0] },
  { name: "Cadd9", group: "Sus & Add", frets: [-1, 3, 2, 0, 3, 0] },
];

const FB_CHORDS_DROP_D = [
  { name: "D", group: "Open", frets: [0, 0, 0, 2, 3, 2] },
  { name: "Dm", group: "Open", frets: [0, 0, 0, 2, 3, 1] },
  { name: "G", group: "Open", frets: [5, 5, 0, 0, 0, 3] },
  { name: "A", group: "Open", frets: [-1, 0, 2, 2, 2, 0] },
  { name: "C", group: "Open", frets: [-1, 3, 2, 0, 1, 0] },
  { name: "Em", group: "Open", frets: [2, 2, 2, 0, 0, 0] },
  { name: "D5", group: "Power", frets: [0, 0, 0, -1, -1, -1] },
  { name: "E5", group: "Power", frets: [2, 2, 2, -1, -1, -1] },
  { name: "F5", group: "Power", frets: [3, 3, 3, -1, -1, -1] },
  { name: "G5", group: "Power", frets: [5, 5, 5, -1, -1, -1] },
];

const FB_CHORDS_DOUBLE_DROP_D = [
  { name: "D", group: "Open", frets: [0, 0, 0, 2, 3, 4] },
  { name: "D5", group: "Open", frets: [0, 0, 0, -1, -1, -1] },
  { name: "G", group: "Open", frets: [5, 5, 0, 0, 0, 0] },
  { name: "A", group: "Open", frets: [-1, 0, 2, 2, 2, -1] },
  { name: "Em7", group: "Open", frets: [2, 2, 2, 0, 0, 0] },
];

const FB_CHORDS_DADGAD = [
  { name: "Dsus4", group: "Open", frets: [0, 0, 0, 0, 0, 0] },
  { name: "D", group: "Open", frets: [0, 0, 4, 2, 0, 0] },
  { name: "Dm", group: "Open", frets: [0, 0, 3, 2, 0, 0] },
  { name: "G", group: "Open", frets: [5, 5, 0, 0, 2, 0] },
  { name: "A7sus4", group: "Open", frets: [-1, 0, 0, 0, 0, 0] },
  { name: "Em11", group: "Open", frets: [2, 2, 0, 0, 0, 0] },
];

const FB_CHORDS_OPEN_G = [
  { name: "G", group: "Open & Barre", frets: [0, 0, 0, 0, 0, 0] },
  { name: "A# (barre 3)", group: "Open & Barre", frets: [3, 3, 3, 3, 3, 3] },
  { name: "C (barre 5)", group: "Open & Barre", frets: [5, 5, 5, 5, 5, 5] },
  { name: "D (barre 7)", group: "Open & Barre", frets: [7, 7, 7, 7, 7, 7] },
  { name: "G7", group: "Open & Barre", frets: [0, 0, 0, 0, 0, 3] },
];

const FB_CHORDS_OPEN_D = [
  { name: "D", group: "Open & Barre", frets: [0, 0, 0, 0, 0, 0] },
  { name: "E (barre 2)", group: "Open & Barre", frets: [2, 2, 2, 2, 2, 2] },
  { name: "G (barre 5)", group: "Open & Barre", frets: [5, 5, 5, 5, 5, 5] },
  { name: "A (barre 7)", group: "Open & Barre", frets: [7, 7, 7, 7, 7, 7] },
  { name: "D7", group: "Open & Barre", frets: [0, 0, 0, 0, 3, 0] },
];

const FB_CHORDS_OPEN_E = [
  { name: "E", group: "Open & Barre", frets: [0, 0, 0, 0, 0, 0] },
  { name: "G (barre 3)", group: "Open & Barre", frets: [3, 3, 3, 3, 3, 3] },
  { name: "A (barre 5)", group: "Open & Barre", frets: [5, 5, 5, 5, 5, 5] },
  { name: "B (barre 7)", group: "Open & Barre", frets: [7, 7, 7, 7, 7, 7] },
  { name: "E7", group: "Open & Barre", frets: [0, 0, 0, 0, 3, 0] },
];

const FB_CHORDS_OPEN_C = [
  { name: "C", group: "Open & Barre", frets: [0, 0, 0, 0, 0, 0] },
  { name: "F (barre 5)", group: "Open & Barre", frets: [5, 5, 5, 5, 5, 5] },
  { name: "G (barre 7)", group: "Open & Barre", frets: [7, 7, 7, 7, 7, 7] },
  { name: "C7", group: "Open & Barre", frets: [0, 0, 0, 3, 0, 0] },
];

// Tunings. midi = open-string MIDI numbers low to high. chords = the shape
// set valid in that tuning (null = none defined). transpose = semitone shift
// applied to standard shapes when they are reused in a down-tuned standard.
const FB_TUNINGS = {
  standard: { name: "Standard — E A D G B E", midi: [40, 45, 50, 55, 59, 64], chords: FB_CHORDS_STANDARD },
  dropD: { name: "Drop D — D A D G B E", midi: [38, 45, 50, 55, 59, 64], chords: FB_CHORDS_DROP_D },
  doubleDropD: { name: "Double Drop D — D A D G B D", midi: [38, 45, 50, 55, 59, 62], chords: FB_CHORDS_DOUBLE_DROP_D },
  dadgad: { name: "DADGAD — D A D G A D", midi: [38, 45, 50, 55, 57, 62], chords: FB_CHORDS_DADGAD },
  openG: { name: "Open G — D G D G B D", midi: [38, 43, 50, 55, 59, 62], chords: FB_CHORDS_OPEN_G },
  openD: { name: "Open D — D A D F# A D", midi: [38, 45, 50, 54, 57, 62], chords: FB_CHORDS_OPEN_D },
  openE: { name: "Open E — E B E G# B E", midi: [40, 47, 52, 56, 59, 64], chords: FB_CHORDS_OPEN_E },
  openC: { name: "Open C — C G C G C E", midi: [36, 43, 48, 55, 60, 64], chords: FB_CHORDS_OPEN_C },
  eFlat: { name: "Eb Standard — half step down", midi: [39, 44, 49, 54, 58, 63], chords: FB_CHORDS_STANDARD, transpose: -1 },
  dStandard: { name: "D Standard — whole step down", midi: [38, 43, 48, 53, 57, 62], chords: FB_CHORDS_STANDARD, transpose: -2 },
  custom: { name: "Custom…", midi: null, chords: null, custom: true },
};

// ── State ────────────────────────────────────────────────────────────────

const FB_STORAGE_KEY = "gp.fretboard";

let fbState = Object.assign(
  {
    mode: "chords",
    chord: "C",
    root: 9 /* A */,
    scale: "minorPent",
    labels: "notes",
    tuning: "standard",
    customMidi: [...FB_STD_MIDI],
  },
  load(FB_STORAGE_KEY, {})
);

function fbSave() {
  save(FB_STORAGE_KEY, fbState);
}

function fbTuning() {
  const t = FB_TUNINGS[fbState.tuning] || FB_TUNINGS.standard;
  return t.custom ? { ...t, midi: fbState.customMidi } : t;
}

function fbStringMidi(string) {
  return fbTuning().midi[string];
}

function fbNoteAt(string, fret) {
  return (fbStringMidi(string) + fret) % 12;
}

function fbTranspose() {
  return fbTuning().transpose || 0;
}

// ── Audio ────────────────────────────────────────────────────────────────

let fbAudioCtx = null;

function fbPlayMidi(midi, delaySec = 0) {
  try {
    if (!fbAudioCtx) fbAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = fbAudioCtx;
    const t = ctx.currentTime + delaySec;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 6, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 1.0);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.28, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.4);
  } catch {
    // No audio available — visual-only is fine.
  }
}

function fbCurrentChord() {
  const set = fbTuning().chords;
  if (!set) return null;
  return set.find((c) => c.name === fbState.chord) || set[0];
}

function fbStrumCurrentChord() {
  const chord = fbCurrentChord();
  if (!chord) return;
  let i = 0;
  chord.frets.forEach((fret, string) => {
    if (fret < 0) return;
    fbPlayMidi(fbStringMidi(string) + fret, i * 0.07);
    i++;
  });
}

// ── Geometry / rendering ─────────────────────────────────────────────────

const FB_FRETS = 12;
const FB_NUT_X = 66;
const FB_FRET_W = 46;
const FB_TOP = 18;
const FB_STRING_GAP = 25;
const FB_W = FB_NUT_X + FB_FRETS * FB_FRET_W + 14;
const FB_H = FB_TOP + 5 * FB_STRING_GAP + 34;

function fbStringY(string) {
  // string 0 = low E drawn at the bottom, 5 = high E at the top.
  return FB_TOP + (5 - string) * FB_STRING_GAP;
}

function fbDotX(fret) {
  return FB_NUT_X + (fret - 0.5) * FB_FRET_W;
}

function fbBoardBase() {
  let svg = "";

  // Open-string tuning labels; strings retuned away from standard get accent color.
  for (let s = 0; s < 6; s++) {
    const changed = fbStringMidi(s) !== FB_STD_MIDI[s];
    svg += `<text x="16" y="${fbStringY(s) + 4}" text-anchor="middle" font-size="11"
      font-weight="700" fill="${changed ? "var(--accent)" : "var(--text-dim)"}">${FB_NOTES[fbStringMidi(s) % 12]}</text>`;
  }

  // Fret position markers (inlays).
  for (const f of [3, 5, 7, 9]) {
    svg += `<circle cx="${fbDotX(f)}" cy="${FB_TOP + 2.5 * FB_STRING_GAP}" r="5" fill="var(--border)" />`;
  }
  svg += `<circle cx="${fbDotX(12)}" cy="${FB_TOP + 1.5 * FB_STRING_GAP}" r="5" fill="var(--border)" />`;
  svg += `<circle cx="${fbDotX(12)}" cy="${FB_TOP + 3.5 * FB_STRING_GAP}" r="5" fill="var(--border)" />`;

  // Frets. The nut (fret 0) is thicker.
  for (let f = 0; f <= FB_FRETS; f++) {
    const x = FB_NUT_X + f * FB_FRET_W;
    svg += `<line x1="${x}" y1="${FB_TOP - 4}" x2="${x}" y2="${FB_TOP + 5 * FB_STRING_GAP + 4}"
      stroke="${f === 0 ? "var(--text-dim)" : "var(--border)"}" stroke-width="${f === 0 ? 5 : 2}" />`;
  }

  // Strings — thicker at the bottom (low E).
  for (let s = 0; s < 6; s++) {
    const y = fbStringY(s);
    svg += `<line x1="${FB_NUT_X}" y1="${y}" x2="${FB_NUT_X + FB_FRETS * FB_FRET_W}" y2="${y}"
      stroke="var(--text-dim)" stroke-width="${2.4 - s * 0.28}" opacity="0.75" />`;
  }

  // Fret numbers.
  for (const f of [3, 5, 7, 9, 12]) {
    svg += `<text x="${fbDotX(f)}" y="${FB_H - 8}" text-anchor="middle"
      font-size="11" fill="var(--text-dim)">${f}</text>`;
  }
  return svg;
}

function fbDot({ string, fret, label, isRoot, openMarker = false }) {
  const midi = fbStringMidi(string) + fret;
  const x = openMarker ? FB_NUT_X - 18 : fbDotX(fret);
  const y = fbStringY(string);
  const fill = isRoot ? "var(--accent)" : openMarker ? "transparent" : "#2e3639";
  const textColor = isRoot ? "#071419" : "var(--text)";
  const stroke = isRoot ? "var(--accent)" : "var(--text-dim)";
  return `<g class="fb-dot" data-midi="${midi}" cursor="pointer">
    <circle cx="${x}" cy="${y}" r="10" fill="${fill}" stroke="${stroke}" stroke-width="1.4" />
    <text x="${x}" y="${y + 3.4}" text-anchor="middle" font-size="9.5" font-weight="700"
      fill="${openMarker && !isRoot ? "var(--text)" : textColor}">${label}</text>
  </g>`;
}

function fbMutedMarker(string) {
  const x = FB_NUT_X - 18;
  const y = fbStringY(string);
  return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12"
    fill="var(--text-dim)">✕</text>`;
}

function fbChordRootIndex(chordName) {
  const m = chordName.match(/^([A-G]#?)/);
  return m ? FB_NOTES.indexOf(m[1]) : -1;
}

// "Am7" with transpose -1 -> "G#m7" (used when standard shapes are reused
// in a down-tuned standard tuning).
function fbSoundingName(chordName, transpose) {
  const m = chordName.match(/^([A-G]#?)(.*)$/);
  if (!m) return chordName;
  const idx = (FB_NOTES.indexOf(m[1]) + transpose + 12) % 12;
  return FB_NOTES[idx] + m[2];
}

function fbRenderBoard() {
  let dots = "";

  if (fbState.mode === "chords") {
    const chord = fbCurrentChord();
    if (chord) {
      const rootIdx = (fbChordRootIndex(chord.name) + fbTranspose() + 12) % 12;
      chord.frets.forEach((fret, string) => {
        if (fret < 0) {
          dots += fbMutedMarker(string);
          return;
        }
        const noteIdx = fbNoteAt(string, fret);
        dots += fbDot({
          string,
          fret,
          label: FB_NOTES[noteIdx],
          isRoot: noteIdx === rootIdx,
          openMarker: fret === 0,
        });
      });
    }
  } else {
    const scale = FB_SCALES[fbState.scale] || FB_SCALES.minorPent;
    const intervals = new Set(scale.intervals);
    for (let string = 0; string < 6; string++) {
      for (let fret = 0; fret <= FB_FRETS; fret++) {
        const noteIdx = fbNoteAt(string, fret);
        const interval = (noteIdx - fbState.root + 12) % 12;
        if (!intervals.has(interval)) continue;
        const label =
          fbState.labels === "intervals" ? FB_INTERVAL_NAMES[interval] : FB_NOTES[noteIdx];
        dots += fbDot({
          string,
          fret,
          label,
          isRoot: interval === 0,
          openMarker: fret === 0,
        });
      }
    }
  }

  const board = document.getElementById("fb-board");
  board.innerHTML = `<svg viewBox="0 0 ${FB_W} ${FB_H}" xmlns="http://www.w3.org/2000/svg"
    role="img" aria-label="Guitar fretboard diagram">${fbBoardBase()}${dots}</svg>`;

  board.querySelectorAll(".fb-dot").forEach((dot) => {
    dot.addEventListener("click", () => fbPlayMidi(Number(dot.dataset.midi)));
  });
}

// ── Controls ─────────────────────────────────────────────────────────────

function fbRebuildChordSelect() {
  const chordSelect = document.getElementById("fb-chord");
  chordSelect.innerHTML = "";
  const set = fbTuning().chords;
  if (!set) return;
  if (!set.some((c) => c.name === fbState.chord)) fbState.chord = set[0].name;

  const transpose = fbTranspose();
  const groups = [...new Set(set.map((c) => c.group))];
  for (const group of groups) {
    const og = document.createElement("optgroup");
    og.label = group;
    for (const chord of set.filter((c) => c.group === group)) {
      const opt = document.createElement("option");
      opt.value = chord.name;
      opt.textContent =
        transpose !== 0
          ? `${chord.name} (sounds ${fbSoundingName(chord.name, transpose)})`
          : chord.name;
      opt.selected = chord.name === fbState.chord;
      og.appendChild(opt);
    }
    chordSelect.appendChild(og);
  }
}

function fbRebuildCustomEditor() {
  const editor = document.getElementById("fb-custom-tuning");
  editor.innerHTML = "";
  for (let s = 0; s < 6; s++) {
    const select = document.createElement("select");
    select.setAttribute("aria-label", `String ${6 - s} note`);
    FB_NOTES.forEach((note, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = note;
      opt.selected = fbState.customMidi[s] % 12 === i;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => {
      // Choose the octave closest to the standard string so pitches stay sane.
      const target = Number(select.value);
      let delta = (target - (FB_STD_MIDI[s] % 12) + 12) % 12;
      if (delta > 6) delta -= 12;
      fbState.customMidi[s] = FB_STD_MIDI[s] + delta;
      fbSave();
      fbRenderControls();
      fbRenderBoard();
    });
    editor.appendChild(select);
  }
}

function fbRenderControls() {
  document.querySelectorAll("#fb-tabs button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === fbState.mode);
  });

  const tuning = fbTuning();
  const hasChords = Boolean(tuning.chords);
  const inChords = fbState.mode === "chords";

  document.getElementById("fb-chord-controls").classList.toggle("hidden", !inChords || !hasChords);
  document.getElementById("fb-chord-hint").classList.toggle("hidden", !inChords || hasChords);
  document.getElementById("fb-scale-controls").classList.toggle("hidden", inChords);
  document.getElementById("fb-custom-tuning").classList.toggle("hidden", !tuning.custom);

  const transposeNote = document.getElementById("fb-transpose-note");
  const transpose = fbTranspose();
  if (inChords && hasChords && transpose !== 0) {
    transposeNote.textContent = `Standard shapes — everything sounds ${
      transpose === -1 ? "a half step" : "a whole step"
    } lower.`;
    transposeNote.classList.remove("hidden");
  } else {
    transposeNote.classList.add("hidden");
  }

  document.querySelectorAll("#fb-label-toggle button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.labels === fbState.labels);
  });
}

function fbInit() {
  // Tuning dropdown.
  const tuningSelect = document.getElementById("fb-tuning");
  for (const [id, tuning] of Object.entries(FB_TUNINGS)) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = tuning.name;
    opt.selected = id === fbState.tuning;
    tuningSelect.appendChild(opt);
  }
  tuningSelect.addEventListener("change", () => {
    fbState.tuning = tuningSelect.value;
    fbSave();
    fbRebuildChordSelect();
    fbRebuildCustomEditor();
    fbRenderControls();
    fbRenderBoard();
  });

  // Root note dropdown.
  const rootSelect = document.getElementById("fb-root");
  FB_NOTES.forEach((note, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = note;
    opt.selected = i === fbState.root;
    rootSelect.appendChild(opt);
  });
  rootSelect.addEventListener("change", () => {
    fbState.root = Number(rootSelect.value);
    fbSave();
    fbRenderBoard();
  });

  // Scale dropdown.
  const scaleSelect = document.getElementById("fb-scale");
  for (const [id, scale] of Object.entries(FB_SCALES)) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = scale.name;
    opt.selected = id === fbState.scale;
    scaleSelect.appendChild(opt);
  }
  scaleSelect.addEventListener("change", () => {
    fbState.scale = scaleSelect.value;
    fbSave();
    fbRenderBoard();
  });

  // Chord dropdown (rebuilt on tuning change).
  document.getElementById("fb-chord").addEventListener("change", (e) => {
    fbState.chord = e.target.value;
    fbSave();
    fbRenderBoard();
  });

  // Mode tabs.
  document.querySelectorAll("#fb-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      fbState.mode = btn.dataset.mode;
      fbSave();
      fbRenderControls();
      fbRenderBoard();
    });
  });

  // Notes / intervals label toggle.
  document.querySelectorAll("#fb-label-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      fbState.labels = btn.dataset.labels;
      fbSave();
      fbRenderControls();
      fbRenderBoard();
    });
  });

  document.getElementById("fb-strum").addEventListener("click", fbStrumCurrentChord);

  fbRebuildChordSelect();
  fbRebuildCustomEditor();
  fbRenderControls();
  fbRenderBoard();
}

fbInit();
