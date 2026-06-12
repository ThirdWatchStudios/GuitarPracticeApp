// Exercise library for the Guitar Practice app.
// Each category has exercises at three levels. Every exercise is designed
// to fill a focused 15-minute session.
//
// Within a category and level, array order is the lesson-path order: the
// picker serves the earliest unmastered exercise first. An exercise is
// mastered after MASTERY_SESSIONS logged sessions, or — where `targetBpm`
// is set — by logging a session at or above that tempo. Every exercise
// carries a one-line `why` connecting it to real playing. Exercises that
// reference concrete shapes carry `visuals`: chord grids, scale windows
// (root + scale key from fretboard.js + a [lo, hi] fret window), and tab
// snippets, rendered on the card by diagrams.js.

const CATEGORIES = {
  lefthand: {
    name: "Left-Hand Technique",
    short: "Left Hand",
    blurb: "Scales, legato, finger independence and fretting accuracy.",
  },
  fingerstyle: {
    name: "Fingerstyle",
    short: "Fingerstyle",
    blurb: "Right-hand fingerpicking patterns, independence and tone.",
  },
  picking: {
    name: "Picking & Strumming",
    short: "Picking",
    blurb: "Right-hand pick control: alternate picking, strumming, dynamics.",
  },
  chords: {
    name: "Chords & Rhythm",
    short: "Chords",
    blurb: "Chord changes, voicings, groove and timing.",
  },
  fretboard: {
    name: "Fretboard & Theory",
    short: "Fretboard",
    blurb: "Note names, intervals, scale shapes and how they connect.",
  },
  ear: {
    name: "Ear Training & Improv",
    short: "Ear & Improv",
    blurb: "Hearing intervals and chords, transcribing, melodic improvisation.",
  },
  repertoire: {
    name: "Repertoire & Free Play",
    short: "Repertoire",
    blurb: "Learning songs, polishing pieces, and playing for the joy of it.",
  },
};

// Default day -> category mapping (0 = Sunday ... 6 = Saturday).
const DEFAULT_SCHEDULE = {
  0: "repertoire",
  1: "lefthand",
  2: "fingerstyle",
  3: "picking",
  4: "chords",
  5: "fretboard",
  6: "ear",
};

const EXERCISES = [
  // ── Left-Hand Technique ────────────────────────────────────────────────
  {
    id: "lh-b1",
    category: "lefthand",
    level: "beginner",
    name: "1-2-3-4 Chromatic Crawl",
    description:
      "Place one finger per fret starting at fret 5: index-middle-ring-pinky on each string, low E to high E and back. Keep fingers hovering close to the strings and press just behind the fret.",
    plan: "5 min slow with a metronome at 60 BPM (one note per click) · 5 min moving the pattern up one fret each pass · 5 min trying 80 BPM while keeping every note clean.",
    targetBpm: 80,
    why: "Every riff and scale you'll ever play rides on these four fingers landing exactly where you aim them.",
    visuals: [{"type":"tab","text":"E|--5--6--7--8--\nA|--5--6--7--8--\nD|--5--6--7--8--   ...all six strings","label":"One finger per fret"}],
  },
  {
    id: "lh-b5",
    category: "lefthand",
    level: "beginner",
    name: "Minimum Pressure Calibration",
    description:
      "Fret a note with far too little pressure, then add force gradually until it rings clean — notice how little it actually takes. Tour the neck repeating the test, and keep your thumb soft behind the neck the whole time.",
    plan: "5 min single notes finding the just-enough point · 5 min the chromatic crawl at minimum pressure · 5 min one chord shape, releasing to near-zero between strums.",
    why: "Most beginner hand pain and slowness is overgripping — a light touch is free speed and longer practice sessions.",
  },
  {
    id: "lh-b2",
    category: "lefthand",
    level: "beginner",
    name: "Open-Position C Major Scale",
    description:
      "Learn the C major scale in open position, saying each note name aloud as you play it. Use the correct finger for each fret (finger 1 = fret 1, finger 2 = fret 2, finger 3 = fret 3).",
    plan: "5 min ascending only, slowly · 5 min ascending and descending with a metronome · 5 min starting from a random scale note and finding your way back to C.",
    why: "Most melodies you'll want to pick out live inside this scale — and naming notes now makes the whole neck legible later.",
    visuals: [{"type":"scale","root":"C","scale":"major","frets":[0,3],"label":"C major, open position"}],
  },
  {
    id: "lh-b3",
    category: "lefthand",
    level: "beginner",
    name: "Finger Stretch & Spider Walk",
    description:
      "On frets 5-8, walk fingers across strings in a 'spider' pattern: 1st finger on string 6, 2nd on string 5, 3rd on string 6, 4th on string 5, then shift to the next string pair. Builds independence and stretch gently.",
    plan: "5 min on the lowest string pair, very slow · 5 min walking across all string pairs · 5 min repeating at frets 3-6 where the stretch is wider.",
    why: "Finger independence is what stops chord changes and runs from collapsing into a fist of fingers moving together.",
  },
  {
    id: "lh-b4",
    category: "lefthand",
    level: "beginner",
    name: "Hammer-On / Pull-Off Basics",
    description:
      "Pick a note at fret 5, hammer onto fret 7 with your ring finger without picking again. Then reverse: pick fret 7, pull off to 5. Aim for the second note to be as loud as the first.",
    plan: "5 min hammer-ons on each string · 5 min pull-offs on each string · 5 min combining: pick once, hammer on, pull off (3 notes per pick).",
    why: "Hammer-ons and pull-offs are how recorded guitar gets its smooth, vocal quality — picking every note sounds stiff.",
    visuals: [{"type":"tab","text":"G|--5h7--7p5--5h7p5--","label":"h = hammer-on, p = pull-off"}],
  },
  {
    id: "lh-b6",
    category: "lefthand",
    level: "beginner",
    name: "First Slides & Position Shifts",
    description:
      "Pick a note at fret 5 and slide it to fret 9, landing exactly in tune with no dip in volume. Then shift the whole hand between 2nd and 5th position cleanly. Keep light contact during the slide — the string keeps ringing.",
    plan: "5 min one-finger slides on each string · 5 min shifting between two positions inside the C major scale · 5 min sliding into target notes with eyes closed.",
    why: "Position shifts are how real songs travel the neck — sliding in tune is the skill behind every smooth lick.",
  },
  {
    id: "lh-i1",
    category: "lefthand",
    level: "intermediate",
    name: "Major Scale: Three Positions",
    description:
      "Play the G major scale in three positions (open/2nd, 4th/5th, and 7th position), connecting them by shifting on the B string. Focus on smooth position shifts with no gap in sound.",
    plan: "5 min per position, then spend the last pass linking all three ascending and descending without stopping.",
    why: "Songs don't stay in one position; smooth shifts let a melody go where it wants instead of where your hand is parked.",
    visuals: [{"type":"scale","root":"G","scale":"major","frets":[2,5],"label":"2nd position"},{"type":"scale","root":"G","scale":"major","frets":[4,8],"label":"5th position"},{"type":"scale","root":"G","scale":"major","frets":[7,10],"label":"7th position"}],
  },
  {
    id: "lh-i2",
    category: "lefthand",
    level: "intermediate",
    name: "Legato Triplet Lines",
    description:
      "Using the A minor pentatonic box at fret 5, play continuous triplets using only one pick stroke per string — the rest is hammer-ons and pull-offs. Keep the volume even between picked and legato notes.",
    plan: "5 min at 60 BPM triplets · 5 min at 72 BPM · 5 min improvising short legato phrases inside the box.",
    targetBpm: 72,
    why: "This is the sound of fluid blues and rock soloing — speed that flows instead of machine-gunning.",
    visuals: [{"type":"scale","root":"A","scale":"minorPent","frets":[5,8],"label":"A minor pentatonic, box 1"}],
  },
  {
    id: "lh-i3",
    category: "lefthand",
    level: "intermediate",
    name: "Finger Independence: 24 Permutations",
    description:
      "The four fingers can play frets 5-6-7-8 in 24 different orders (1234, 1243, 1324...). Work through 8 of them today across all six strings. Keep unused fingers low and relaxed.",
    plan: "Roughly 2 min per permutation. Write down which 8 you did so you can rotate next time.",
    why: "Real lines use finger orders you'd never choose — working the permutations removes your weak combinations.",
  },
  {
    id: "lh-i5",
    category: "lefthand",
    level: "intermediate",
    name: "Finger Rolling for Same-Fret Notes",
    description:
      "When two notes sit at the same fret on adjacent strings, roll one finger across both instead of jumping. Practice the index roll at fret 5 between the G and B strings, sounding each note separately with no bleed, then add the ring finger.",
    plan: "5 min index rolls between two strings · 5 min ring-finger rolls · 5 min an A minor pentatonic phrase where the roll keeps the notes from ringing together.",
    why: "Same-fret notes on adjacent strings appear constantly in pentatonic playing — rolling keeps them clean and separate.",
  },
  {
    id: "lh-i4",
    category: "lefthand",
    level: "intermediate",
    name: "Trill Endurance",
    description:
      "Trill (rapid hammer-on/pull-off) between two frets for 20 seconds, rest 10 seconds. Rotate through finger pairs: 1-2, 1-3, 1-4, 2-3, 2-4, 3-4. The weak pairs (2-4, 3-4) are where the gains are.",
    plan: "Three full rounds of all six finger pairs. Shake out your hand between rounds — stop if anything hurts.",
    why: "Trill stamina is raw fretting strength — it pays off in every bend, hammer-on and vibrato you play.",
  },
  {
    id: "lh-i6",
    category: "lefthand",
    level: "intermediate",
    name: "Scales in Diatonic 3rds",
    description:
      "Play the G major scale in broken 3rds: G-B, A-C, B-D and so on, up and back. The skips force fingerings you never use in straight scales. Once it flows, try 6ths on the B and high E strings.",
    plan: "5 min ascending in 3rds, slowly and evenly · 5 min descending · 5 min 6ths on the top string pair for a country flavor.",
    why: "Broken 3rds and 6ths are instant melody — the harmonized sound inside countless intros and solos.",
  },
  {
    id: "lh-a1",
    category: "lefthand",
    level: "advanced",
    name: "Three-Notes-Per-String Scales",
    description:
      "Play the C major scale across all six strings using three-notes-per-string fingerings, in all seven positions. Use economy of motion — fingers stay within a fret of the string.",
    plan: "10 min cycling through positions at 16th notes, 80 BPM · 5 min picking one position and pushing the tempo in 8 BPM steps.",
    targetBpm: 96,
    why: "Three-notes-per-string is the standard fingering for fast modern lines — it makes long scale runs mechanical and even.",
  },
  {
    id: "lh-a5",
    category: "lefthand",
    level: "advanced",
    name: "Wide-Stretch Sets: 1-2-4 and 1-3-4",
    description:
      "Isolate the two finger sets that do all the work in three-notes-per-string playing. Drill 1-2-4 and 1-3-4 patterns across string pairs around fret 7, then move them lower where the frets widen. Stop at fatigue, never pain.",
    plan: "5 min 1-2-4 sets across all string pairs · 5 min 1-3-4 sets · 5 min combining both inside a two-octave A major scale.",
    why: "These two finger sets carry every three-notes-per-string fingering — isolating them removes the weak links.",
  },
  {
    id: "lh-a2",
    category: "lefthand",
    level: "advanced",
    name: "Wide-Interval String Skipping",
    description:
      "Take a major arpeggio shape and play it with string skips (6th string to 4th, 5th to 3rd, etc.). The left hand must mute the skipped string with the underside of the fretting finger.",
    plan: "5 min on C major arpeggio · 5 min on A minor · 5 min connecting both through the cycle of fourths (C, F, Bb...).",
    why: "String skips break the up-and-down-the-scale sound — they're how lines start sounding composed instead of practiced.",
  },
  {
    id: "lh-a3",
    category: "lefthand",
    level: "advanced",
    name: "Legato Position Shifts",
    description:
      "Play a one-octave scale entirely on one string using slides and hammer-ons, only picking the first note. Then do two strings. Focus on landing shifts exactly in tune with no rhythmic hiccup.",
    plan: "5 min on the B string in A major · 5 min adding the E string · 5 min improvising single-string legato lines over a drone.",
    why: "Single-string playing forces you to think in music instead of box shapes — slides are the most vocal sound on the instrument.",
  },
  {
    id: "lh-a4",
    category: "lefthand",
    level: "advanced",
    name: "Chromatic Speed Bursts",
    description:
      "Play 1-2-3-4 as a fast 'burst' (16th notes for one beat) followed by a beat of rest, alternating. Bursts train speed without building tension — the rest beat is for checking your hand is relaxed.",
    plan: "5 min bursts at 100 BPM · 5 min at 120 BPM · 5 min stitching two bursts together into longer runs.",
    targetBpm: 120,
    why: "Speed is learned in relaxed bursts, not gritted teeth — this is the safest way to raise your ceiling.",
  },
  {
    id: "lh-a6",
    category: "lefthand",
    level: "advanced",
    name: "Sustained-Note Independence",
    description:
      "Hold a fretted note with your pinky while fingers 1-2-3 walk a bass line beneath it, both voices ringing through each other. Then flip it: hold a bass note while a melody moves on top. Classical études live on this skill.",
    plan: "5 min holding a treble note over a moving bass · 5 min holding a bass note under a moving melody · 5 min a short two-voice phrase of your own.",
    why: "Letting voices ring through each other is what makes solo guitar sound like two players — it's all fretting-hand discipline.",
  },

  // ── Fingerstyle ────────────────────────────────────────────────────────
  {
    id: "fs-b1",
    category: "fingerstyle",
    level: "beginner",
    name: "Thumb + Fingers Home Position",
    description:
      "Rest your thumb on the low E and fingers i-m-a on the G, B, and high E strings. Over an open Em chord, play: thumb, index, middle, ring — one at a time, evenly. This is the foundation of all fingerstyle.",
    plan: "5 min on Em getting an even volume from each finger · 5 min switching between Em and G · 5 min trying the pattern as continuous 8th notes.",
    why: "A stable right hand is to fingerstyle what posture is to singing — every pattern you ever learn sits on this.",
    visuals: [{"type":"chord","name":"Em"}],
  },
  {
    id: "fs-b5",
    category: "fingerstyle",
    level: "beginner",
    name: "Rest Stroke vs. Free Stroke",
    description:
      "A free stroke clears the next string; a rest stroke follows through and lands on it, giving a louder, rounder note. Practice both with each finger on open strings, then mix them inside a slow arpeggio with the rest stroke on the melody note.",
    plan: "5 min free strokes with each finger, listening for even tone · 5 min rest strokes, feeling the finger land · 5 min a slow arpeggio with rest strokes marking the top notes.",
    why: "Rest strokes are how fingerstyle players make a melody pop out of an arpeggio — volume control built into the stroke.",
  },
  {
    id: "fs-b2",
    category: "fingerstyle",
    level: "beginner",
    name: "Travis Picking: First Steps",
    description:
      "Over a C chord, alternate your thumb between the 5th and 4th strings on every beat. Once steady, add your index finger plucking the B string on the 'and' of beats 1 and 2. The thumb never stops.",
    plan: "5 min thumb alone until it's automatic · 5 min adding the index finger · 5 min trying the same thing over an Am chord.",
    why: "That steady thumb is the engine of Dust in the Wind, Landslide and most fingerpicked songs you'll want to play.",
    visuals: [{"type":"chord","name":"C"},{"type":"tab","text":"    1 & 2 & 3 & 4 &\nB|----1---1---------\nD|------2-------2---\nA|--3-------3-------","label":"Thumb on every beat"}],
  },
  {
    id: "fs-b3",
    category: "fingerstyle",
    level: "beginner",
    name: "Arpeggio Patterns p-i-m-a",
    description:
      "Cycle the right-hand pattern p-i-m-a (thumb, index, middle, ring) over a simple chord progression: C - Am - F - G, four plucks per chord. Keep your wrist still; let the fingers do the work.",
    plan: "5 min on one chord perfecting the motion · 5 min through the progression slowly · 5 min with a metronome at 70 BPM.",
    targetBpm: 70,
    why: "p-i-m-a is the default vocabulary of fingerstyle — once it's automatic, new patterns are rearrangements, not new skills.",
    visuals: [{"type":"chord","name":"C"},{"type":"chord","name":"Am"},{"type":"chord","name":"F (barre)"},{"type":"chord","name":"G"}],
  },
  {
    id: "fs-b4",
    category: "fingerstyle",
    level: "beginner",
    name: "Pinch Technique",
    description:
      "A 'pinch' is thumb and finger plucking together. Over a G chord, pinch the low G (thumb) and high G (ring finger) at the same time, then arpeggiate the middle strings. Pinches mark the melody in fingerstyle tunes.",
    plan: "5 min isolated pinches, checking both notes ring equally · 5 min pinch-then-arpeggio over G and C · 5 min over a D chord where the spacing changes.",
    why: "Pinches are how a single guitar plays melody and bass at once — the heart of solo arrangements.",
    visuals: [{"type":"chord","name":"G"},{"type":"chord","name":"C"},{"type":"chord","name":"D"}],
  },
  {
    id: "fs-b6",
    category: "fingerstyle",
    level: "beginner",
    name: "Melody Over Open Bass",
    description:
      "Play a simple melody on the top two strings while your thumb drops an open bass note (low E or A) on the first beat of each bar. Let everything ring. This is the smallest complete fingerstyle arrangement there is.",
    plan: "5 min the melody alone (try Ode to Joy on the top two strings) · 5 min adding a bass note at each bar start · 5 min letting both ring and shaping the melody louder.",
    why: "Melody plus bass is already a complete-sounding performance — solo fingerstyle in miniature.",
  },
  {
    id: "fs-i1",
    category: "fingerstyle",
    level: "intermediate",
    name: "Travis Picking with Melody",
    description:
      "Keep the alternating thumb bass going over C and G7 while your fingers pick out the melody of a simple tune (try 'Freight Train'). The melody notes land on top of the bass without interrupting it.",
    plan: "5 min bass-only refresher · 7 min adding melody phrase by phrase · 3 min playing through whatever you've got, even if rough.",
    why: "This is the moment fingerstyle becomes self-accompaniment: one guitar, a band's worth of parts.",
    visuals: [{"type":"chord","name":"C"},{"type":"chord","name":"G7"}],
  },
  {
    id: "fs-i5",
    category: "fingerstyle",
    level: "intermediate",
    name: "Forward & Reverse Rolls",
    description:
      "Borrowed from banjo: cycle p-i-m (forward) and m-i-p (reverse) as continuous, even 8th notes over chord shapes. Keep the thumb on the lower strings and the fingers fixed to their strings — the pattern does the moving.",
    plan: "5 min forward rolls over a C chord · 5 min reverse rolls · 5 min alternating directions over a C-Am-F-G loop.",
    why: "Rolls are pattern vocabulary — once automatic, your fingers can accompany any progression without thinking.",
  },
  {
    id: "fs-i2",
    category: "fingerstyle",
    level: "intermediate",
    name: "Independence: Bass vs. Syncopated Treble",
    description:
      "Thumb plays steady quarter notes on the beat; fingers pluck chord tones only on off-beats. This off-beat independence is what makes fingerstyle groove. Use an Am - Dm - E7 - Am progression.",
    plan: "5 min clapping the rhythm away from the guitar · 5 min slow with metronome · 5 min bringing it up to a comfortable groove tempo.",
    why: "Off-beat independence is what makes fingerstyle groove rather than plod.",
    visuals: [{"type":"chord","name":"Am"},{"type":"chord","name":"Dm"},{"type":"chord","name":"E7"}],
  },
  {
    id: "fs-i3",
    category: "fingerstyle",
    level: "intermediate",
    name: "Tone Control: Nail vs. Flesh",
    description:
      "Play the same arpeggio pattern three ways: near the bridge (bright), over the soundhole (full), near the neck (warm). Then vary the attack angle of your fingers. Building a palette of tones is an instrument in itself.",
    plan: "5 min exploring positions · 5 min exploring attack angles · 5 min playing a progression and 'orchestrating' it with deliberate tone changes.",
    why: "Players are recognized by tone before notes — a palette of attacks is what makes an arrangement sound orchestrated.",
  },
  {
    id: "fs-i4",
    category: "fingerstyle",
    level: "intermediate",
    name: "Tremolo Introduction",
    description:
      "Classical tremolo: p-a-m-i (thumb plays a bass note, then ring-middle-index repeat the same treble note). Aim for perfectly even spacing — speed comes later. Use the open B string over an Em chord.",
    plan: "10 min slow and even with a metronome (start ~50 BPM, one note per click) · 5 min moving the bass note while the tremolo stays constant.",
    targetBpm: 60,
    why: "Tremolo turns one guitar into a sustained voice over moving bass — the signature of classical and flamenco repertoire.",
  },
  {
    id: "fs-i6",
    category: "fingerstyle",
    level: "intermediate",
    name: "Rolled Chords with Control",
    description:
      "Roll chords deliberately from thumb to ring finger with perfectly even spacing between notes. Then vary the speed of the roll itself — a tight snap versus a slow spread — as an expressive choice, not an accident.",
    plan: "5 min slow four-note rolls, metronome on, perfectly even · 5 min varying roll speed from snap to spread · 5 min ending phrases of a song you know with intentional rolls.",
    why: "A controlled roll is the most-used expressive gesture in fingerstyle — the difference between strumming a chord and unfolding it.",
  },
  {
    id: "fs-a1",
    category: "fingerstyle",
    level: "advanced",
    name: "Walking Bass + Chord Comping",
    description:
      "Play a jazz-style walking bass line with your thumb (quarter notes through a ii-V-I in G) while your fingers punch chord stabs on beats 2 and 4. Two musicians, one hand.",
    plan: "5 min bass line alone, naming the connecting notes · 5 min adding chord stabs · 5 min looping the progression and varying the stab rhythm.",
    why: "Walking bass under chords is the jazz-duo trick that makes one guitar sound like a rhythm section.",
    visuals: [{"type":"chord","name":"Am7"},{"type":"chord","name":"D7"},{"type":"chord","name":"Gmaj7"}],
  },
  {
    id: "fs-a5",
    category: "fingerstyle",
    level: "advanced",
    name: "Two-Voice Counterpoint",
    description:
      "Take eight bars where melody and bass move independently — a Bach minuet fragment or your own invention. Learn each voice alone until it's singable, then combine them two bars at a time, keeping both lines shaped.",
    plan: "5 min each voice alone, singing along · 7 min combining two bars at a time · 3 min the full section with both voices phrased.",
    why: "Counterpoint is the deep end of fingerstyle independence — when both lines sing, one guitar genuinely sounds like two.",
  },
  {
    id: "fs-a2",
    category: "fingerstyle",
    level: "advanced",
    name: "Percussive Fingerstyle Elements",
    description:
      "Add a slap on beats 2 and 4: strike the strings against the frets with your thumb or palm where a snare drum would be. Work it into a Travis pattern until kick (bass note), snare (slap) and melody coexist.",
    plan: "5 min isolating the slap motion · 5 min slap + alternating bass · 5 min full pattern with melody fragments on top.",
    why: "The kick-and-snare illusion is what makes modern acoustic players sound like a full track live.",
  },
  {
    id: "fs-a3",
    category: "fingerstyle",
    level: "advanced",
    name: "Tremolo Refinement",
    description:
      "Push your p-a-m-i tremolo toward performance speed. Record 30 seconds and listen for the classic flaws: a gap after the thumb, or a weak middle finger. Practice with rhythmic variations (dotted patterns) to smooth them out.",
    plan: "5 min warm-up at moderate speed · 5 min dotted-rhythm variations · 5 min recording and reviewing two takes.",
    why: "Tremolo is judged on evenness, and the recording habit built here transfers to everything you polish.",
  },
  {
    id: "fs-a4",
    category: "fingerstyle",
    level: "advanced",
    name: "Harp Harmonics",
    description:
      "Fret a chord, then with the right hand touch a string 12 frets above the fretted note with your index finger and pluck with your ring finger or thumb. Alternate harmonics with normally plucked notes for the cascading 'harp' effect.",
    plan: "5 min finding clean harmonics over one chord shape · 5 min alternating harmonic/open notes · 5 min cascading through a slow chord progression.",
    why: "Cascading harp harmonics are the most magical sound an unplugged guitar makes — instant arrangement sparkle.",
  },
  {
    id: "fs-a6",
    category: "fingerstyle",
    level: "advanced",
    name: "Altered-Tuning Study: DADGAD",
    description:
      "Retune to DADGAD and build a four-bar groove that leans on open-string drones against fretted shapes. Use the Fretboard Explorer's DADGAD tuning to find your notes. Resist standard-tuning habits — let the tuning suggest the part.",
    plan: "3 min retuning and exploring the drones · 7 min building a 4-bar figure with open strings ringing through · 5 min adding melody notes on top.",
    why: "Altered tunings hand you new harmony for free — DADGAD's ringing drones are a whole genre's worth of texture.",
  },

  // ── Picking & Strumming ────────────────────────────────────────────────
  {
    id: "pk-b1",
    category: "picking",
    level: "beginner",
    name: "Alternate Picking Foundations",
    description:
      "Strict down-up picking on a single open string, then on fretted notes. The motion comes from the wrist, not the elbow, and the pick travels only a few millimeters past the string.",
    plan: "5 min open strings with metronome at 60 BPM (8th notes) · 5 min on a fretted note, checking the motion stays small · 5 min crossing between two adjacent strings.",
    targetBpm: 72,
    why: "Alternate picking is the default motion of pick playing — a small, relaxed stroke now decides your speed limit for years.",
    visuals: [{"type":"tab","text":"    v ^ v ^ v ^ v ^\nE|--0-0-0-0-0-0-0-0--","label":"v = down, ^ = up"}],
  },
  {
    id: "pk-b5",
    category: "picking",
    level: "beginner",
    name: "Subdivision Switching: 8ths to 16ths",
    description:
      "On one fretted note at 60 BPM, alternate a bar of 8th notes with a bar of 16ths without the tempo drifting. Count aloud. The switch moment is where most players rush — make it invisible.",
    plan: "5 min one bar of each, counting aloud · 5 min adding a bar of triplets into the rotation · 5 min at 70-80 BPM if the switches stay clean.",
    targetBpm: 80,
    why: "Locking subdivisions to the click is rhythm-guitar bedrock — bands follow the player whose 16ths don't drift.",
  },
  {
    id: "pk-b2",
    category: "picking",
    level: "beginner",
    name: "Strumming: Constant Motion",
    description:
      "Your strumming arm moves down-up constantly like a pendulum, even when not hitting strings. Practice the pattern D-D-U-U-D-U over an Em chord — the arm never stops, you just miss the strings on purpose.",
    plan: "5 min all downstrums on the beat · 5 min the D-D-U-U-D-U pattern slowly · 5 min over a two-chord change (Em to Am).",
    why: "The pendulum arm is why good strummers never lose the beat — the groove lives in the arm, not the chord.",
    visuals: [{"type":"chord","name":"Em"},{"type":"chord","name":"Am"}],
  },
  {
    id: "pk-b3",
    category: "picking",
    level: "beginner",
    name: "Pick Grip & Dynamics",
    description:
      "Play the same note quiet, medium, and loud, controlling volume with pick depth and grip pressure — not arm force. Then strum a chord at three volumes. Dynamics are the cheapest way to sound musical.",
    plan: "5 min single-note volume ladders · 5 min chord volume ladders · 5 min playing a strumming pattern that swells from quiet to loud over 4 bars.",
    why: "Volume control is the cheapest upgrade to musicality — the same chords at three volumes is an arrangement.",
  },
  {
    id: "pk-b4",
    category: "picking",
    level: "beginner",
    name: "String Crossing Accuracy",
    description:
      "Pick each string four times moving from low E to high E and back, without looking at your picking hand. Then three times each, then two, then one. Builds the spatial map your hand needs.",
    plan: "5 min with four picks per string · 5 min working down to two · 5 min attempting one pick per string cleanly.",
    why: "Picking without looking frees your eyes for the fretting hand and your memory for the music.",
  },
  {
    id: "pk-b6",
    category: "picking",
    level: "beginner",
    name: "The Chuck: Muted Backbeats",
    description:
      "Relax your fretting fingers to mute the strings and strum a percussive chuck on beats 2 and 4 inside a normal pattern. It should crack like a snare drum. Keep the strumming arm's pendulum unchanged.",
    plan: "5 min isolating the chuck on muted strings · 5 min dropping it onto beats 2 and 4 of D-D-U-U-D-U · 5 min over a two-chord vamp until it grooves.",
    why: "The chuck turns solo strumming into a self-contained groove — the singer-guitarist secret to sounding rhythmic alone.",
  },
  {
    id: "pk-i1",
    category: "picking",
    level: "intermediate",
    name: "Alternate Picking: Scale Sequences",
    description:
      "Play the A minor pentatonic in groups of four (notes 1-2-3-4, 2-3-4-5, 3-4-5-6...) with strict alternate picking. The string crosses fall in awkward places — that's the point.",
    plan: "5 min at 70 BPM 16ths · 5 min at 80 · 5 min applying the same sequence idea to a major scale.",
    targetBpm: 80,
    why: "Sequences are how scales become lines — they're the connective tissue of practically every solo.",
    visuals: [{"type":"scale","root":"A","scale":"minorPent","frets":[5,8],"label":"A minor pentatonic, box 1"}],
  },
  {
    id: "pk-i5",
    category: "picking",
    level: "intermediate",
    name: "Inside vs. Outside Picking",
    description:
      "Two-string repeating figures cross the strings two ways: with the pick trapped between them (inside) or traveling around them (outside). Drill the same figure both ways on the B and E strings and find your weaker crossing — then live there.",
    plan: "5 min the outside version of the figure · 5 min the inside version · 5 min drilling whichever felt worse, slow then at tempo.",
    targetBpm: 80,
    why: "Every lick crosses strings one of two ways — fixing your weaker crossing removes mystery flubs.",
  },
  {
    id: "pk-i2",
    category: "picking",
    level: "intermediate",
    name: "16th-Note Strumming & Accents",
    description:
      "Strum continuous 16th notes on a muted chord, then add accents: beat 1, then the 'e' of 2, then the 'and' of 3. Moving the accent without changing the underlying motion is the core funk/pop skill.",
    plan: "5 min even 16ths, totally relaxed · 5 min accent drills · 5 min applying it to a real chord progression with a 16th-note feel.",
    why: "Moving accents over a steady hand is the core of funk, pop and R&B rhythm guitar.",
  },
  {
    id: "pk-i3",
    category: "picking",
    level: "intermediate",
    name: "Palm Muting Control",
    description:
      "Practice three degrees of palm muting on a chugging low-string riff: heavy mute, half mute, and open. Switch between them every two beats without your picking rhythm wobbling.",
    plan: "5 min finding the three mute positions · 5 min switching on command (every 2 beats) · 5 min writing a 4-bar riff that uses all three.",
    why: "Palm-mute control is a dynamics knob — verse chug to chorus roar without touching the volume.",
  },
  {
    id: "pk-i4",
    category: "picking",
    level: "intermediate",
    name: "Triplet & Shuffle Feels",
    description:
      "Alternate between straight 8ths and shuffled 8ths on the same riff. Then strum a 12/8 slow-blues pattern. Feel is learned by deliberately switching between feels, not by accident.",
    plan: "5 min straight vs. shuffle on one riff · 5 min 12/8 blues strumming · 5 min playing along to a shuffle backing track or drum loop if available.",
    why: "Straight versus swung is the difference between rock and blues — feel is a vocabulary, and this is how it's learned.",
  },
  {
    id: "pk-i6",
    category: "picking",
    level: "intermediate",
    name: "Push Strums & Anticipations",
    description:
      "Tie the 'and' of beat 4 across the barline so the new chord arrives half a beat early — the push. Keep the arm pendulum steady; only the chord change moves. Then push the 'and' of 2 as well.",
    plan: "5 min one chord, accenting the and of 4 · 5 min changing chords on the push · 5 min applying it to a song you know that suddenly sounds right.",
    why: "Pop and rock chords change on the push more often than on the beat — this is why your cover sounded stiff.",
  },
  {
    id: "pk-a1",
    category: "picking",
    level: "advanced",
    name: "Economy Picking Transitions",
    description:
      "When crossing to a higher string after a downstroke, continue the motion through (down-down) instead of alternating. Drill 3-notes-per-string scales with economy crossings, then contrast with strict alternate picking.",
    plan: "5 min isolating the two-string crossing motion · 5 min full scale runs with economy · 5 min alternating between economy and alternate picking to keep both honest.",
    why: "Economy crossings remove the speed tax at string changes — the difference is audible in any fast passage.",
  },
  {
    id: "pk-a5",
    category: "picking",
    level: "advanced",
    name: "Sweep Picking: Three-String Triads",
    description:
      "Play minor and major triad shapes on strings 1-3 with one continuous pick motion per direction, releasing each note as the next sounds. Muting behind the sweep is the real skill — the notes must never ring together.",
    plan: "5 min the down-sweep alone with the notes fully separated · 5 min adding the pull-off turnaround at the top · 5 min connecting two inversions up the neck.",
    why: "Sweeping is the most motion-efficient picking there is — three-string shapes give you the technique without the shred clichés.",
  },
  {
    id: "pk-a2",
    category: "picking",
    level: "advanced",
    name: "Cross-Picking Arpeggios",
    description:
      "Flatpick through a banjo-roll style pattern across three strings (D-G-B) over open chords, one note per string, strict alternate picking. This is one of the hardest pick-hand skills — slow is the only way in.",
    plan: "7 min on a C chord roll at painfully slow tempo · 5 min over a G chord · 3 min pushing tempo only as far as it stays clean.",
    why: "Cross-picking gives flatpickers the sparkle of fingerstyle — it's bluegrass's hardest and prettiest trick.",
    visuals: [{"type":"chord","name":"C"},{"type":"chord","name":"G"}],
  },
  {
    id: "pk-a3",
    category: "picking",
    level: "advanced",
    name: "Hybrid Picking",
    description:
      "Pick the low note with the pick and grab the higher strings with middle and ring fingers. Drill country-style 'double stop pops' over an A7 chord, then a pedal-steel style lick with bends.",
    plan: "5 min pick + middle finger basics · 5 min double-stop licks · 5 min combining hybrid picking with a bend on the B string.",
    why: "Pick-plus-fingers grabs non-adjacent strings instantly — the country secret that rock players steal.",
    visuals: [{"type":"chord","name":"A7"}],
  },
  {
    id: "pk-a4",
    category: "picking",
    level: "advanced",
    name: "Speed Picking: Threshold Training",
    description:
      "Find your current clean 16th-note tempo on a 6-note pattern. Practice 4 BPM below it for accuracy, then 8 BPM above it in short bursts to recalibrate what 'fast' feels like, then return to the threshold.",
    plan: "3 min finding your threshold · 5 min below threshold (perfect reps) · 4 min burst training above · 3 min retesting the threshold.",
    why: "Structured threshold work is how speed actually grows — random fast playing just rehearses sloppiness.",
  },
  {
    id: "pk-a6",
    category: "picking",
    level: "advanced",
    name: "Gallop Precision",
    description:
      "Drill the gallop (down-down-up) and reverse gallop (down-up-down) on a palm-muted low string. The triplet figure must stay perfectly even as tempo rises — recording a few bars exposes any limp instantly.",
    plan: "5 min straight gallops at 100 BPM · 5 min reverse gallops · 5 min alternating bars of each, pushing tempo in 8 BPM steps.",
    targetBpm: 132,
    why: "The gallop is a stamina-and-precision benchmark — if it stays even at tempo, your picking hand is genuinely in shape.",
  },

  // ── Chords & Rhythm ────────────────────────────────────────────────────
  {
    id: "ch-b1",
    category: "chords",
    level: "beginner",
    name: "One-Minute Chord Changes",
    description:
      "Pick two chords (start with Em-Am, then C-G). Count how many clean changes you can make in one minute. Log the number — beating yesterday's score is the whole game.",
    plan: "Three rounds of: 1 min counting changes + 2 min slow-motion practice of whatever finger is late. Do two chord pairs.",
    why: "Slow changes are what stall beginner songs; this drill attacks the exact bottleneck, measurably.",
    visuals: [{"type":"chord","name":"Em"},{"type":"chord","name":"Am"},{"type":"chord","name":"C"},{"type":"chord","name":"G"}],
  },
  {
    id: "ch-b5",
    category: "chords",
    level: "beginner",
    name: "String-by-String Chord Audit",
    description:
      "Fret a chord and pick each string one at a time. Every buzz or dead string gets diagnosed: more fingertip curl, a nudged thumb, a finger scooted off a neighboring string. Then strum and hear the difference.",
    plan: "5 min auditing Em, Am and C string by string · 5 min fixing the worst offender finger by finger · 5 min re-strumming and comparing the before and after.",
    why: "A chord that's five-sixths clean still sounds wrong — the audit habit fixes problems your strumming hides.",
    visuals: [{"type":"chord","name":"Em"},{"type":"chord","name":"Am"},{"type":"chord","name":"C"}],
  },
  {
    id: "ch-b2",
    category: "chords",
    level: "beginner",
    name: "First Barre: F Major (Small Version)",
    description:
      "Start with the small 4-string F (barre frets 1 on strings 1-2 only). Check each string rings. Then attempt the full barre for short holds — squeeze for 5 seconds, rest for 10. Don't grind through pain.",
    plan: "5 min small F, strumming and checking strings · 5 min full barre holds with rests · 5 min changing C to small-F slowly.",
    why: "The F barre unlocks every key — and the small version keeps you playing songs while strength builds.",
    visuals: [{"type":"chord","name":"F (barre)"},{"type":"chord","name":"C"}],
  },
  {
    id: "ch-b3",
    category: "chords",
    level: "beginner",
    name: "Strum-and-Count Rhythm Reading",
    description:
      "Count '1 and 2 and 3 and 4 and' out loud while strumming simple patterns. Start with downs on numbers, then add ups on selected 'ands'. Counting aloud is non-negotiable — it wires rhythm to your voice.",
    plan: "5 min downs only, counting aloud · 5 min adding ups on 'and' of 2 and 4 · 5 min over a G-C-D progression.",
    why: "Counting aloud welds rhythm into your body — it's why some players never get lost in a song.",
    visuals: [{"type":"chord","name":"G"},{"type":"chord","name":"C"},{"type":"chord","name":"D"}],
  },
  {
    id: "ch-b4",
    category: "chords",
    level: "beginner",
    name: "Chord Family Tour: Key of G",
    description:
      "Play the chords that live in the key of G: G, Am, C, D, Em. Strum each for one bar in different orders. Notice how each chord 'wants' to move — Em is sad-G, D pulls home to G.",
    plan: "5 min cycling through the family in order · 5 min in random orders · 5 min building a 4-chord progression you actually like and looping it.",
    why: "Hearing how chords pull toward each other is what lets you predict songs you've never played.",
    visuals: [{"type":"chord","name":"G"},{"type":"chord","name":"Am"},{"type":"chord","name":"C"},{"type":"chord","name":"D"},{"type":"chord","name":"Em"}],
  },
  {
    id: "ch-b6",
    category: "chords",
    level: "beginner",
    name: "Anchor Fingers & Tiny Moves",
    description:
      "Some chord pairs share finger positions — moving Am to C, two fingers never leave the strings. Find the anchors in your common changes and keep them planted while only the moving fingers travel.",
    plan: "5 min spotting anchors in Am-C and Em-G · 5 min changing chords while the anchors never lift · 5 min applying it to the changes of a song you're learning.",
    why: "Fast changes aren't fast fingers — they're fewer movements. Anchors cut the work in half.",
    visuals: [{"type":"chord","name":"Am"},{"type":"chord","name":"C"},{"type":"chord","name":"Em"},{"type":"chord","name":"G"}],
  },
  {
    id: "ch-i1",
    category: "chords",
    level: "intermediate",
    name: "Barre Chord Workout: Both Shapes",
    description:
      "Play a I-vi-IV-V progression (e.g., C-Am-F-G) entirely with barre chords: E-shapes and A-shapes. Then move the whole progression to a new key just by shifting frets.",
    plan: "5 min in C with E-shape roots · 5 min mixing E- and A-shapes for minimal movement · 5 min transposing to Eb and A.",
    why: "Two moveable shapes turn five open chords into every chord in every key.",
    visuals: [{"type":"chord","name":"F (barre)","label":"E-shape barre"},{"type":"chord","name":"B (barre)","label":"A-shape barre"}],
  },
  {
    id: "ch-i2",
    category: "chords",
    level: "intermediate",
    name: "7th Chords & the 12-Bar Blues",
    description:
      "Play a 12-bar blues in A using A7, D7, E7 — first open shapes, then moveable two-note 'shell' voicings (root + 7th). Shells are the gateway to jazz comping.",
    plan: "5 min open-chord 12-bar with a shuffle strum · 5 min learning the shell shapes · 5 min the 12-bar using only shells.",
    why: "The 12-bar is the most-called progression at any jam — and shells are your first step into jazz comping.",
    visuals: [{"type":"chord","name":"A7"},{"type":"chord","name":"D7"},{"type":"chord","name":"E7"}],
  },
  {
    id: "ch-i5",
    category: "chords",
    level: "intermediate",
    name: "Sus Chords & Open-Chord Colors",
    description:
      "Decorate open chords with their neighbors: Dsus2 and Dsus4 around D, Asus4 around A, Cadd9 for C. Lift and re-plant single fingers in rhythm so the decoration becomes a figure, not an accident.",
    plan: "5 min sus moves around D and A · 5 min around C and G with add9 colors · 5 min looping a two-chord figure decorated until it sounds like a record.",
    why: "Sus decorations are how one chord becomes a guitar part — the sound of countless classic intros.",
    visuals: [{"type":"chord","name":"Dsus4"},{"type":"chord","name":"Asus2"},{"type":"chord","name":"Cadd9"}],
  },
  {
    id: "ch-i3",
    category: "chords",
    level: "intermediate",
    name: "Rhythm Displacement Drill",
    description:
      "Take one strum pattern and start it on beat 2 instead of beat 1. Then on the 'and' of 1. Keeping your place while the pattern floats over the bar line builds real rhythmic security.",
    plan: "5 min the pattern as written, with metronome · 5 min displaced to beat 2 · 5 min displaced to the 'and' of 1 (count out loud!).",
    why: "If you can float a pattern over the barline and not get lost, no drummer or band can shake you.",
  },
  {
    id: "ch-i4",
    category: "chords",
    level: "intermediate",
    name: "Voice Leading on Top Strings",
    description:
      "Play a C-Am-F-G progression using only strings 1-3, choosing the closest possible voicing for each change (triads and inversions). Your fingers should barely move between chords.",
    plan: "5 min finding the three triad shapes on strings 1-3 · 5 min the progression with minimal movement · 5 min trying it in one new key.",
    why: "Tiny movements between chords are the difference between strumming shapes and sounding like a record.",
  },
  {
    id: "ch-i6",
    category: "chords",
    level: "intermediate",
    name: "Slash Chords & Walk-Downs",
    description:
      "Learn the classic bass walks: G to Em via D/F#, and C to Am via C/B. The chord on top barely changes — the bass note carries the motion. Name the bass note aloud as you land each one.",
    plan: "5 min the G - D/F# - Em walk until seamless · 5 min C - C/B - Am · 5 min finding one more walk-down in a song you already play.",
    why: "Walk-downs are the connective tissue of acoustic songs — a moving bass line makes a progression feel inevitable.",
    visuals: [{"type":"tab","text":"     G    D/F#   Em\ne|---3-----2-----0---\nB|---3-----3-----0---\nG|---0-----2-----0---\nD|---0-----0-----2---\nA|---2-----0-----2---\nE|---3-----2-----0---","label":"The walk-down"}],
  },
  {
    id: "ch-a1",
    category: "chords",
    level: "advanced",
    name: "Drop-2 Voicings Through a Standard",
    description:
      "Comp through a ii-V-I-vi cycle using drop-2 voicings on strings 2-5, voice-leading each change so no finger moves more than 2 frets. Then do the same cycle on strings 1-4.",
    plan: "5 min reviewing the four drop-2 inversions for maj7 and m7 · 5 min the cycle on strings 2-5 · 5 min on strings 1-4.",
    why: "Drop-2s are the working vocabulary of jazz comping — four inversions cover every chord with minimal movement.",
  },
  {
    id: "ch-a5",
    category: "chords",
    level: "advanced",
    name: "Quartal Voicings over a Modal Vamp",
    description:
      "Build three-note voicings stacked in 4ths on strings 4-3-2 and move them diatonically through D dorian over a Dm drone. The sound is open and ambiguous — modern comping that names no chord too loudly.",
    plan: "5 min building the quartal shapes up the neck · 5 min moving them diatonically over a Dm drone · 5 min comping a modal vamp using only quartals.",
    why: "Quartal shapes are the modern, ambiguous comping sound — freedom from playing the same major and minor grips.",
  },
  {
    id: "ch-a2",
    category: "chords",
    level: "advanced",
    name: "Chord Melody: Harmonize a Tune",
    description:
      "Take the first 8 bars of a melody you know (a standard, a folk tune) and harmonize it: melody on top string set, chord underneath on the important beats. Just block chords today — embellishment comes later.",
    plan: "5 min playing the melody alone on strings 1-2 · 7 min adding a chord under each phrase's strong beats · 3 min playing it through musically.",
    why: "Chord melody is the solo guitarist's whole-band trick — melody, harmony and rhythm in one take.",
  },
  {
    id: "ch-a3",
    category: "chords",
    level: "advanced",
    name: "Funk 16th Comping with Ghost Notes",
    description:
      "Take a 9th chord (E9) and comp a 16th-note funk pattern where most strums are muted 'ghosts' and only selected hits ring. The mute-to-sound ratio should be about 3:1. Lock with a metronome on 2 and 4.",
    plan: "5 min pure ghost-note 16ths · 5 min placing accents in one fixed pattern · 5 min improvising accent placement while the groove stays solid.",
    why: "Ghost notes are what make a single guitar groove like a drummer is in the room.",
  },
  {
    id: "ch-a4",
    category: "chords",
    level: "advanced",
    name: "Reharmonization Sandbox",
    description:
      "Take a simple progression (C-F-G-C) and reharmonize it three ways: add secondary dominants, substitute relative minors, then try a tritone sub for the G. Play each version and compare the flavor.",
    plan: "5 min per reharmonization approach. End by combining your favorite moves into one 'best' version.",
    why: "Reharmonization is how you make a borrowed song yours — and how you start hearing harmony as choices, not facts.",
  },
  {
    id: "ch-a6",
    category: "chords",
    level: "advanced",
    name: "Upper-Structure Triads",
    description:
      "Over a low C7 shell, play simple triads from above: a D triad gives you 9-#11-13 for a bright lydian-dominant color, an Eb triad darkens it toward the altered sound. Test each and name the colors you hear — simple grips, sophisticated harmony.",
    plan: "5 min triads over a C7 shell, naming each color · 5 min finding two structures you like over G7 · 5 min resolving them inside a ii-V-I.",
    why: "Upper structures turn shapes you already know into altered-dominant sophistication — complexity from simple parts.",
  },

  // ── Fretboard & Theory ─────────────────────────────────────────────────
  {
    id: "fb-b1",
    category: "fretboard",
    level: "beginner",
    name: "Note Names: Low E and A Strings",
    description:
      "Learn every natural note on the low E and A strings (these are your barre-chord roots). Say each note aloud as you play it. Then quiz yourself: 'find C on the A string' without counting from the nut.",
    plan: "5 min walking up each string naming notes · 5 min random call-outs (use the dots as landmarks) · 5 min finding the same note on both strings.",
    why: "These two strings are where barre chords and power chords live — name the root and the chord finds itself.",
  },
  {
    id: "fb-b2",
    category: "fretboard",
    level: "beginner",
    name: "Octave Shapes",
    description:
      "Learn the octave shape (two strings up, two frets over from strings 6 and 5). Use it to find every E on the neck, then every A. Octaves turn 6 strings of mystery into one repeating map.",
    plan: "5 min drilling the two octave shapes · 5 min mapping all E's, then all G's · 5 min playing a simple melody in octaves.",
    why: "Octave shapes collapse six strings into one repeating map — learn two shapes, inherit the whole neck.",
  },
  {
    id: "fb-b5",
    category: "fretboard",
    level: "beginner",
    name: "Note Names: D and G Strings",
    description:
      "Extend your map to the D and G strings using the octave shapes you know — every note on the D string sits two strings and two frets from its twin on the low E. Quiz yourself with random call-outs.",
    plan: "5 min walking and naming each string · 5 min octave-jumping from known low-string notes to check yourself · 5 min random call-outs across all four learned strings.",
    why: "Four named strings cover most roots and scale starts you'll ever need — and the remaining two repeat the first.",
  },
  {
    id: "fb-b3",
    category: "fretboard",
    level: "beginner",
    name: "Intervals: Whole and Half Steps",
    description:
      "On one string, build a major scale using the W-W-H-W-W-W-H formula, saying 'whole' or 'half' at each move. Then start from a different note and do it again. The formula, not the shape, is the scale.",
    plan: "5 min on the B string starting from C · 5 min from G on the low E string · 5 min building a minor scale (W-H-W-W-H-W-W) and hearing the difference.",
    why: "The formula is the scale; once you hear whole and half steps, you can build any scale anywhere, no diagrams.",
  },
  {
    id: "fb-b4",
    category: "fretboard",
    level: "beginner",
    name: "Where Chords Come From",
    description:
      "Play a C major scale, then build the C chord by stacking every other note (C-E-G). Find those three notes inside your open C chord shape — every string is one of them. Repeat with G (G-B-D).",
    plan: "5 min finding chord tones in the C shape · 5 min in the G shape · 5 min in Am (A-C-E) — notice the only change from C is one note.",
    why: "Knowing chords are stacked scale notes is the aha that links riffs, solos and progressions into one system.",
    visuals: [{"type":"chord","name":"C"},{"type":"chord","name":"G"},{"type":"chord","name":"Am"}],
  },
  {
    id: "fb-b6",
    category: "fretboard",
    level: "beginner",
    name: "One Note, Everywhere",
    description:
      "Pick a note — say G — and find every G on the neck using octave shapes as stepping stones. Say which octave each one is. Repeat with C. Finish by racing the clock on a third note.",
    plan: "5 min finding every G and naming its octave · 5 min every C · 5 min the race: every E on the neck in under 30 seconds.",
    why: "When one note has six addresses you stop being lost — the fretboard equivalent of knowing your hometown streets.",
  },
  {
    id: "fb-i1",
    category: "fretboard",
    level: "intermediate",
    name: "Pentatonic Boxes: Connecting 1-2-3",
    description:
      "Play A minor pentatonic boxes 1, 2 and 3, then connect them by sliding along the G and B strings. Improvise short phrases that deliberately cross box boundaries.",
    plan: "5 min reviewing the three boxes · 5 min sliding between them on one string pair · 5 min improvising across boundaries over an Am backing feel.",
    why: "Crossing box boundaries is what separates players who solo from players who recite shapes.",
    visuals: [{"type":"scale","root":"A","scale":"minorPent","frets":[5,8],"label":"Box 1"},{"type":"scale","root":"A","scale":"minorPent","frets":[7,10],"label":"Box 2"},{"type":"scale","root":"A","scale":"minorPent","frets":[9,12],"label":"Box 3"}],
  },
  {
    id: "fb-i5",
    category: "fretboard",
    level: "intermediate",
    name: "Pentatonic Boxes 4-5: Closing the Loop",
    description:
      "Learn the last two A minor pentatonic boxes and connect box 5 back into box 1 an octave higher. The five boxes now tile the entire neck — no fret is outside the scale anymore.",
    plan: "5 min boxes 4 and 5 in A minor · 5 min linking box 5 into box 1 an octave up · 5 min improvising one phrase per box, climbing the neck.",
    why: "Five connected boxes make the whole neck one scale — no more dead zones where the solo can't go.",
    visuals: [{"type":"scale","root":"A","scale":"minorPent","frets":[0,3],"label":"Box 4 (low octave)"},{"type":"scale","root":"A","scale":"minorPent","frets":[2,5],"label":"Box 5"},{"type":"scale","root":"A","scale":"minorPent","frets":[5,8],"label":"Box 1 again"}],
  },
  {
    id: "fb-i2",
    category: "fretboard",
    level: "intermediate",
    name: "Triads on Three-String Sets",
    description:
      "Learn major triad inversions (root position, 1st, 2nd) on strings 1-3 for the key of G. Play G-C-D using the closest available inversions. Then strings 2-4.",
    plan: "5 min the three shapes on strings 1-3 · 5 min the progression with nearest-inversion movement · 5 min repeating on strings 2-4.",
    why: "Small triads are the rhythm-guitar secret on records — they sit above the bass and leave room for the vocal.",
  },
  {
    id: "fb-i3",
    category: "fretboard",
    level: "intermediate",
    name: "Interval Recognition on the Neck",
    description:
      "Learn the shapes of a 3rd, 4th, 5th, 6th and octave from a root on the A string. Then call out an interval and grab it instantly. Intervals are the vocabulary that makes the whole neck readable.",
    plan: "5 min mapping each interval shape · 5 min random call-and-grab drills · 5 min playing a melody and naming each interval as you go.",
    why: "Intervals are the words of fretboard language — grab them on sight and transcribing and improvising both speed up.",
  },
  {
    id: "fb-i4",
    category: "fretboard",
    level: "intermediate",
    name: "CAGED: One Chord, Five Places",
    description:
      "Play a C major chord using all five CAGED shapes up the neck (C shape, A shape, G shape, E shape, D shape). For each, identify where the root notes sit. One chord, the whole fretboard.",
    plan: "7 min walking through the five shapes slowly · 4 min naming root locations in each · 4 min doing the same for F major.",
    why: "CAGED ties every chord you know into one map — after this, where to play C has five answers.",
    visuals: [{"type":"chord","name":"C","label":"C shape"},{"type":"chord","name":"A","label":"A shape"},{"type":"chord","name":"G","label":"G shape"},{"type":"chord","name":"E","label":"E shape"},{"type":"chord","name":"D","label":"D shape"}],
  },
  {
    id: "fb-i6",
    category: "fretboard",
    level: "intermediate",
    name: "Major & Relative Minor: One Shape, Two Sounds",
    description:
      "C major pentatonic and A minor pentatonic are the same shapes with different home notes. Improvise resolving every phrase to A, then resolve the same shapes to C and hear the brightness flip.",
    plan: "5 min phrases resolving to A over an Am drone · 5 min resolving to C over a C drone · 5 min switching targets mid-phrase and hearing the mood move.",
    why: "One set of shapes serves two sounds — hearing the root flip is the difference between knowing patterns and using them.",
    visuals: [{"type":"scale","root":"A","scale":"minorPent","frets":[5,8],"label":"Home note: A"},{"type":"scale","root":"C","scale":"majorPent","frets":[5,8],"label":"Home note: C"}],
  },
  {
    id: "fb-a1",
    category: "fretboard",
    level: "advanced",
    name: "Modes from One Root",
    description:
      "Play C Ionian, C Dorian, C Phrygian, C Lydian and C Mixolydian all starting from the same C root. Hear what each altered note does. Parallel-mode practice teaches the sound, not just the pattern.",
    plan: "2-3 min per mode: play it, then improvise a 2-bar phrase that highlights its characteristic note (e.g., the #4 in Lydian).",
    why: "Parallel modes teach the flavor of each scale, which is the only reason modes matter in real playing.",
  },
  {
    id: "fb-a5",
    category: "fretboard",
    level: "advanced",
    name: "Modes in Context: Drone Laboratory",
    description:
      "Play only C major scale notes, but change the drone underneath: over D the same notes become dorian, over E phrygian, over G mixolydian. Improvise until each new home note clicks as home.",
    plan: "2-3 min per drone — D, E, F, G, A — improvising C-major notes until the mode's character lands. End on your favorite.",
    why: "Modes only exist over context — the drone lab teaches your ear why identical notes feel completely different.",
  },
  {
    id: "fb-a2",
    category: "fretboard",
    level: "advanced",
    name: "Arpeggios Through Changes",
    description:
      "Over a ii-V-I in C (Dm7-G7-Cmaj7), play only arpeggio tones of each chord, switching arpeggios exactly on the chord change. Then target 3rds: land on the 3rd of each new chord.",
    plan: "5 min arpeggios in position · 5 min the 3rd-targeting drill · 5 min freely connecting arpeggios with passing tones.",
    why: "Targeting chord tones over changes is the actual mechanics of jazz and country soloing — everything else decorates this.",
  },
  {
    id: "fb-a3",
    category: "fretboard",
    level: "advanced",
    name: "Melodic Minor Applications",
    description:
      "Learn A melodic minor in two positions. Then use it where it shines: over E7 (as the altered scale starting on E... i.e., F melodic minor) resolving to Am. Hear the tension-and-release.",
    plan: "5 min scale positions · 5 min the E7alt-to-Am resolution drill · 5 min improvising over a slow Am - E7 vamp.",
    why: "Melodic minor over altered dominants is the most-used outside sound in sophisticated solos — tension you can resolve.",
  },
  {
    id: "fb-a4",
    category: "fretboard",
    level: "advanced",
    name: "Whole-Neck Single-Key Mapping",
    description:
      "Pick one key (try Eb major for unfamiliarity). Play its scale on every string set and position, find its seven diatonic chords as barre shapes, and finish by playing a I-IV-V using three different neck regions.",
    plan: "5 min scale coverage · 5 min diatonic chord hunt · 5 min the three-region progression challenge.",
    why: "Fluency in an unfamiliar key proves the system stuck — and Eb is where horn players will actually call tunes.",
  },
  {
    id: "fb-a6",
    category: "fretboard",
    level: "advanced",
    name: "Symmetrical Colors: Diminished & Whole-Tone",
    description:
      "Learn the half-whole diminished scale over a 7b9 chord and the whole-tone scale over a 7#5. Both repeat in symmetric patterns, so a little fingering goes everywhere. Resolve each into a major chord to hear the release.",
    plan: "5 min the two patterns in position · 5 min resolving each over its dominant into a I chord · 5 min one short lick from each you'd actually reuse.",
    why: "Symmetrical scales are spice, not dinner — but a bar of diminished over a V chord is the classiest tension in the book.",
  },

  // ── Ear Training & Improv ──────────────────────────────────────────────
  {
    id: "ea-b1",
    category: "ear",
    level: "beginner",
    name: "Sing What You Play, Play What You Sing",
    description:
      "Play a note, sing it. Play two notes, sing them. Then reverse: sing a short phrase (3 notes), and find it on the guitar. Don't worry about your voice — this is about connecting ear to hands.",
    plan: "5 min matching pitch with single notes · 5 min singing back 2-3 note phrases · 5 min finding sung phrases on the fretboard.",
    why: "The ear-hand link is the entire goal of practice — players who have it can play what they imagine.",
  },
  {
    id: "ea-b2",
    category: "ear",
    level: "beginner",
    name: "Interval Sounds: 3 Flavors",
    description:
      "Drill just three intervals today: the octave (Somewhere Over the Rainbow), the perfect 5th (Star Wars), and the major 3rd (first two notes of a major chord). Play them, sing them, then test yourself with eyes closed.",
    plan: "5 min playing and singing each interval from random roots · 5 min eyes-closed self-quizzing · 5 min finding the intervals inside chords you know.",
    why: "Three reference sounds give your ear coordinates — every melody you'll ever transcribe is built from intervals.",
  },
  {
    id: "ea-b5",
    category: "ear",
    level: "beginner",
    name: "Interval Flavors II: 4ths, 2nds, 6ths",
    description:
      "Add three more sounds: the perfect 4th (Here Comes the Bride), the major 2nd (the first two notes of Happy Birthday), and the major 6th (the NBC chime). Play, sing, then quiz with eyes closed, mixing in the first three.",
    plan: "5 min playing and singing the new intervals from random roots · 5 min eyes-closed quizzing, all six mixed · 5 min finding these intervals inside melodies you know.",
    why: "Six interval sounds cover most melodic motion in popular music — your transcription toolkit is nearly complete.",
  },
  {
    id: "ea-b3",
    category: "ear",
    level: "beginner",
    name: "Major or Minor?",
    description:
      "Strum a chord, decide if it's major or minor by sound alone before looking. Alternate randomly between C/Cm-type pairs (use barre shapes or record yourself). Happy vs. sad is a real skill, not a cliché.",
    plan: "5 min playing major/minor pairs and exaggerating the listening · 5 min self-quiz with eyes closed · 5 min identifying the quality of chords in a song you like.",
    why: "Chord quality is the first thing your ear can usefully tell you about any song on the radio.",
  },
  {
    id: "ea-b6",
    category: "ear",
    level: "beginner",
    name: "Find the Key",
    description:
      "Play a song you love and hum the note that feels like home — the one the song wants to end on. Find that note on the guitar, then test it: play its chord along with the track and feel it lock in.",
    plan: "5 min humming and hunting the tonic of three songs · 5 min confirming by playing the chord along with each track · 5 min trying it on something unfamiliar.",
    why: "Finding the key is the first move of every by-ear musician — everything else locates itself from that one note.",
  },
  {
    id: "ea-b4",
    category: "ear",
    level: "beginner",
    name: "First Transcription: A Simple Riff",
    description:
      "Pick a dead-simple riff you know by sound ('Seven Nation Army', 'Smoke on the Water') and figure it out entirely by ear. No tabs allowed. Hunt and peck — wrong notes are information.",
    plan: "15 min of patient hunting. If you finish early, transpose the riff to start on a different string.",
    why: "Your first by-ear riff proves you don't need tabs — that independence compounds for the rest of your playing life.",
  },
  {
    id: "ea-i1",
    category: "ear",
    level: "intermediate",
    name: "Call and Response with Yourself",
    description:
      "Record (or just play) a 2-bar phrase in A minor pentatonic, then answer it with a different 2-bar phrase. The answer should relate to the call — echo its rhythm, or end where it began. This is how solos become conversations.",
    plan: "5 min strict echo (answer = exact repeat) · 5 min vary-the-ending answers · 5 min free conversation, keeping phrases short.",
    why: "Phrasing in calls and answers is what makes a solo a conversation instead of a scale demonstration.",
  },
  {
    id: "ea-i2",
    category: "ear",
    level: "intermediate",
    name: "Transcribe a Vocal Melody",
    description:
      "Take a song you love and find its vocal melody on guitar, by ear. Verse or chorus, whichever calls to you. Vocal melodies teach phrasing in a way scale practice never will.",
    plan: "12 min transcribing phrase by phrase · 3 min playing the melody with as much of the singer's phrasing (slides, holds) as you can.",
    why: "Singers phrase better than guitarists — stealing their lines is the fastest route to lyrical playing.",
  },
  {
    id: "ea-i5",
    category: "ear",
    level: "intermediate",
    name: "Bass-Line Ear",
    description:
      "Transcribe only the bass notes of a verse or chorus — ignore everything above them. Then play the line while naming each root and its distance from the last: up a 4th, down a step. The chords reveal themselves.",
    plan: "10 min lifting the bass line of one song section · 5 min playing it while naming each root movement aloud.",
    why: "The bass tells you the chords — hear root movement and you can sketch a song's harmony from one listen.",
  },
  {
    id: "ea-i3",
    category: "ear",
    level: "intermediate",
    name: "Hearing Chord Progressions",
    description:
      "Learn to hear I-IV-V-I vs I-V-vi-IV. Play each several times, singing the root movement. Then test: play one at random (or have a song in mind) and identify which it is. Most pop songs are one of about five progressions.",
    plan: "5 min playing and singing root movement of each progression · 5 min self-quizzing · 5 min identifying the progression of one song from memory.",
    why: "Most pop songs are five progressions in disguise; recognize them and you can comp along on first listen.",
  },
  {
    id: "ea-i4",
    category: "ear",
    level: "intermediate",
    name: "One-String Improvisation",
    description:
      "Improvise over an Am feel using only the B string. With one string, you can't rely on patterns — only your ear. Sing along with every note you play to force the ear-hand connection.",
    plan: "5 min exploring the string and finding the 'good' notes · 5 min improvising while singing along · 5 min adding one more string and keeping the lyricism.",
    why: "One string strips away patterns and leaves your ear in charge — what it finds is yours, not a shape's.",
  },
  {
    id: "ea-i6",
    category: "ear",
    level: "intermediate",
    name: "Rhythm Dictation",
    description:
      "Loop a one-bar riff from a song and clap its rhythm back exactly, then play it on a single muted note. Pitch removed, only time remains. Write your favorite down in counts: 1 e-and-a, 2...",
    plan: "5 min clapping back one-bar rhythms from a recording · 5 min playing them on one muted note · 5 min writing one out in counts and checking it.",
    why: "Most transcription mistakes are rhythm, not pitch — dictation trains the half of your ear that interval drills miss.",
  },
  {
    id: "ea-a1",
    category: "ear",
    level: "advanced",
    name: "Transcribe a Solo Phrase-by-Phrase",
    description:
      "Take 8-16 bars of a solo you admire and transcribe it by ear, including the bends, slides and timing — not just the pitches. Slow it down if needed, but get every nuance.",
    plan: "12 min transcription work · 3 min playing the passage along with the recording, matching the feel.",
    why: "Transcription is how every great player actually learned — nuance included, not just the notes.",
  },
  {
    id: "ea-a5",
    category: "ear",
    level: "advanced",
    name: "Lift the Voicings",
    description:
      "Take two or three chords from a recording and find the exact voicings — not the chord names, the actual grips. Work top note first, then quality, then bass. Compare your version's color against the record until they match.",
    plan: "12 min lifting two or three voicings exactly from a track you love · 3 min A/B-ing your grips against the recording.",
    why: "Records are made of specific voicings, not chord names — lifting them is how comping vocabulary really transfers.",
  },
  {
    id: "ea-a2",
    category: "ear",
    level: "advanced",
    name: "Pre-Hear Improvisation",
    description:
      "Over a slow backing feel, sing a phrase first, then immediately play exactly what you sang. No playing anything you didn't pre-hear. Painfully slow at first — this is the deepest improv practice there is.",
    plan: "15 min of sing-then-play. Keep phrases to 3-5 notes early on, lengthening as accuracy improves.",
    why: "Playing only what you pre-hear closes the final gap between imagination and instrument.",
  },
  {
    id: "ea-a3",
    category: "ear",
    level: "advanced",
    name: "Hearing Extensions & Alterations",
    description:
      "Play maj7, dom7, m7, then add 9ths and 13ths, then alter (b9, #5). Sing the extension note against the chord each time. Then quiz: play a random voicing and name its quality by ear.",
    plan: "5 min playing and singing extensions · 5 min altered dominants specifically · 5 min eyes-closed quality identification.",
    why: "Hearing a 9 or a b13 by ear lets you lift voicings off records and color your own comping on purpose.",
  },
  {
    id: "ea-a4",
    category: "ear",
    level: "advanced",
    name: "Motivic Development Solo",
    description:
      "Improvise a full 'solo' built from a single 3-4 note motif. Develop it only through repetition, transposition, rhythmic displacement, inversion and fragmentation. One idea, fully explored, beats twenty ideas abandoned.",
    plan: "3 min choosing and learning your motif cold · 9 min developing it over a vamp · 3 min performing one 'final take' solo from scratch.",
    why: "Great solos develop one idea; motif work is composition practice at improv speed.",
  },
  {
    id: "ea-a6",
    category: "ear",
    level: "advanced",
    name: "Blindfold Changes",
    description:
      "Put on a backing track you've never heard, no chart. First just listen: find the key, the form, where it turns around. Then improvise, targeting the changes as your ear locates them in real time.",
    plan: "3 min pure listening — key, form, turnarounds · 7 min improvising and targeting changes as you find them · 5 min a second pass, noticing how much more you hear.",
    why: "No chart is the realest test there is — exactly what sitting in at a jam feels like.",
  },

  // ── Repertoire & Free Play ─────────────────────────────────────────────
  {
    id: "rp-b1",
    category: "repertoire",
    level: "beginner",
    name: "Song Sprint: Learn a Chorus",
    description:
      "Pick a 3-4 chord song you love and learn just the chorus today: chords, strum pattern, and singing or humming along. A finished chorus beats a half-learned song.",
    plan: "5 min getting the chords under your fingers · 5 min looping the progression with the right strum · 5 min playing along with the recording.",
    why: "Finished sections are what you can play for people — momentum beats half-learned ambition.",
  },
  {
    id: "rp-b5",
    category: "repertoire",
    level: "beginner",
    name: "Section Welding: Verse into Chorus",
    description:
      "Songs collapse at the seams, not in the sections. Loop just the last line of the verse into the first line of the chorus until the join disappears, then weld the chorus back into the verse the same way.",
    plan: "5 min the verse-to-chorus seam, looped · 5 min the chorus-to-verse seam · 5 min full halves of the song with no stopping at the joins.",
    why: "Welding transitions is what turns a pile of sections into a performable song.",
  },
  {
    id: "rp-b2",
    category: "repertoire",
    level: "beginner",
    name: "Polish, Don't Add",
    description:
      "Take a song you can already 'kind of' play and polish it: clean chord changes, steady tempo, no stopping. Record one full take at the end — the recording is the test.",
    plan: "10 min fixing the two roughest spots in isolation · 5 min one full recorded take, mistakes and all.",
    why: "Clean and steady beats fancy and stumbling in every room you'll ever play in.",
  },
  {
    id: "rp-b3",
    category: "repertoire",
    level: "beginner",
    name: "Play-Along Session",
    description:
      "Play along with original recordings of songs you know. The recording is a merciless tempo coach — no stopping when you flub. Aim for three songs.",
    plan: "About 5 min per song. If you crash out of one, rejoin at the next section instead of stopping.",
    why: "The record never waits — playing along builds the recover-don't-stop reflex that performance requires.",
  },
  {
    id: "rp-b4",
    category: "repertoire",
    level: "beginner",
    name: "Build a 3-Song Mini Setlist",
    description:
      "Choose three songs you can play and perform them back-to-back as a 'set' — count each one in, no restarts, brief pause between songs. Performing, even alone, is a different skill from practicing.",
    plan: "15 min: perform the set once (about 10-12 min), then redo the single roughest section of the roughest song.",
    why: "Performing back-to-back is a separate skill from practicing — the mini-set is where you build it safely.",
  },
  {
    id: "rp-b6",
    category: "repertoire",
    level: "beginner",
    name: "Sing While You Strum",
    description:
      "Keep a strumming pattern steady while humming the melody, then add words to the easiest section. If the guitar falls apart, simplify the strum — all downstrums is fine. The voice leads; the guitar serves.",
    plan: "5 min strumming the song while humming · 5 min adding words to the easiest section · 5 min one verse and chorus with voice and guitar together, any quality.",
    why: "Accompanying yourself doubles what a guitar is for — and steady strumming under a melody is its own coordination skill.",
  },
  {
    id: "rp-i1",
    category: "repertoire",
    level: "intermediate",
    name: "Learn a Signature Intro/Riff Exactly",
    description:
      "Pick an iconic intro or riff and learn it exactly as recorded — the right positions, the right articulations, the right feel. 'Close enough' is the enemy today.",
    plan: "10 min detailed learning (use a slowed-down recording if possible) · 5 min playing along with the original at full speed.",
    why: "Learning a part exactly trains detail-hearing — close enough is a habit that caps how good you can sound.",
  },
  {
    id: "rp-i2",
    category: "repertoire",
    level: "intermediate",
    name: "Same Song, New Arrangement",
    description:
      "Take a song you know with open chords and rearrange it: barre chords in a higher region, or fingerstyle instead of strummed, or a new key to suit your voice. Arranging is where songs become yours.",
    plan: "5 min choosing the new approach and mapping chords · 7 min working through it section by section · 3 min full play-through.",
    why: "Rearranging is the start of having a style — the song stops being homework and becomes material.",
  },
  {
    id: "rp-i5",
    category: "repertoire",
    level: "intermediate",
    name: "Capo Craft",
    description:
      "Take a song you sing and find its best key for your voice with the capo. Then play the same song at a second capo position with different chord shapes — same key, new color. Decide which arrangement you'd perform.",
    plan: "5 min finding the singable key and playing it there · 5 min the same key from a second capo position with new shapes · 5 min choosing and polishing the winner.",
    why: "The capo is a transposition and arranging tool in one — pros use it for tone color as much as for key.",
  },
  {
    id: "rp-i3",
    category: "repertoire",
    level: "intermediate",
    name: "Memory Deepening: No Paper",
    description:
      "Play a piece from your repertoire fully from memory. Then test the memory's depth: start from the second verse cold; play the chord progression while naming the chords aloud; play it at half tempo (the hardest test of all).",
    plan: "4 min full run from memory · 4 min cold starts from each section · 4 min naming chords aloud while playing · 3 min half-tempo run.",
    why: "Deep memory survives nerves; cold-start practice is why some players never blank on stage.",
  },
  {
    id: "rp-i4",
    category: "repertoire",
    level: "intermediate",
    name: "Dynamics Pass on a Known Song",
    description:
      "Take a song you play competently and add a dynamic arc: quieter verse, building pre-chorus, full chorus, dropped-down bridge. Same notes, totally different performance.",
    plan: "5 min marking the dynamic map (even mentally) · 7 min practicing the transitions between levels · 3 min one full expressive take.",
    why: "An audience feels dynamics more than note choice — same song, played in colors.",
  },
  {
    id: "rp-i6",
    category: "repertoire",
    level: "intermediate",
    name: "Intros, Outros & Turnarounds",
    description:
      "Give a song you play a deliberate beginning and ending: an intro built from the riff, a partial progression or a stop-time count-in; an outro that ritards, tags the last line, or lands on a button. No more trailing off.",
    plan: "5 min building an intro · 5 min building a deliberate ending · 5 min running the song top-to-tail with both installed.",
    why: "Starting and stopping cleanly is what separates knowing a song from being able to perform it.",
  },
  {
    id: "rp-a1",
    category: "repertoire",
    level: "advanced",
    name: "Performance Simulation",
    description:
      "One take, recorded, standing up if you'd perform that way, of your current best piece. No warm-up beyond 1 minute, no restarts. Then listen back and write down the three things you'd fix first.",
    plan: "1 min warm-up · 5 min the recorded take · 5 min critical listen-back with notes · 4 min drilling fix #1.",
    why: "Pressure rehearsed alone is pressure you've already met on stage.",
  },
  {
    id: "rp-a2",
    category: "repertoire",
    level: "advanced",
    name: "Interpretation Study",
    description:
      "Find two different recordings/covers of a piece you play. Compare their tempo, dynamics, and phrasing choices. Steal the best idea from each and work it into your version.",
    plan: "5 min focused listening (2-3 min each) · 7 min integrating two stolen ideas · 3 min a full play-through of your upgraded version.",
    why: "Comparing versions teaches that interpretation is a menu of choices — and gives you taste worth stealing.",
  },
  {
    id: "rp-a5",
    category: "repertoire",
    level: "advanced",
    name: "Medley Construction",
    description:
      "Join two songs you play into one piece. Find the splice: a shared chord, a key pivot, or a tempo bridge. Drill the transition in both directions until it sounds designed, then perform the medley once, no restarts.",
    plan: "5 min choosing the splice point and pivot · 7 min drilling the transition both directions · 3 min one full performance of the medley.",
    why: "Medleys force arranging decisions — keys, tempos, transitions — that single songs never ask of you.",
  },
  {
    id: "rp-a3",
    category: "repertoire",
    level: "advanced",
    name: "Repertoire Maintenance Rotation",
    description:
      "Old pieces decay silently. Play through three pieces you haven't touched in weeks. Grade each (solid / shaky / broken) and spend remaining time repairing the shakiest one.",
    plan: "9 min playing through three pieces (3 min each) · 6 min repairing the weakest section found.",
    why: "Repertoire decays silently — rotation is the difference between knowing ten songs and having known them once.",
  },
  {
    id: "rp-a4",
    category: "repertoire",
    level: "advanced",
    name: "Compose a 16-Bar Piece",
    description:
      "Write a short piece or song section today: pick a mood, sketch a progression, top it with a melody. Constraints help — 16 bars, one key, done in 15 minutes. Finished and imperfect beats perfect and abandoned.",
    plan: "4 min progression sketch · 6 min melody on top · 5 min playing it through and making one revision. Record it before you forget it.",
    why: "Writing inside constraints is how finished music happens — and finished beats perfect.",
  },
  {
    id: "rp-a6",
    category: "repertoire",
    level: "advanced",
    name: "Record Against the Grid",
    description:
      "Record your best piece against a click at performance tempo. Listen back with the click muted and mark every rush and drag — the grid doesn't flatter. Re-record the worst section until it sits.",
    plan: "2 min setting the click · 5 min one recorded take · 5 min the listen-back with notes · 3 min re-recording the section that drifted most.",
    why: "Hearing exactly where you rush is the fastest route to the solid time that bands and engineers love.",
  },
];
