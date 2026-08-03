/* ============================================================
   NeuroSpazio — i18n.js
   Localizzazione italiano/inglese. Copre l'interfaccia, gli
   elenchi di giochi/strumenti, le schede scientifiche brevi e
   i 3 test di screening per intero. I contenuti lunghi (percorsi
   giorno-per-giorno, schede complete delle Risorse) restano solo
   in italiano: onestà prima della copertura totale.
   ============================================================ */

const I18N = {
  it: {
    nav_home: "Home", nav_giochi: "Giochi", nav_strumenti: "Strumenti",
    nav_risorse: "Risorse", nav_progressi: "Progressi", nav_impostazioni: "Opzioni",
    footer_disclaimer: "<strong>NeuroSpazio</strong> è uno strumento educativo e di benessere, <strong>non un dispositivo medico</strong>: non diagnostica, non cura, non previene alcuna condizione. Non sostituisce un parere medico. Se hai dubbi sulla tua salute, parlane con una persona professionista. In emergenza: 112. 💜",
    lang_toggle: "EN",
    only_it_notice: "🇮🇹 Da qui in poi i contenuti dettagliati sono disponibili solo in italiano. Stiamo lavorando alla traduzione completa.",
    construction_banner: "NeuroSpazio è in costruzione: contenuti e funzionalità cambiano ancora. Se trovi un problema, <a href=\"https://github.com/itsgrc/neuro/issues\" target=\"_blank\" rel=\"noopener\">segnalalo su GitHub</a>.",
  },
  en: {
    nav_home: "Home", nav_giochi: "Games", nav_strumenti: "Tools",
    nav_risorse: "Resources", nav_progressi: "Progress", nav_impostazioni: "Settings",
    footer_disclaimer: "<strong>NeuroSpazio</strong> is an educational and wellness tool, <strong>not a medical device</strong>: it does not diagnose, treat, or prevent any condition. It does not replace medical advice. If you have concerns about your health, talk to a qualified professional. 💜",
    lang_toggle: "IT",
    only_it_notice: "🇮🇹 From here on, detailed content is only available in Italian. Full translation is in progress.",
    construction_banner: "NeuroSpazio is under construction: content and features are still changing. Found a problem? <a href=\"https://github.com/itsgrc/neuro/issues\" target=\"_blank\" rel=\"noopener\">Report it on GitHub</a>.",
  },
};

/* Traduzioni inglesi di nome/descrizione per i giochi (id da games.js) */
const GAMES_EN = {
  memoria:   { nome: "Memory Pairs", desc: "Find matching card pairs. Trains working memory." },
  stroop:    { nome: "Color Rebel", desc: "Tap the ink color, not the word! Trains impulse control." },
  riflessi:  { nome: "Cat Reflex", desc: "Tap the instant the screen turns green. Measures reaction time." },
  simon:     { nome: "Light Sequence", desc: "Repeat the growing sequence of lights and sounds." },
  numeri:    { nome: "Number Hunt", desc: "Find the numbers in order as fast as you can. Trains visual attention." },
  flusso:    { nome: "Flow (n-back)", desc: "Is this symbol the same as before? A working-memory challenge." },
  tempo:     { nome: "One Exact Minute", desc: "How long is a minute, really? Measures your sense of time." },
  rotta:     { nome: "Switch Track", desc: "The rule changes without warning: color or shape? Trains mental flexibility." },
  stima:     { nome: "Quick Glance", desc: "Which side has more dots? No counting: trains number sense." },
  corsi:     { nome: "Block Path", desc: "Repeat the lit-up path on the grid. Pure spatial memory." },
  gonogo:    { nome: "Traffic Light", desc: "Press on green, stop on red. Sounds easy… for 45 seconds." },
};

/* Traduzioni inglesi di nome/descrizione per gli strumenti (id da tools.js) */
const TOOLS_EN = {
  pomodoro:    { nome: "Focus Timer", desc: "Timed work sessions with breaks: time becomes visible." },
  attivita:    { nome: "My Tasks", desc: "Max 3 things for today. The rest can wait, guilt-free." },
  dump:        { nome: "Brain Dump", desc: "Get the swirling thoughts out. Decide what to do with them later." },
  abitudini:   { nome: "Habits", desc: "Small habits, tracked day by day. Streaks are motivating!" },
  umore:       { nome: "How I Feel Today", desc: "Log your mood in 5 seconds and discover your patterns." },
  routine:     { nome: "Guided Routines", desc: "Build step-by-step routines and run them on autopilot." },
  decisioni:   { nome: "Decide For Me", desc: "Decision paralysis? Let the wheel (or a coin) choose." },
  suoni:       { nome: "Focus Sounds", desc: "White, pink and brown noise to mask distractions." },
  respiro:     { nome: "Breathe With Me", desc: "Guided, animated breathing to calm body and mind." },
  grounding:   { nome: "Overload SOS", desc: "The 5-4-3-2-1 exercise to return to the present when it's too much." },
  sos:         { nome: "SOS Card", desc: "When words won't come out, this card speaks for you. Prepare it ahead of time." },
  bodyscan:    { nome: "Body Scan", desc: "A guided journey through the body, one area at a time. No-frills mindfulness." },
  gratitudine: { nome: "Three Good Things", desc: "Every evening, three things that went well. The most studied exercise in positive psychology." },
  coach:       { nome: "Study Coach", desc: "Understands how you really study (from your own data) and suggests what to try, with sources." },
};

/* Traduzione inglese delle schede scientifiche brevi ("perché funziona"),
   fedele nel significato alle versioni italiane in data.js. */
const SCIENZA_EN = {
  memoria: "Working memory — holding information in mind while using it — is often reduced in ADHD (Martinussen et al., 2005) and is central to learning difficulties (Gathercole & Alloway, 2008). This game trains it playfully.",
  stroop: "The Stroop task (Stroop, 1935) measures inhibitory control: the ability to override an automatic response. Inhibition is central to scientific models of ADHD (Barkley, 1997) and to tic management therapies like CBIT (Piacentini et al., 2010).",
  riflessi: "In ADHD, reaction times aren't just slower — they're more variable: brilliant moments alternating with attention 'gaps'. This variability is one of the most solid findings in the research (Kofler et al., 2013, a meta-analysis of 319 studies).",
  simon: "Repeating growing sequences engages sequential working memory and sustained attention, often fragile in ADHD and learning disabilities (Martinussen et al., 2005; Gathercole & Alloway, 2008).",
  numeri: "Schulte tables are a classic visual scanning and selective attention exercise. Sustained attention on unstimulating tasks is among the most studied areas of ADHD (Barkley, 1997; Faraone et al., 2021).",
  flusso: "The n-back (Kirchner, 1958) is the most-used working memory paradigm in research, made famous by Jaeggi et al. (2008). Science is divided though: meta-analyses show benefits transfer poorly beyond the task itself (Melby-Lervåg & Hulme, 2013; Simons et al., 2016).",
  tempo: "'Time blindness' isn't just a figure of speech: research documents measurable differences in perceiving and estimating time intervals in ADHD (Noreika et al., 2013; Toplak et al., 2006).",
  rotta: "Switching between tasks has a measurable cognitive cost, the 'switch cost' (Monsell, 2003). Cognitive flexibility is one of the three core executive functions (Miyake et al., 2000).",
  stima: "We're all born with a 'number sense': the ability to estimate quantities at a glance, without counting. Its precision correlates with math ability (Halberda et al., 2008, published in Nature) and is often weaker in dyscalculia.",
  corsi: "This game is the digital version of the Corsi block-tapping task, one of the most used spatial memory tests in neuropsychology for fifty years (Kessels et al., 2000).",
  gonogo: "The go/no-go paradigm is the lab standard for measuring response inhibition (Verbruggen & Logan, 2008), a function central to ADHD models (Barkley, 1997) and tic control.",
  pomodoro: "ADHD often involves 'time blindness': the internal clock is unreliable (Barkley, 1997). A visible timer makes time external and concrete (Pomodoro Technique: Cirillo, 2018).",
  attivita: "Limiting priorities to 3 reduces choice overload, and turning 'I have to study' into a small concrete step leverages implementation intentions, one of the most replicated effects in psychology (Gollwitzer, 1999).",
  dump: "Writing thoughts down offloads them from working memory, a precious and limited resource in ADHD (Martinussen et al., 2005). Postponing worries to a dedicated time is a validated clinical technique (Borkovec et al., 1983).",
  abitudini: "Habits form through repetition in the same context: on average 66 days, with huge individual variation — and missing a day doesn't reset anything (Lally et al., 2010).",
  umore: "Naming what you feel ('affect labeling') reduces amygdala activation, the brain's alarm center (Lieberman et al., 2007). Emotional dysregulation is an integral part of ADHD (Shaw et al., 2014).",
  routine: "Knowing what comes next reduces cognitive load and anxiety: visual structuring of activities is at the heart of validated autism approaches like TEACCH (Mesibov et al., 2005).",
  decisioni: "Too many options cause paralysis and reduce satisfaction even after choosing (Iyengar & Lepper, 2000). For low-stakes choices, delegating to chance breaks the deadlock and conserves energy.",
  suoni: "It sounds paradoxical, but moderate background noise can improve memory and attention in ADHD: the phenomenon of stochastic resonance (Söderlund et al., 2007).",
  respiro: "Slow breathing (about 6 breaths per minute) activates the parasympathetic system and lowers physiological arousal, with effects documented by systematic reviews (Zaccaro et al., 2018; Lehrer & Gevirtz, 2014).",
  grounding: "The 5-4-3-2-1 anchors attention to the five senses, interrupting spirals of anxiety, rumination, or sensory overload: a standard grounding technique in anxiety and trauma clinical work (Najavits, 2002).",
  sos: "During a shutdown or overload, the verbal channel can genuinely shut down: that's not stubbornness, it's neurology (Lord et al., 2018). Preparing a message in advance follows core Augmentative and Alternative Communication principles (Beukelman & Mirenda, 2013).",
  bodyscan: "The body scan is a core mindfulness exercise; its effectiveness on anxiety and stress is documented by meta-analyses (Khoury et al., 2013).",
  gratitudine: "'Three good things' is one of the most studied exercises in positive psychology: noting three things that went well each evening has shown measurable effects on wellbeing (Seligman et al., 2005; Emmons & McCullough, 2003).",
  coach: "Not all study techniques are equally effective: the largest review ever conducted rated retrieval practice and distributed practice as 'high utility', while common habits like rereading and highlighting were rated 'low utility' (Dunlosky et al., 2013). Retrieval practice improves long-term retention more than rereading (Roediger & Karpicke, 2006). This coach looks at YOUR local data — timing, completed session lengths, how quickly you act on tasks, game strengths — to suggest what to try first. No AI model is involved: it's a transparent rule engine, and everything stays on your device.",
};

/* Traduzione completa dei 3 test di screening: gli strumenti originali
   sono nati in inglese, quindi qui la formulazione è quella di
   riferimento (adattata, non copia letterale coperta da copyright). */
const TESTS_EN = {
  asrs: {
    nome: "Adult ADHD Screening",
    strumento: "ASRS v1.1 · Part A (World Health Organization)",
    per: "ADHD · age 18+",
    intro: "The 6 screening questions from the Adult ADHD Self-Report Scale, developed with the WHO (Kessler et al., 2005). Answer based on how you've felt and behaved over the last 6 months.",
    opzioni: ["Never", "Rarely", "Sometimes", "Often", "Very often"],
    domande: [
      "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
      "How often do you have problems remembering appointments or obligations?",
      "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    ],
  },
  aq10: {
    nome: "Autistic Traits Screening",
    strumento: "AQ-10 adult (Autism Research Centre, University of Cambridge)",
    per: "Autism · age 18+",
    intro: "The short form of the Autism Spectrum Quotient (Allison, Auyeung & Baron-Cohen, 2012), also used by the UK's NHS as a screening 'red flag'. Answer instinctively: there are no right answers.",
    opzioni: ["Definitely agree", "Slightly agree", "Slightly disagree", "Definitely disagree"],
    domande: [
      "I often notice small sounds when others do not.",
      "I usually concentrate more on the whole picture, rather than the small details.",
      "I find it easy to do more than one thing at once.",
      "If there is an interruption, I can switch back to what I was doing very quickly.",
      "I find it easy to 'read between the lines' when someone is talking to me.",
      "I know how to tell if someone listening to me is getting bored.",
      "When I'm reading a story, I find it difficult to work out the characters' intentions.",
      "I like to collect information about categories of things (e.g. types of car, bird, train, plant, etc.).",
      "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
      "I find it difficult to work out people's intentions.",
    ],
  },
  gad7: {
    nome: "Anxiety Screening",
    strumento: "GAD-7 (Spitzer, Kroenke, Williams & Löwe)",
    per: "Anxiety · age 18+",
    intro: "The most widely used questionnaire in the world for generalized anxiety screening (Spitzer et al., 2006), freely available for use. Over the LAST 2 WEEKS, how often have you been bothered by the following problems?",
    opzioni: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    domande: [
      "Feeling nervous, anxious, or on edge.",
      "Not being able to stop or control worrying.",
      "Worrying too much about different things.",
      "Trouble relaxing.",
      "Being so restless that it's hard to sit still.",
      "Becoming easily annoyed or irritable.",
      "Feeling afraid as if something awful might happen.",
    ],
  },
};

const TEST_DISCLAIMER_EN = "This is a screening tool, NOT a diagnosis. No questionnaire can tell you whether you are ADHD, autistic, or anxious: it can only suggest whether it may be worth exploring further with a qualified professional (doctor, psychologist, psychiatrist). Whatever the result, if something is weighing on you, you deserve to be heard. Your answers stay only on your device.";

const ND_INFO_EN = {
  adhd: "ADHD", autismo: "Autism", dsa: "Learning disabilities", ansia: "Anxiety & emotions", tourette: "Tourette's",
};
const ETA_INFO_EN = {
  bambini: { nome: "Kids", range: "ages 6–10" },
  ragazzi: { nome: "Teens", range: "ages 11–17" },
  adulti:  { nome: "Adults", range: "18+" },
};

/* Solo titolo + descrizione breve dei percorsi guidati: il contenuto
   giorno-per-giorno resta italiano-only (vedi only_it_notice). */
const PERCORSI_EN = {
  adhd7:     { nome: "Know Your ADHD", desc: "7 days to understand how your engine works — and stop blaming yourself for it." },
  sonno7:    { nome: "Sleep, Mission Possible", desc: "7 days to make peace with the night, no sleep-hygiene lectures." },
  emozioni7: { nome: "Emotions: From Flood to Map", desc: "7 days to know your emotional waves and build your toolkit." },
};
