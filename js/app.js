/* ============================================================
   NeuroSpazio — app.js
   Router, viste principali, impostazioni, badge, feedback
   (suoni, toast, coriandoli). Nessuna dipendenza esterna.
   ============================================================ */

const App = (() => {
  /* ---------- pulizia tra una vista e l'altra ---------- */
  let cleanups = [];
  function addCleanup(fn) { cleanups.push(fn); }
  function runCleanups() {
    cleanups.forEach(fn => { try { fn(); } catch (e) { /* già pulito */ } });
    cleanups = [];
  }

  /* ---------- audio ---------- */
  let ctx = null;
  function audioCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function beep(freq, dur = 0.1) {
    if (!DB.state.settings.sounds) return;
    try {
      const c = audioCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + dur + 0.05);
    } catch (e) { /* audio non disponibile */ }
  }

  /* ---------- feedback visivo ---------- */
  function toast(msg, cls = "") {
    const zone = document.getElementById("toast-zone");
    const t = document.createElement("div");
    t.className = `toast ${cls}`;
    t.textContent = msg;
    zone.appendChild(t);
    setTimeout(() => t.remove(), 3600);
  }

  function confetti(n = 80) {
    if (document.documentElement.classList.contains("reduce-motion")) return;
    const zone = document.getElementById("confetti-zone");
    const colori = ["#6c5ce7", "#00b894", "#e17055", "#f5a623", "#0984e3", "#e84393"];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("div");
      c.className = "confetto";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colori[Math.floor(Math.random() * colori.length)];
      c.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
      c.style.animationDelay = Math.random() * 0.4 + "s";
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      zone.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }

  /* ---------- badge ---------- */
  function earn(id) {
    if (DB.state.badges.includes(id)) return;
    DB.state.badges.push(id);
    DB.save();
    const b = BADGES.find(x => x.id === id);
    if (b) {
      toast(`${b.emoji} Badge sbloccato: ${b.nome}!`, "toast-badge");
      beep(880, 0.12); setTimeout(() => beep(1174, 0.18), 140);
    }
  }

  function habitStreak(h) {
    let s = 0;
    for (let i = 0; ; i++) {
      const k = DB.todayKey(-i);
      if (h.days[k]) s++;
      else if (i === 0) continue; // oggi non ancora segnato non spezza la serie
      else break;
    }
    return s;
  }

  function checkBadges() {
    const s = DB.state.stats;
    if (s.totalGames >= 1) earn("primo-gioco");
    if (s.totalGames >= 10) earn("dieci-giochi");
    if (s.totalGames >= 50) earn("cinquanta-giochi");
    if (s.totalPomodoros >= 1) earn("primo-pomodoro");
    if (s.totalPomodoros >= 10) earn("dieci-pomodori");
    if (s.totalTasksDone >= 1) earn("prima-attivita");
    if (s.totalTasksDone >= 10) earn("dieci-attivita");
    if (s.visitStreak >= 3) earn("streak-3");
    if (s.visitStreak >= 7) earn("streak-7");
    if (s.breathSessions >= 1) earn("primo-respiro");
    if (s.groundingSessions >= 1) earn("primo-grounding");
    if (Object.keys(DB.state.moods).length >= 7) earn("umore-7");
    if (DB.state.habits.some(h => habitStreak(h) >= 7)) earn("abitudine-7");
    const giorniPercorsi = Object.values(DB.state.percorsi || {});
    if (giorniPercorsi.some(g => g.length >= 1)) earn("primo-giorno-percorso");
    if (giorniPercorsi.some(g => g.length >= 7)) earn("percorso-completo");
    if (s.workoutsDone >= 1) earn("primo-allenamento");
    if (s.workoutsDone >= 7) earn("atleta-mente");
  }

  /* ---------- palestra della mente: allenamento del giorno ---------- */
  let currentGameId = null; // impostato da viewGioco, usato per il registro giornaliero

  // circuito quotidiano di 3 esercizi: ruota in modo deterministico sulla data,
  // così in ~4 giorni passi per tutti i domini cognitivi (pratica distribuita, Cepeda et al. 2006)
  function workoutOggi() {
    const giorno = Math.floor(Date.now() / 86400000);
    const n = GAMES.length;
    const start = (giorno * 3) % n;
    return [GAMES[start], GAMES[(start + 1) % n], GAMES[(start + 2) % n]];
  }

  function recordGamePlayed() {
    DB.state.stats.totalGames++;
    DB.logEvento("gioco");
    if (currentGameId) {
      const k = DB.todayKey();
      const arr = DB.state.playedByDay[k] = DB.state.playedByDay[k] || [];
      if (!arr.includes(currentGameId)) arr.push(currentGameId);
      // teniamo solo gli ultimi 30 giorni
      const chiavi = Object.keys(DB.state.playedByDay).sort();
      while (chiavi.length > 30) delete DB.state.playedByDay[chiavi.shift()];
      // circuito del giorno completato?
      if (!DB.state.workoutDays[k] && workoutOggi().every(g => arr.includes(g.id))) {
        DB.state.workoutDays[k] = true;
        DB.state.stats.workoutsDone++;
        confetti(80);
        toast("🏋️ Allenamento del giorno completato! Costanza batte intensità.");
      }
      DB.save();
    }
    checkBadges();
  }

  /* ---------- notifiche locali (facoltative, si attivano nelle Opzioni) ---------- */
  function notify(titolo, corpo) {
    if (!DB.state.settings.notifications) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (!document.hidden) return; // se stai guardando l'app, bastano toast e suoni
    try {
      new Notification(titolo, { body: corpo, icon: "icons/icon-192.png" });
    } catch (e) { /* notifiche non disponibili */ }
  }

  /* ---------- lettura ad alta voce (sintesi vocale del browser) ---------- */
  let vocePreferita = null;
  function trovaVoce() {
    if (vocePreferita || !("speechSynthesis" in window)) return vocePreferita;
    const voci = speechSynthesis.getVoices();
    vocePreferita = voci.find(v => v.lang.startsWith("it")) || null;
    return vocePreferita;
  }
  if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", trovaVoce);

  function speak(testo, btn) {
    if (!("speechSynthesis" in window)) { toast("Il tuo browser non supporta la lettura ad alta voce 😕"); return; }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      document.querySelectorAll(".tts-btn.leggendo").forEach(b => {
        b.classList.remove("leggendo"); b.textContent = "🔊 Ascolta";
      });
      if (btn?.dataset.eraAttivo === "1") { delete btn.dataset.eraAttivo; return; }
    }
    const u = new SpeechSynthesisUtterance(testo);
    u.lang = "it-IT";
    const voce = trovaVoce();
    if (voce) u.voice = voce;
    u.rate = 0.95;
    if (btn) {
      btn.classList.add("leggendo");
      btn.textContent = "⏹️ Ferma";
      btn.dataset.eraAttivo = "1";
      u.onend = u.onerror = () => {
        btn.classList.remove("leggendo");
        btn.textContent = "🔊 Ascolta";
        delete btn.dataset.eraAttivo;
      };
    }
    speechSynthesis.speak(u);
  }

  /* ---------- impostazioni ---------- */
  const mediaScuro = window.matchMedia("(prefers-color-scheme: dark)");

  function applySettings() {
    const st = DB.state.settings;
    const html = document.documentElement;
    const scuro = st.theme === "dark" || (st.theme === "auto" && mediaScuro.matches);
    html.dataset.theme = scuro ? "dark" : "light";
    html.classList.toggle("dyslexia", st.dyslexia);
    html.classList.toggle("reduce-motion", st.reduceMotion);
    html.style.setProperty("--font-scale", st.fontScale);
    applyI18n();
  }
  mediaScuro.addEventListener("change", applySettings);

  /* ---------- lingua (it/en) ---------- */
  function lang() { return DB.state.settings.lang === "en" ? "en" : "it"; }
  function t(key) { return (I18N[lang()] && I18N[lang()][key]) || I18N.it[key] || key; }

  function applyI18n() {
    const l = lang();
    document.documentElement.lang = l; // essenziale per i lettori di schermo
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    const toggle = document.getElementById("lang-toggle");
    if (toggle) toggle.setAttribute("aria-label", l === "it" ? "Cambia lingua: passa a Inglese" : "Change language: switch to Italian");
  }

  function nomeLocalizzato(item, mappa) {
    return lang() === "en" && mappa[item.id] ? mappa[item.id].nome : item.nome;
  }
  function descLocalizzato(item, mappa) {
    return lang() === "en" && mappa[item.id] ? mappa[item.id].desc : item.desc;
  }
  function onlyItNoticeHTML() {
    return lang() === "en" ? `<div class="only-it-notice">${t("only_it_notice")}</div>` : "";
  }

  /* ---------- viste ---------- */
  const main = document.getElementById("main");

  /* filtri per neurodivergenza e per età nelle pagine Giochi e Strumenti */
  const filtroND = { giochi: "tutte", strumenti: "tutte" };
  const filtroEta = {
    giochi: DB.state.settings.eta || "tutte",
    strumenti: DB.state.settings.eta || "tutte",
  };

  function ndChipsHTML(id) {
    const sch = typeof SCHEDE_SCIENZA !== "undefined" && SCHEDE_SCIENZA[id];
    if (!sch) return "";
    const etaLabel = lang() === "en" ? `${ETA_MIN[id]}+ years` : `${ETA_MIN[id]}+ anni`;
    const eta = ETA_MIN[id] ? `<span class="nd-chip eta-chip">👤 ${etaLabel}</span>` : "";
    return `<div class="nd-chips">${eta}${sch.nd.map(k => {
      const n = ND_INFO[k];
      const nome = lang() === "en" ? ND_INFO_EN[k] : n.nome;
      return `<span class="nd-chip ${n.classe}">${n.emoji} ${nome}</span>`;
    }).join("")}</div>`;
  }

  function scienceBoxHTML(id) {
    const sch = typeof SCHEDE_SCIENZA !== "undefined" && SCHEDE_SCIENZA[id];
    if (!sch) return "";
    const fonti = sch.fonti.map(fid => FONTI.find(f => f.id === fid)).filter(Boolean);
    const perche = lang() === "en" && SCIENZA_EN[id] ? SCIENZA_EN[id] : sch.perche;
    const summaryLabel = lang() === "en" ? "🔬 Who it's for and why it works" : "🔬 Per chi è pensato e perché funziona";
    const bibLabel = lang() === "en" ? "📚 Full bibliography →" : "📚 Tutta la bibliografia →";
    return `
      <div class="science-box">
        ${ndChipsHTML(id)}
        <details>
          <summary>${summaryLabel}</summary>
          <p class="science-body">${perche}</p>
          <ul class="fonti-mini">${fonti.map(f => `<li>${f.testo}</li>`).join("")}</ul>
          <a href="#/risorse" style="font-size:.85rem; font-weight:700">${bibLabel}</a>
        </details>
      </div>`;
  }

  function filterRowHTML(attivo) {
    const opzioni = [["tutte", lang() === "en" ? "✨ For everyone" : "✨ Per tutti"],
      ...Object.entries(ND_INFO).map(([k, n]) => [k, `${n.emoji} ${lang() === "en" ? ND_INFO_EN[k] : n.nome}`])];
    return `
      <div class="nd-filter-row" role="group" aria-label="${lang() === "en" ? "Filter by neurodivergence" : "Filtra per neurodivergenza"}">
        ${opzioni.map(([k, label]) =>
          `<button class="nd-filter ${attivo === k ? "active" : ""}" data-filter="${k}" aria-pressed="${attivo === k}">${label}</button>`).join("")}
      </div>`;
  }

  function filtra(items, f) {
    if (f === "tutte") return items;
    return items.filter(x => (SCHEDE_SCIENZA[x.id]?.nd || []).includes(f));
  }

  function etaFilterRowHTML(attivo) {
    const en = lang() === "en";
    const opzioni = [["tutte", en ? "👥 All ages" : "👥 Tutte le età"],
      ...Object.entries(ETA_INFO).map(([k, e]) => [k, en
        ? `${e.emoji} ${ETA_INFO_EN[k].nome} ${ETA_INFO_EN[k].range}`
        : `${e.emoji} ${e.nome} ${e.range}`])];
    return `
      <div class="nd-filter-row" role="group" aria-label="${en ? "Filter by age" : "Filtra per età"}">
        ${opzioni.map(([k, label]) =>
          `<button class="nd-filter ${attivo === k ? "active" : ""}" data-filter-eta="${k}" aria-pressed="${attivo === k}">${label}</button>`).join("")}
      </div>`;
  }

  function filtraEta(items, fascia) {
    if (fascia === "tutte" || !ETA_INFO[fascia]) return items;
    return items.filter(x => (ETA_MIN[x.id] || 0) <= ETA_INFO[fascia].maxMin);
  }

  function tileHTML(item, tipo) {
    const mappa = tipo === "gioco" ? GAMES_EN : TOOLS_EN;
    return `
      <a class="tile" href="#/${tipo}/${item.id}">
        <span class="tile-emoji" aria-hidden="true">${item.emoji}</span>
        <h3>${nomeLocalizzato(item, mappa)}</h3>
        <p>${descLocalizzato(item, mappa)}</p>
        <span class="tile-tag tag-${item.tag}">${item.tag}</span>
        ${ndChipsHTML(item.id)}
      </a>`;
  }

  function viewHome() {
    const en = lang() === "en";
    const ora = new Date().getHours();
    const saluto = en
      ? (ora < 6 ? "Up late, huh?" : ora < 13 ? "Good morning" : ora < 18 ? "Good afternoon" : "Good evening")
      : (ora < 6 ? "Notte fonda, eh?" : ora < 13 ? "Buongiorno" : ora < 18 ? "Buon pomeriggio" : "Buonasera");
    const s = DB.state.stats;
    const oggiTasks = DB.state.tasks.filter(t => t.col === "oggi").length;
    const tip = CONSIGLI_DEL_GIORNO[Math.floor((Date.now() / 86400000)) % CONSIGLI_DEL_GIORNO.length];

    main.innerHTML = `
      <div class="view">
        <section class="hero">
          <h1>${saluto}! 👋</h1>
          <p>${en
            ? "Your mind gym and safe space: science-based exercises, tools for rough days and good ones. Built for neurodivergent minds, useful to anyone with a brain. No judgment, your own pace."
            : "La tua palestra della mente e il tuo spazio sicuro: esercizi con basi scientifiche, strumenti per le giornate storte e quelle buone. Pensato per menti neurodivergenti, utile a chiunque abbia un cervello. Senza giudizi, al tuo ritmo."}</p>
          <div class="streak-pill">🔥 ${s.visitStreak} ${en ? (s.visitStreak === 1 ? "day" : "days") + " in a row here" : (s.visitStreak === 1 ? "giorno" : "giorni") + " di fila qui"}</div>
          <div class="btn-row" style="margin-top:1rem">
            <a class="btn hero-btn-solid" href="#/inizia">🧭 ${en ? "Start here" : "Inizia da qui"}</a>
            <a class="btn btn-ghost" style="border-color:rgba(255,255,255,.6); color:#fff" href="#/test">📋 ${en ? "Screening tests" : "Test di screening"}</a>
          </div>
        </section>

        <div class="tip-card" style="margin-bottom:1.4rem">
          <span class="tip-emoji" aria-hidden="true">💡</span>
          <div><strong>${en ? "Tip of the day" : "Consiglio del giorno"}</strong><br>${en ? "Daily tips are only available in Italian for now. 🇮🇹" : tip}</div>
        </div>

        <h2 style="font-size:1.15rem; margin-bottom:.6rem">${en ? "What do you need right now?" : "Di cosa hai bisogno adesso?"}</h2>
        <div class="quick-row">
          <a class="quick-btn" href="#/strumento/pomodoro"><span class="q-emoji">🍅</span>${en ? "I need to focus" : "Devo concentrarmi"}</a>
          <a class="quick-btn" href="#/strumento/grounding"><span class="q-emoji">🆘</span>${en ? "It's all too much" : "È tutto troppo"}</a>
          <a class="quick-btn" href="#/strumento/attivita"><span class="q-emoji">✅</span>${en ? "Get organized" : "Organizzarmi"}</a>
          <a class="quick-btn" href="#/strumento/dump"><span class="q-emoji">🧺</span>${en ? "Full head" : "Testa piena"}</a>
          <a class="quick-btn" href="#/strumento/respiro"><span class="q-emoji">🫁</span>${en ? "Calm down" : "Calmarmi"}</a>
          <a class="quick-btn" href="#/giochi"><span class="q-emoji">🎮</span>${en ? "Play a bit" : "Giocare un po'"}</a>
          <a class="quick-btn" href="#/percorsi"><span class="q-emoji">🎓</span>${en ? "One step a day" : "Un passo al giorno"}</a>
          <a class="quick-btn" href="#/strumento/sos"><span class="q-emoji">🆘</span>${en ? "SOS Card" : "Carta SOS"}</a>
        </div>

        <div class="today-summary">
          <div class="stat-box"><div class="stat-num">${oggiTasks}</div><div class="stat-label">${en ? "tasks for today" : "attività per oggi"}</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalPomodoros}</div><div class="stat-label">${en ? "focus sessions" : "sessioni di focus"}</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalGames}</div><div class="stat-label">${en ? "games played" : "partite giocate"}</div></div>
          <div class="stat-box"><div class="stat-num">${DB.state.badges.length}/${BADGES.length}</div><div class="stat-label">${en ? "badges unlocked" : "badge sbloccati"}</div></div>
        </div>

        <div class="home-section-title"><h2>🎓 ${en ? "Guided paths" : "Percorsi guidati"}</h2><a href="#/percorsi">${en ? "All paths →" : "Tutti i percorsi →"}</a></div>
        <div class="grid grid-3">
          ${PERCORSI.map(p => {
            const fatti = (DB.state.percorsi[p.id] || []).length;
            const pp = en && PERCORSI_EN[p.id] ? PERCORSI_EN[p.id] : p;
            return `<a class="tile" href="#/percorso/${p.id}">
              <span class="tile-emoji" aria-hidden="true">${p.emoji}</span>
              <h3>${pp.nome}</h3>
              <p>${pp.desc}</p>
              <div class="percorso-progress"><div style="width:${(fatti / 7) * 100}%"></div></div>
              <span class="tile-tag">${fatti}/7 ${en ? "days" : "giorni"}</span>
            </a>`;
          }).join("")}
        </div>

        <div class="home-section-title"><h2>🏋️ ${en ? "Workout of the day" : "Allenamento del giorno"}</h2><a href="#/giochi">${en ? "Whole gym →" : "Tutta la palestra →"}</a></div>
        <div class="grid grid-3">${workoutOggi().map(g => tileHTML(g, "gioco")).join("")}</div>

        <div class="home-section-title"><h2>🧰 ${en ? "Tools of the day" : "Strumenti del giorno"}</h2><a href="#/strumenti">${en ? "All tools →" : "Tutti gli strumenti →"}</a></div>
        <div class="grid grid-3">${[TOOLS[0], TOOLS[4], TOOLS[8]].map(t => tileHTML(t, "strumento")).join("")}</div>
      </div>`;
  }

  function workoutCardHTML() {
    const en = lang() === "en";
    const k = DB.todayKey();
    const giocatiOggi = DB.state.playedByDay[k] || [];
    const piano = workoutOggi();
    const fattiOggi = piano.filter(g => giocatiOggi.includes(g.id)).length;
    const completato = DB.state.workoutDays[k];
    const giorniLabel = en ? ["S", "M", "T", "W", "T", "F", "S"] : ["D", "L", "M", "M", "G", "V", "S"];
    return `
      <div class="card workout-card">
        <div class="workout-head">
          <h2>🏋️ ${en ? "Workout of the day" : "Allenamento del giorno"}</h2>
          <span class="workout-count ${completato ? "completo" : ""}">${completato ? `✅ ${en ? "Completed!" : "Completato!"}` : `${fattiOggi}/3 ${en ? "exercises" : "esercizi"}`}</span>
        </div>
        <p class="workout-note">${en
          ? "Today's circuit touches 3 different cognitive domains and rotates daily: 10 minutes a day beats 2 hours on Sunday (distributed practice: Cepeda et al., 2006)."
          : "Il circuito di oggi tocca 3 domini cognitivi diversi e ruota ogni giorno: 10 minuti al giorno battono 2 ore la domenica (pratica distribuita: Cepeda et al., 2006)."}</p>
        <div class="workout-games">
          ${piano.map(g => `
            <a class="workout-game ${giocatiOggi.includes(g.id) ? "fatto" : ""}" href="#/gioco/${g.id}">
              <span class="wg-emoji">${g.emoji}</span>
              <span class="wg-nome">${nomeLocalizzato(g, GAMES_EN)}</span>
              <span class="wg-stato">${giocatiOggi.includes(g.id) ? "✅" : "▶️"}</span>
            </a>`).join("")}
        </div>
        <div class="workout-week" role="group" aria-label="${en ? "Workouts in the last 7 days" : "Allenamenti degli ultimi 7 giorni"}">
          ${Array.from({ length: 7 }, (_, i) => {
            const key = DB.todayKey(-(6 - i));
            const d = new Date(); d.setDate(d.getDate() - (6 - i));
            return `<div class="ww-day ${DB.state.workoutDays[key] ? "hit" : ""} ${i === 6 ? "today" : ""}">
              <span>${giorniLabel[d.getDay()]}</span>
            </div>`;
          }).join("")}
          <span class="ww-tot">🏅 ${DB.state.stats.workoutsDone} ${en ? "total" : "totali"}</span>
        </div>
      </div>`;
  }

  function viewGiochi() {
    const f = filtroND.giochi;
    const fe = filtroEta.giochi;
    const items = filtraEta(filtra(GAMES, f), fe);
    const en = lang() === "en";
    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🎮 ${en ? "The mind gym" : "La palestra della mente"}</h1>
          <p>${en
            ? "11 short exercises across 6 cognitive domains, each with several levels and a recommended age (from 6 years up). For neurodivergent minds and for anyone who wants to train — with scientific sources on every card."
            : "11 esercizi brevi su 6 domini cognitivi, ognuno con più livelli e l'età consigliata (dai 6 anni in su). Per menti neurodivergenti e per chiunque voglia allenarsi — con le fonti scientifiche in ogni scheda."}</p>
        </div>
        ${workoutCardHTML()}
        ${filterRowHTML(f)}
        ${etaFilterRowHTML(fe)}
        <div class="grid grid-3">${items.map(g => tileHTML(g, "gioco")).join("")}</div>
        ${items.length === 0 ? `<p class="task-empty">${en ? "No games match these filters (for now!)." : "Nessun gioco con questi filtri (per ora!)."}</p>` : ""}
      </div>`;
    main.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => {
      filtroND.giochi = b.dataset.filter;
      viewGiochi();
    }));
    main.querySelectorAll("[data-filter-eta]").forEach(b => b.addEventListener("click", () => {
      filtroEta.giochi = b.dataset.filterEta;
      viewGiochi();
    }));
  }

  function viewGioco(id) {
    const g = GAMES.find(x => x.id === id);
    if (!g) return navigate("/giochi");
    currentGameId = g.id;
    const nome = nomeLocalizzato(g, GAMES_EN);
    document.title = `${nome} — NeuroSpazio`;
    const backLabel = lang() === "en" ? "← All games" : "← Tutti i giochi";
    main.innerHTML = `
      <div class="view game-shell">
        <a class="back-link" href="#/giochi">${backLabel}</a>
        <div class="page-head"><h1>${g.emoji} ${nome}</h1></div>
        ${scienceBoxHTML(g.id)}
        ${onlyItNoticeHTML()}
        <div data-game></div>
      </div>`;
    g.render(main.querySelector("[data-game]"));
  }

  function viewStrumenti() {
    const f = filtroND.strumenti;
    const fe = filtroEta.strumenti;
    const items = filtraEta(filtra(TOOLS, f), fe);
    const en = lang() === "en";
    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🧰 ${en ? "Tools" : "Strumenti"}</h1>
          <p>${en
            ? "13 concrete aids for everyday challenges: focusing, organizing, calming down, knowing yourself. Filter by neurodivergence or age, and discover why each tool works, sources included."
            : "13 aiuti concreti per le sfide di ogni giorno: concentrarsi, organizzarsi, calmarsi, conoscersi. Filtra per neurodivergenza o per età, e in ogni strumento scopri perché funziona, con le fonti."}</p>
        </div>
        ${filterRowHTML(f)}
        ${etaFilterRowHTML(fe)}
        <div class="grid grid-3">${items.map(t => tileHTML(t, "strumento")).join("")}</div>
        ${items.length === 0 ? `<p class="task-empty">${en ? "No tools match these filters (for now!)." : "Nessuno strumento con questi filtri (per ora!)."}</p>` : ""}
      </div>`;
    main.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => {
      filtroND.strumenti = b.dataset.filter;
      viewStrumenti();
    }));
    main.querySelectorAll("[data-filter-eta]").forEach(b => b.addEventListener("click", () => {
      filtroEta.strumenti = b.dataset.filterEta;
      viewStrumenti();
    }));
  }

  function viewStrumento(id) {
    const t = TOOLS.find(x => x.id === id);
    if (!t) return navigate("/strumenti");
    const nome = nomeLocalizzato(t, TOOLS_EN);
    document.title = `${nome} — NeuroSpazio`;
    const backLabel = lang() === "en" ? "← All tools" : "← Tutti gli strumenti";
    main.innerHTML = `
      <div class="view game-shell" style="max-width:820px">
        <a class="back-link" href="#/strumenti">${backLabel}</a>
        <div class="page-head"><h1>${t.emoji} ${nome}</h1></div>
        ${scienceBoxHTML(t.id)}
        ${onlyItNoticeHTML()}
        <div data-tool></div>
      </div>`;
    t.render(main.querySelector("[data-tool]"));
  }

  function viewRisorse() {
    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>📚 Risorse</h1>
          <p>Capire come funziona il proprio cervello è il primo superpotere. Qui trovi spiegazioni semplici e strategie concrete, scritte con rispetto.</p>
        </div>
        ${onlyItNoticeHTML()}

        <div class="help-banner">
          <h2>🤝 ${AIUTO_ITALIA.titolo}</h2>
          <p style="margin-bottom:.6rem">${AIUTO_ITALIA.intro}</p>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:.4rem">
            ${AIUTO_ITALIA.voci.map(v => `<li>${v.emoji} ${v.testo}</li>`).join("")}
          </ul>
        </div>

        <h2 style="margin-bottom:.8rem">Le neurodivergenze, spiegate bene</h2>
        <div class="grid grid-2" style="margin-bottom:1.8rem">
          ${CONDIZIONI.map(c => `
            <article class="card res-card">
              <h3><span aria-hidden="true">${c.emoji}</span> ${c.nome}
                <button class="tts-btn btn-ghost" data-tts-cond="${c.id}" style="margin-left:auto">🔊 Ascolta</button>
              </h3>
              <p style="color:var(--text-soft); font-size:.85rem; margin-bottom:.5rem"><em>${c.sottotitolo}</em></p>
              <p class="res-body">${c.descrizione}</p>
              <details class="res-details">
                <summary>Cose importanti da sapere</summary>
                <ul>${c.punti.map(p => `<li>${p}</li>`).join("")}</ul>
              </details>
              <details class="res-details">
                <summary>Strategie che aiutano</summary>
                <ul>${c.strategie.map(p => `<li>${p}</li>`).join("")}</ul>
              </details>
              ${(FONTI_CONDIZIONI[c.id] || []).length ? `
              <details class="res-details">
                <summary>📚 Fonti scientifiche</summary>
                <ul class="res-fonti">${FONTI_CONDIZIONI[c.id]
                  .map(fid => FONTI.find(f => f.id === fid))
                  .filter(Boolean)
                  .map(f => `<li>${f.testo}</li>`).join("")}</ul>
              </details>` : ""}
            </article>`).join("")}
        </div>

        <h2 style="margin-bottom:.8rem">Guide pratiche per la vita vera</h2>
        <div class="grid grid-2" style="margin-bottom:1.8rem">
          ${GUIDE_PRATICHE.map(g => `
            <article class="card res-card" style="border-top-color:var(--accent)">
              <h3><span aria-hidden="true">${g.emoji}</span> ${g.titolo}</h3>
              <ul style="padding-left:1.2rem; color:var(--text-soft); font-size:.95rem; margin-top:.4rem">
                ${g.consigli.map(c => `<li style="margin-bottom:.35rem">${c}</li>`).join("")}
              </ul>
            </article>`).join("")}
        </div>

        <h2 style="margin-bottom:.8rem">🔬 La scienza dietro NeuroSpazio</h2>
        <div class="honesty-box">
          <h3>🤝 ${NOTA_SCIENZA.titolo}</h3>
          <p>${NOTA_SCIENZA.testo}</p>
        </div>
        <div class="card">
          <h3 style="margin-bottom:.6rem">📚 Bibliografia completa</h3>
          <p style="color:var(--text-soft); font-size:.9rem; margin-bottom:.8rem">
            Tutte le fonti citate nelle schede dei giochi, degli strumenti e delle neurodivergenze. Puoi cercarle per autore e anno su Google Scholar o PubMed per leggerle direttamente.
          </p>
          <ol class="biblio">
            ${FONTI.map(f => `<li>${f.testo}</li>`).join("")}
          </ol>
        </div>
      </div>`;

    // lettura ad alta voce delle schede (per chi legge con fatica: Wood et al., 2018)
    main.querySelectorAll("[data-tts-cond]").forEach(b => b.addEventListener("click", () => {
      const c = CONDIZIONI.find(x => x.id === b.dataset.ttsCond);
      if (c) speak(`${c.nome}. ${c.descrizione} Cose importanti da sapere: ${c.punti.join(". ")}. Strategie che aiutano: ${c.strategie.join(". ")}`, b);
    }));
  }

  function viewProgressi() {
    const s = DB.state.stats;
    const scores = Object.entries(s.bestScores);
    const FACCE = ["", "😖", "😕", "😐", "🙂", "😄"];

    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🏆 I tuoi progressi</h1>
          <p>Ogni piccolo passo è registrato qui. Guarda quanta strada hai fatto — anche nei giorni in cui non sembrava.</p>
          ${onlyItNoticeHTML()}
          <div class="btn-row" style="margin-top:.6rem">
            <a class="btn btn-soft" href="#/report">🖨️ Report per il professionista</a>
            <button class="btn btn-soft" data-condividi>📤 Condividi i tuoi progressi</button>
          </div>
        </div>

        <div class="card" style="margin-bottom:1.6rem">
          <h2 style="font-size:1.15rem; margin-bottom:.6rem">💡 I tuoi insight personali</h2>
          <p style="color:var(--text-soft); font-size:.88rem; margin-bottom:.8rem">
            Calcolati solo qui, sul tuo dispositivo, dai dati che registri usando l'app. L'auto-osservazione strutturata è una pratica con basi solide (Korotitsch & Nelson-Gray, 1999).
          </p>
          <ul class="insight-list">
            ${calcolaInsights().map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>

        <div class="today-summary" style="margin-bottom:1.6rem">
          <div class="stat-box"><div class="stat-num">🔥 ${s.visitStreak}</div><div class="stat-label">giorni di fila</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalGames}</div><div class="stat-label">partite giocate</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalPomodoros}</div><div class="stat-label">sessioni di focus</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalTasksDone}</div><div class="stat-label">attività completate</div></div>
          <div class="stat-box"><div class="stat-num">${s.breathSessions + s.groundingSessions}</div><div class="stat-label">momenti di calma</div></div>
          <div class="stat-box"><div class="stat-num">🏋️ ${s.workoutsDone}</div><div class="stat-label">allenamenti completi</div></div>
        </div>

        <div class="card" style="margin-bottom:1.6rem">
          <h2 style="font-size:1.15rem; margin-bottom:.6rem">🎖️ Badge</h2>
          <div class="badge-grid">
            ${BADGES.map(b => `
              <div class="badge ${DB.state.badges.includes(b.id) ? "earned" : ""}">
                <div class="badge-emoji">${b.emoji}</div>
                <div class="badge-name">${b.nome}</div>
                <div class="badge-desc">${b.desc}</div>
              </div>`).join("")}
          </div>
        </div>

        <div class="card" style="margin-bottom:1.6rem">
          <h2 style="font-size:1.15rem; margin-bottom:.6rem">🥇 Record nei giochi</h2>
          ${scores.length === 0
            ? `<p class="task-empty">Gioca la tua prima partita e i record appariranno qui! <a href="#/giochi">Vai ai giochi →</a></p>`
            : `<table class="score-table">
                <thead><tr><th>Gioco</th><th>Record</th></tr></thead>
                <tbody>
                  ${scores.map(([id, sc]) => `
                    <tr><td>${sc.label}</td>
                    <td class="score-val">${sc.value}${id.startsWith("numeri") ? "s" : id === "riflessi" ? " ms" : id.startsWith("memoria") ? " mosse" : " punti"}</td></tr>`).join("")}
                </tbody>
              </table>`}
        </div>

        <div class="card">
          <h2 style="font-size:1.15rem">🌤️ Umore degli ultimi 7 giorni</h2>
          <div class="mood-chart">
            ${Array.from({ length: 7 }, (_, i) => {
              const off = -(6 - i);
              const k = DB.todayKey(off);
              const m = DB.state.moods[k];
              const d = new Date(); d.setDate(d.getDate() + off);
              const h = m ? m.value * 20 : 0;
              return `<div class="mood-bar">
                <span style="font-size:.9rem">${m ? FACCE[m.value] : ""}</span>
                <div style="height:${h}%; ${m ? "" : "background:var(--border)"}"></div>
                <small>${d.getDate()}/${d.getMonth() + 1}</small>
              </div>`;
            }).join("")}
          </div>
          <p style="color:var(--text-soft); font-size:.85rem; margin-top:.6rem">Registra come stai in <a href="#/strumento/umore">Come sto oggi</a>.</p>
        </div>
      </div>`;

    main.querySelector("[data-condividi]").addEventListener("click", condividiTraguardi);
  }

  /** Disegna una card 1080×1080 con i TUOI dati reali (streak, badge, allenamenti) —
      niente numeri finti, niente "utenti online": solo ciò che hai fatto davvero. */
  async function condividiTraguardi() {
    const s = DB.state.stats;
    const size = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#4834e1");
    grad.addColorStop(1, "#a6145b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";

    ctx.font = "160px system-ui, sans-serif";
    ctx.fillText("🧠", size / 2, 260);

    ctx.font = "900 64px system-ui, sans-serif";
    ctx.fillText("NeuroSpazio", size / 2, 360);

    ctx.font = "600 32px system-ui, sans-serif";
    ctx.globalAlpha = 0.85;
    ctx.fillText(lang() === "en" ? "My progress" : "I miei progressi", size / 2, 420);
    ctx.globalAlpha = 1;

    const stats = [
      [`🔥 ${s.visitStreak}`, lang() === "en" ? "day streak" : (s.visitStreak === 1 ? "giorno di fila" : "giorni di fila")],
      [`🏅 ${DB.state.badges.length}/${BADGES.length}`, lang() === "en" ? "badges" : "badge"],
      [`🏋️ ${s.workoutsDone}`, lang() === "en" ? "workouts" : "allenamenti"],
    ];
    const colW = size / 3;
    stats.forEach(([num, label], i) => {
      const cx = colW * i + colW / 2;
      ctx.font = "900 76px system-ui, sans-serif";
      ctx.fillText(num, cx, 620);
      ctx.font = "500 28px system-ui, sans-serif";
      ctx.globalAlpha = 0.85;
      ctx.fillText(label, cx, 665);
      ctx.globalAlpha = 1;
    });

    ctx.font = "600 30px system-ui, sans-serif";
    ctx.globalAlpha = 0.9;
    ctx.fillText(
      lang() === "en" ? "The mind gym for ADHD, autism, and more" : "La palestra della mente per ADHD, autismo e non solo",
      size / 2, 900
    );
    ctx.globalAlpha = 1;
    ctx.font = "500 26px system-ui, sans-serif";
    ctx.globalAlpha = 0.7;
    ctx.fillText("neurospazio", size / 2, 950);
    ctx.globalAlpha = 1;

    const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
    const file = new File([blob], "neurospazio-progressi.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "NeuroSpazio",
          text: lang() === "en" ? "My progress on NeuroSpazio" : "I miei progressi su NeuroSpazio",
        });
        return;
      } catch (e) { /* utente ha annullato la condivisione, va bene */ }
    }
    // ripiego: scarica l'immagine
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "neurospazio-progressi.png";
    a.click();
    URL.revokeObjectURL(url);
    toast(lang() === "en" ? "Image downloaded 📤" : "Immagine scaricata 📤");
  }

  /* ---------- percorsi guidati ---------- */
  function viewPercorsi() {
    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🎓 Percorsi guidati</h1>
          <p>Sette giorni, un passo al giorno: una micro-lezione basata sulla ricerca (fonte inclusa) e un'azione concreta da fare subito. Niente maratone: la dose è pensata per cervelli veri.</p>
        </div>
        ${onlyItNoticeHTML()}
        <div class="grid grid-2">
          ${PERCORSI.map(p => {
            const fatti = (DB.state.percorsi[p.id] || []).length;
            return `
            <a class="tile" href="#/percorso/${p.id}">
              <span class="tile-emoji" aria-hidden="true">${p.emoji}</span>
              <h3>${p.nome}</h3>
              <p>${p.desc}</p>
              <div class="percorso-progress"><div style="width:${(fatti / 7) * 100}%"></div></div>
              <span class="tile-tag">${fatti === 7 ? "🏔️ Completato!" : `${fatti}/7 giorni`}</span>
            </a>`;
          }).join("")}
        </div>
      </div>`;
  }

  function viewPercorso(id) {
    const p = PERCORSI.find(x => x.id === id);
    if (!p) return navigate("/percorsi");
    if (!DB.state.percorsi[p.id]) DB.state.percorsi[p.id] = [];
    const fatti = DB.state.percorsi[p.id];
    const prossimo = p.giorni.findIndex((_, i) => !fatti.includes(i));

    main.innerHTML = `
      <div class="view game-shell" style="max-width:760px">
        <a class="back-link" href="#/percorsi">← Tutti i percorsi</a>
        <div class="page-head">
          <h1>${p.emoji} ${p.nome}</h1>
          <p>${p.desc}</p>
        </div>
        ${onlyItNoticeHTML()}
        <div class="percorso-progress" style="margin-bottom:1.2rem"><div style="width:${(fatti.length / 7) * 100}%"></div></div>
        ${p.giorni.map((g, i) => {
          const done = fatti.includes(i);
          const isNext = i === prossimo;
          const fonte = FONTI.find(f => f.id === g.fonte);
          return `
          <details class="card giorno-card ${done ? "fatto" : ""} ${isNext ? "prossimo" : ""}" ${isNext ? "open" : ""}>
            <summary>
              <span class="giorno-num">${done ? "✅" : `Giorno ${i + 1}`}</span>
              <span class="giorno-titolo">${g.t}</span>
              ${isNext && !done ? `<span class="giorno-oggi">← oggi</span>` : ""}
            </summary>
            <div class="giorno-body">
              <p>${g.testo}</p>
              <div class="btn-row" style="margin:.8rem 0">
                <a class="btn btn-soft" href="${g.azione.href}">👉 ${g.azione.label}</a>
                <button class="btn tts-btn btn-ghost" data-tts="${i}">🔊 Ascolta</button>
              </div>
              ${fonte ? `<p class="giorno-fonte">📚 Fonte: ${fonte.testo}</p>` : ""}
              <button class="btn ${done ? "btn-ghost" : "btn-accent"}" data-fatto="${i}">
                ${done ? "↩️ Segna come da fare" : "✔️ Ho fatto il passo di oggi"}
              </button>
            </div>
          </details>`;
        }).join("")}
      </div>`;

    main.querySelectorAll("[data-fatto]").forEach(b => b.addEventListener("click", () => {
      const i = Number(b.dataset.fatto);
      const arr = DB.state.percorsi[p.id];
      const pos = arr.indexOf(i);
      if (pos >= 0) arr.splice(pos, 1);
      else {
        arr.push(i);
        confetti(arr.length >= 7 ? 120 : 30);
        toast(arr.length >= 7 ? "🏔️ PERCORSO COMPLETATO! Sei stato costante per 7 giorni." : `Giorno ${i + 1} fatto! A domani per il prossimo 🌱`);
      }
      DB.save();
      checkBadges();
      viewPercorso(id);
    }));

    main.querySelectorAll("[data-tts]").forEach(b => b.addEventListener("click", () => {
      const g = p.giorni[Number(b.dataset.tts)];
      speak(`${g.t}. ${g.testo}`, b);
    }));
  }

  /* ---------- insight personali (calcolati solo sul tuo dispositivo) ---------- */
  function calcolaInsights() {
    const out = [];
    const eventi = DB.state.eventi || [];
    const focus = eventi.filter(e => e.k === "pomodoro" || e.k === "gioco");

    if (focus.length >= 8) {
      const fasce = { "mattina (6–12)": 0, "pomeriggio (12–18)": 0, "sera (18–24)": 0, "notte (0–6)": 0 };
      focus.forEach(e => {
        const h = new Date(e.t).getHours();
        if (h >= 6 && h < 12) fasce["mattina (6–12)"]++;
        else if (h >= 12 && h < 18) fasce["pomeriggio (12–18)"]++;
        else if (h >= 18) fasce["sera (18–24)"]++;
        else fasce["notte (0–6)"]++;
      });
      const top = Object.entries(fasce).sort((a, b) => b[1] - a[1])[0];
      const perc = Math.round((top[1] / focus.length) * 100);
      out.push(`🕐 Il <strong>${perc}%</strong> delle tue sessioni di focus e partite avviene di <strong>${top[0]}</strong>: quella sembra la tua fascia d'oro. Prova a metterci le cose importanti.`);
    } else {
      out.push(`🕐 Ancora pochi dati sulle tue fasce orarie (${focus.length} eventi registrati): continua a usare timer e giochi per una settimana e qui appariranno i tuoi momenti d'oro.`);
    }

    const moodKeys = Object.keys(DB.state.moods);
    if (moodKeys.length >= 6) {
      const ultimi7 = [], prec7 = [];
      for (let i = 0; i < 14; i++) {
        const m = DB.state.moods[DB.todayKey(-i)];
        if (m) (i < 7 ? ultimi7 : prec7).push(m.value);
      }
      const media = a => a.reduce((x, y) => x + y, 0) / a.length;
      if (ultimi7.length >= 3 && prec7.length >= 3) {
        const diff = media(ultimi7) - media(prec7);
        if (diff > 0.4) out.push(`📈 Il tuo umore medio negli ultimi 7 giorni è <strong>in salita</strong> rispetto alla settimana prima. Qualcosa sta funzionando: cosa?`);
        else if (diff < -0.4) out.push(`📉 Il tuo umore medio è <strong>in calo</strong> rispetto alla settimana scorsa. Nessun giudizio — ma se continua, parlane con qualcuno di cui ti fidi.`);
        else out.push(`⚖️ Il tuo umore è <strong>stabile</strong> tra le ultime due settimane.`);
      }
      const perGiorno = {};
      moodKeys.forEach(k => {
        const d = new Date(k + "T12:00:00");
        const g = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"][d.getDay()];
        (perGiorno[g] = perGiorno[g] || []).push(DB.state.moods[k].value);
      });
      const medie = Object.entries(perGiorno).filter(([, v]) => v.length >= 2)
        .map(([g, v]) => [g, media(v)]).sort((a, b) => b[1] - a[1]);
      if (medie.length >= 3) {
        out.push(`🌤️ Il tuo giorno migliore finora è il <strong>${medie[0][0]}</strong>; il più faticoso il <strong>${medie[medie.length - 1][0]}</strong>. Puoi pianificare di conseguenza.`);
      }
    } else {
      out.push(`🌤️ Registra l'umore per almeno 6 giorni e qui compariranno i tuoi schemi settimanali.`);
    }

    if (eventi.filter(e => e.k === "task").length >= 5 && moodKeys.length >= 4) {
      const giorniConUmore = new Set(moodKeys);
      const taskConUmore = eventi.filter(e => e.k === "task" && giorniConUmore.has(new Date(e.t).toISOString().slice(0, 10))).length;
      const totTask = eventi.filter(e => e.k === "task").length;
      if (taskConUmore / totTask > 0.6) {
        out.push(`✅ La maggior parte delle attività le completi nei giorni in cui registri anche l'umore: ascoltarti e fare sembrano andare a braccetto.`);
      }
    }
    return out;
  }

  /* ---------- report stampabile per il professionista ---------- */
  function viewReport() {
    const s = DB.state.stats;
    const FACCE = ["", "😖", "😕", "😐", "🙂", "😄"];
    const oggi = new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
    const moodEntries = [];
    for (let i = 13; i >= 0; i--) {
      const k = DB.todayKey(-i);
      const m = DB.state.moods[k];
      const d = new Date(); d.setDate(d.getDate() - i);
      moodEntries.push({ data: `${d.getDate()}/${d.getMonth() + 1}`, m });
    }
    const scores = Object.entries(s.bestScores);

    main.innerHTML = `
      <div class="view report-page" style="max-width:760px; margin:0 auto">
        <a class="back-link no-print" href="#/progressi">← Ai progressi</a>
        ${lang() === "en" ? `<div class="no-print">${onlyItNoticeHTML()}</div>` : ""}
        <div class="card">
          <h1 style="font-size:1.5rem">🧠 NeuroSpazio — Report personale</h1>
          <p style="color:var(--text-soft)">Generato il ${oggi} · dati auto-registrati dall'utente sul proprio dispositivo</p>
          <hr style="border:none; border-top:1px solid var(--border); margin:1rem 0">

          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Riepilogo dell'attività</h2>
          <table class="score-table" style="margin-bottom:1.2rem">
            <tbody>
              <tr><td>Giorni consecutivi di utilizzo</td><td class="score-val">${s.visitStreak}</td></tr>
              <tr><td>Sessioni di focus (pomodoro) completate</td><td class="score-val">${s.totalPomodoros}</td></tr>
              <tr><td>Attività portate a termine</td><td class="score-val">${s.totalTasksDone}</td></tr>
              <tr><td>Sessioni di respirazione / grounding</td><td class="score-val">${s.breathSessions} / ${s.groundingSessions}</td></tr>
              <tr><td>Partite di allenamento cognitivo</td><td class="score-val">${s.totalGames}</td></tr>
            </tbody>
          </table>

          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Umore auto-riferito (ultimi 14 giorni)</h2>
          <table class="score-table" style="margin-bottom:1.2rem">
            <thead><tr><th>Data</th><th>Umore (1–5)</th><th>Nota</th></tr></thead>
            <tbody>
              ${moodEntries.map(e => `<tr>
                <td>${e.data}</td>
                <td>${e.m ? `${e.m.value} ${FACCE[e.m.value]}` : "—"}</td>
                <td>${e.m?.note ? escapeHTML(e.m.note) : ""}</td>
              </tr>`).join("")}
            </tbody>
          </table>

          ${DB.state.habits.length ? `
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Abitudini in corso</h2>
          <table class="score-table" style="margin-bottom:1.2rem">
            <thead><tr><th>Abitudine</th><th>Serie attuale</th></tr></thead>
            <tbody>
              ${DB.state.habits.map(h => `<tr><td>${escapeHTML(h.name)}</td><td class="score-val">${habitStreak(h)} giorni</td></tr>`).join("")}
            </tbody>
          </table>` : ""}

          ${scores.length ? `
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Record nei giochi cognitivi</h2>
          <table class="score-table" style="margin-bottom:1.2rem">
            <tbody>
              ${scores.map(([id, sc]) => `<tr><td>${sc.label}</td><td class="score-val">${sc.value}</td></tr>`).join("")}
            </tbody>
          </table>` : ""}

          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Osservazioni automatiche</h2>
          <ul style="padding-left:1.2rem; margin-bottom:1.2rem">
            ${calcolaInsights().map(i => `<li style="margin-bottom:.4rem">${i}</li>`).join("")}
          </ul>

          <p style="font-size:.82rem; color:var(--text-soft)">
            Nota metodologica: questo report raccoglie dati auto-registrati (self-monitoring), una pratica utile in valutazione e trattamento
            (Korotitsch & Nelson-Gray, 1999, <em>Psychological Assessment</em>) ma soggetta ai limiti dell'auto-osservazione.
            Non è uno strumento diagnostico: è pensato come base di conversazione con professionisti sanitari.
          </p>
        </div>
        <div class="btn-row no-print" style="justify-content:center; margin-top:1rem">
          <button class="btn btn-big" data-print>🖨️ Stampa o salva come PDF</button>
        </div>
      </div>`;

    main.querySelector("[data-print]").addEventListener("click", () => window.print());
  }

  /* ---------- inizia da qui: scelta diretta, senza test ---------- */
  function viewInizia() {
    const en = lang() === "en";
    const CARDS = [
      { emoji: "🧘", it: ["Rilassarmi", "Calmare corpo e mente, adesso."], en: ["Relax", "Calm body and mind, right now."],
        links: [["#/strumento/respiro", "🫁", "Respirazione", "Breathing"], ["#/strumento/bodyscan", "🧘", "Scansione corporea", "Body scan"],
          ["#/strumento/grounding", "🌍", "Grounding 5-4-3-2-1", "Grounding 5-4-3-2-1"], ["#/strumento/suoni", "🎧", "Suoni rilassanti", "Relaxing sounds"]] },
      { emoji: "⚡", it: ["Attivarmi e concentrarmi", "Accendere il cervello e tenerlo sul pezzo."], en: ["Activate and focus", "Turn the brain on and keep it on track."],
        links: [["#/strumento/pomodoro", "🍅", "Timer di focus", "Focus timer"], ["#/giochi", "🏋️", "Palestra della mente", "Mind gym"],
          ["#/strumento/suoni", "🎧", "Rumore per il focus", "Focus noise"]] },
      { emoji: "🗂️", it: ["Organizzarmi", "Mettere ordine nella giornata e nella testa."], en: ["Get organized", "Bring order to the day and to your head."],
        links: [["#/strumento/attivita", "✅", "Le mie attività", "My tasks"], ["#/strumento/routine", "🧭", "Routine guidate", "Guided routines"],
          ["#/strumento/abitudini", "🔁", "Abitudini", "Habits"], ["#/strumento/dump", "🧺", "Svuota la mente", "Brain dump"]] },
      { emoji: "🏋️", it: ["Solo allenare la mente", "Nessuna neurodivergenza? La palestra vale per tutti i cervelli."], en: ["Just train the mind", "No neurodivergence? The gym works for every brain."],
        links: [["#/giochi", "🎮", "Tutti gli 11 giochi", "All 11 games"], ["#/strumento/gratitudine", "✨", "Tre cose buone", "Three good things"]] },
      { emoji: "🎓", it: ["Capire e imparare", "Psicoeducazione seria, un passo al giorno."], en: ["Understand and learn", "Serious psychoeducation, one step a day."],
        links: [["#/percorsi", "🎓", "Percorsi di 7 giorni", "7-day paths"], ["#/risorse", "📚", "Risorse e guide", "Resources & guides"]] },
      { emoji: "📋", it: ["Non so da dove iniziare", "Un questionario riconosciuto può orientarti (senza etichettarti)."], en: ["I don't know where to start", "A recognized questionnaire can point you somewhere (without labeling you)."],
        links: [["#/test", "📋", "Test di screening", "Screening tests"], ["#/strumento/umore", "🌤️", "Parti da come stai", "Start from how you feel"]] },
    ];
    const cardHTML = c => `
      <div class="tile">
        <span class="tile-emoji" aria-hidden="true">${c.emoji}</span>
        <h3>${en ? c.en[0] : c.it[0]}</h3>
        <p>${en ? c.en[1] : c.it[1]}</p>
        <div class="mini-links">
          ${c.links.map(([href, e, it, enL]) => `<a href="${href}">${e} ${en ? enL : it}</a>`).join("")}
        </div>
      </div>`;

    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🧭 ${en ? "Start here" : "Inizia da qui"}</h1>
          <p>${en
            ? "No mandatory test, no label required: choose how you want to come in. You can change path anytime."
            : "Nessun test obbligatorio, nessuna etichetta necessaria: scegli come vuoi entrare. Puoi cambiare strada quando vuoi."}</p>
        </div>

        <h2 style="font-size:1.15rem; margin-bottom:.6rem">${en ? "What do you need right now?" : "Di cosa hai bisogno adesso?"}</h2>
        <div class="grid grid-3" style="margin-bottom:1.8rem">
          ${CARDS.map(cardHTML).join("")}
        </div>

        <h2 style="font-size:1.15rem; margin-bottom:.6rem">${en ? "Or enter from your neurodivergence (or a loved one's)" : "Oppure entra dalla tua neurodivergenza (o da quella di chi ami)"}</h2>
        <div class="grid grid-3" style="margin-bottom:1.8rem">
          ${Object.entries(ND_INFO).map(([k, n]) => `
            <div class="tile">
              <span class="tile-emoji" aria-hidden="true">${n.emoji}</span>
              <h3>${en ? ND_INFO_EN[k] : n.nome}</h3>
              <div class="mini-links">
                <a href="#/giochi" data-nd-go="${k}">🎮 ${en ? "Relevant games" : "Giochi indicati"}</a>
                <a href="#/strumenti" data-nd-go="${k}">🧰 ${en ? "Relevant tools" : "Strumenti indicati"}</a>
                <a href="#/risorse">📚 ${en ? "Understand more" : "Capire meglio"}</a>
              </div>
            </div>`).join("")}
          <div class="tile">
            <span class="tile-emoji" aria-hidden="true">👨‍👩‍👧</span>
            <h3>${en ? "Parent or teacher" : "Genitore o insegnante"}</h3>
            <div class="mini-links">
              <a href="#/risorse">👨‍👩‍👧 ${en ? "Guide for you" : "Guida per voi"}</a>
              <a href="#/giochi">🧒 ${en ? "Age-leveled games" : "Giochi con livelli per età"}</a>
              <a href="#/classe">🏫 ${en ? "Class Mode (shared device)" : "Modalità Classe (dispositivo condiviso)"}</a>
            </div>
          </div>
        </div>
      </div>`;

    main.querySelectorAll("[data-nd-go]").forEach(a => a.addEventListener("click", () => {
      filtroND.giochi = a.dataset.ndGo;
      filtroND.strumenti = a.dataset.ndGo;
    }));
  }

  /* ---------- test di screening riconosciuti (mai diagnosi) ---------- */
  /* fonde i campi testuali inglesi (se presenti) con la struttura di scoring originale */
  function testLocalizzato(t) {
    const en = lang() === "en" && TESTS_EN[t.id];
    if (!en) return t;
    return {
      ...t,
      nome: en.nome, strumento: en.strumento, per: en.per, intro: en.intro,
      opzioni: en.opzioni,
      domande: t.domande.map((d, i) => ({ ...d, t: en.domande[i] })),
    };
  }

  function viewTests() {
    const en = lang() === "en";
    const disclaimer = en ? TEST_DISCLAIMER_EN : TEST_DISCLAIMER;
    main.innerHTML = `
      <div class="view" style="max-width:760px; margin:0 auto">
        <div class="page-head">
          <h1>📋 ${en ? "Screening tests" : "Test di screening"}</h1>
          <p>${en
            ? "Questionnaires <strong>validated and recognized</strong> in the scientific literature. They are compasses, not labels."
            : "Questionari <strong>validati e riconosciuti</strong> dalla letteratura scientifica, in adattamento italiano. Sono bussole, non etichette."}</p>
        </div>
        <div class="honesty-box" style="border-color:var(--warn); background:var(--warn-soft)">
          <h3 style="color:var(--warn)">⚠️ ${en ? "Before you start" : "Prima di iniziare"}</h3>
          <p>${disclaimer} ${en
            ? "These questionnaires are meant for <strong>adults (18+)</strong>: for children and teens, the right point of reference is a pediatrician or child/adolescent psychiatry service."
            : "Questi questionari sono pensati per <strong>adulti (18+)</strong>: per bambini e ragazzi il riferimento giusto è il pediatra o la neuropsichiatria infantile."}</p>
        </div>
        <div class="btn-row" style="margin-bottom:1.4rem">
          <a class="btn btn-soft" href="#/inizia">🧭 ${en ? "I'd rather choose without a test →" : "Preferisco scegliere senza test →"}</a>
        </div>
        <div class="grid" style="grid-template-columns:1fr">
          ${TESTS.map(t => {
            const tt = testLocalizzato(t);
            const esito = DB.state.testEsiti[t.id];
            return `
            <a class="tile" href="#/test/${t.id}">
              <span class="tile-emoji" aria-hidden="true">${t.emoji}</span>
              <h3>${tt.nome}</h3>
              <p><strong>${tt.strumento}</strong> · ${t.domande.length} ${en ? "questions" : "domande"} · ${tt.per}</p>
              ${esito ? `<span class="tile-tag">${en ? "Last result" : "Ultimo risultato"}: ${esito.score} ${t.unita} (${esito.when})</span>` : `<span class="tile-tag">${en ? "Never taken" : "Mai fatto"}</span>`}
            </a>`;
          }).join("")}
        </div>
      </div>`;
  }

  function calcolaTest(t, risposte) {
    if (t.tipo === "asrs") {
      const score = t.domande.filter((d, i) => risposte[i] >= d.soglia).length;
      return { score, positivo: score >= t.sogliaPositiva };
    }
    if (t.tipo === "aq") {
      const score = t.domande.filter((d, i) => d.agree ? risposte[i] <= 1 : risposte[i] >= 2).length;
      return { score, positivo: score >= t.sogliaPositiva };
    }
    // gad: somma semplice
    const score = risposte.reduce((a, b) => a + b, 0);
    return { score, positivo: score >= t.sogliaPositiva };
  }

  function viewTest(id) {
    const t = TESTS.find(x => x.id === id);
    if (!t) return navigate("/test");
    const en = lang() === "en";
    const tt = testLocalizzato(t);
    const fonte = FONTI.find(f => f.id === t.fonte);
    const disclaimer = en ? TEST_DISCLAIMER_EN : TEST_DISCLAIMER;

    main.innerHTML = `
      <div class="view" style="max-width:720px; margin:0 auto">
        <a class="back-link" href="#/test">${en ? "← All tests" : "← Tutti i test"}</a>
        <div class="page-head">
          <h1>${t.emoji} ${tt.nome}</h1>
          <p><strong>${tt.strumento}</strong></p>
        </div>
        <div class="honesty-box" style="border-color:var(--warn); background:var(--warn-soft); padding:.9rem 1.1rem">
          <p style="font-size:.88rem">⚠️ ${disclaimer}</p>
        </div>
        <div class="card" style="margin-bottom:1.2rem"><p style="color:var(--text-soft)">${tt.intro}</p></div>
        <form data-test-form>
          ${tt.domande.map((d, i) => `
            <fieldset class="test-q card">
              <legend>${i + 1}. ${d.t}</legend>
              <div class="test-opts">
                ${tt.opzioni.map((o, j) => `
                  <label class="test-opt">
                    <input type="radio" name="q${i}" value="${j}">
                    <span>${o}</span>
                  </label>`).join("")}
              </div>
            </fieldset>`).join("")}
          <div class="btn-row" style="justify-content:center; margin:1.2rem 0">
            <button class="btn btn-big" type="submit">${en ? "Calculate result" : "Calcola il risultato"}</button>
          </div>
        </form>
        <div data-risultato></div>
        <p style="font-size:.8rem; color:var(--text-soft); margin-top:1rem">📚 ${en ? "Source" : "Fonte"}: ${fonte ? fonte.testo : ""}</p>
      </div>`;

    main.querySelector("[data-test-form]").addEventListener("submit", e => {
      e.preventDefault();
      const risposte = t.domande.map((_, i) => {
        const sel = main.querySelector(`input[name="q${i}"]:checked`);
        return sel ? Number(sel.value) : null;
      });
      if (risposte.some(r => r === null)) {
        toast(en ? "Some answers are missing: check the questions with no dot selected 😊" : "Manca qualche risposta: controlla le domande senza pallino 😊");
        return;
      }
      const { score, positivo } = calcolaTest(t, risposte);
      DB.state.testEsiti[t.id] = { score, max: t.max, positivo, when: DB.todayKey() };
      DB.save();

      let banda = "";
      if (t.tipo === "gad") {
        banda = en
          ? (score <= 4 ? "minimal anxiety" : score <= 9 ? "mild anxiety" : score <= 14 ? "moderate anxiety" : "severe anxiety")
          : (score <= 4 ? "ansia minima" : score <= 9 ? "ansia lieve" : score <= 14 ? "ansia moderata" : "ansia elevata");
      }

      const box = main.querySelector("[data-risultato]");
      box.innerHTML = `
        <div class="card" style="border:2px solid ${positivo ? "var(--warn)" : "var(--accent)"}">
          <h2 style="margin-bottom:.5rem">${en ? "Your result" : "Il tuo risultato"}: ${score} ${t.unita}${banda ? ` · ${banda}` : ""}</h2>
          <p style="margin-bottom:.8rem">${positivo
            ? (en
              ? `In the literature, a score like yours (≥ ${t.sogliaPositiva}) is considered a <strong>signal worth exploring further</strong> with a qualified professional. It's not a diagnosis: it's a good reason for a conversation with someone who can properly assess you.`
              : `In letteratura, un punteggio come il tuo (≥ ${t.sogliaPositiva}) è considerato un <strong>segnale che vale la pena approfondire</strong> con una persona professionista. Non è una diagnosi: è un buon motivo per una chiacchierata con chi può valutarti davvero.`)
            : (en
              ? `Your score is <strong>below the screening threshold</strong> used in the literature (${t.sogliaPositiva}). Remember though: if real-life difficulties are there, you deserve support regardless of any number.`
              : `Il tuo punteggio è <strong>sotto la soglia di screening</strong> usata in letteratura (${t.sogliaPositiva}). Ricorda però: se le difficoltà nella vita reale ci sono, meriti supporto a prescindere da qualsiasi numero.`)}
          </p>
          <p style="font-size:.85rem; color:var(--text-soft); margin-bottom:1rem">⚠️ ${disclaimer}</p>
          <div class="btn-row">
            <a class="btn" href="#/risorse">🤝 ${en ? "Where to find help" : "Dove trovare aiuto in Italia"}</a>
            <a class="btn btn-soft" href="#/giochi" data-nd-result>🎮 ${en ? "Relevant exercises" : "Esercizi indicati"}</a>
            <a class="btn btn-ghost" href="#/inizia">🧭 ${en ? "Explore the app" : "Esplora l'app"}</a>
          </div>
        </div>`;
      const ndLink = box.querySelector("[data-nd-result]");
      if (ndLink) ndLink.addEventListener("click", () => {
        filtroND.giochi = t.nd;
        filtroND.strumenti = t.nd;
      });
      box.scrollIntoView({ behavior: "smooth", block: "start" });
      confetti(20);
    });
  }

  /* ---------- dichiarazione di accessibilità ---------- */
  function viewAccessibilita() {
    const en = lang() === "en";
    const data = new Date().toLocaleDateString(en ? "en-GB" : "it-IT", { day: "numeric", month: "long", year: "numeric" });
    main.innerHTML = en ? `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>♿ Accessibility statement</h1>
          <p>Last checked: ${data}</p>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Commitment and standard</h2>
          <p>NeuroSpazio aims to meet the <strong>Web Content Accessibility Guidelines (WCAG) 2.2, level AA</strong>, the international reference standard for digital accessibility. This commitment isn't decorative: much of who uses this site has concrete reasons — sensory, motor, cognitive — to need an interface that's genuinely accessible, not just aesthetically inclusive.</p>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">What we've verified</h2>
          <ul style="padding-left:1.3rem">
            <li style="margin-bottom:.4rem"><strong>Color contrast:</strong> text and components automatically checked (axe-core) across all main pages, in light and dark theme, for the minimum 4.5:1 ratio required by WCAG criterion 1.4.3.</li>
            <li style="margin-bottom:.4rem"><strong>Keyboard navigation:</strong> every function is reachable without a mouse; the SOS Card (the most critical component, meant for crisis moments) has focus trap, Escape-to-close, and focus restoration, per the ARIA Authoring Practices.</li>
            <li style="margin-bottom:.4rem"><strong>Screen readers:</strong> semantic landmarks (header/nav/main/footer), ARIA labels on controls, aria-live for notifications and game scores, alt text on decorative emoji.</li>
            <li style="margin-bottom:.4rem"><strong>Motion:</strong> a "Reduce animations" switch in Settings, and automatic respect for the OS's <code>prefers-reduced-motion</code>.</li>
            <li style="margin-bottom:.4rem"><strong>Text:</strong> resizable up to 130% from the interface, a dedicated dyslexia mode (font and spacing).</li>
          </ul>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--warn)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Known limitations</h2>
          <p style="margin-bottom:.6rem">Honesty first: automated auditing covers part of the WCAG criteria, not all of them. We don't yet have full testing with real screen reader users (NVDA, JAWS, VoiceOver) in everyday conditions, nor a review by certified accessibility experts.</p>
          <p>Some games (e.g. Color Rebel/Stroop) necessarily use color as part of the cognitive task itself: there, color is the content, not just decoration, so it isn't always possible to pair it with a non-color alternative without changing the exercise.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Report a problem</h2>
          <p>If you hit a barrier — insufficient contrast, a control unreachable by keyboard, a missing label for your screen reader — that's valuable information. We don't have a data-collection form (consistent with our <a href="#/privacy">zero-tracking policy</a>): the right channel to report it depends on where you found this site.</p>
        </div>
      </div>` : `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>♿ Dichiarazione di accessibilità</h1>
          <p>Ultimo controllo: ${data}</p>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Impegno e standard</h2>
          <p>NeuroSpazio punta a rispettare le <strong>Web Content Accessibility Guidelines (WCAG) 2.2, livello AA</strong>, lo standard internazionale di riferimento per l'accessibilità digitale. Questo impegno non è decorativo: gran parte di chi usa questo sito ha ragioni concrete — sensoriali, motorie, cognitive — per aver bisogno di un'interfaccia davvero accessibile, non solo esteticamente inclusiva.</p>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Cosa abbiamo verificato</h2>
          <ul style="padding-left:1.3rem">
            <li style="margin-bottom:.4rem"><strong>Contrasto colore:</strong> testo e componenti verificati automaticamente (axe-core) su tutte le pagine principali, in tema chiaro e scuro, per il rapporto minimo 4.5:1 richiesto dal criterio WCAG 1.4.3.</li>
            <li style="margin-bottom:.4rem"><strong>Navigazione da tastiera:</strong> ogni funzione è raggiungibile senza mouse; la Carta SOS (il componente più critico, pensato per momenti di crisi) ha focus trap, chiusura con Esc e ripristino del focus, secondo le ARIA Authoring Practices.</li>
            <li style="margin-bottom:.4rem"><strong>Lettori di schermo:</strong> landmark semantici (header/nav/main/footer), etichette ARIA sui controlli, aria-live per notifiche e punteggi di gioco, testo alternativo sulle emoji decorative.</li>
            <li style="margin-bottom:.4rem"><strong>Movimento:</strong> interruttore "Riduci le animazioni" nelle Opzioni, e rispetto automatico di <code>prefers-reduced-motion</code> del sistema operativo.</li>
            <li style="margin-bottom:.4rem"><strong>Testo:</strong> ridimensionabile fino al 130% dall'interfaccia, modalità dedicata per la dislessia (font e spaziatura).</li>
          </ul>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--warn)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Limiti conosciuti</h2>
          <p style="margin-bottom:.6rem">Onestà prima di tutto: l'audit automatico copre una parte dei criteri WCAG, non tutti. Non abbiamo ancora un test completo con persone reali che usano lettori di schermo (NVDA, JAWS, VoiceOver) in condizioni quotidiane, né una revisione da parte di esperti certificati di accessibilità.</p>
          <p>Alcuni giochi (es. Colore ribelle/Stroop) usano necessariamente il colore come parte del compito cognitivo stesso: lì il colore è il contenuto, non solo una decorazione, e non è quindi sempre possibile affiancarlo a un'alternativa non cromatica senza snaturare l'esercizio.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Segnala un problema</h2>
          <p>Se incontri una barriera — un contrasto insufficiente, un controllo non raggiungibile da tastiera, un'etichetta mancante per il tuo lettore di schermo — è un'informazione preziosa. Non abbiamo un modulo di raccolta dati (coerentemente con la nostra <a href="#/privacy">politica zero-tracking</a>): il canale di segnalazione dipende da dove hai trovato questo sito.</p>
        </div>
      </div>`;
  }

  /* ---------- trasparenza privacy ---------- */
  function viewPrivacy() {
    const en = lang() === "en";
    main.innerHTML = en ? `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>🔒 Privacy, in plain words</h1>
          <p>Not a legal document written to protect us: an honest explanation of what happens to your data.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--accent)">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">🏠 Everything stays on your device</h2>
          <p>NeuroSpazio has no account, no server, no database. Tasks, mood, game scores, test results, everything you write: it's saved only in the local memory of the browser you're using right now (called <code>localStorage</code>). If you clear the site's data from your browser, or open the app on another device, that data is gone — no server keeps it for you.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--primary)">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">🚫 What we DON'T do</h2>
          <ul style="padding-left:1.3rem">
            <li style="margin-bottom:.4rem">No account, no password, no email required</li>
            <li style="margin-bottom:.4rem">No tracking cookies, no advertising pixels</li>
            <li style="margin-bottom:.4rem">No analytics (Google Analytics, Meta Pixel or similar)</li>
            <li style="margin-bottom:.4rem">No data sent to external servers: the app even works offline (thanks to the service worker) precisely because it doesn't need to "phone home"</li>
            <li style="margin-bottom:.4rem">No selling or sharing data with third parties — simply because we never hold it ourselves</li>
          </ul>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">📋 Exactly what's stored locally</h2>
          <p style="color:var(--text-soft); margin-bottom:.6rem">All under one entry in your browser: tasks and lists, daily mood, habits and streaks, routines you create, screening test results, game scores, badges, appearance and accessibility settings, "Brain Dump" and "Three Good Things" notes.</p>
          <p>You can view and delete everything anytime from <a href="#/impostazioni">Settings → Your data</a>: export a copy, import it on another device, or delete everything with one tap.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">⚖️ A note on GDPR (not legal advice)</h2>
          <p>The EU General Data Protection Regulation (GDPR, Art. 5.1.c) asks companies to collect only the minimum data necessary ("data minimization"). NeuroSpazio follows this principle as radically as possible: by collecting zero data that leaves your device. This page describes how the app works; it does not replace professional legal or privacy advice.</p>
        </div>
      </div>` : `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>🔒 Privacy, in parole semplici</h1>
          <p>Non un documento legale scritto per proteggerci: una spiegazione onesta di cosa succede ai tuoi dati.</p>
        </div>

        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--accent)">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">🏠 Tutto resta nel tuo dispositivo</h2>
          <p>NeuroSpazio non ha un account, non ha un server, non ha un database. Attività, umore, punteggi dei giochi, risultati dei test, tutto quello che scrivi: viene salvato solo nella memoria locale del browser che stai usando ora (si chiama <code>localStorage</code>). Se cancelli i dati del sito dal browser, o apri l'app da un altro dispositivo, quei dati non ci sono più — nessun server li conserva al posto tuo.</p>
        </div>

        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--primary)">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">🚫 Cosa NON facciamo</h2>
          <ul style="padding-left:1.3rem">
            <li style="margin-bottom:.4rem">Nessun account, nessuna password, nessuna email richiesta</li>
            <li style="margin-bottom:.4rem">Nessun cookie di tracciamento, nessun pixel pubblicitario</li>
            <li style="margin-bottom:.4rem">Nessun analytics (Google Analytics, Meta Pixel o simili)</li>
            <li style="margin-bottom:.4rem">Nessun invio di dati a server esterni: l'app funziona anche offline (grazie al service worker) proprio perché non ha bisogno di "telefonare a casa"</li>
            <li style="margin-bottom:.4rem">Nessuna vendita o condivisione di dati con terze parti — semplicemente perché non li abbiamo mai in mano noi</li>
          </ul>
        </div>

        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">📋 Esattamente cosa viene salvato localmente</h2>
          <p style="color:var(--text-soft); margin-bottom:.6rem">Tutto sotto un'unica voce nel tuo browser: attività e liste, umore giornaliero, abitudini e serie, routine create, esiti dei test di screening, punteggi dei giochi, badge, impostazioni di aspetto e accessibilità, note di "Svuota la mente" e "Tre cose buone".</p>
          <p>Puoi vedere e cancellare tutto in ogni momento da <a href="#/impostazioni">Opzioni → I tuoi dati</a>: esporta una copia, importala su un altro dispositivo, o cancella tutto con un tocco.</p>
        </div>

        <div class="card">
          <h2 style="font-size:1.15rem; margin-bottom:.5rem">⚖️ Una nota sul GDPR (non è consulenza legale)</h2>
          <p>Il Regolamento europeo sulla protezione dei dati (GDPR, Art. 5.1.c) chiede alle aziende di raccogliere solo i dati minimi necessari ("minimizzazione dei dati"). NeuroSpazio segue questo principio nel modo più radicale possibile: raccogliendo zero dati che lascino il tuo dispositivo. Questa pagina descrive come funziona l'app, non sostituisce una consulenza legale o privacy professionale.</p>
        </div>
      </div>`;
  }

  /* ---------- per ricercatori: onestà, nessuna validazione mai dichiarata ---------- */
  function viewRicerca() {
    const en = lang() === "en";
    const repoUrl = "https://github.com/itsgrc/neuro";
    main.innerHTML = en ? `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>🔬 For researchers</h1>
          <p>What NeuroSpazio actually is, scientifically speaking — no more, no less.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--accent)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">What we can honestly claim</h2>
          <p>Every game and tool is built around a mechanism documented in peer-reviewed literature (Stroop task, go/no-go, n-back, ASRS, AQ-10, GAD-7, implementation intentions, mindfulness-based interventions, and more — full list in our <a href="#/risorse">bibliography</a>, 53 references). The underlying <em>techniques</em> have evidence behind them.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--warn)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">What we CANNOT honestly claim</h2>
          <p style="margin-bottom:.6rem"><strong>NeuroSpazio itself — this specific web implementation — has not undergone independent clinical or usability validation.</strong> A validated technique (e.g., the Stroop paradigm) doesn't automatically make our particular digital adaptation of it validated: colors, timing, UI, and game framing can all affect results, and we haven't measured that.</p>
          <p style="margin-bottom:.6rem">The three screening questionnaires (ASRS, AQ-10, GAD-7) are validated instruments in their original clinical form. Our web adaptation follows their structure and scoring faithfully, but digital self-administered versions of paper instruments generally require their own psychometric validation (equivalence testing) before being considered clinically equivalent — we have not conducted or commissioned that study.</p>
          <p>We do not track usage, retention, or outcomes centrally (by design — see our <a href="#/privacy">privacy page</a>), so we currently have no aggregate data of our own to analyze or share.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">An open invitation</h2>
          <p style="margin-bottom:.6rem">If you're a researcher in psychology, HCI, digital health, or education interested in studying digital tools for neurodivergent support — usability, engagement, or the validity of digital screening adaptations — we'd genuinely like to talk. This would mean designing a proper study with real consent, not analyzing data we don't have.</p>
          <p>The codebase is public: <a href="${repoUrl}" target="_blank" rel="noopener">${repoUrl}</a>. Open an issue there to get in touch — that's our only real, verifiable contact channel today.</p>
        </div>
      </div>` : `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>🔬 Per ricercatori</h1>
          <p>Cos'è davvero NeuroSpazio, dal punto di vista scientifico — né più né meno.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--accent)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Cosa possiamo affermare onestamente</h2>
          <p>Ogni gioco e strumento è costruito attorno a un meccanismo documentato nella letteratura peer-reviewed (compito di Stroop, go/no-go, n-back, ASRS, AQ-10, GAD-7, implementation intentions, interventi mindfulness-based e altro — elenco completo nella nostra <a href="#/risorse">bibliografia</a>, 53 riferimenti). Le <em>tecniche</em> di base hanno prove a supporto.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--warn)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Cosa NON possiamo affermare onestamente</h2>
          <p style="margin-bottom:.6rem"><strong>NeuroSpazio in sé — questa specifica implementazione web — non ha ricevuto una validazione clinica o di usabilità indipendente.</strong> Una tecnica validata (es. il paradigma di Stroop) non rende automaticamente validato il nostro particolare adattamento digitale: colori, tempistiche, interfaccia e cornice ludica possono tutti influenzare i risultati, e non lo abbiamo misurato.</p>
          <p style="margin-bottom:.6rem">I tre questionari di screening (ASRS, AQ-10, GAD-7) sono strumenti validati nella loro forma clinica originale. Il nostro adattamento web ne segue fedelmente struttura e punteggio, ma le versioni digitali auto-somministrate di strumenti cartacei richiedono generalmente una propria validazione psicometrica (test di equivalenza) prima di essere considerate clinicamente equivalenti — non abbiamo condotto né commissionato quello studio.</p>
          <p>Non tracciamo utilizzo, retention o esiti in modo centralizzato (per scelta — vedi la nostra <a href="#/privacy">pagina privacy</a>), quindi al momento non abbiamo dati aggregati nostri da analizzare o condividere.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Un invito aperto</h2>
          <p style="margin-bottom:.6rem">Se sei un ricercatore o una ricercatrice in psicologia, HCI, salute digitale o educazione, interessato/a a studiare strumenti digitali per il supporto neurodivergente — usabilità, coinvolgimento, o la validità degli adattamenti digitali di screening — ci farebbe piacere parlarne. Significherebbe progettare uno studio vero con consenso reale, non analizzare dati che non abbiamo.</p>
          <p>Il codice è pubblico: <a href="${repoUrl}" target="_blank" rel="noopener">${repoUrl}</a>. Apri una issue lì per metterti in contatto — è il nostro unico canale di contatto reale e verificabile oggi.</p>
        </div>
      </div>`;
  }

  /* ---------- media kit: fatti reali, zero testimonianze finte ---------- */
  function viewMediaKit() {
    const en = lang() === "en";
    const repoUrl = "https://github.com/itsgrc/neuro";
    const FACTS_IT = [
      ["🎮", "11 giochi cognitivi", "Su 6 domini: memoria, attenzione, inibizione, flessibilità, tempo, senso del numero"],
      ["🧰", "13 strumenti", "Focus, organizzazione, calma — dal Pomodoro alla Carta SOS"],
      ["🎓", "3 percorsi guidati", "7 giorni, un passo al giorno, con fonte citata per ogni giorno"],
      ["📋", "3 test di screening", "ASRS (OMS), AQ-10 (Cambridge), GAD-7 — mai diagnostici"],
      ["📚", "53 fonti scientifiche", "Bibliografia consultabile integralmente nell'app"],
      ["🔒", "Zero tracking", "Nessun account, nessun server, nessun analytics"],
      ["💸", "Gratis, senza pubblicità", "E lo resterà: nessun costo di infrastruttura da ripagare"],
      ["♿", "WCAG 2.2 AA", "Verificato con axe-core in tema chiaro e scuro"],
      ["📖", "Open source", "Codice pubblico, ispezionabile da chiunque"],
    ];
    const FACTS_EN = [
      ["🎮", "11 cognitive games", "Across 6 domains: memory, attention, inhibition, flexibility, time, number sense"],
      ["🧰", "13 tools", "Focus, organization, calm — from Pomodoro to the SOS Card"],
      ["🎓", "3 guided paths", "7 days, one step a day, with a cited source for each day"],
      ["📋", "3 screening tests", "ASRS (WHO), AQ-10 (Cambridge), GAD-7 — never diagnostic"],
      ["📚", "53 scientific sources", "Full bibliography browsable in the app"],
      ["🔒", "Zero tracking", "No account, no server, no analytics"],
      ["💸", "Free, no ads", "And it'll stay that way: no infrastructure cost to recoup"],
      ["♿", "WCAG 2.2 AA", "Verified with axe-core in light and dark theme"],
      ["📖", "Open source", "Public code, inspectable by anyone"],
    ];
    const facts = en ? FACTS_EN : FACTS_IT;

    main.innerHTML = `
      <div class="view" style="max-width:760px; margin:0 auto">
        <div class="page-head">
          <h1>📰 ${en ? "Media kit" : "Media kit"}</h1>
          <p>${en
            ? "Real facts about NeuroSpazio, for press, educators, or anyone who wants to talk about it accurately. No follower counts, no testimonials, no fabricated numbers — this app has no analytics, so we couldn't fake usage stats even if we wanted to."
            : "Fatti reali su NeuroSpazio, per stampa, educatori o chiunque voglia parlarne con precisione. Nessun numero di follower, nessuna testimonianza, nessuna statistica inventata — quest'app non ha analytics, quindi non potremmo fabbricare dati d'uso nemmeno volendo."}</p>
        </div>

        <div class="grid grid-3" style="margin-bottom:1.4rem">
          ${facts.map(([e, t, d]) => `
            <div class="card" style="text-align:center">
              <div style="font-size:2rem; margin-bottom:.3rem">${e}</div>
              <div style="font-weight:800; margin-bottom:.3rem">${t}</div>
              <div style="color:var(--text-soft); font-size:.85rem">${d}</div>
            </div>`).join("")}
        </div>

        <div class="card" style="margin-bottom:1.2rem">
          <h2 style="font-size:1.1rem; margin-bottom:.6rem">${en ? "One-line description" : "Descrizione in una riga"}</h2>
          <p style="color:var(--text-soft); font-style:italic; margin-bottom:.8rem">${en
            ? "“NeuroSpazio is a free, science-backed mind gym — games, tools, and screening tests for ADHD, autism, learning disabilities, and anxiety, built with zero tracking and open source code.”"
            : "“NeuroSpazio è una palestra della mente gratuita e con basi scientifiche — giochi, strumenti e test di screening per ADHD, autismo, DSA e ansia, costruita a zero tracciamento e a codice aperto.”"}</p>
          <h2 style="font-size:1.1rem; margin-bottom:.6rem">${en ? "Brand assets" : "Risorse grafiche"}</h2>
          <div class="btn-row">
            <a class="btn btn-soft" href="icons/icon-512.png" download>⬇️ ${en ? "Icon (512×512)" : "Icona (512×512)"}</a>
            <a class="btn btn-soft" href="icons/og-image.png" download>⬇️ ${en ? "Social preview image" : "Immagine social"}</a>
          </div>
        </div>

        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.6rem">${en ? "Want to collaborate?" : "Vuoi collaborare?"}</h2>
          <p style="margin-bottom:.6rem">${en
            ? "We're open to honest collaboration with neurodivergent creators, educators, and associations who want to talk about NeuroSpazio to their own audience — on their own terms. We're not offering paid placements or fabricated endorsements, and we won't ask you to say anything you don't believe."
            : "Siamo aperti a collaborazioni oneste con creator neurodivergenti, educatori e associazioni che vogliano parlare di NeuroSpazio al proprio pubblico — alle loro condizioni. Non offriamo inserzioni a pagamento né endorsement fabbricati, e non ti chiederemmo mai di dire qualcosa in cui non credi."}</p>
          <p>${en ? "Get in touch via" : "Mettiti in contatto via"} <a href="${repoUrl}" target="_blank" rel="noopener">GitHub</a> — ${en ? "our only real contact channel today" : "il nostro unico canale di contatto reale oggi"}.</p>
        </div>
      </div>`;
  }

  /* ---------- manifesto: monetizzazione etica, niente ads, niente pagamenti finti ---------- */
  function viewSostieni() {
    const en = lang() === "en";
    const repoUrl = "https://github.com/itsgrc/neuro";
    main.innerHTML = en ? `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>💜 Support NeuroSpazio</h1>
          <p>Why there are no ads here, and probably never will be.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--primary)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Why no ads</h2>
          <p style="margin-bottom:.6rem">The attention economy — infinite scroll, autoplay, targeted engagement — is built to hijack exactly the reward circuitry that's already more sensitive and harder to self-regulate in ADHD (Volkow et al., 2009). Putting ads, engagement-maximizing notifications, or manipulative design in an app built <em>for</em> this audience would be a direct contradiction of its purpose.</p>
          <p>So: no ads, no attention-mining "streaks that punish," no dark patterns. The streaks and badges here exist because reward and structure genuinely help ADHD motivation (same source) — not to keep you scrolling past your own better judgment.</p>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">How this stays free</h2>
          <p>Right now, NeuroSpazio runs on zero infrastructure cost by design — no server, no database, no account system, hosted as a static site. That's not just a privacy choice, it's what makes "free, forever, no ads" actually sustainable rather than a promise waiting to be broken.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">How you can help (for real, today)</h2>
          <ul style="padding-left:1.3rem">
            <li style="margin-bottom:.5rem">⭐ Star or contribute on <a href="${repoUrl}" target="_blank" rel="noopener">GitHub</a> — the code is open</li>
            <li style="margin-bottom:.5rem">🗣️ Tell someone who might need it — word of mouth is our only marketing channel</li>
            <li style="margin-bottom:.5rem">🐛 Report bugs or accessibility barriers via a GitHub issue</li>
          </ul>
          <p style="color:var(--text-soft); font-size:.85rem; margin-top:.8rem">A financial support option (donations) isn't set up yet — we won't put up a button that leads nowhere. If that changes, it'll appear here, clearly labeled.</p>
        </div>
      </div>` : `
      <div class="view" style="max-width:720px; margin:0 auto">
        <div class="page-head">
          <h1>💜 Sostieni NeuroSpazio</h1>
          <p>Perché qui non c'è pubblicità, e probabilmente non ci sarà mai.</p>
        </div>
        <div class="card" style="margin-bottom:1rem; border-left:4px solid var(--primary)">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Perché niente pubblicità</h2>
          <p style="margin-bottom:.6rem">L'economia dell'attenzione — scroll infinito, autoplay, coinvolgimento mirato — è costruita per dirottare esattamente quei circuiti della ricompensa che nell'ADHD sono già più sensibili e più difficili da autoregolare (Volkow et al., 2009). Mettere pubblicità, notifiche che massimizzano il coinvolgimento o design manipolativo in un'app pensata <em>per</em> questo pubblico sarebbe una contraddizione diretta del suo scopo.</p>
          <p>Quindi: niente pubblicità, niente serie che "puniscono" per catturare attenzione, niente pattern oscuri. Le serie e i badge qui esistono perché ricompensa e struttura aiutano davvero la motivazione nell'ADHD (stessa fonte) — non per tenerti a scrollare oltre il tuo stesso buon senso.</p>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Come resta gratis</h2>
          <p>Oggi NeuroSpazio ha costi di infrastruttura pari a zero per come è progettato — nessun server, nessun database, nessun sistema di account, ospitato come sito statico. Non è solo una scelta di privacy: è ciò che rende "gratis, per sempre, senza pubblicità" davvero sostenibile, e non una promessa in attesa di essere infranta.</p>
        </div>
        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">Come puoi aiutare (davvero, oggi)</h2>
          <ul style="padding-left:1.3rem">
            <li style="margin-bottom:.5rem">⭐ Metti una stella o contribuisci su <a href="${repoUrl}" target="_blank" rel="noopener">GitHub</a> — il codice è aperto</li>
            <li style="margin-bottom:.5rem">🗣️ Parlane a chi potrebbe averne bisogno — il passaparola è il nostro unico canale di marketing</li>
            <li style="margin-bottom:.5rem">🐛 Segnala bug o barriere di accessibilità con una issue su GitHub</li>
          </ul>
          <p style="color:var(--text-soft); font-size:.85rem; margin-top:.8rem">Un'opzione di sostegno economico (donazioni) non è ancora attiva — non mettiamo un bottone che non porta da nessuna parte. Se cambierà, comparirà qui, etichettato con chiarezza.</p>
        </div>
      </div>`;
  }

  /* ---------- modalità classe: profili multipli locali su un solo dispositivo ---------- */
  const EMOJI_PROFILO = ["🦊", "🐼", "🦁", "🐸", "🐙", "🦋", "🐢", "🦉", "🐝", "🌟", "🚀", "🌈"];

  function viewClasse() {
    const en = lang() === "en";
    const attivo = DB.currentProfileId();
    const profili = [{ id: "default", name: en ? "Me" : "Io", emoji: "🙂" }, ...DB.listProfiles()];

    main.innerHTML = `
      <div class="view" style="max-width:760px; margin:0 auto">
        <div class="page-head">
          <h1>🏫 ${en ? "Class Mode" : "Modalità Classe"}</h1>
          <p>${en
            ? "For a shared classroom device: one local profile per student, each with its own separate progress. Everything stays on this device — nothing is synced or sent anywhere."
            : "Pensata per un computer o tablet condiviso in classe: un profilo locale per ogni studente, ciascuno con i propri progressi separati. Tutto resta su questo dispositivo — niente viene sincronizzato o inviato altrove."}</p>
        </div>

        <div class="card" style="margin-bottom:1.2rem; border-left:4px solid var(--warn)">
          <p style="font-size:.9rem">⚠️ ${en
            ? "Important: switching profile reloads the active data set on THIS browser. If students use different devices, this mode isn't needed — each device already keeps its own separate data automatically."
            : "Importante: cambiare profilo ricarica il set di dati attivo su QUESTO browser. Se gli studenti usano dispositivi diversi, questa modalità non serve — ogni dispositivo tiene già i propri dati separati automaticamente."}</p>
        </div>

        <div class="card" style="margin-bottom:1.2rem">
          <h2 style="font-size:1.1rem; margin-bottom:.8rem">👥 ${en ? "Profiles on this device" : "Profili su questo dispositivo"}</h2>
          <div class="profile-list">
            ${profili.map(p => `
              <div class="profile-row ${p.id === attivo ? "attivo" : ""}">
                <span class="profile-emoji">${p.emoji}</span>
                <span class="profile-name">${App.escapeHTML(p.name)}</span>
                ${p.id === attivo
                  ? `<span class="profile-badge">✅ ${en ? "Active" : "Attivo"}</span>`
                  : `<button class="btn btn-soft" data-attiva="${p.id}">${en ? "Switch" : "Attiva"}</button>`}
                ${p.id !== "default" ? `<button class="btn-icon" data-elimina="${p.id}" title="${en ? "Delete" : "Elimina"}" aria-label="${en ? "Delete profile" : "Elimina profilo"}">🗑️</button>` : ""}
              </div>`).join("")}
          </div>
          <form data-nuovo-profilo style="margin-top:1rem">
            <div class="field">
              <label for="profilo-nome">${en ? "New profile name (nickname, not required to be real)" : "Nome nuovo profilo (un soprannome va benissimo)"}</label>
              <input type="text" id="profilo-nome" maxlength="40" placeholder="${en ? "e.g. “Student 3” or a nickname" : "Es. “Alunno 3” o un soprannome"}">
            </div>
            <button class="btn" type="submit">➕ ${en ? "Create profile" : "Crea profilo"}</button>
          </form>
        </div>

        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.4rem">📊 ${en ? "Teacher dashboard" : "Cruscotto insegnante"}</h2>
          <p style="color:var(--text-soft); font-size:.85rem; margin-bottom:.8rem">${en
            ? "Read directly from this browser's local storage — not a live sync. Refresh this page after students use their profiles to update the numbers."
            : "Letto direttamente dalla memoria locale di questo browser — non è una sincronizzazione live. Ricarica questa pagina dopo che gli studenti hanno usato i loro profili per aggiornare i numeri."}</p>
          <div class="table-scroll">
            <table class="score-table">
              <thead><tr>
                <th>${en ? "Profile" : "Profilo"}</th>
                <th>🏋️ ${en ? "Workouts" : "Allenamenti"}</th>
                <th>✅ ${en ? "Tasks" : "Attività"}</th>
                <th>🎮 ${en ? "Games" : "Partite"}</th>
                <th>🔥 ${en ? "Streak" : "Serie"}</th>
              </tr></thead>
              <tbody>
                ${profili.map(p => {
                  const s = DB.readProfileStatsRaw(p.id) || {};
                  return `<tr>
                    <td>${p.emoji} ${App.escapeHTML(p.name)}</td>
                    <td class="score-val">${s.workoutsDone || 0}</td>
                    <td class="score-val">${s.totalTasksDone || 0}</td>
                    <td class="score-val">${s.totalGames || 0}</td>
                    <td class="score-val">${s.visitStreak || 0}</td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;

    main.querySelector("[data-nuovo-profilo]").addEventListener("submit", e => {
      e.preventDefault();
      const input = main.querySelector("#profilo-nome");
      const name = input.value.trim();
      if (!name) { toast(en ? "Give the profile a name first 😊" : "Dai prima un nome al profilo 😊"); return; }
      const emoji = EMOJI_PROFILO[Math.floor(Math.random() * EMOJI_PROFILO.length)];
      DB.createProfile(name, emoji);
      viewClasse();
    });
    main.querySelectorAll("[data-attiva]").forEach(b => b.addEventListener("click", () => {
      DB.switchProfile(b.dataset.attiva);
      applySettings();
      checkBadges();
      toast(en ? "Profile switched 👤" : "Profilo cambiato 👤");
      route();
    }));
    main.querySelectorAll("[data-elimina]").forEach(b => b.addEventListener("click", () => {
      if (!confirm(en ? "Delete this profile and all its progress? This can't be undone." : "Eliminare questo profilo e tutti i suoi progressi? Non si può annullare.")) return;
      DB.deleteProfile(b.dataset.elimina);
      viewClasse();
    }));
  }

  function viewImpostazioni() {
    const st = DB.state.settings;
    const en = lang() === "en";
    main.innerHTML = `
      <div class="view" style="max-width:640px; margin:0 auto">
        <div class="page-head">
          <h1>⚙️ ${en ? "Settings" : "Opzioni"}</h1>
          <p>${en ? "Adapt NeuroSpazio to your senses and preferences. Everything stays saved only on your device." : "Adatta NeuroSpazio ai tuoi sensi e alle tue preferenze. Tutto resta salvato solo sul tuo dispositivo."}</p>
        </div>

        <div class="card" style="margin-bottom:1.2rem">
          <h2 style="font-size:1.1rem; margin-bottom:.4rem">🌐 ${en ? "Language" : "Lingua"}</h2>
          <div class="seg" role="group" aria-label="${en ? "Interface language" : "Lingua dell'interfaccia"}">
            <button data-lang-opt="it" class="${!en ? "active" : ""}">🇮🇹 Italiano</button>
            <button data-lang-opt="en" class="${en ? "active" : ""}">🇬🇧 English</button>
          </div>
          <p style="color:var(--text-soft); font-size:.85rem; margin-top:.6rem">${en
            ? "Navigation, games, tools, and screening tests are translated. Long-form content (guided paths, in-depth resources) is Italian-only for now — you'll see a small notice where that applies."
            : "Navigazione, giochi, strumenti e test di screening sono tradotti in inglese. I contenuti lunghi (percorsi, risorse approfondite) restano solo in italiano — vedrai un piccolo avviso dove succede."}</p>
        </div>
        ${en ? onlyItNoticeHTML() : ""}

        <div class="card" style="margin-bottom:1.2rem">
          <h2 style="font-size:1.1rem; margin-bottom:.4rem">👤 Profilo età</h2>
          <p style="color:var(--text-soft); font-size:.88rem; margin-bottom:.8rem">
            Serve solo a consigliarti i livelli giusti (⭐ nei giochi) e a impostare il filtro per età. Resta sul tuo dispositivo, come tutto il resto.
          </p>
          <div class="seg" role="group" aria-label="Fascia d'età">
            <button data-eta-opt="" class="${!st.eta ? "active" : ""}">Non dico</button>
            <button data-eta-opt="bambini" class="${st.eta === "bambini" ? "active" : ""}">🧒 6–10</button>
            <button data-eta-opt="ragazzi" class="${st.eta === "ragazzi" ? "active" : ""}">🧑 11–17</button>
            <button data-eta-opt="adulti" class="${st.eta === "adulti" ? "active" : ""}">🧑‍💼 18+</button>
          </div>
        </div>

        <div class="card" style="margin-bottom:1.2rem">
          <h2 style="font-size:1.1rem; margin-bottom:.8rem">🎨 Aspetto</h2>
          <div class="field">
            <label>Tema</label>
            <div class="seg" role="group" aria-label="Tema">
              <button data-theme-opt="auto" class="${st.theme === "auto" ? "active" : ""}">🌗 Auto</button>
              <button data-theme-opt="light" class="${st.theme === "light" ? "active" : ""}">☀️ Chiaro</button>
              <button data-theme-opt="dark" class="${st.theme === "dark" ? "active" : ""}">🌙 Scuro</button>
            </div>
          </div>
          <div class="field">
            <label>Dimensione del testo</label>
            <div class="seg" role="group" aria-label="Dimensione del testo">
              <button data-font="0.9" class="${st.fontScale === 0.9 ? "active" : ""}">A</button>
              <button data-font="1" class="${st.fontScale === 1 ? "active" : ""}" style="font-size:1.1em">A</button>
              <button data-font="1.15" class="${st.fontScale === 1.15 ? "active" : ""}" style="font-size:1.25em">A</button>
              <button data-font="1.3" class="${st.fontScale === 1.3 ? "active" : ""}" style="font-size:1.4em">A</button>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:1.2rem">
          <h2 style="font-size:1.1rem">♿ Accessibilità e sensi</h2>
          <div class="switch-row">
            <div><div class="switch-label">Modalità dislessia</div>
            <div class="switch-desc">Font più leggibile, lettere e righe più distanziate</div></div>
            <button class="switch" data-sw="dyslexia" role="switch" aria-checked="${st.dyslexia}" aria-label="Modalità dislessia"></button>
          </div>
          <div class="switch-row">
            <div><div class="switch-label">Riduci le animazioni</div>
            <div class="switch-desc">Meno movimento sullo schermo (niente coriandoli, transizioni istantanee)</div></div>
            <button class="switch" data-sw="reduceMotion" role="switch" aria-checked="${st.reduceMotion}" aria-label="Riduci le animazioni"></button>
          </div>
          <div class="switch-row">
            <div><div class="switch-label">Suoni dell'app</div>
            <div class="switch-desc">Feedback sonori nei giochi e negli strumenti</div></div>
            <button class="switch" data-sw="sounds" role="switch" aria-checked="${st.sounds}" aria-label="Suoni dell'app"></button>
          </div>
          <div class="switch-row">
            <div><div class="switch-label">Notifiche di fine timer</div>
            <div class="switch-desc">Ti avvisa a fine pomodoro o passo di routine anche se stai guardando un'altra scheda</div></div>
            <button class="switch" data-sw-notif role="switch" aria-checked="${st.notifications}" aria-label="Notifiche di fine timer"></button>
          </div>
        </div>

        <div class="card">
          <h2 style="font-size:1.1rem; margin-bottom:.8rem">💾 I tuoi dati</h2>
          <p style="color:var(--text-soft); font-size:.9rem; margin-bottom:.8rem">
            Tutto ciò che fai qui (attività, umore, record…) vive solo nel tuo browser. Puoi salvarne una copia o portarla su un altro dispositivo.
          </p>
          <div class="btn-row">
            <button class="btn btn-soft" data-export>⬇️ Esporta copia</button>
            <button class="btn btn-soft" data-import>⬆️ Importa copia</button>
            <button class="btn btn-warn" data-reset>🗑️ Cancella tutto</button>
          </div>
          <input type="file" data-file accept="application/json" style="display:none" aria-hidden="true">
        </div>

        <div class="card" style="margin-top:1.2rem">
          <h2 style="font-size:1.1rem; margin-bottom:.5rem">🏫 ${en ? "For teachers" : "Per insegnanti"}</h2>
          <p style="color:var(--text-soft); font-size:.9rem; margin-bottom:.8rem">${en
            ? "Sharing one device with a class? Class Mode keeps each student's progress separate, locally."
            : "Condividi un dispositivo con la classe? La Modalità Classe tiene i progressi di ogni studente separati, in locale."}</p>
          <a class="btn btn-soft" href="#/classe">🏫 ${en ? "Open Class Mode" : "Apri Modalità Classe"}</a>
        </div>
      </div>`;

    main.querySelectorAll("[data-eta-opt]").forEach(b => b.addEventListener("click", () => {
      st.eta = b.dataset.etaOpt || null;
      DB.save();
      filtroEta.giochi = st.eta || "tutte";
      filtroEta.strumenti = st.eta || "tutte";
      toast(st.eta ? `Profilo impostato: ${ETA_INFO[st.eta].nome} ${ETA_INFO[st.eta].range} 👤` : "Profilo rimosso");
      viewImpostazioni();
    }));

    main.querySelectorAll("[data-lang-opt]").forEach(b => b.addEventListener("click", () => {
      st.lang = b.dataset.langOpt;
      DB.save(); applySettings(); viewImpostazioni();
    }));
    main.querySelectorAll("[data-theme-opt]").forEach(b => b.addEventListener("click", () => {
      st.theme = b.dataset.themeOpt;
      DB.save(); applySettings(); viewImpostazioni();
    }));
    main.querySelectorAll("[data-font]").forEach(b => b.addEventListener("click", () => {
      st.fontScale = Number(b.dataset.font);
      DB.save(); applySettings(); viewImpostazioni();
    }));
    main.querySelectorAll("[data-sw]").forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.sw;
      st[k] = !st[k];
      DB.save(); applySettings();
      b.setAttribute("aria-checked", st[k]);
    }));

    const swNotif = main.querySelector("[data-sw-notif]");
    swNotif.addEventListener("click", async () => {
      if (!st.notifications) {
        if (!("Notification" in window)) {
          toast("Il tuo browser non supporta le notifiche 😕");
          return;
        }
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          toast("Permesso negato: puoi cambiarlo dalle impostazioni del browser.");
          return;
        }
        st.notifications = true;
        toast("🔔 Notifiche attive: ti avviso a fine timer.");
      } else {
        st.notifications = false;
      }
      DB.save();
      swNotif.setAttribute("aria-checked", st.notifications);
    });

    main.querySelector("[data-export]").addEventListener("click", () => {
      const blob = new Blob([DB.exportJSON()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `neurospazio-backup-${DB.todayKey()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast("Copia dei dati scaricata 💾");
    });

    const fileInput = main.querySelector("[data-file]");
    main.querySelector("[data-import]").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const f = fileInput.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          DB.importJSON(reader.result);
          applySettings();
          toast("Dati importati! Bentornato 💜");
          navigate("/home");
        } catch (e) {
          toast("File non valido 😕 Serve un backup di NeuroSpazio.");
        }
      };
      reader.readAsText(f);
    });

    main.querySelector("[data-reset]").addEventListener("click", () => {
      if (!confirm("Cancellare TUTTI i dati di NeuroSpazio da questo dispositivo? Non si può annullare.")) return;
      DB.reset();
      applySettings();
      toast("Tutto azzerato. Nuovo inizio ✨");
      navigate("/home");
    });
  }

  /* ---------- router ---------- */
  const routes = [
    { re: /^\/?$|^\/home$/, view: viewHome, nav: "home", title: "NeuroSpazio — la palestra della mente per ADHD, autismo, DSA e non solo" },
    { re: /^\/giochi$/, view: viewGiochi, nav: "giochi", title: "Giochi cognitivi con basi scientifiche — NeuroSpazio" },
    { re: /^\/gioco\/([\w-]+)$/, view: viewGioco, nav: "giochi", title: "Gioco — NeuroSpazio" },
    { re: /^\/strumenti$/, view: viewStrumenti, nav: "strumenti", title: "Strumenti per focus, organizzazione e calma — NeuroSpazio" },
    { re: /^\/strumento\/([\w-]+)$/, view: viewStrumento, nav: "strumenti", title: "Strumento — NeuroSpazio" },
    { re: /^\/risorse$/, view: viewRisorse, nav: "risorse", title: "Risorse su ADHD, autismo e DSA con fonti scientifiche — NeuroSpazio" },
    { re: /^\/inizia$/, view: viewInizia, nav: "home", title: "Inizia da qui — NeuroSpazio" },
    { re: /^\/test$/, view: viewTests, nav: "risorse", title: "Test di screening ADHD, autismo e ansia — NeuroSpazio" },
    { re: /^\/test\/([\w-]+)$/, view: viewTest, nav: "risorse", title: "Test di screening — NeuroSpazio" },
    { re: /^\/percorsi$/, view: viewPercorsi, nav: "risorse", title: "Percorsi guidati di 7 giorni — NeuroSpazio" },
    { re: /^\/percorso\/([\w-]+)$/, view: viewPercorso, nav: "risorse", title: "Percorso guidato — NeuroSpazio" },
    { re: /^\/progressi$/, view: viewProgressi, nav: "progressi", title: "I tuoi progressi — NeuroSpazio" },
    { re: /^\/report$/, view: viewReport, nav: "progressi", title: "Report per il professionista — NeuroSpazio" },
    { re: /^\/impostazioni$/, view: viewImpostazioni, nav: "impostazioni", title: "Opzioni — NeuroSpazio" },
    { re: /^\/accessibilita$/, view: viewAccessibilita, nav: "impostazioni", title: "Dichiarazione di accessibilità — NeuroSpazio" },
    { re: /^\/privacy$/, view: viewPrivacy, nav: "impostazioni", title: "Privacy — NeuroSpazio" },
    { re: /^\/classe$/, view: viewClasse, nav: "impostazioni", title: "Modalità Classe — NeuroSpazio" },
    { re: /^\/ricerca$/, view: viewRicerca, nav: "risorse", title: "Per ricercatori — NeuroSpazio" },
    { re: /^\/sostieni$/, view: viewSostieni, nav: "impostazioni", title: "Sostienici — NeuroSpazio" },
    { re: /^\/media$/, view: viewMediaKit, nav: "impostazioni", title: "Media kit — NeuroSpazio" },
  ];

  function navigate(path) { location.hash = "#" + path; }

  function route() {
    runCleanups();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    currentGameId = null; // viewGioco lo reimposta quando serve
    const path = location.hash.slice(1) || "/home";
    const r = routes.find(x => x.re.test(path));
    if (!r) return navigate("/home");
    document.title = r.title || "NeuroSpazio";
    const m = path.match(r.re);
    document.querySelectorAll(".mainnav a").forEach(a =>
      a.classList.toggle("active", a.dataset.nav === r.nav));
    r.view(m[1]);
    window.scrollTo({ top: 0 });
  }

  window.addEventListener("hashchange", route);

  /* ---------- avvio ---------- */
  function init() {
    applySettings();
    DB.touchVisit();
    checkBadges();
    route();
    const toggle = document.getElementById("lang-toggle");
    if (toggle) toggle.addEventListener("click", () => {
      DB.state.settings.lang = lang() === "it" ? "en" : "it";
      DB.save();
      applySettings();
      route();
    });
    // PWA: installabile e utilizzabile offline (solo su http/https, non nel bundle standalone)
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => { /* facoltativo */ });
    }
    const s = DB.state.stats;
    if (s.visitStreak > 1) {
      setTimeout(() => toast(`🔥 ${s.visitStreak} giorni di fila! Bello rivederti.`), 800);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    addCleanup, beep, audioCtx, toast, confetti, escapeHTML,
    checkBadges, recordGamePlayed, habitStreak, navigate,
    earn, notify, speak,
  };
})();
