/* ============================================================
   NeuroSpazio — storage.js
   Stato dell'app salvato in localStorage: impostazioni,
   statistiche, attività, abitudini, umore, routine, record.
   ============================================================ */

const DB = (() => {
  const KEY = "neurospazio_v1";

  const defaults = () => ({
    settings: {
      theme: "auto",          // auto | light | dark
      dyslexia: false,
      reduceMotion: false,
      fontScale: 1,
      sounds: true,
      notifications: false,   // notifiche locali di fine timer
    },
    stats: {
      totalGames: 0,
      totalPomodoros: 0,
      totalTasksDone: 0,
      breathSessions: 0,
      groundingSessions: 0,
      visitStreak: 1,
      lastVisit: null,        // "YYYY-MM-DD"
      bestScores: {},         // { gameId: { label, value, better } }
    },
    badges: [],               // id dei badge ottenuti
    tasks: [],                // { id, text, col: "oggi"|"dopo"|"fatto", done, createdAt }
    dump: [],                 // { id, text, at }
    habits: [],               // { id, name, days: { "YYYY-MM-DD": true } }
    moods: {},                // { "YYYY-MM-DD": { value: 1..5, note } }
    routines: [],             // { id, name, steps: [{ name, minutes }] }
    decisions: [],            // opzioni salvate della ruota
    pomodoro: { work: 25, pause: 5, goal: 4 },
    eventi: [],               // registro locale { t, k: "pomodoro"|"gioco"|"task" } per gli insight
    percorsi: {},             // { idPercorso: [indici dei giorni completati] }
    sos: {                    // carta di comunicazione per i momenti difficili
      msg: "Sto attraversando un momento difficile. Non riesco a parlare, adesso. Non è colpa tua.",
      needs: ["silenzio", "tempo"],
    },
  });

  let state;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // unione superficiale con i default per compatibilità futura
        state = Object.assign(defaults(), saved);
        state.settings = Object.assign(defaults().settings, saved.settings || {});
        state.stats = Object.assign(defaults().stats, saved.stats || {});
        state.pomodoro = Object.assign(defaults().pomodoro, saved.pomodoro || {});
        state.sos = Object.assign(defaults().sos, saved.sos || {});
      } else {
        state = defaults();
      }
    } catch (e) {
      console.warn("Stato corrotto, ripristino i default", e);
      state = defaults();
    }
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Impossibile salvare lo stato", e);
    }
  }

  function reset() {
    localStorage.removeItem(KEY);
    state = defaults();
    save();
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text); // lancia se non valido
    if (typeof parsed !== "object" || parsed === null) throw new Error("Formato non valido");
    localStorage.setItem(KEY, JSON.stringify(parsed));
    load();
  }

  // --- utilità data ---
  function todayKey(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const g = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${g}`;
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // --- streak di visita giornaliera ---
  function touchVisit() {
    const oggi = todayKey();
    const ieri = todayKey(-1);
    const s = state.stats;
    if (s.lastVisit === oggi) return;
    s.visitStreak = (s.lastVisit === ieri) ? (s.visitStreak || 0) + 1 : 1;
    s.lastVisit = oggi;
    save();
  }

  // --- registro eventi (solo locale, per gli insight personali) ---
  function logEvento(k) {
    state.eventi.push({ t: Date.now(), k });
    if (state.eventi.length > 600) state.eventi.splice(0, state.eventi.length - 600);
    save();
  }

  // --- record dei giochi ---
  // better: "high" (più alto è meglio) | "low" (più basso è meglio)
  function submitScore(gameId, label, value, better) {
    const best = state.stats.bestScores[gameId];
    const isRecord = !best ||
      (better === "high" ? value > best.value : value < best.value);
    if (isRecord) {
      state.stats.bestScores[gameId] = { label, value, better };
      save();
    }
    return isRecord;
  }

  return { load, save, reset, exportJSON, importJSON, todayKey, uid, touchVisit, submitScore, logEvento,
    get state() { return state; } };
})();

DB.load();
