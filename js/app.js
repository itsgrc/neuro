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
  }

  function recordGamePlayed() {
    DB.state.stats.totalGames++;
    DB.logEvento("gioco");
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
          <a class="quick-btn" href="#/percorsi"><span class="q-emoji">🎓</span>Un passo al giorno</a>
          <a class="quick-btn" href="#/strumento/sos"><span class="q-emoji">🆘</span>Carta SOS</a>
        </div>

        <div class="today-summary">
          <div class="stat-box"><div class="stat-num">${oggiTasks}</div><div class="stat-label">attività per oggi</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalPomodoros}</div><div class="stat-label">sessioni di focus</div></div>
          <div class="stat-box"><div class="stat-num">${s.totalGames}</div><div class="stat-label">partite giocate</div></div>
          <div class="stat-box"><div class="stat-num">${DB.state.badges.length}/${BADGES.length}</div><div class="stat-label">badge sbloccati</div></div>
        </div>

        <div class="home-section-title"><h2>🎓 Percorsi guidati</h2><a href="#/percorsi">Tutti i percorsi →</a></div>
        <div class="grid grid-3">
          ${PERCORSI.map(p => {
            const fatti = (DB.state.percorsi[p.id] || []).length;
            return `<a class="tile" href="#/percorso/${p.id}">
              <span class="tile-emoji" aria-hidden="true">${p.emoji}</span>
              <h3>${p.nome}</h3>
              <p>${p.desc}</p>
              <div class="percorso-progress"><div style="width:${(fatti / 7) * 100}%"></div></div>
              <span class="tile-tag">${fatti}/7 giorni</span>
            </a>`;
          }).join("")}
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
          <div class="btn-row" style="margin-top:.6rem">
            <a class="btn btn-soft" href="#/report">🖨️ Report per il professionista</a>
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

  /* ---------- percorsi guidati ---------- */
  function viewPercorsi() {
    main.innerHTML = `
      <div class="view">
        <div class="page-head">
          <h1>🎓 Percorsi guidati</h1>
          <p>Sette giorni, un passo al giorno: una micro-lezione basata sulla ricerca (fonte inclusa) e un'azione concreta da fare subito. Niente maratone: la dose è pensata per cervelli veri.</p>
        </div>
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
    { re: /^\/?$|^\/home$/, view: viewHome, nav: "home" },
    { re: /^\/giochi$/, view: viewGiochi, nav: "giochi" },
    { re: /^\/gioco\/([\w-]+)$/, view: viewGioco, nav: "giochi" },
    { re: /^\/strumenti$/, view: viewStrumenti, nav: "strumenti" },
    { re: /^\/strumento\/([\w-]+)$/, view: viewStrumento, nav: "strumenti" },
    { re: /^\/risorse$/, view: viewRisorse, nav: "risorse" },
    { re: /^\/percorsi$/, view: viewPercorsi, nav: "risorse" },
    { re: /^\/percorso\/([\w-]+)$/, view: viewPercorso, nav: "risorse" },
    { re: /^\/progressi$/, view: viewProgressi, nav: "progressi" },
    { re: /^\/report$/, view: viewReport, nav: "progressi" },
    { re: /^\/impostazioni$/, view: viewImpostazioni, nav: "impostazioni" },
  ];

  function navigate(path) { location.hash = "#" + path; }

  function route() {
    runCleanups();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
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
