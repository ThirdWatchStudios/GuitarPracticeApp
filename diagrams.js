// Mini diagrams for exercise cards: chord grids, scale-window fretboards,
// and tab snippets, driven by each exercise's optional `visuals` field.
// Loaded after fretboard.js — reuses its chord shapes, scale intervals,
// note names and explorer state. Tapping a diagram opens it in the
// Fretboard Explorer tab.

const DG_DOT_FILL = "#2e3639";

// Vertical chord grid in the classic chord-chart style: strings as columns
// (low E left), frets as rows, root notes in amber.
function dgChordSVG(shape) {
  const rootIdx = fbChordRootIndex(shape.name);
  const fretted = shape.frets.filter((f) => f > 0);
  const maxFret = fretted.length ? Math.max(...fretted) : 0;
  const base = maxFret > 4 ? Math.min(...fretted) : 1;
  const ROWS = 4;
  const SG = 16; // string gap
  const FH = 17; // fret row height
  const LEFT = 12;
  const TOP = 24;
  const W = LEFT * 2 + SG * 5 + (base > 1 ? 20 : 0);
  const H = TOP + FH * ROWS + 10;
  let svg = "";

  // Nut (thick) when the grid starts at fret 1, otherwise a base-fret label.
  if (base === 1) {
    svg += `<line x1="${LEFT - 1}" y1="${TOP}" x2="${LEFT + SG * 5 + 1}" y2="${TOP}"
      stroke="var(--text-dim)" stroke-width="3.5" />`;
  } else {
    svg += `<text x="${LEFT + SG * 5 + 6}" y="${TOP + FH * 0.5 + 4}" font-size="9"
      fill="var(--text-dim)">${base}fr</text>`;
  }

  for (let r = 0; r <= ROWS; r++) {
    svg += `<line x1="${LEFT}" y1="${TOP + FH * r}" x2="${LEFT + SG * 5}" y2="${TOP + FH * r}"
      stroke="var(--border)" stroke-width="1.5" />`;
  }
  for (let s = 0; s < 6; s++) {
    svg += `<line x1="${LEFT + SG * s}" y1="${TOP}" x2="${LEFT + SG * s}" y2="${TOP + FH * ROWS}"
      stroke="var(--border)" stroke-width="1.5" />`;
  }

  shape.frets.forEach((fret, s) => {
    const x = LEFT + SG * s;
    if (fret < 0) {
      svg += `<text x="${x}" y="${TOP - 8}" text-anchor="middle" font-size="10"
        fill="var(--text-dim)">✕</text>`;
      return;
    }
    const isRoot = (FB_STD_MIDI[s] + fret) % 12 === rootIdx;
    if (fret === 0) {
      svg += `<circle cx="${x}" cy="${TOP - 11}" r="4"
        fill="${isRoot ? "var(--accent)" : "transparent"}"
        stroke="${isRoot ? "var(--accent)" : "var(--text-dim)"}" stroke-width="1.3" />`;
      return;
    }
    const y = TOP + (fret - base + 0.5) * FH;
    svg += `<circle cx="${x}" cy="${y}" r="6"
      fill="${isRoot ? "var(--accent)" : DG_DOT_FILL}"
      stroke="${isRoot ? "var(--accent)" : "var(--text-dim)"}" stroke-width="1.3" />`;
  });

  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${shape.name} chord diagram">${svg}</svg>`;
}

// Horizontal mini-neck cropped to a fret window — same orientation as the
// explorer (low E at the bottom). Scale notes inside the window only.
function dgScaleSVG(rootIdx, scaleKey, lo, hi, ariaLabel) {
  const scale = FB_SCALES[scaleKey];
  if (!scale) return "";
  const intervals = new Set(scale.intervals);
  const FW = 24; // fret column width
  const SG = 13; // string gap
  const LEFT = 8;
  const TOP = 10;
  const cols = hi - lo + 1;
  const W = LEFT * 2 + FW * cols;
  const H = TOP + SG * 5 + 20;
  const stringY = (s) => TOP + (5 - s) * SG;
  let svg = "";

  for (let c = 0; c <= cols; c++) {
    const isNut = lo + c === 0 || (lo === 0 && c === 1);
    svg += `<line x1="${LEFT + FW * c}" y1="${TOP - 3}" x2="${LEFT + FW * c}" y2="${TOP + SG * 5 + 3}"
      stroke="${lo === 0 && c === 1 ? "var(--text-dim)" : "var(--border)"}"
      stroke-width="${lo === 0 && c === 1 ? 3 : 1.5}" />`;
    if (isNut) continue;
  }
  for (let s = 0; s < 6; s++) {
    svg += `<line x1="${LEFT}" y1="${stringY(s)}" x2="${LEFT + FW * cols}" y2="${stringY(s)}"
      stroke="var(--text-dim)" stroke-width="1" opacity="0.6" />`;
  }

  for (let s = 0; s < 6; s++) {
    for (let f = lo; f <= hi; f++) {
      const interval = ((FB_STD_MIDI[s] + f) % 12 - rootIdx + 12) % 12;
      if (!intervals.has(interval)) continue;
      const x = LEFT + FW * (f - lo + 0.5);
      const isRoot = interval === 0;
      svg += `<circle cx="${x}" cy="${stringY(s)}" r="5.5"
        fill="${isRoot ? "var(--accent)" : DG_DOT_FILL}"
        stroke="${isRoot ? "var(--accent)" : "var(--text-dim)"}" stroke-width="1.2" />`;
    }
  }

  // Fret numbers under the first and last columns.
  svg += `<text x="${LEFT + FW * 0.5}" y="${H - 4}" text-anchor="middle" font-size="9"
    fill="var(--text-dim)">${lo}</text>`;
  svg += `<text x="${LEFT + FW * (cols - 0.5)}" y="${H - 4}" text-anchor="middle" font-size="9"
    fill="var(--text-dim)">${hi}</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${ariaLabel}">${svg}</svg>`;
}

// ── Explorer deep links ──────────────────────────────────────────────────

function dgSwitchToFretboardTab() {
  const btn = document.querySelector('#main-tabs button[data-tab="fretboard"]');
  if (btn) btn.click();
}

function dgOpenChordInExplorer(name) {
  fbState.mode = "chords";
  if (!(fbTuning().chords || []).some((c) => c.name === name)) {
    fbState.tuning = "standard";
    document.getElementById("fb-tuning").value = "standard";
  }
  fbState.chord = name;
  fbSave();
  fbRebuildChordSelect();
  fbRenderControls();
  fbRenderBoard();
  dgSwitchToFretboardTab();
}

function dgOpenScaleInExplorer(rootIdx, scaleKey) {
  fbState.mode = "scales";
  fbState.root = rootIdx;
  fbState.scale = scaleKey;
  fbSave();
  document.getElementById("fb-root").value = String(rootIdx);
  document.getElementById("fb-scale").value = scaleKey;
  fbRenderControls();
  fbRenderBoard();
  dgSwitchToFretboardTab();
}

// ── Card rendering ───────────────────────────────────────────────────────

function dgItem(caption, inner, onOpen) {
  const el = document.createElement(onOpen ? "button" : "div");
  el.className = "visual-item";
  el.innerHTML = inner + (caption ? `<span class="visual-caption">${escapeHtml(caption)}</span>` : "");
  if (onOpen) {
    el.title = "Open in Fretboard Explorer";
    el.addEventListener("click", onOpen);
  }
  return el;
}

function dgRenderVisuals(exercise) {
  const box = document.getElementById("exercise-visuals");
  if (!box) return;
  box.innerHTML = "";
  const visuals = (exercise && exercise.visuals) || [];

  for (const v of visuals) {
    if (v.type === "chord") {
      const shape = FB_CHORDS_STANDARD.find((c) => c.name === v.name);
      if (!shape) continue;
      box.appendChild(
        dgItem(v.label || v.name, dgChordSVG(shape), () => dgOpenChordInExplorer(v.name))
      );
    } else if (v.type === "scale") {
      const rootIdx = FB_NOTES.indexOf(v.root);
      const [lo, hi] = v.frets;
      if (rootIdx < 0 || !FB_SCALES[v.scale]) continue;
      const aria = `${v.root} ${FB_SCALES[v.scale].name}, frets ${lo} to ${hi}`;
      box.appendChild(
        dgItem(v.label || aria, dgScaleSVG(rootIdx, v.scale, lo, hi, aria), () =>
          dgOpenScaleInExplorer(rootIdx, v.scale)
        )
      );
    } else if (v.type === "tab") {
      const el = document.createElement("div");
      el.className = "visual-item visual-tab-item";
      el.innerHTML =
        `<pre class="visual-tab">${escapeHtml(v.text)}</pre>` +
        (v.label ? `<span class="visual-caption">${escapeHtml(v.label)}</span>` : "");
      box.appendChild(el);
    }
  }

  box.classList.toggle("hidden", box.children.length === 0);
}

// app.js renders the first exercise before this file loads — catch up now.
if (typeof currentExercise !== "undefined" && currentExercise) {
  dgRenderVisuals(currentExercise);
}
