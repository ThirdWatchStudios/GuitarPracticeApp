// Exercise library for the Guitar Practice app.
// Each category has exercises at three levels. Every exercise is designed
// to fill a focused 15-minute session.
//
// Within a category and level, array order is the lesson-path order: the
// picker serves the earliest unmastered exercise first. An exercise is
// mastered after MASTERY_SESSIONS logged sessions, or — where `targetBpm`
// is set — by logging a session at or above that tempo.

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
  },
  {
    id: "lh-b2",
    category: "lefthand",
    level: "beginner",
    name: "Open-Position C Major Scale",
    description:
      "Learn the C major scale in open position, saying each note name aloud as you play it. Use the correct finger for each fret (finger 1 = fret 1, finger 2 = fret 2, finger 3 = fret 3).",
    plan: "5 min ascending only, slowly · 5 min ascending and descending with a metronome · 5 min starting from a random scale note and finding your way back to C.",
  },
  {
    id: "lh-b3",
    category: "lefthand",
    level: "beginner",
    name: "Finger Stretch & Spider Walk",
    description:
      "On frets 5-8, walk fingers across strings in a 'spider' pattern: 1st finger on string 6, 2nd on string 5, 3rd on string 6, 4th on string 5, then shift to the next string pair. Builds independence and stretch gently.",
    plan: "5 min on the lowest string pair, very slow · 5 min walking across all string pairs · 5 min repeating at frets 3-6 where the stretch is wider.",
  },
  {
    id: "lh-b4",
    category: "lefthand",
    level: "beginner",
    name: "Hammer-On / Pull-Off Basics",
    description:
      "Pick a note at fret 5, hammer onto fret 7 with your ring finger without picking again. Then reverse: pick fret 7, pull off to 5. Aim for the second note to be as loud as the first.",
    plan: "5 min hammer-ons on each string · 5 min pull-offs on each string · 5 min combining: pick once, hammer on, pull off (3 notes per pick).",
  },
  {
    id: "lh-i1",
    category: "lefthand",
    level: "intermediate",
    name: "Major Scale: Three Positions",
    description:
      "Play the G major scale in three positions (open/2nd, 4th/5th, and 7th position), connecting them by shifting on the B string. Focus on smooth position shifts with no gap in sound.",
    plan: "5 min per position, then spend the last pass linking all three ascending and descending without stopping.",
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
  },
  {
    id: "lh-i3",
    category: "lefthand",
    level: "intermediate",
    name: "Finger Independence: 24 Permutations",
    description:
      "The four fingers can play frets 5-6-7-8 in 24 different orders (1234, 1243, 1324...). Work through 8 of them today across all six strings. Keep unused fingers low and relaxed.",
    plan: "Roughly 2 min per permutation. Write down which 8 you did so you can rotate next time.",
  },
  {
    id: "lh-i4",
    category: "lefthand",
    level: "intermediate",
    name: "Trill Endurance",
    description:
      "Trill (rapid hammer-on/pull-off) between two frets for 20 seconds, rest 10 seconds. Rotate through finger pairs: 1-2, 1-3, 1-4, 2-3, 2-4, 3-4. The weak pairs (2-4, 3-4) are where the gains are.",
    plan: "Three full rounds of all six finger pairs. Shake out your hand between rounds — stop if anything hurts.",
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
  },
  {
    id: "lh-a2",
    category: "lefthand",
    level: "advanced",
    name: "Wide-Interval String Skipping",
    description:
      "Take a major arpeggio shape and play it with string skips (6th string to 4th, 5th to 3rd, etc.). The left hand must mute the skipped string with the underside of the fretting finger.",
    plan: "5 min on C major arpeggio · 5 min on A minor · 5 min connecting both through the cycle of fourths (C, F, Bb...).",
  },
  {
    id: "lh-a3",
    category: "lefthand",
    level: "advanced",
    name: "Legato Position Shifts",
    description:
      "Play a one-octave scale entirely on one string using slides and hammer-ons, only picking the first note. Then do two strings. Focus on landing shifts exactly in tune with no rhythmic hiccup.",
    plan: "5 min on the B string in A major · 5 min adding the E string · 5 min improvising single-string legato lines over a drone.",
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
  },
  {
    id: "fs-b2",
    category: "fingerstyle",
    level: "beginner",
    name: "Travis Picking: First Steps",
    description:
      "Over a C chord, alternate your thumb between the 5th and 4th strings on every beat. Once steady, add your index finger plucking the B string on the 'and' of beats 1 and 2. The thumb never stops.",
    plan: "5 min thumb alone until it's automatic · 5 min adding the index finger · 5 min trying the same thing over an Am chord.",
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
  },
  {
    id: "fs-b4",
    category: "fingerstyle",
    level: "beginner",
    name: "Pinch Technique",
    description:
      "A 'pinch' is thumb and finger plucking together. Over a G chord, pinch the low G (thumb) and high G (ring finger) at the same time, then arpeggiate the middle strings. Pinches mark the melody in fingerstyle tunes.",
    plan: "5 min isolated pinches, checking both notes ring equally · 5 min pinch-then-arpeggio over G and C · 5 min over a D chord where the spacing changes.",
  },
  {
    id: "fs-i1",
    category: "fingerstyle",
    level: "intermediate",
    name: "Travis Picking with Melody",
    description:
      "Keep the alternating thumb bass going over C and G7 while your fingers pick out the melody of a simple tune (try 'Freight Train'). The melody notes land on top of the bass without interrupting it.",
    plan: "5 min bass-only refresher · 7 min adding melody phrase by phrase · 3 min playing through whatever you've got, even if rough.",
  },
  {
    id: "fs-i2",
    category: "fingerstyle",
    level: "intermediate",
    name: "Independence: Bass vs. Syncopated Treble",
    description:
      "Thumb plays steady quarter notes on the beat; fingers pluck chord tones only on off-beats. This off-beat independence is what makes fingerstyle groove. Use an Am - Dm - E7 - Am progression.",
    plan: "5 min clapping the rhythm away from the guitar · 5 min slow with metronome · 5 min bringing it up to a comfortable groove tempo.",
  },
  {
    id: "fs-i3",
    category: "fingerstyle",
    level: "intermediate",
    name: "Tone Control: Nail vs. Flesh",
    description:
      "Play the same arpeggio pattern three ways: near the bridge (bright), over the soundhole (full), near the neck (warm). Then vary the attack angle of your fingers. Building a palette of tones is an instrument in itself.",
    plan: "5 min exploring positions · 5 min exploring attack angles · 5 min playing a progression and 'orchestrating' it with deliberate tone changes.",
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
  },
  {
    id: "fs-a1",
    category: "fingerstyle",
    level: "advanced",
    name: "Walking Bass + Chord Comping",
    description:
      "Play a jazz-style walking bass line with your thumb (quarter notes through a ii-V-I in G) while your fingers punch chord stabs on beats 2 and 4. Two musicians, one hand.",
    plan: "5 min bass line alone, naming the connecting notes · 5 min adding chord stabs · 5 min looping the progression and varying the stab rhythm.",
  },
  {
    id: "fs-a2",
    category: "fingerstyle",
    level: "advanced",
    name: "Percussive Fingerstyle Elements",
    description:
      "Add a slap on beats 2 and 4: strike the strings against the frets with your thumb or palm where a snare drum would be. Work it into a Travis pattern until kick (bass note), snare (slap) and melody coexist.",
    plan: "5 min isolating the slap motion · 5 min slap + alternating bass · 5 min full pattern with melody fragments on top.",
  },
  {
    id: "fs-a3",
    category: "fingerstyle",
    level: "advanced",
    name: "Tremolo Refinement",
    description:
      "Push your p-a-m-i tremolo toward performance speed. Record 30 seconds and listen for the classic flaws: a gap after the thumb, or a weak middle finger. Practice with rhythmic variations (dotted patterns) to smooth them out.",
    plan: "5 min warm-up at moderate speed · 5 min dotted-rhythm variations · 5 min recording and reviewing two takes.",
  },
  {
    id: "fs-a4",
    category: "fingerstyle",
    level: "advanced",
    name: "Harp Harmonics",
    description:
      "Fret a chord, then with the right hand touch a string 12 frets above the fretted note with your index finger and pluck with your ring finger or thumb. Alternate harmonics with normally plucked notes for the cascading 'harp' effect.",
    plan: "5 min finding clean harmonics over one chord shape · 5 min alternating harmonic/open notes · 5 min cascading through a slow chord progression.",
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
  },
  {
    id: "pk-b2",
    category: "picking",
    level: "beginner",
    name: "Strumming: Constant Motion",
    description:
      "Your strumming arm moves down-up constantly like a pendulum, even when not hitting strings. Practice the pattern D-D-U-U-D-U over an Em chord — the arm never stops, you just miss the strings on purpose.",
    plan: "5 min all downstrums on the beat · 5 min the D-D-U-U-D-U pattern slowly · 5 min over a two-chord change (Em to Am).",
  },
  {
    id: "pk-b3",
    category: "picking",
    level: "beginner",
    name: "Pick Grip & Dynamics",
    description:
      "Play the same note quiet, medium, and loud, controlling volume with pick depth and grip pressure — not arm force. Then strum a chord at three volumes. Dynamics are the cheapest way to sound musical.",
    plan: "5 min single-note volume ladders · 5 min chord volume ladders · 5 min playing a strumming pattern that swells from quiet to loud over 4 bars.",
  },
  {
    id: "pk-b4",
    category: "picking",
    level: "beginner",
    name: "String Crossing Accuracy",
    description:
      "Pick each string four times moving from low E to high E and back, without looking at your picking hand. Then three times each, then two, then one. Builds the spatial map your hand needs.",
    plan: "5 min with four picks per string · 5 min working down to two · 5 min attempting one pick per string cleanly.",
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
  },
  {
    id: "pk-i2",
    category: "picking",
    level: "intermediate",
    name: "16th-Note Strumming & Accents",
    description:
      "Strum continuous 16th notes on a muted chord, then add accents: beat 1, then the 'e' of 2, then the 'and' of 3. Moving the accent without changing the underlying motion is the core funk/pop skill.",
    plan: "5 min even 16ths, totally relaxed · 5 min accent drills · 5 min applying it to a real chord progression with a 16th-note feel.",
  },
  {
    id: "pk-i3",
    category: "picking",
    level: "intermediate",
    name: "Palm Muting Control",
    description:
      "Practice three degrees of palm muting on a chugging low-string riff: heavy mute, half mute, and open. Switch between them every two beats without your picking rhythm wobbling.",
    plan: "5 min finding the three mute positions · 5 min switching on command (every 2 beats) · 5 min writing a 4-bar riff that uses all three.",
  },
  {
    id: "pk-i4",
    category: "picking",
    level: "intermediate",
    name: "Triplet & Shuffle Feels",
    description:
      "Alternate between straight 8ths and shuffled 8ths on the same riff. Then strum a 12/8 slow-blues pattern. Feel is learned by deliberately switching between feels, not by accident.",
    plan: "5 min straight vs. shuffle on one riff · 5 min 12/8 blues strumming · 5 min playing along to a shuffle backing track or drum loop if available.",
  },
  {
    id: "pk-a1",
    category: "picking",
    level: "advanced",
    name: "Economy Picking Transitions",
    description:
      "When crossing to a higher string after a downstroke, continue the motion through (down-down) instead of alternating. Drill 3-notes-per-string scales with economy crossings, then contrast with strict alternate picking.",
    plan: "5 min isolating the two-string crossing motion · 5 min full scale runs with economy · 5 min alternating between economy and alternate picking to keep both honest.",
  },
  {
    id: "pk-a2",
    category: "picking",
    level: "advanced",
    name: "Cross-Picking Arpeggios",
    description:
      "Flatpick through a banjo-roll style pattern across three strings (D-G-B) over open chords, one note per string, strict alternate picking. This is one of the hardest pick-hand skills — slow is the only way in.",
    plan: "7 min on a C chord roll at painfully slow tempo · 5 min over a G chord · 3 min pushing tempo only as far as it stays clean.",
  },
  {
    id: "pk-a3",
    category: "picking",
    level: "advanced",
    name: "Hybrid Picking",
    description:
      "Pick the low note with the pick and grab the higher strings with middle and ring fingers. Drill country-style 'double stop pops' over an A7 chord, then a pedal-steel style lick with bends.",
    plan: "5 min pick + middle finger basics · 5 min double-stop licks · 5 min combining hybrid picking with a bend on the B string.",
  },
  {
    id: "pk-a4",
    category: "picking",
    level: "advanced",
    name: "Speed Picking: Threshold Training",
    description:
      "Find your current clean 16th-note tempo on a 6-note pattern. Practice 4 BPM below it for accuracy, then 8 BPM above it in short bursts to recalibrate what 'fast' feels like, then return to the threshold.",
    plan: "3 min finding your threshold · 5 min below threshold (perfect reps) · 4 min burst training above · 3 min retesting the threshold.",
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
  },
  {
    id: "ch-b2",
    category: "chords",
    level: "beginner",
    name: "First Barre: F Major (Small Version)",
    description:
      "Start with the small 4-string F (barre frets 1 on strings 1-2 only). Check each string rings. Then attempt the full barre for short holds — squeeze for 5 seconds, rest for 10. Don't grind through pain.",
    plan: "5 min small F, strumming and checking strings · 5 min full barre holds with rests · 5 min changing C to small-F slowly.",
  },
  {
    id: "ch-b3",
    category: "chords",
    level: "beginner",
    name: "Strum-and-Count Rhythm Reading",
    description:
      "Count '1 and 2 and 3 and 4 and' out loud while strumming simple patterns. Start with downs on numbers, then add ups on selected 'ands'. Counting aloud is non-negotiable — it wires rhythm to your voice.",
    plan: "5 min downs only, counting aloud · 5 min adding ups on 'and' of 2 and 4 · 5 min over a G-C-D progression.",
  },
  {
    id: "ch-b4",
    category: "chords",
    level: "beginner",
    name: "Chord Family Tour: Key of G",
    description:
      "Play the chords that live in the key of G: G, Am, C, D, Em. Strum each for one bar in different orders. Notice how each chord 'wants' to move — Em is sad-G, D pulls home to G.",
    plan: "5 min cycling through the family in order · 5 min in random orders · 5 min building a 4-chord progression you actually like and looping it.",
  },
  {
    id: "ch-i1",
    category: "chords",
    level: "intermediate",
    name: "Barre Chord Workout: Both Shapes",
    description:
      "Play a I-vi-IV-V progression (e.g., C-Am-F-G) entirely with barre chords: E-shapes and A-shapes. Then move the whole progression to a new key just by shifting frets.",
    plan: "5 min in C with E-shape roots · 5 min mixing E- and A-shapes for minimal movement · 5 min transposing to Eb and A.",
  },
  {
    id: "ch-i2",
    category: "chords",
    level: "intermediate",
    name: "7th Chords & the 12-Bar Blues",
    description:
      "Play a 12-bar blues in A using A7, D7, E7 — first open shapes, then moveable two-note 'shell' voicings (root + 7th). Shells are the gateway to jazz comping.",
    plan: "5 min open-chord 12-bar with a shuffle strum · 5 min learning the shell shapes · 5 min the 12-bar using only shells.",
  },
  {
    id: "ch-i3",
    category: "chords",
    level: "intermediate",
    name: "Rhythm Displacement Drill",
    description:
      "Take one strum pattern and start it on beat 2 instead of beat 1. Then on the 'and' of 1. Keeping your place while the pattern floats over the bar line builds real rhythmic security.",
    plan: "5 min the pattern as written, with metronome · 5 min displaced to beat 2 · 5 min displaced to the 'and' of 1 (count out loud!).",
  },
  {
    id: "ch-i4",
    category: "chords",
    level: "intermediate",
    name: "Voice Leading on Top Strings",
    description:
      "Play a C-Am-F-G progression using only strings 1-3, choosing the closest possible voicing for each change (triads and inversions). Your fingers should barely move between chords.",
    plan: "5 min finding the three triad shapes on strings 1-3 · 5 min the progression with minimal movement · 5 min trying it in one new key.",
  },
  {
    id: "ch-a1",
    category: "chords",
    level: "advanced",
    name: "Drop-2 Voicings Through a Standard",
    description:
      "Comp through a ii-V-I-vi cycle using drop-2 voicings on strings 2-5, voice-leading each change so no finger moves more than 2 frets. Then do the same cycle on strings 1-4.",
    plan: "5 min reviewing the four drop-2 inversions for maj7 and m7 · 5 min the cycle on strings 2-5 · 5 min on strings 1-4.",
  },
  {
    id: "ch-a2",
    category: "chords",
    level: "advanced",
    name: "Chord Melody: Harmonize a Tune",
    description:
      "Take the first 8 bars of a melody you know (a standard, a folk tune) and harmonize it: melody on top string set, chord underneath on the important beats. Just block chords today — embellishment comes later.",
    plan: "5 min playing the melody alone on strings 1-2 · 7 min adding a chord under each phrase's strong beats · 3 min playing it through musically.",
  },
  {
    id: "ch-a3",
    category: "chords",
    level: "advanced",
    name: "Funk 16th Comping with Ghost Notes",
    description:
      "Take a 9th chord (E9) and comp a 16th-note funk pattern where most strums are muted 'ghosts' and only selected hits ring. The mute-to-sound ratio should be about 3:1. Lock with a metronome on 2 and 4.",
    plan: "5 min pure ghost-note 16ths · 5 min placing accents in one fixed pattern · 5 min improvising accent placement while the groove stays solid.",
  },
  {
    id: "ch-a4",
    category: "chords",
    level: "advanced",
    name: "Reharmonization Sandbox",
    description:
      "Take a simple progression (C-F-G-C) and reharmonize it three ways: add secondary dominants, substitute relative minors, then try a tritone sub for the G. Play each version and compare the flavor.",
    plan: "5 min per reharmonization approach. End by combining your favorite moves into one 'best' version.",
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
  },
  {
    id: "fb-b2",
    category: "fretboard",
    level: "beginner",
    name: "Octave Shapes",
    description:
      "Learn the octave shape (two strings up, two frets over from strings 6 and 5). Use it to find every E on the neck, then every A. Octaves turn 6 strings of mystery into one repeating map.",
    plan: "5 min drilling the two octave shapes · 5 min mapping all E's, then all G's · 5 min playing a simple melody in octaves.",
  },
  {
    id: "fb-b3",
    category: "fretboard",
    level: "beginner",
    name: "Intervals: Whole and Half Steps",
    description:
      "On one string, build a major scale using the W-W-H-W-W-W-H formula, saying 'whole' or 'half' at each move. Then start from a different note and do it again. The formula, not the shape, is the scale.",
    plan: "5 min on the B string starting from C · 5 min from G on the low E string · 5 min building a minor scale (W-H-W-W-H-W-W) and hearing the difference.",
  },
  {
    id: "fb-b4",
    category: "fretboard",
    level: "beginner",
    name: "Where Chords Come From",
    description:
      "Play a C major scale, then build the C chord by stacking every other note (C-E-G). Find those three notes inside your open C chord shape — every string is one of them. Repeat with G (G-B-D).",
    plan: "5 min finding chord tones in the C shape · 5 min in the G shape · 5 min in Am (A-C-E) — notice the only change from C is one note.",
  },
  {
    id: "fb-i1",
    category: "fretboard",
    level: "intermediate",
    name: "Pentatonic Boxes: Connecting 1-2-3",
    description:
      "Play A minor pentatonic boxes 1, 2 and 3, then connect them by sliding along the G and B strings. Improvise short phrases that deliberately cross box boundaries.",
    plan: "5 min reviewing the three boxes · 5 min sliding between them on one string pair · 5 min improvising across boundaries over an Am backing feel.",
  },
  {
    id: "fb-i2",
    category: "fretboard",
    level: "intermediate",
    name: "Triads on Three-String Sets",
    description:
      "Learn major triad inversions (root position, 1st, 2nd) on strings 1-3 for the key of G. Play G-C-D using the closest available inversions. Then strings 2-4.",
    plan: "5 min the three shapes on strings 1-3 · 5 min the progression with nearest-inversion movement · 5 min repeating on strings 2-4.",
  },
  {
    id: "fb-i3",
    category: "fretboard",
    level: "intermediate",
    name: "Interval Recognition on the Neck",
    description:
      "Learn the shapes of a 3rd, 4th, 5th, 6th and octave from a root on the A string. Then call out an interval and grab it instantly. Intervals are the vocabulary that makes the whole neck readable.",
    plan: "5 min mapping each interval shape · 5 min random call-and-grab drills · 5 min playing a melody and naming each interval as you go.",
  },
  {
    id: "fb-i4",
    category: "fretboard",
    level: "intermediate",
    name: "CAGED: One Chord, Five Places",
    description:
      "Play a C major chord using all five CAGED shapes up the neck (C shape, A shape, G shape, E shape, D shape). For each, identify where the root notes sit. One chord, the whole fretboard.",
    plan: "7 min walking through the five shapes slowly · 4 min naming root locations in each · 4 min doing the same for F major.",
  },
  {
    id: "fb-a1",
    category: "fretboard",
    level: "advanced",
    name: "Modes from One Root",
    description:
      "Play C Ionian, C Dorian, C Phrygian, C Lydian and C Mixolydian all starting from the same C root. Hear what each altered note does. Parallel-mode practice teaches the sound, not just the pattern.",
    plan: "2-3 min per mode: play it, then improvise a 2-bar phrase that highlights its characteristic note (e.g., the #4 in Lydian).",
  },
  {
    id: "fb-a2",
    category: "fretboard",
    level: "advanced",
    name: "Arpeggios Through Changes",
    description:
      "Over a ii-V-I in C (Dm7-G7-Cmaj7), play only arpeggio tones of each chord, switching arpeggios exactly on the chord change. Then target 3rds: land on the 3rd of each new chord.",
    plan: "5 min arpeggios in position · 5 min the 3rd-targeting drill · 5 min freely connecting arpeggios with passing tones.",
  },
  {
    id: "fb-a3",
    category: "fretboard",
    level: "advanced",
    name: "Melodic Minor Applications",
    description:
      "Learn A melodic minor in two positions. Then use it where it shines: over E7 (as the altered scale starting on E... i.e., F melodic minor) resolving to Am. Hear the tension-and-release.",
    plan: "5 min scale positions · 5 min the E7alt-to-Am resolution drill · 5 min improvising over a slow Am - E7 vamp.",
  },
  {
    id: "fb-a4",
    category: "fretboard",
    level: "advanced",
    name: "Whole-Neck Single-Key Mapping",
    description:
      "Pick one key (try Eb major for unfamiliarity). Play its scale on every string set and position, find its seven diatonic chords as barre shapes, and finish by playing a I-IV-V using three different neck regions.",
    plan: "5 min scale coverage · 5 min diatonic chord hunt · 5 min the three-region progression challenge.",
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
  },
  {
    id: "ea-b2",
    category: "ear",
    level: "beginner",
    name: "Interval Sounds: 3 Flavors",
    description:
      "Drill just three intervals today: the octave (Somewhere Over the Rainbow), the perfect 5th (Star Wars), and the major 3rd (first two notes of a major chord). Play them, sing them, then test yourself with eyes closed.",
    plan: "5 min playing and singing each interval from random roots · 5 min eyes-closed self-quizzing · 5 min finding the intervals inside chords you know.",
  },
  {
    id: "ea-b3",
    category: "ear",
    level: "beginner",
    name: "Major or Minor?",
    description:
      "Strum a chord, decide if it's major or minor by sound alone before looking. Alternate randomly between C/Cm-type pairs (use barre shapes or record yourself). Happy vs. sad is a real skill, not a cliché.",
    plan: "5 min playing major/minor pairs and exaggerating the listening · 5 min self-quiz with eyes closed · 5 min identifying the quality of chords in a song you like.",
  },
  {
    id: "ea-b4",
    category: "ear",
    level: "beginner",
    name: "First Transcription: A Simple Riff",
    description:
      "Pick a dead-simple riff you know by sound ('Seven Nation Army', 'Smoke on the Water') and figure it out entirely by ear. No tabs allowed. Hunt and peck — wrong notes are information.",
    plan: "15 min of patient hunting. If you finish early, transpose the riff to start on a different string.",
  },
  {
    id: "ea-i1",
    category: "ear",
    level: "intermediate",
    name: "Call and Response with Yourself",
    description:
      "Record (or just play) a 2-bar phrase in A minor pentatonic, then answer it with a different 2-bar phrase. The answer should relate to the call — echo its rhythm, or end where it began. This is how solos become conversations.",
    plan: "5 min strict echo (answer = exact repeat) · 5 min vary-the-ending answers · 5 min free conversation, keeping phrases short.",
  },
  {
    id: "ea-i2",
    category: "ear",
    level: "intermediate",
    name: "Transcribe a Vocal Melody",
    description:
      "Take a song you love and find its vocal melody on guitar, by ear. Verse or chorus, whichever calls to you. Vocal melodies teach phrasing in a way scale practice never will.",
    plan: "12 min transcribing phrase by phrase · 3 min playing the melody with as much of the singer's phrasing (slides, holds) as you can.",
  },
  {
    id: "ea-i3",
    category: "ear",
    level: "intermediate",
    name: "Hearing Chord Progressions",
    description:
      "Learn to hear I-IV-V-I vs I-V-vi-IV. Play each several times, singing the root movement. Then test: play one at random (or have a song in mind) and identify which it is. Most pop songs are one of about five progressions.",
    plan: "5 min playing and singing root movement of each progression · 5 min self-quizzing · 5 min identifying the progression of one song from memory.",
  },
  {
    id: "ea-i4",
    category: "ear",
    level: "intermediate",
    name: "One-String Improvisation",
    description:
      "Improvise over an Am feel using only the B string. With one string, you can't rely on patterns — only your ear. Sing along with every note you play to force the ear-hand connection.",
    plan: "5 min exploring the string and finding the 'good' notes · 5 min improvising while singing along · 5 min adding one more string and keeping the lyricism.",
  },
  {
    id: "ea-a1",
    category: "ear",
    level: "advanced",
    name: "Transcribe a Solo Phrase-by-Phrase",
    description:
      "Take 8-16 bars of a solo you admire and transcribe it by ear, including the bends, slides and timing — not just the pitches. Slow it down if needed, but get every nuance.",
    plan: "12 min transcription work · 3 min playing the passage along with the recording, matching the feel.",
  },
  {
    id: "ea-a2",
    category: "ear",
    level: "advanced",
    name: "Pre-Hear Improvisation",
    description:
      "Over a slow backing feel, sing a phrase first, then immediately play exactly what you sang. No playing anything you didn't pre-hear. Painfully slow at first — this is the deepest improv practice there is.",
    plan: "15 min of sing-then-play. Keep phrases to 3-5 notes early on, lengthening as accuracy improves.",
  },
  {
    id: "ea-a3",
    category: "ear",
    level: "advanced",
    name: "Hearing Extensions & Alterations",
    description:
      "Play maj7, dom7, m7, then add 9ths and 13ths, then alter (b9, #5). Sing the extension note against the chord each time. Then quiz: play a random voicing and name its quality by ear.",
    plan: "5 min playing and singing extensions · 5 min altered dominants specifically · 5 min eyes-closed quality identification.",
  },
  {
    id: "ea-a4",
    category: "ear",
    level: "advanced",
    name: "Motivic Development Solo",
    description:
      "Improvise a full 'solo' built from a single 3-4 note motif. Develop it only through repetition, transposition, rhythmic displacement, inversion and fragmentation. One idea, fully explored, beats twenty ideas abandoned.",
    plan: "3 min choosing and learning your motif cold · 9 min developing it over a vamp · 3 min performing one 'final take' solo from scratch.",
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
  },
  {
    id: "rp-b2",
    category: "repertoire",
    level: "beginner",
    name: "Polish, Don't Add",
    description:
      "Take a song you can already 'kind of' play and polish it: clean chord changes, steady tempo, no stopping. Record one full take at the end — the recording is the test.",
    plan: "10 min fixing the two roughest spots in isolation · 5 min one full recorded take, mistakes and all.",
  },
  {
    id: "rp-b3",
    category: "repertoire",
    level: "beginner",
    name: "Play-Along Session",
    description:
      "Play along with original recordings of songs you know. The recording is a merciless tempo coach — no stopping when you flub. Aim for three songs.",
    plan: "About 5 min per song. If you crash out of one, rejoin at the next section instead of stopping.",
  },
  {
    id: "rp-b4",
    category: "repertoire",
    level: "beginner",
    name: "Build a 3-Song Mini Setlist",
    description:
      "Choose three songs you can play and perform them back-to-back as a 'set' — count each one in, no restarts, brief pause between songs. Performing, even alone, is a different skill from practicing.",
    plan: "15 min: perform the set once (about 10-12 min), then redo the single roughest section of the roughest song.",
  },
  {
    id: "rp-i1",
    category: "repertoire",
    level: "intermediate",
    name: "Learn a Signature Intro/Riff Exactly",
    description:
      "Pick an iconic intro or riff and learn it exactly as recorded — the right positions, the right articulations, the right feel. 'Close enough' is the enemy today.",
    plan: "10 min detailed learning (use a slowed-down recording if possible) · 5 min playing along with the original at full speed.",
  },
  {
    id: "rp-i2",
    category: "repertoire",
    level: "intermediate",
    name: "Same Song, New Arrangement",
    description:
      "Take a song you know with open chords and rearrange it: barre chords in a higher region, or fingerstyle instead of strummed, or a new key to suit your voice. Arranging is where songs become yours.",
    plan: "5 min choosing the new approach and mapping chords · 7 min working through it section by section · 3 min full play-through.",
  },
  {
    id: "rp-i3",
    category: "repertoire",
    level: "intermediate",
    name: "Memory Deepening: No Paper",
    description:
      "Play a piece from your repertoire fully from memory. Then test the memory's depth: start from the second verse cold; play the chord progression while naming the chords aloud; play it at half tempo (the hardest test of all).",
    plan: "4 min full run from memory · 4 min cold starts from each section · 4 min naming chords aloud while playing · 3 min half-tempo run.",
  },
  {
    id: "rp-i4",
    category: "repertoire",
    level: "intermediate",
    name: "Dynamics Pass on a Known Song",
    description:
      "Take a song you play competently and add a dynamic arc: quieter verse, building pre-chorus, full chorus, dropped-down bridge. Same notes, totally different performance.",
    plan: "5 min marking the dynamic map (even mentally) · 7 min practicing the transitions between levels · 3 min one full expressive take.",
  },
  {
    id: "rp-a1",
    category: "repertoire",
    level: "advanced",
    name: "Performance Simulation",
    description:
      "One take, recorded, standing up if you'd perform that way, of your current best piece. No warm-up beyond 1 minute, no restarts. Then listen back and write down the three things you'd fix first.",
    plan: "1 min warm-up · 5 min the recorded take · 5 min critical listen-back with notes · 4 min drilling fix #1.",
  },
  {
    id: "rp-a2",
    category: "repertoire",
    level: "advanced",
    name: "Interpretation Study",
    description:
      "Find two different recordings/covers of a piece you play. Compare their tempo, dynamics, and phrasing choices. Steal the best idea from each and work it into your version.",
    plan: "5 min focused listening (2-3 min each) · 7 min integrating two stolen ideas · 3 min a full play-through of your upgraded version.",
  },
  {
    id: "rp-a3",
    category: "repertoire",
    level: "advanced",
    name: "Repertoire Maintenance Rotation",
    description:
      "Old pieces decay silently. Play through three pieces you haven't touched in weeks. Grade each (solid / shaky / broken) and spend remaining time repairing the shakiest one.",
    plan: "9 min playing through three pieces (3 min each) · 6 min repairing the weakest section found.",
  },
  {
    id: "rp-a4",
    category: "repertoire",
    level: "advanced",
    name: "Compose a 16-Bar Piece",
    description:
      "Write a short piece or song section today: pick a mood, sketch a progression, top it with a melody. Constraints help — 16 bars, one key, done in 15 minutes. Finished and imperfect beats perfect and abandoned.",
    plan: "4 min progression sketch · 6 min melody on top · 5 min playing it through and making one revision. Record it before you forget it.",
  },
];
