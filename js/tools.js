/* ============================================================
   NeuroSpazio — tools.js
   Strumenti quotidiani: focus, organizzazione, calma.
   ============================================================ */

const TOOLS = [
  { id: "pomodoro",  emoji: "🍅", nome: "Timer di focus",     tag: "focus",          desc: "Sessioni di lavoro a tempo con pause: il tempo diventa visibile.", render: renderPomodoro },
  { id: "attivita",  emoji: "✅", nome: "Le mie attività",     tag: "organizzazione", desc: "Massimo 3 cose per oggi. Il resto aspetta, senza sensi di colpa.", render: renderAttivita },
  { id: "dump",      emoji: "🧺", nome: "Svuota la mente",     tag: "organizzazione", desc: "Butta fuori i pensieri che girano in testa. Poi decidi con calma.", render: renderDump },
  { id: "abitudini", emoji: "🔁", nome: "Abitudini",           tag: "organizzazione", desc: "Piccole abitudini, tracciate giorno per giorno. Le serie motivano!", render: renderAbitudini },
  { id: "umore",     emoji: "🌤️", nome: "Come sto oggi",      tag: "calma",          desc: "Registra il tuo umore in 5 secondi e scopri i tuoi schemi.", render: renderUmore },
  { id: "routine",   emoji: "🧭", nome: "Routine guidate",     tag: "organizzazione", desc: "Crea routine passo-passo e falle partire col pilota automatico.", render: renderRoutine },
  { id: "decisioni", emoji: "🎡", nome: "Decidi per me",       tag: "focus",          desc: "Paralisi decisionale? Lascia scegliere alla ruota (o alla moneta).", render: renderDecisioni },
  { id: "suoni",     emoji: "🎧", nome: "Suoni per il focus",  tag: "focus",          desc: "Rumore bianco, rosa e marrone per coprire le distrazioni.", render: renderSuoni },
  { id: "respiro",   emoji: "🫁", nome: "Respira con me",      tag: "calma",          desc: "Respirazione guidata e animata per calmare corpo e mente.", render: renderRespiro },
  { id: "grounding", emoji: "🌍", nome: "SOS sovraccarico",    tag: "calma",          desc: "L'esercizio 5-4-3-2-1 per tornare al presente quando è troppo.", render: renderGrounding },
];

/* ============================================================
   TIMER DI FOCUS (Pomodoro)
   ============================================================ */
function renderPomodoro(container) {
  const CIRC = 2 * Math.PI * 90; // circonferenza dell'anello SVG
  const cfg = DB.state.pomodoro;
  let fase = "lavoro";           // "lavoro" | "pausa"
  let totale = cfg.work * 60;
  let resta = totale;
  let attivo = false;
  let fatteOggi = 0;
  let interval = null;
  App.addCleanup(() => { clearInterval(interval); document.title = "NeuroSpazio"; });

  container.innerHTML = `
    <div class="card pomo-wrap">
      <div class="seg" role="group" aria-label="Preimpostazioni durata">
        <button data-preset="25-5" class="${cfg.work === 25 ? "active" : ""}">Classico 25/5</button>
        <button data-preset="15-3" class="${cfg.work === 15 ? "active" : ""}">Gentile 15/3</button>
        <button data-preset="45-10" class="${cfg.work === 45 ? "active" : ""}">Profondo 45/10</button>
      </div>
      <div class="pomo-ring-box">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle class="pomo-ring-bg" cx="100" cy="100" r="90"></circle>
          <circle class="pomo-ring-fg" data-ring cx="100" cy="100" r="90"
            stroke-dasharray="${CIRC}" stroke-dashoffset="0"></circle>
        </svg>
        <div class="pomo-center">
          <div class="pomo-phase" data-fase>Focus</div>
          <div class="pomo-time" data-time></div>
        </div>
      </div>
      <div class="pomo-dots" data-dots aria-label="Sessioni completate oggi"></div>
      <div class="btn-row" style="justify-content:center; margin-top:1.2rem">
        <button class="btn btn-big" data-play>▶️ Inizia</button>
        <button class="btn btn-ghost" data-skip>⏭️ Salta fase</button>
        <button class="btn btn-ghost" data-reset>🔄 Azzera</button>
      </div>
      <p class="focus-limit-note">💡 Durante il focus: una sola cosa. Le distrazioni le annoti in <a href="#/strumento/dump">Svuota la mente</a> e le guardi dopo.</p>
    </div>`;

  const elRing = container.querySelector("[data-ring]");
  const elTime = container.querySelector("[data-time]");
  const elFase = container.querySelector("[data-fase]");
  const elDots = container.querySelector("[data-dots]");
  const btnPlay = container.querySelector("[data-play]");

  function disegnaDots() {
    elDots.innerHTML = "";
    for (let i = 0; i < cfg.goal; i++) {
      const d = document.createElement("span");
      d.className = "pomo-dot" + (i < fatteOggi ? " done" : "");
      elDots.appendChild(d);
    }
  }

  function aggiorna() {
    const m = Math.floor(resta / 60), s = resta % 60;
    const txt = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    elTime.textContent = txt;
    elRing.style.strokeDashoffset = CIRC * (1 - resta / totale);
    elRing.classList.toggle("pausa", fase === "pausa");
    elFase.textContent = fase === "lavoro" ? "Focus" : "Pausa";
    document.title = attivo ? `${txt} · ${fase === "lavoro" ? "Focus" : "Pausa"} — NeuroSpazio` : "NeuroSpazio";
  }

  function impostaFase(nuova) {
    fase = nuova;
    totale = (fase === "lavoro" ? cfg.work : cfg.pause) * 60;
    resta = totale;
    aggiorna();
  }

  function fineFase() {
    App.beep(660, 0.15); setTimeout(() => App.beep(880, 0.25), 180);
    if (fase === "lavoro") {
      fatteOggi++;
      DB.state.stats.totalPomodoros++;
      DB.save();
      App.checkBadges();
      App.confetti();
      App.toast("🍅 Sessione di focus completata! Ora pausa vera: alzati e muoviti.");
      disegnaDots();
      impostaFase("pausa");
    } else {
      App.toast("🔔 Pausa finita. Pronto per un'altra sessione?");
      impostaFase("lavoro");
      pausa(); // la nuova sessione parte solo quando lo decidi tu
    }
  }

  function tick() {
    resta--;
    if (resta <= 0) { resta = 0; aggiorna(); fineFase(); return; }
    aggiorna();
  }

  function via() {
    attivo = true;
    btnPlay.innerHTML = "⏸️ Pausa";
    clearInterval(interval);
    interval = setInterval(tick, 1000);
  }
  function pausa() {
    attivo = false;
    btnPlay.innerHTML = "▶️ Inizia";
    clearInterval(interval);
    aggiorna();
  }

  btnPlay.addEventListener("click", () => (attivo ? pausa() : via()));
  container.querySelector("[data-skip]").addEventListener("click", () => { pausa(); fineFase(); });
  container.querySelector("[data-reset]").addEventListener("click", () => { pausa(); impostaFase(fase); });

  container.querySelectorAll("[data-preset]").forEach(b => {
    b.addEventListener("click", () => {
      const [w, p] = b.dataset.preset.split("-").map(Number);
      cfg.work = w; cfg.pause = p; DB.save();
      container.querySelectorAll("[data-preset]").forEach(x => x.classList.toggle("active", x === b));
      pausa();
      impostaFase("lavoro");
    });
  });

  disegnaDots();
  impostaFase("lavoro");
}

/* ============================================================
   LE MIE ATTIVITÀ
   ============================================================ */
function renderAttivita(container) {
  const COLONNE = [
    { id: "oggi", emoji: "🎯", nome: "Oggi (max 3)" },
    { id: "dopo", emoji: "🗂️", nome: "Dopo" },
    { id: "fatto", emoji: "🎉", nome: "Fatto" },
  ];

  function draw() {
    const tasks = DB.state.tasks;
    container.innerHTML = `
      <form class="task-input-row" data-form>
        <input type="text" data-input placeholder="Cosa c'è da fare? Scrivilo in piccolo…" maxlength="140" aria-label="Nuova attività">
        <button class="btn" type="submit">➕ Aggiungi</button>
      </form>
      <p class="focus-limit-note" style="margin:-0.4rem 0 1rem">💡 Trucco ADHD: spezzetta! Non “pulire casa” ma “portare i piatti in cucina”.</p>
      <div class="task-cols">
        ${COLONNE.map(c => {
          const items = tasks.filter(t => t.col === c.id);
          return `
          <section class="task-col" aria-label="${c.nome}">
            <h3>${c.emoji} ${c.nome} <span class="col-count">${items.length}</span></h3>
            <div data-col="${c.id}">
              ${items.length === 0 ? `<p class="task-empty">${c.id === "fatto" ? "I successi appariranno qui ✨" : "Niente qui, respira 😌"}</p>` : ""}
              ${items.map(t => taskHTML(t, c.id)).join("")}
            </div>
            ${c.id === "fatto" && items.length > 0 ? `<button class="btn btn-ghost" data-clear style="width:100%">🧹 Svuota i fatti</button>` : ""}
          </section>`;
        }).join("")}
      </div>`;

    container.querySelector("[data-form]").addEventListener("submit", e => {
      e.preventDefault();
      const input = container.querySelector("[data-input]");
      const text = input.value.trim();
      if (!text) return;
      const inOggi = DB.state.tasks.filter(t => t.col === "oggi").length;
      DB.state.tasks.unshift({ id: DB.uid(), text, col: inOggi < 3 ? "oggi" : "dopo", createdAt: Date.now() });
      DB.save();
      if (inOggi >= 3) App.toast("Oggi è pieno (3 su 3): l'ho messa in “Dopo” 📦");
      draw();
    });

    container.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = DB.state.tasks.find(x => x.id === btn.dataset.id);
        if (!t) return;
        const act = btn.dataset.act;
        if (act === "done") {
          t.col = "fatto";
          DB.state.stats.totalTasksDone++;
          DB.save();
          App.checkBadges();
          App.confetti(40);
          App.toast("Fatto! Una in meno 🎉");
        } else if (act === "su") {
          if (DB.state.tasks.filter(x => x.col === "oggi").length >= 3) {
            App.toast("“Oggi” è già pieno: massimo 3, è la regola d'oro ✋");
            return;
          }
          t.col = "oggi";
        } else if (act === "giu") {
          t.col = "dopo";
        } else if (act === "del") {
          DB.state.tasks = DB.state.tasks.filter(x => x.id !== t.id);
        }
        DB.save();
        draw();
      });
    });

    const clearBtn = container.querySelector("[data-clear]");
    if (clearBtn) clearBtn.addEventListener("click", () => {
      DB.state.tasks = DB.state.tasks.filter(t => t.col !== "fatto");
      DB.save();
      draw();
    });
  }

  function taskHTML(t, col) {
    const esc = App.escapeHTML(t.text);
    const actions =
      col === "fatto"
        ? `<button data-act="giu" data-id="${t.id}" title="Riporta in Dopo" aria-label="Riporta in Dopo">↩️</button>
           <button data-act="del" data-id="${t.id}" title="Elimina" aria-label="Elimina">🗑️</button>`
        : `<button data-act="done" data-id="${t.id}" title="Completata!" aria-label="Segna come fatta">✔️</button>
           ${col === "dopo"
             ? `<button data-act="su" data-id="${t.id}" title="Sposta in Oggi" aria-label="Sposta in Oggi">⬆️</button>`
             : `<button data-act="giu" data-id="${t.id}" title="Sposta in Dopo" aria-label="Sposta in Dopo">⬇️</button>`}
           <button data-act="del" data-id="${t.id}" title="Elimina" aria-label="Elimina">🗑️</button>`;
    return `
      <div class="task-item ${col === "fatto" ? "done" : ""}">
        <div class="task-text">${esc}</div>
        <div class="task-actions">${actions}</div>
      </div>`;
  }

  draw();
}

/* ============================================================
   SVUOTA LA MENTE
   ============================================================ */
function renderDump(container) {
  function draw() {
    const note = DB.state.dump;
    container.innerHTML = `
      <div class="card" style="margin-bottom:1rem">
        <p style="margin-bottom:.8rem">Quel pensiero che gira in testa? Scaricalo qui. Non deve essere ordinato, deve solo <strong>uscire</strong>. 🧺</p>
        <form data-form>
          <div class="field">
            <textarea data-input rows="3" maxlength="500" placeholder="Es. “ricordati la bolletta”, “idea per il regalo”, “sono in ansia per giovedì”…" aria-label="Nuovo pensiero"></textarea>
          </div>
          <button class="btn" type="submit">🧺 Scarica il pensiero</button>
        </form>
      </div>
      <div data-list>
        ${note.length === 0 ? `<p class="task-empty">La mente svuotata apparirà qui. Per ora: testa leggera! ☁️</p>` : ""}
        ${note.map(n => `
          <div class="dump-note">
            <div class="dump-text">${App.escapeHTML(n.text)}
              <span class="dump-date">${new Date(n.at).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <button data-task="${n.id}" title="Trasforma in attività" aria-label="Trasforma in attività">📋</button>
            <button data-del="${n.id}" title="Lascia andare" aria-label="Elimina">🕊️</button>
          </div>`).join("")}
      </div>`;

    container.querySelector("[data-form]").addEventListener("submit", e => {
      e.preventDefault();
      const input = container.querySelector("[data-input]");
      const text = input.value.trim();
      if (!text) return;
      DB.state.dump.unshift({ id: DB.uid(), text, at: Date.now() });
      DB.save();
      App.toast("Fuori dalla testa, al sicuro qui 🧺");
      draw();
    });

    container.querySelectorAll("[data-task]").forEach(b => b.addEventListener("click", () => {
      const n = DB.state.dump.find(x => x.id === b.dataset.task);
      if (!n) return;
      DB.state.tasks.unshift({ id: DB.uid(), text: n.text.slice(0, 140), col: "dopo", createdAt: Date.now() });
      DB.state.dump = DB.state.dump.filter(x => x.id !== n.id);
      DB.save();
      App.toast("Trasformata in attività (in “Dopo”) 📋");
      draw();
    }));

    container.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
      DB.state.dump = DB.state.dump.filter(x => x.id !== b.dataset.del);
      DB.save();
      draw();
    }));
  }

  draw();
}

/* ============================================================
   ABITUDINI
   ============================================================ */
function renderAbitudini(container) {
  const GIORNI = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];

  function streakDi(h) {
    let s = 0;
    for (let i = 0; ; i++) {
      const k = DB.todayKey(-i);
      if (h.days[k]) s++;
      else if (i === 0) continue; // oggi non ancora fatto non spezza la serie
      else break;
    }
    return s;
  }

  function draw() {
    const habits = DB.state.habits;
    container.innerHTML = `
      <div class="card" style="margin-bottom:1rem">
        <form class="task-input-row" style="margin-bottom:0" data-form>
          <input type="text" data-input maxlength="60" placeholder="Nuova abitudine (piccola! es. “bere un bicchiere d'acqua”)" aria-label="Nuova abitudine">
          <button class="btn" type="submit">➕</button>
        </form>
      </div>
      <div class="card">
        ${habits.length === 0 ? `<p class="task-empty">Aggiungi la tua prima micro-abitudine. Più è piccola, più funziona 🌱</p>` : ""}
        ${habits.map(h => {
          const st = streakDi(h);
          return `
          <div class="habit-row">
            <div class="habit-name">${App.escapeHTML(h.name)}
              ${st >= 2 ? `<div class="habit-streak">🔥 ${st} giorni di fila</div>` : ""}
            </div>
            <div class="habit-days">
              ${Array.from({ length: 7 }, (_, i) => {
                const off = -(6 - i);
                const key = DB.todayKey(off);
                const d = new Date(); d.setDate(d.getDate() + off);
                const oggi = off === 0;
                return `<button class="habit-day ${h.days[key] ? "hit" : ""} ${oggi ? "today" : ""}"
                  data-hab="${h.id}" data-day="${key}" ${oggi ? "" : "disabled"}
                  aria-label="${GIORNI[d.getDay()]} ${d.getDate()}${oggi ? ", tocca per segnare oggi" : ""}">
                  <span>${GIORNI[d.getDay()]}</span><span>${d.getDate()}</span>
                </button>`;
              }).join("")}
            </div>
            <button class="btn-icon" data-delhab="${h.id}" title="Elimina abitudine" aria-label="Elimina abitudine">🗑️</button>
          </div>`;
        }).join("")}
      </div>`;

    container.querySelector("[data-form]").addEventListener("submit", e => {
      e.preventDefault();
      const input = container.querySelector("[data-input]");
      const name = input.value.trim();
      if (!name) return;
      DB.state.habits.push({ id: DB.uid(), name, days: {} });
      DB.save();
      draw();
    });

    container.querySelectorAll("[data-hab]:not([disabled])").forEach(b => b.addEventListener("click", () => {
      const h = DB.state.habits.find(x => x.id === b.dataset.hab);
      if (!h) return;
      const k = b.dataset.day;
      if (h.days[k]) delete h.days[k];
      else {
        h.days[k] = true;
        App.beep(700, 0.08);
        const st = streakDi(h);
        if (st >= 2) App.toast(`🔥 ${st} giorni di fila con “${h.name}”!`);
        else App.toast("Segnato! Un mattoncino alla volta 🧱");
      }
      DB.save();
      App.checkBadges();
      draw();
    }));

    container.querySelectorAll("[data-delhab]").forEach(b => b.addEventListener("click", () => {
      if (!confirm("Eliminare questa abitudine e la sua storia?")) return;
      DB.state.habits = DB.state.habits.filter(x => x.id !== b.dataset.delhab);
      DB.save();
      draw();
    }));
  }

  // esposta per il calcolo dei badge
  renderAbitudini.streakDi = streakDi;
  draw();
}

/* ============================================================
   COME STO OGGI (umore)
   ============================================================ */
function renderUmore(container) {
  const FACCE = [
    { v: 1, e: "😖", label: "Molto giù" },
    { v: 2, e: "😕", label: "Così così" },
    { v: 3, e: "😐", label: "Neutro" },
    { v: 4, e: "🙂", label: "Bene" },
    { v: 5, e: "😄", label: "Alla grande" },
  ];

  function draw() {
    const oggi = DB.todayKey();
    const corrente = DB.state.moods[oggi];
    container.innerHTML = `
      <div class="card" style="text-align:center; margin-bottom:1rem">
        <h2 style="margin-bottom:.4rem">Come ti senti adesso?</h2>
        <p style="color:var(--text-soft)">Nessuna risposta è sbagliata. Serve solo a conoscerti meglio.</p>
        <div class="mood-faces">
          ${FACCE.map(f => `
            <button class="mood-face ${corrente?.value === f.v ? "selected" : ""}"
              data-mood="${f.v}" title="${f.label}" aria-label="${f.label}"
              aria-pressed="${corrente?.value === f.v}">${f.e}</button>`).join("")}
        </div>
        <div class="field" style="max-width:420px; margin:0 auto">
          <input type="text" data-note maxlength="100" placeholder="Una parola sul perché (facoltativo)"
            value="${corrente?.note ? App.escapeHTML(corrente.note) : ""}" aria-label="Nota sull'umore">
        </div>
        <button class="btn" data-save ${corrente ? "" : "disabled"}>💾 Salva la nota</button>
      </div>
      <div class="card">
        <h3 style="margin-bottom:.4rem">Gli ultimi 14 giorni</h3>
        <div class="mood-history">
          ${Array.from({ length: 14 }, (_, i) => {
            const off = -(13 - i);
            const k = DB.todayKey(off);
            const m = DB.state.moods[k];
            const d = new Date(); d.setDate(d.getDate() + off);
            return `<div class="mood-hist-day" title="${m?.note ? App.escapeHTML(m.note) : ""}">
              <div class="mh-emoji">${m ? FACCE.find(f => f.v === m.value).e : "·"}</div>
              <div class="mh-date">${d.getDate()}/${d.getMonth() + 1}</div>
            </div>`;
          }).join("")}
        </div>
      </div>`;

    container.querySelectorAll("[data-mood]").forEach(b => b.addEventListener("click", () => {
      const v = Number(b.dataset.mood);
      const nota = container.querySelector("[data-note]").value.trim();
      DB.state.moods[oggi] = { value: v, note: nota };
      DB.save();
      App.checkBadges();
      App.toast("Umore registrato 🌤️ Grazie di esserti ascoltato.");
      draw();
    }));

    container.querySelector("[data-save]").addEventListener("click", () => {
      if (!DB.state.moods[oggi]) return;
      DB.state.moods[oggi].note = container.querySelector("[data-note]").value.trim();
      DB.save();
      App.toast("Nota salvata 📝");
    });
  }

  draw();
}

/* ============================================================
   ROUTINE GUIDATE
   ============================================================ */
function renderRoutine(container) {
  function lista() {
    const rs = DB.state.routines;
    container.innerHTML = `
      <div class="btn-row" style="margin-bottom:1rem">
        <button class="btn" data-new>➕ Nuova routine</button>
      </div>
      <div class="grid grid-2">
        ${rs.length === 0 ? `<div class="card"><p class="task-empty">Crea la tua prima routine: ad esempio “Mattina” con 4-5 passi brevi. Poi premi ▶️ e lasciati guidare, un passo alla volta. 🧭</p></div>` : ""}
        ${rs.map(r => `
          <div class="card">
            <h3 style="margin-bottom:.3rem">🧭 ${App.escapeHTML(r.name)}</h3>
            <p style="color:var(--text-soft); font-size:.9rem; margin-bottom:.8rem">
              ${r.steps.length} passi · ${r.steps.reduce((a, s) => a + s.minutes, 0)} minuti totali
            </p>
            <div class="btn-row">
              <button class="btn btn-accent" data-play="${r.id}">▶️ Avvia</button>
              <button class="btn btn-ghost" data-edit="${r.id}">✏️ Modifica</button>
              <button class="btn-icon" data-del="${r.id}" title="Elimina" aria-label="Elimina routine">🗑️</button>
            </div>
          </div>`).join("")}
      </div>`;

    container.querySelector("[data-new]").addEventListener("click", () => editor());
    container.querySelectorAll("[data-play]").forEach(b => b.addEventListener("click", () =>
      player(DB.state.routines.find(r => r.id === b.dataset.play))));
    container.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () =>
      editor(DB.state.routines.find(r => r.id === b.dataset.edit))));
    container.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
      if (!confirm("Eliminare questa routine?")) return;
      DB.state.routines = DB.state.routines.filter(r => r.id !== b.dataset.del);
      DB.save();
      lista();
    }));
  }

  function editor(r) {
    const steps = r ? r.steps.map(s => ({ ...s })) : [{ name: "", minutes: 5 }];
    container.innerHTML = `
      <div class="card">
        <h2 style="margin-bottom:.8rem">${r ? "Modifica routine" : "Nuova routine"}</h2>
        <div class="field">
          <label for="rt-name">Nome</label>
          <input type="text" id="rt-name" maxlength="50" value="${r ? App.escapeHTML(r.name) : ""}" placeholder="Es. Routine della mattina">
        </div>
        <label>Passi (nome + minuti)</label>
        <div data-steps style="margin-top:.4rem"></div>
        <div class="btn-row" style="margin:.8rem 0 1.2rem">
          <button class="btn btn-soft" data-addstep type="button">➕ Aggiungi passo</button>
        </div>
        <div class="btn-row">
          <button class="btn" data-save>💾 Salva</button>
          <button class="btn btn-ghost" data-cancel>Annulla</button>
        </div>
      </div>`;

    const boxSteps = container.querySelector("[data-steps]");
    function drawSteps() {
      boxSteps.innerHTML = steps.map((s, i) => `
        <div class="routine-step-row">
          <input type="text" data-sname="${i}" maxlength="60" value="${App.escapeHTML(s.name)}" placeholder="Passo ${i + 1} (es. “vestiti”)" aria-label="Nome del passo ${i + 1}">
          <input type="number" data-smin="${i}" min="1" max="120" value="${s.minutes}" aria-label="Minuti per il passo ${i + 1}">
          <button class="btn-icon" data-sdel="${i}" title="Rimuovi passo" aria-label="Rimuovi passo" type="button">🗑️</button>
        </div>`).join("");
      boxSteps.querySelectorAll("[data-sname]").forEach(inp =>
        inp.addEventListener("input", () => (steps[Number(inp.dataset.sname)].name = inp.value)));
      boxSteps.querySelectorAll("[data-smin]").forEach(inp =>
        inp.addEventListener("input", () => (steps[Number(inp.dataset.smin)].minutes = Math.max(1, Number(inp.value) || 1))));
      boxSteps.querySelectorAll("[data-sdel]").forEach(btn =>
        btn.addEventListener("click", () => { steps.splice(Number(btn.dataset.sdel), 1); drawSteps(); }));
    }
    drawSteps();

    container.querySelector("[data-addstep]").addEventListener("click", () => {
      steps.push({ name: "", minutes: 5 });
      drawSteps();
    });
    container.querySelector("[data-cancel]").addEventListener("click", lista);
    container.querySelector("[data-save]").addEventListener("click", () => {
      const name = container.querySelector("#rt-name").value.trim();
      const validi = steps.filter(s => s.name.trim());
      if (!name || validi.length === 0) {
        App.toast("Serve un nome e almeno un passo 😊");
        return;
      }
      if (r) { r.name = name; r.steps = validi; }
      else DB.state.routines.push({ id: DB.uid(), name, steps: validi });
      DB.save();
      lista();
    });
  }

  function player(r) {
    if (!r) return lista();
    let idx = 0, resta = r.steps[0].minutes * 60, attivo = true, interval = null;
    App.addCleanup(() => clearInterval(interval));

    function draw() {
      const step = r.steps[idx];
      const m = Math.floor(resta / 60), s = resta % 60;
      container.innerHTML = `
        <div class="card routine-player">
          <div class="rp-step-label">Passo ${idx + 1} di ${r.steps.length} · ${App.escapeHTML(r.name)}</div>
          <div class="rp-step-name">${App.escapeHTML(step.name)}</div>
          <div class="rp-timer">${m}:${String(s).padStart(2, "0")}</div>
          <div class="rp-progress"><div style="width:${(idx / r.steps.length) * 100}%"></div></div>
          <div class="btn-row" style="justify-content:center">
            <button class="btn" data-pausa>${attivo ? "⏸️ Pausa" : "▶️ Riprendi"}</button>
            <button class="btn btn-accent btn-big" data-next>✔️ Fatto, avanti!</button>
            <button class="btn btn-ghost" data-stop>Esci</button>
          </div>
        </div>`;
      container.querySelector("[data-next]").addEventListener("click", avanti);
      container.querySelector("[data-stop]").addEventListener("click", () => { clearInterval(interval); lista(); });
      container.querySelector("[data-pausa]").addEventListener("click", () => { attivo = !attivo; draw(); });
    }

    function avanti() {
      idx++;
      if (idx >= r.steps.length) {
        clearInterval(interval);
        App.confetti();
        container.innerHTML = `
          <div class="card game-over-card">
            <div class="big-emoji">🏁</div>
            <h2>Routine completata!</h2>
            <p class="result-line">“${App.escapeHTML(r.name)}” — fatta tutta. Sei un treno. 🚂</p>
            <div class="btn-row" style="justify-content:center; margin-top:1rem">
              <button class="btn" data-back>⬅️ Alle routine</button>
            </div>
          </div>`;
        container.querySelector("[data-back]").addEventListener("click", lista);
        return;
      }
      resta = r.steps[idx].minutes * 60;
      App.beep(760, 0.12);
      draw();
    }

    interval = setInterval(() => {
      if (!attivo) return;
      resta--;
      if (resta <= 0) {
        App.beep(500, 0.2);
        App.toast("⏰ Tempo del passo finito: quando sei pronto premi “Fatto”!");
        resta = 0; attivo = false;
      }
      draw();
    }, 1000);

    draw();
  }

  lista();
}

/* ============================================================
   DECIDI PER ME
   ============================================================ */
function renderDecisioni(container) {
  function draw() {
    const opts = DB.state.decisions;
    container.innerHTML = `
      <div class="card">
        <p style="margin-bottom:.8rem">Quando il cervello si blocca davanti a una scelta, delega! Aggiungi le opzioni e lascia decidere il fato. 🎡</p>
        <form class="task-input-row" data-form>
          <input type="text" data-input maxlength="60" placeholder="Aggiungi un'opzione (es. “pasta”, “insalata”…)" aria-label="Nuova opzione">
          <button class="btn" type="submit">➕</button>
        </form>
        <div class="decision-list">
          ${opts.map((o, i) => `
            <div class="decision-opt">
              <span>${App.escapeHTML(o)}</span>
              <button class="btn-icon" data-del="${i}" title="Rimuovi" aria-label="Rimuovi opzione">✖️</button>
            </div>`).join("")}
        </div>
        <div class="decision-result" data-result aria-live="polite">${opts.length >= 2 ? "Pronto a scegliere…" : "Aggiungi almeno 2 opzioni"}</div>
        <div class="btn-row" style="justify-content:center">
          <button class="btn btn-big" data-spin ${opts.length < 2 ? "disabled" : ""}>🎡 Scegli per me!</button>
          <button class="btn btn-ghost" data-coin>🪙 Testa o croce</button>
          <button class="btn btn-ghost" data-dice>🎲 Dado</button>
        </div>
      </div>`;

    container.querySelector("[data-form]").addEventListener("submit", e => {
      e.preventDefault();
      const v = container.querySelector("[data-input]").value.trim();
      if (!v) return;
      DB.state.decisions.push(v);
      DB.save();
      draw();
    });
    container.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
      DB.state.decisions.splice(Number(b.dataset.del), 1);
      DB.save();
      draw();
    }));

    const elRes = container.querySelector("[data-result]");

    container.querySelector("[data-spin]").addEventListener("click", () => {
      const scelte = DB.state.decisions;
      if (scelte.length < 2) return;
      let giri = 14 + Math.floor(Math.random() * 8), i = 0;
      const spin = setInterval(() => {
        elRes.textContent = scelte[i % scelte.length];
        App.beep(400 + (i % scelte.length) * 60, 0.03);
        i++;
        if (i >= giri) {
          clearInterval(spin);
          const vinta = scelte[(giri - 1) % scelte.length];
          elRes.textContent = `👉 ${vinta}!`;
          App.confetti(30);
        }
      }, 120);
      App.addCleanup(() => clearInterval(spin));
    });

    container.querySelector("[data-coin]").addEventListener("click", () => {
      elRes.textContent = Math.random() < 0.5 ? "🪙 TESTA" : "🪙 CROCE";
      App.beep(650, 0.08);
    });
    container.querySelector("[data-dice]").addEventListener("click", () => {
      elRes.textContent = `🎲 ${1 + Math.floor(Math.random() * 6)}`;
      App.beep(650, 0.08);
    });
  }

  draw();
}

/* ============================================================
   SUONI PER IL FOCUS (Web Audio)
   ============================================================ */
function renderSuoni(container) {
  const SUONI = [
    { id: "bianco", emoji: "🌫️", nome: "Rumore bianco", desc: "Copre tutto" },
    { id: "rosa", emoji: "🌸", nome: "Rumore rosa", desc: "Più morbido" },
    { id: "marrone", emoji: "🟤", nome: "Rumore marrone", desc: "Profondo, tipo pioggia" },
    { id: "onde", emoji: "🌊", nome: "Onde lente", desc: "Va e viene, rilassante" },
  ];

  let nodo = null, gain = null, lfo = null, attivo = null;

  function stop() {
    try { nodo?.stop(); lfo?.stop(); } catch (e) { /* già fermo */ }
    nodo = null; lfo = null; attivo = null;
  }
  App.addCleanup(stop);

  function creaBuffer(tipo) {
    const ctx = App.audioCtx();
    const sec = 4;
    const buf = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      if (tipo === "bianco") data[i] = white * 0.35;
      else if (tipo === "rosa") {
        b0 = 0.99765 * b0 + white * 0.099046;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.12;
      } else { // marrone e onde partono dal marrone
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
    }
    return buf;
  }

  function play(tipo) {
    stop();
    const ctx = App.audioCtx();
    nodo = ctx.createBufferSource();
    nodo.buffer = creaBuffer(tipo);
    nodo.loop = true;
    gain = gain || ctx.createGain();
    gain.gain.value = Number(container.querySelector("[data-vol]").value);
    try { gain.disconnect(); } catch (e) { /* non ancora connesso */ }
    gain.connect(ctx.destination);

    if (tipo === "onde") {
      // il volume "respira" lentamente come la risacca
      const mod = ctx.createGain();
      mod.gain.value = 1;
      lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08;
      const depth = ctx.createGain();
      depth.gain.value = 0.45;
      lfo.connect(depth).connect(mod.gain);
      nodo.connect(mod).connect(gain);
      lfo.start();
    } else {
      nodo.connect(gain);
    }
    nodo.start();
    attivo = tipo;
  }

  container.innerHTML = `
    <div class="card">
      <p style="margin-bottom:1rem">Un tappeto sonoro costante aiuta molti cervelli neurodivergenti a filtrare le distrazioni. Prova quale funziona per te. 🎧</p>
      <div class="sound-cards">
        ${SUONI.map(s => `
          <button class="sound-card" data-snd="${s.id}" aria-pressed="false">
            <span class="snd-emoji">${s.emoji}</span>
            ${s.nome}
            <div style="font-weight:400; font-size:.8rem; color:var(--text-soft)">${s.desc}</div>
          </button>`).join("")}
      </div>
      <div class="volume-row">
        <span aria-hidden="true">🔉</span>
        <input type="range" data-vol min="0" max="1" step="0.02" value="0.5" aria-label="Volume">
        <span aria-hidden="true">🔊</span>
      </div>
      <div class="btn-row" style="margin-top:1rem">
        <button class="btn btn-ghost" data-stop>⏹️ Ferma tutto</button>
      </div>
    </div>`;

  function aggiornaCards() {
    container.querySelectorAll("[data-snd]").forEach(c => {
      const on = c.dataset.snd === attivo;
      c.classList.toggle("playing", on);
      c.setAttribute("aria-pressed", on);
    });
  }

  container.querySelectorAll("[data-snd]").forEach(c => c.addEventListener("click", () => {
    if (attivo === c.dataset.snd) stop();
    else play(c.dataset.snd);
    aggiornaCards();
  }));
  container.querySelector("[data-stop]").addEventListener("click", () => { stop(); aggiornaCards(); });
  container.querySelector("[data-vol]").addEventListener("input", e => {
    if (gain) gain.gain.value = Number(e.target.value);
  });
}

/* ============================================================
   RESPIRA CON ME
   ============================================================ */
function renderRespiro(container) {
  const MODI = [
    { id: "quadrato", nome: "Quadrato 4-4-4-4", fasi: [["Inspira", 4], ["Trattieni", 4], ["Espira", 4], ["Trattieni", 4]] },
    { id: "478", nome: "Rilassante 4-7-8", fasi: [["Inspira", 4], ["Trattieni", 7], ["Espira", 8]] },
    { id: "semplice", nome: "Semplice 5-5", fasi: [["Inspira", 5], ["Espira", 5]] },
  ];
  let modo = MODI[0], running = false, timeouts = [], cicli = 0;
  App.addCleanup(() => { running = false; timeouts.forEach(clearTimeout); });

  container.innerHTML = `
    <div class="card" style="text-align:center">
      <div class="seg" role="group" aria-label="Tipo di respirazione">
        ${MODI.map((m, i) => `<button data-modo="${m.id}" class="${i === 0 ? "active" : ""}">${m.nome}</button>`).join("")}
      </div>
      <div class="breath-stage">
        <div class="breath-ring"></div>
        <div class="breath-circle" data-circle>Pronto?</div>
      </div>
      <div class="breath-phase-label" data-fase>&nbsp;</div>
      <div class="breath-count" data-cicli>Segui il cerchio: si gonfia quando inspiri.</div>
      <div class="btn-row" style="justify-content:center; margin-top:1.2rem">
        <button class="btn btn-big" data-toggle>▶️ Inizia</button>
      </div>
    </div>`;

  const elCircle = container.querySelector("[data-circle]");
  const elFase = container.querySelector("[data-fase]");
  const elCicli = container.querySelector("[data-cicli]");
  const btn = container.querySelector("[data-toggle]");

  container.querySelectorAll("[data-modo]").forEach(b => b.addEventListener("click", () => {
    modo = MODI.find(m => m.id === b.dataset.modo);
    container.querySelectorAll("[data-modo]").forEach(x => x.classList.toggle("active", x === b));
    ferma();
  }));

  function faseVisiva(nome, sec) {
    elFase.textContent = `${nome} · ${sec}s`;
    elCircle.textContent = nome;
    elCircle.style.transitionDuration = `${sec}s`;
    if (nome === "Inspira") elCircle.style.transform = "scale(2.3)";
    else if (nome === "Espira") elCircle.style.transform = "scale(1)";
    // "Trattieni" mantiene la scala corrente
  }

  function ciclo(faseIdx) {
    if (!running) return;
    if (faseIdx === 0 && cicli > 0) elCicli.textContent = `Cicli completati: ${cicli}`;
    const [nome, sec] = modo.fasi[faseIdx];
    faseVisiva(nome, sec);
    App.beep(nome === "Inspira" ? 520 : nome === "Espira" ? 392 : 460, 0.1);
    timeouts.push(setTimeout(() => {
      const next = (faseIdx + 1) % modo.fasi.length;
      if (next === 0) cicli++;
      ciclo(next);
    }, sec * 1000));
  }

  function via() {
    running = true;
    cicli = 0;
    btn.innerHTML = "⏹️ Fine";
    ciclo(0);
  }

  function ferma() {
    const fatti = cicli;
    running = false;
    timeouts.forEach(clearTimeout);
    timeouts = [];
    btn.innerHTML = "▶️ Inizia";
    elCircle.style.transitionDuration = "1s";
    elCircle.style.transform = "scale(1)";
    elCircle.textContent = "Pronto?";
    elFase.innerHTML = "&nbsp;";
    if (fatti >= 3) {
      DB.state.stats.breathSessions++;
      DB.save();
      App.checkBadges();
      elCicli.textContent = `Bella sessione: ${fatti} cicli. Com'è il corpo adesso? 💜`;
    }
    cicli = 0;
  }

  btn.addEventListener("click", () => (running ? ferma() : via()));
}

/* ============================================================
   SOS SOVRACCARICO (grounding 5-4-3-2-1)
   ============================================================ */
function renderGrounding(container) {
  const PASSI = [
    { n: 5, sense: "cose che puoi VEDERE", emoji: "👀", desc: "Guardati intorno con calma. Nominale una a una, anche a bassa voce: “vedo la finestra, vedo le mie mani…”" },
    { n: 4, sense: "cose che puoi TOCCARE", emoji: "✋", desc: "La sedia sotto di te, la stoffa dei vestiti, la temperatura dell'aria. Sentile davvero." },
    { n: 3, sense: "suoni che puoi SENTIRE", emoji: "👂", desc: "Anche i più piccoli: il tuo respiro, un ronzio lontano, i tuoi passi." },
    { n: 2, sense: "odori che puoi ANNUSARE", emoji: "👃", desc: "Se non trovi odori, va bene ricordarne due che ami: il caffè, la pioggia…" },
    { n: 1, sense: "respiro lento, tutto tuo", emoji: "🫁", desc: "Un ultimo respiro profondo. Inspira dal naso… ed espira piano dalla bocca." },
  ];
  let idx = 0;

  function draw() {
    if (idx >= PASSI.length) {
      DB.state.stats.groundingSessions++;
      DB.save();
      App.checkBadges();
      App.confetti(40);
      container.innerHTML = `
        <div class="card game-over-card">
          <div class="big-emoji">🌍</div>
          <h2>Sei tornato al presente.</h2>
          <p class="result-line">Qualsiasi cosa stia succedendo, adesso hai di nuovo un punto d'appoggio. Vai piano. 💜</p>
          <div class="btn-row" style="justify-content:center; margin-top:1rem">
            <button class="btn" data-again>🔁 Ripeti</button>
            <a class="btn btn-ghost" href="#/strumento/respiro">🫁 Ora respira con me</a>
          </div>
        </div>`;
      container.querySelector("[data-again]").addEventListener("click", () => { idx = 0; draw(); });
      return;
    }
    const p = PASSI[idx];
    container.innerHTML = `
      <div class="card ground-step">
        <div class="ground-dots">${PASSI.map((_, i) => `<span class="${i <= idx ? "on" : ""}"></span>`).join("")}</div>
        <div style="font-size:2.4rem">${p.emoji}</div>
        <div class="g-num">${p.n}</div>
        <div class="g-sense">${p.sense}</div>
        <p class="g-desc">${p.desc}</p>
        <div class="btn-row" style="justify-content:center">
          ${idx > 0 ? `<button class="btn btn-ghost" data-back>⬅️ Indietro</button>` : ""}
          <button class="btn btn-big btn-accent" data-next>Fatto ✔️</button>
        </div>
      </div>`;
    container.querySelector("[data-next]").addEventListener("click", () => { idx++; App.beep(600, 0.06); draw(); });
    const back = container.querySelector("[data-back]");
    if (back) back.addEventListener("click", () => { idx--; draw(); });
  }

  container.innerHTML = "";
  const intro = document.createElement("div");
  intro.className = "card ground-step";
  intro.innerHTML = `
    <div style="font-size:3rem">🌊➡️🌍</div>
    <div class="g-sense">Troppo rumore, dentro o fuori?</div>
    <p class="g-desc">Questo esercizio usa i 5 sensi per riportarti qui e ora, un passo alla volta. Ci vogliono 2-3 minuti. Trova una posizione comoda, se puoi.</p>
    <button class="btn btn-big" data-start>Iniziamo insieme 💜</button>`;
  container.appendChild(intro);
  intro.querySelector("[data-start]").addEventListener("click", draw);
}
