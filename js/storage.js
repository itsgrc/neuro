/* ============================================================
   NeuroSpazio — storage.js
   Stato dell'app salvato in localStorage: impostazioni,
   statistiche, attività, abitudini, umore, routine, record.
   ============================================================ */

const DB = (() => {
  const BASE_KEY = "neurospazio_v1";
  const PROFILES_KEY = "neurospazio_profiles";
  const CURRENT_KEY = "neurospazio_current_profile";

  // --- profili locali (Modalità Classe): un dispositivo condiviso,
  //     più profili isolati, nessun dato che lascia il browser ---
  function keyFor(id) {
    return id && id !== "default" ? `${BASE_KEY}__${id}` : BASE_KEY;
  }
  function listProfiles() {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveProfiles(list) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
  }
  function currentProfileId() {
    return localStorage.getItem(CURRENT_KEY) || "default";
  }
  function createProfile(name, emoji) {
    const list = listProfiles();
    const profile = { id: uid(), name: name.trim().slice(0, 40), emoji: emoji || "🧒", createdAt: Date.now() };
    list.push(profile);
    saveProfiles(list);
    return profile;
  }
  function deleteProfile(id) {
    if (id === "default") return; // il profilo base non si elimina, solo si svuota da Opzioni
    saveProfiles(listProfiles().filter(p => p.id !== id));
    localStorage.removeItem(keyFor(id));
    if (currentProfileId() === id) setCurrentProfile("default");
  }
  function setCurrentProfile(id) {
    localStorage.setItem(CURRENT_KEY, id);
  }
  /** Legge le statistiche grezze di un profilo SENZA attivarlo (per il cruscotto insegnante). */
  function readProfileStatsRaw(id) {
    try {
      const raw = localStorage.getItem(keyFor(id));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.stats || null;
    } catch (e) { return null; }
  }

  const defaults = () => ({
    settings: {
      theme: "auto",          // auto | light | dark
      dyslexia: false,
      reduceMotion: false,
      fontScale: 1,
      sounds: true,
      notifications: false,   // notifiche locali di fine timer
      eta: null,              // fascia d'età: null | "bambini" | "ragazzi" | "adulti"
      lang: "it",             // lingua interfaccia: "it" | "en"
    },
    stats: {
      totalGames: 0,
      totalPomodoros: 0,
      totalTasksDone: 0,
      breathSessions: 0,
      groundingSessions: 0,
      workoutsDone: 0,
      visitStreak: 1,
      lastVisit: null,        // "YYYY-MM-DD"
      bestScores: {},         // { gameId: { label, value, better } }
      pomodoroPreset: {},     // { "25-5": { completate, saltate } } per il Coach di studio
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
    playedByDay: {},          // { "YYYY-MM-DD": [id dei giochi giocati] } per l'allenamento del giorno
    workoutDays: {},          // { "YYYY-MM-DD": true } giorni con allenamento completato
    gratitudine: {},          // { "YYYY-MM-DD": ["cosa 1", "cosa 2", "cosa 3"] }
    testEsiti: {},            // { idTest: { score, max, positivo, when } } — solo locale
    sos: {                    // carta di comunicazione per i momenti difficili
      msg: "Sto attraversando un momento difficile. Non riesco a parlare, adesso. Non è colpa tua.",
      needs: ["silenzio", "tempo"],
    },
  });

  let state;

  function load() {
    try {
      const raw = localStorage.getItem(keyFor(currentProfileId()));
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
      localStorage.setItem(keyFor(currentProfileId()), JSON.stringify(state));
    } catch (e) {
      console.warn("Impossibile salvare lo stato", e);
    }
  }

  function reset() {
    localStorage.removeItem(keyFor(currentProfileId()));
    state = defaults();
    save();
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text); // lancia se non valido
    if (typeof parsed !== "object" || parsed === null) throw new Error("Formato non valido");
    localStorage.setItem(keyFor(currentProfileId()), JSON.stringify(parsed));
    load();
  }

  /** Cambia profilo attivo e ricarica lo stato da quel profilo.
      Salva subito, così un profilo nuovo esiste davvero in localStorage
      anche prima che l'utente faccia la prima azione. */
  function switchProfile(id) {
    setCurrentProfile(id);
    load();
    save();
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
    listProfiles, createProfile, deleteProfile, currentProfileId, switchProfile, readProfileStatsRaw,
    get state() { return state; } };
})();

DB.load();
