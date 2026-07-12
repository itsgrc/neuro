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
  }

  function recordGamePlayed() {
    DB.state.stats.totalGames++;
    DB.save();
    checkBadges();
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
  }
  mediaScuro.addEventListener("change", applySettings);

  /* ---------- viste ---------- */
  const main = document.getElementById("main");

  /* filtri per neurodivergenza nelle pagine Giochi e Strumenti */
  const filtroND = { giochi: "tutte", strumenti: "tutte" };

  function ndChipsHTML(id) {
    const sch = typeof SCHEDE_SCIENZA !== "undefined" && SCHEDE_SCIENZA[id];
    if (!sch) return "";
    return `<div class="nd-chips">${sch.nd.map(k => {
      const n = ND_INFO[k];
      return `<span class="nd-chip ${n.classe}">${n.emoji} ${n.nome}</span>`;
    }).join("")}</div>`;
  }

  function scienceBoxHTML(id) {
    const sch = typeof SCHEDE_SCIENZA !== "undefined" && SCHEDE_SCIENZA[id];
    if (!sch) return "";
    const fonti = sch.fonti.map(fid => FONTI.find(f => f.id === fid)).filter(Boolean);
    return `
      <div class="science-box">
        ${ndChipsHTML(id)}
        <details>
          <summary>🔬 Per chi è pensato e perché funziona</summary>
          <p class="science-body">${sch.perche}</p>
          <ul class="fonti-mini">${fonti.map(f => `<li>${f.testo}</li>`).join("")}</ul>
          <a href="#/risorse" style="font-size:.85rem; font-weight:700">📚 Tutta la bibliografia →</a>
        </details>
      </div>`;
  }

  function filterRowHTML(attivo) {
    const opzioni = [["tutte", "✨ Per tutti"],
      ...Object.entries(ND_INFO).map(([k, n]) => [k, `${n.emoji} ${n.nome}`])];
    return `
      <div class="nd-filter-row" role="group" aria-label="Filtra per neurodivergenza">
        ${opzioni.map(([k, label]) =>
          `<button class="nd-filter ${attivo === k ? "active" : ""}" data-filter="${k}" aria-pressed="${attivo === k}">${label}</button>`).join("")}
      </div>`;
  }

  function filtra(items, f) {
    if (f === "tutte") return items;
    return items.filter(x => (SCHEDE_SCIENZA[x.id]?.nd || []).includes(f));
  }

  function tileHTML(item, tipo) {
    return `
      <a class="tile" href="#/${tipo}/${item.id}">
        <span class="tile-emoji" aria-hidden="true">${item.emoji}</span>
        <h3>${item.nome}</h3>
        <p>${item.desc}</p>
        <span class="tile-tag tag-${item.tag}">${item.tag}</span>
        ${ndChipsHTML(item.id)}
      </a>`;
  }

  function viewHome() {
    const ora = new Date().getHours();
    const saluto = ora < 6 ? "Notte fonda, eh?" : ora < 13 ? "Buongiorno" : ora < 18 ? "Buon pomeriggio" : "Buonasera";
    const s = DB.state.stats;
    const oggiTasks = DB.state.tasks.filter(t => t.col === "oggi").length;
    const tip = CONSIGLI_DEL_GIORNO[Math.floor((Date.now() / 86400000)) % CONSIGLI_DEL_GIORNO.length];

    main.innerHTML = `
      <div class="view">
        <section class="hero">
          <h1>${saluto}! 👋</h1>
          <p>Questo è il tuo spazio: giochi per allenare la mente, strumenti per le giornate storte e quelle buone. Senza giudizi, al tuo ritmo.</p>
          <div class="streak-pill">🔥 ${s.visitStreak} ${s.visitStreak === 1 ? "giorno" : "giorni"} di fila qui</div>
        </section>

        <div class="tip-card" style="margin-bottom:1.4rem">
          <span class="tip-emoji" aria-hidden="true">💡</span>
          <div><strong>Consiglio del giorno</strong><br>${tip}</div>
        </div>

        <h2 style="font-size:1.15rem; margin-bottom:.6rem">Di cosa hai bisogno adesso?</h2>
        <div class="quick-row">
          <a class="quick-btn" href="#/strumento/pomodoro"><span class="q-emoji">🍅</span>Devo concentrarmi</a>
          <a class="quick-btn" href="#/strumento/grounding"><span class="q-emoji">🆘</span>È tutto troppo</a>
          <a class="quick-btn" href="#/strumento/attivita"><span class="q-emoji">✅</span>Organizzarmi</a>
          <a class="quick-btn" href="#/strumento/dump"><span class="q-emoji">🧺</span>Testa piena</a>
          <a class="quick-btn" href="#/strumento/respiro"><span class="q-emoji">🫁</span>Calmarmi</a>
          <a class="quick-btn" href="#/giochi"><span class="q-emoji">🎮</span>Giocare un po'</a>
        </div>

        <div class="today-summary">
          <div class="stat-box"><div class="stat-num">${oggiTasks}</div><div class="stat-label">attività per oggi</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalPomodoros}</div><div class="stat-label">sessioni di focus</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalGames}</div><div class="stat-label">partite giocate</div></div>
          <div class="stat-box"><div class="stat-num">${DB.state.badges.length}/${BADGES.length}</div><div class="stat-label">badge sbloccati</div></div>
        </div>

        <div class="home-section-title"><h2>🎮 Allena la mente</h2><a href="#/giochi">Tutti i giochi →</a></div>
        <div class="grid grid-3">${GAMES.slice(0, 3).map(g => tileHTML(g, "gioco")).join("")}</div>

        <div class="home-section-title"><h2>🧰 Strumenti del giorno</h2><a href="#/strumenti">Tutti gli strumenti →</a></div>
        <div class="grid grid-3">${[TOOLS[0], TOOLS[4], TOOLS[8]].map(t => tileHTML(t, "strumento")).join("")}</div>
      </div>`;
  }

  function viewGiochi() {
    const f = filtroND.giochi;
    const items = filtra(GAMES, f);
    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🎮 Giochi</h1>
          <p>Partite brevi che allenano attenzione, memoria e autocontrollo. Le etichette dicono per quali neurodivergenze ogni gioco è più indicato — e in ogni gioco trovi il perché, con le fonti scientifiche.</p>
        </div>
        ${filterRowHTML(f)}
        <div class="grid grid-3">${items.map(g => tileHTML(g, "gioco")).join("")}</div>
        ${items.length === 0 ? `<p class="task-empty">Nessun gioco con questa etichetta (per ora!).</p>` : ""}
      </div>`;
    main.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => {
      filtroND.giochi = b.dataset.filter;
      viewGiochi();
    }));
  }

  function viewGioco(id) {
    const g = GAMES.find(x => x.id === id);
    if (!g) return navigate("/giochi");
    main.innerHTML = `
      <div class="view game-shell">
        <a class="back-link" href="#/giochi">← Tutti i giochi</a>
        <div class="page-head"><h1>${g.emoji} ${g.nome}</h1></div>
        ${scienceBoxHTML(g.id)}
        <div data-game></div>
      </div>`;
    g.render(main.querySelector("[data-game]"));
  }

  function viewStrumenti() {
    const f = filtroND.strumenti;
    const items = filtra(TOOLS, f);
    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🧰 Strumenti</h1>
          <p>Aiuti concreti per le sfide di ogni giorno: concentrarsi, organizzarsi, calmarsi. Filtra per neurodivergenza, e in ogni strumento scopri perché funziona, con le fonti.</p>
        </div>
        ${filterRowHTML(f)}
        <div class="grid grid-3">${items.map(t => tileHTML(t, "strumento")).join("")}</div>
        ${items.length === 0 ? `<p class="task-empty">Nessuno strumento con questa etichetta (per ora!).</p>` : ""}
      </div>`;
    main.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => {
      filtroND.strumenti = b.dataset.filter;
      viewStrumenti();
    }));
  }

  function viewStrumento(id) {
    const t = TOOLS.find(x => x.id === id);
    if (!t) return navigate("/strumenti");
    main.innerHTML = `
      <div class="view game-shell" style="max-width:820px">
        <a class="back-link" href="#/strumenti">← Tutti gli strumenti</a>
        <div class="page-head"><h1>${t.emoji} ${t.nome}</h1></div>
        ${scienceBoxHTML(t.id)}
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
              <h3><span aria-hidden="true">${c.emoji}</span> ${c.nome}</h3>
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
        </div>

        <div class="today-summary" style="margin-bottom:1.6rem">
          <div class="stat-box"><div class="stat-num">🔥 ${s.visitStreak}</div><div class="stat-label">giorni di fila</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalGames}</div><div class="stat-label">partite giocate</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalPomodoros}</div><div class="stat-label">sessioni di focus</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalTasksDone}</div><div class="stat-label">attività completate</div></div>
          <div class="stat-box"><div class="stat-num">${s.breathSessions + s.groundingSessions}</div><div class="stat-label">momenti di calma</div></div>
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
  }

  function viewImpostazioni() {
    const st = DB.state.settings;
    main.innerHTML = `
      <div class="view" style="max-width:640px; margin:0 auto">
        <div class="page-head">
          <h1>⚙️ Opzioni</h1>
          <p>Adatta NeuroSpazio ai tuoi sensi e alle tue preferenze. Tutto resta salvato solo sul tuo dispositivo.</p>
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
      </div>`;

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
    { re: /^\/?$|^\/home$/, view: viewHome, nav: "home" },
    { re: /^\/giochi$/, view: viewGiochi, nav: "giochi" },
    { re: /^\/gioco\/([\w-]+)$/, view: viewGioco, nav: "giochi" },
    { re: /^\/strumenti$/, view: viewStrumenti, nav: "strumenti" },
    { re: /^\/strumento\/([\w-]+)$/, view: viewStrumento, nav: "strumenti" },
    { re: /^\/risorse$/, view: viewRisorse, nav: "risorse" },
    { re: /^\/progressi$/, view: viewProgressi, nav: "progressi" },
    { re: /^\/impostazioni$/, view: viewImpostazioni, nav: "impostazioni" },
  ];

  function navigate(path) { location.hash = "#" + path; }

  function route() {
    runCleanups();
    document.title = "NeuroSpazio";
    const path = location.hash.slice(1) || "/home";
    const r = routes.find(x => x.re.test(path));
    if (!r) return navigate("/home");
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
  };
})();
