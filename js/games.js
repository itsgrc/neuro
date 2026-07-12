/* ============================================================
   NeuroSpazio — games.js
   Sei giochi di allenamento cognitivo, pensati per essere
   brevi, chiari e gratificanti. Ogni gioco salva il record.
   ============================================================ */

const GAMES = [
  {
    id: "memoria",
    emoji: "🃏",
    nome: "Coppie di memoria",
    desc: "Trova le coppie di carte uguali. Allena la memoria di lavoro.",
    tag: "memoria",
    render: renderMemoria,
  },
  {
    id: "stroop",
    emoji: "🌈",
    nome: "Colore ribelle",
    desc: "Tocca il colore dell'inchiostro, non la parola! Allena il controllo degli impulsi.",
    tag: "focus",
    render: renderStroop,
  },
  {
    id: "riflessi",
    emoji: "⚡",
    nome: "Scatto felino",
    desc: "Premi appena lo schermo diventa verde. Misura i tuoi riflessi.",
    tag: "focus",
    render: renderRiflessi,
  },
  {
    id: "simon",
    emoji: "🎵",
    nome: "Sequenza luminosa",
    desc: "Ripeti la sequenza di luci e suoni, sempre più lunga.",
    tag: "memoria",
    render: renderSimon,
  },
  {
    id: "numeri",
    emoji: "🔍",
    nome: "Caccia ai numeri",
    desc: "Trova i numeri in ordine il più in fretta possibile. Allena l'attenzione visiva.",
    tag: "focus",
    render: renderNumeri,
  },
  {
    id: "flusso",
    emoji: "🌊",
    nome: "Flusso (n-back)",
    desc: "Il simbolo è uguale a quello di prima? Sfida per la memoria di lavoro.",
    tag: "memoria",
    render: renderFlusso,
  },
  {
    id: "tempo",
    emoji: "⏱️",
    nome: "Un minuto esatto",
    desc: "Quanto dura davvero un minuto? Misura la tua percezione del tempo.",
    tag: "focus",
    render: renderTempo,
  },
  {
    id: "rotta",
    emoji: "🔀",
    nome: "Cambio di rotta",
    desc: "La regola cambia all'improvviso: colore o forma? Allena la flessibilità mentale.",
    tag: "focus",
    render: renderRotta,
  },
  {
    id: "stima",
    emoji: "👁️",
    nome: "Colpo d'occhio",
    desc: "Quale lato ha più pallini? Niente conte: allena il senso del numero.",
    tag: "focus",
    render: renderStima,
  },
  {
    id: "corsi",
    emoji: "🟪",
    nome: "Percorso di blocchi",
    desc: "Ripeti il percorso che si illumina sulla griglia. Memoria spaziale pura.",
    tag: "memoria",
    render: renderCorsi,
  },
  {
    id: "gonogo",
    emoji: "🚦",
    nome: "Semaforo",
    desc: "Premi col verde, fermati col rosso. Sembra facile… per 45 secondi.",
    tag: "focus",
    render: renderGonogo,
  },
];

/* ---------- utilità comuni ai giochi ---------- */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtSec(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
}

/** Card di fine partita con eventuale record. */
function gameOverCard(container, { emoji, titolo, righe, isRecord, replay }) {
  App.recordGamePlayed();
  container.innerHTML = `
    <div class="card game-over-card">
      <div class="big-emoji">${emoji}</div>
      <h2>${titolo}</h2>
      ${righe.map(r => `<p class="result-line">${r}</p>`).join("")}
      ${isRecord ? `<p class="result-line record">🏆 Nuovo record personale!</p>` : ""}
      <div class="btn-row" style="justify-content:center; margin-top:1.2rem">
        <button class="btn btn-big" data-replay>🔁 Rigioca</button>
        <a class="btn btn-ghost" href="#/giochi">Altri giochi</a>
      </div>
    </div>`;
  if (isRecord) App.confetti();
  container.querySelector("[data-replay]").addEventListener("click", replay);
}

/* ============================================================
   1) COPPIE DI MEMORIA
   ============================================================ */
function renderMemoria(container) {
  const EMOJIS = ["🐶","🐱","🦊","🐼","🐸","🦋","🌻","🍕","🚀","🌈","⭐","🎈","🍓","🐙","🎧","🧩","🍩","🌵","⚽","🎨"];
  const LIVELLI = [
    { id: "facile", nome: "Facile", coppie: 6, cols: 4 },
    { id: "medio", nome: "Medio", coppie: 8, cols: 4 },
    { id: "difficile", nome: "Difficile", coppie: 12, cols: 6 },
  ];

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Scegli la difficoltà</h2>
        <p style="color:var(--text-soft); margin-bottom:1rem">Trova tutte le coppie con meno mosse possibili.</p>
        <div class="btn-row" style="justify-content:center">
          ${LIVELLI.map(l => `<button class="btn btn-big" data-lvl="${l.id}">${l.nome} · ${l.coppie} coppie</button>`).join("")}
        </div>
      </div>`;
    container.querySelectorAll("[data-lvl]").forEach(b =>
      b.addEventListener("click", () => start(LIVELLI.find(l => l.id === b.dataset.lvl))));
  }

  function start(lvl) {
    const cards = shuffle(
      shuffle(EMOJIS).slice(0, lvl.coppie).flatMap(e => [e, e])
    );
    let first = null, lock = false, mosse = 0, trovate = 0, sec = 0;

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">Mosse: <span data-mosse>0</span></div>
        <div class="hud-item">Coppie: <span data-coppie>0/${lvl.coppie}</span></div>
        <div class="hud-item">⏱ <span data-tempo>0s</span></div>
      </div>
      <div class="memory-grid cols-${lvl.cols}" data-grid></div>`;

    const grid = container.querySelector("[data-grid]");
    const elMosse = container.querySelector("[data-mosse]");
    const elCoppie = container.querySelector("[data-coppie]");
    const elTempo = container.querySelector("[data-tempo]");

    const timer = setInterval(() => { sec++; elTempo.textContent = fmtSec(sec); }, 1000);
    App.addCleanup(() => clearInterval(timer));

    cards.forEach((emoji) => {
      const btn = document.createElement("button");
      btn.className = "mem-card";
      btn.textContent = emoji;
      btn.setAttribute("aria-label", "Carta coperta");
      btn.addEventListener("click", () => {
        if (lock || btn.classList.contains("revealed") || btn.classList.contains("matched")) return;
        btn.classList.add("revealed");
        btn.setAttribute("aria-label", `Carta: ${emoji}`);
        App.beep(520, 0.05);
        if (!first) { first = btn; return; }
        mosse++; elMosse.textContent = mosse;
        if (first.textContent === btn.textContent) {
          first.classList.add("matched"); btn.classList.add("matched");
          first = null;
          trovate++;
          elCoppie.textContent = `${trovate}/${lvl.coppie}`;
          App.beep(760, 0.1);
          if (trovate === lvl.coppie) {
            clearInterval(timer);
            const isRecord = DB.submitScore(`memoria-${lvl.id}`, `Memoria (${lvl.nome})`, mosse, "low");
            gameOverCard(container, {
              emoji: "🎉", titolo: "Tutte le coppie trovate!",
              righe: [`Mosse: <strong>${mosse}</strong>`, `Tempo: <strong>${fmtSec(sec)}</strong>`],
              isRecord, replay: () => start(lvl),
            });
          }
        } else {
          lock = true;
          const a = first, b = btn;
          first = null;
          setTimeout(() => {
            a.classList.remove("revealed"); b.classList.remove("revealed");
            a.setAttribute("aria-label", "Carta coperta");
            b.setAttribute("aria-label", "Carta coperta");
            lock = false;
          }, 750);
        }
      });
      grid.appendChild(btn);
    });
  }

  menu();
}

/* ============================================================
   2) COLORE RIBELLE (test di Stroop)
   ============================================================ */
function renderStroop(container) {
  const COLORI = [
    { nome: "ROSSO", css: "#e74c3c" },
    { nome: "VERDE", css: "#27ae60" },
    { nome: "BLU", css: "#2980b9" },
    { nome: "GIALLO", css: "#d8a013" },
  ];
  const DURATA = 45;

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Colore ribelle</h2>
        <p style="color:var(--text-soft); max-width:46ch; margin:0 auto 1rem">
          Vedrai una parola scritta con un colore che non c'entra nulla.<br>
          <strong>Tocca il colore dell'inchiostro</strong>, ignora quello che c'è scritto!<br>
          Hai ${DURATA} secondi.
        </p>
        <button class="btn btn-big" data-start>▶️ Inizia</button>
      </div>`;
    container.querySelector("[data-start]").addEventListener("click", start);
  }

  function start() {
    let punti = 0, errori = 0, resta = DURATA, corrente = null;

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">✅ <span data-ok>0</span></div>
        <div class="hud-item">❌ <span data-no>0</span></div>
        <div class="hud-item">⏱ <span data-tempo>${DURATA}s</span></div>
      </div>
      <div class="card">
        <div class="stroop-word" data-word></div>
        <div class="stroop-btns" data-btns></div>
      </div>`;

    const elWord = container.querySelector("[data-word]");
    const elOk = container.querySelector("[data-ok]");
    const elNo = container.querySelector("[data-no]");
    const elTempo = container.querySelector("[data-tempo]");
    const elBtns = container.querySelector("[data-btns]");

    COLORI.forEach(c => {
      const b = document.createElement("button");
      b.className = "stroop-btn";
      b.style.background = c.css;
      b.textContent = c.nome;
      b.addEventListener("click", () => {
        if (!corrente) return;
        if (c.nome === corrente.ink.nome) {
          punti++; elOk.textContent = punti; App.beep(700, 0.05);
        } else {
          errori++; elNo.textContent = errori; App.beep(180, 0.12);
        }
        prossima();
      });
      elBtns.appendChild(b);
    });

    function prossima() {
      const word = COLORI[Math.floor(Math.random() * COLORI.length)];
      let ink;
      do { ink = COLORI[Math.floor(Math.random() * COLORI.length)]; }
      while (ink.nome === word.nome && Math.random() > 0.25); // a volte coincidono: tiene sveglia l'attenzione
      corrente = { word, ink };
      elWord.textContent = word.nome;
      elWord.style.color = ink.css;
    }

    const timer = setInterval(() => {
      resta--;
      elTempo.textContent = `${resta}s`;
      if (resta <= 0) {
        clearInterval(timer);
        const isRecord = DB.submitScore("stroop", "Colore ribelle", punti, "high");
        gameOverCard(container, {
          emoji: punti >= 25 ? "🤩" : "💪",
          titolo: "Tempo scaduto!",
          righe: [`Risposte giuste: <strong>${punti}</strong>`, `Errori: <strong>${errori}</strong>`],
          isRecord, replay: start,
        });
      }
    }, 1000);
    App.addCleanup(() => clearInterval(timer));

    prossima();
  }

  menu();
}

/* ============================================================
   3) SCATTO FELINO (tempo di reazione)
   ============================================================ */
function renderRiflessi(container) {
  const ROUNDS = 5;

  function start() {
    let round = 0, tempi = [], stato = "idle", goTime = 0, timeoutId = null;

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">Round: <span data-round>0/${ROUNDS}</span></div>
        <div class="hud-item">Media: <span data-media>—</span></div>
      </div>
      <button class="react-zone waiting" data-zone>
        Tocca per iniziare.<br>Poi aspetta il VERDE e scatta! 🐈
      </button>`;

    const zona = container.querySelector("[data-zone]");
    const elRound = container.querySelector("[data-round]");
    const elMedia = container.querySelector("[data-media]");
    App.addCleanup(() => clearTimeout(timeoutId));

    function attesa() {
      stato = "ready";
      zona.className = "react-zone ready";
      zona.innerHTML = "Aspetta il verde… 🤫";
      timeoutId = setTimeout(() => {
        stato = "go";
        goTime = performance.now();
        zona.className = "react-zone go";
        zona.innerHTML = "ORA! 🐾";
        App.beep(880, 0.06);
      }, 1200 + Math.random() * 2500);
    }

    zona.addEventListener("click", () => {
      if (stato === "idle") { attesa(); return; }
      if (stato === "ready") {
        // partenza anticipata
        clearTimeout(timeoutId);
        stato = "idle";
        zona.className = "react-zone waiting";
        zona.innerHTML = "Troppo presto! 😅<br>Tocca per riprovare questo round.";
        App.beep(160, 0.15);
        return;
      }
      if (stato === "go") {
        const ms = Math.round(performance.now() - goTime);
        tempi.push(ms);
        round++;
        elRound.textContent = `${round}/${ROUNDS}`;
        const media = Math.round(tempi.reduce((a, b) => a + b, 0) / tempi.length);
        elMedia.textContent = `${media} ms`;
        if (round >= ROUNDS) {
          const isRecord = DB.submitScore("riflessi", "Scatto felino", media, "low");
          const migliore = Math.min(...tempi);
          gameOverCard(container, {
            emoji: media < 300 ? "🐆" : "🐢",
            titolo: media < 300 ? "Riflessi felini!" : "Bel ritmo, si può migliorare!",
            righe: [`Media: <strong>${media} ms</strong>`, `Scatto migliore: <strong>${migliore} ms</strong>`],
            isRecord, replay: start,
          });
        } else {
          stato = "idle";
          zona.className = "react-zone waiting";
          zona.innerHTML = `${ms} ms! 🎯<br>Tocca per il round ${round + 1}.`;
        }
      }
    });
  }

  start();
}

/* ============================================================
   4) SEQUENZA LUMINOSA (Simon)
   ============================================================ */
function renderSimon(container) {
  const PADS = [
    { id: 0, cls: "simon-red", freq: 261.6 },
    { id: 1, cls: "simon-green", freq: 329.6 },
    { id: 2, cls: "simon-blue", freq: 392.0 },
    { id: 3, cls: "simon-yellow", freq: 523.3 },
  ];

  function start() {
    let seq = [], pos = 0, accettaInput = false, livello = 0;
    let timeouts = [];
    App.addCleanup(() => timeouts.forEach(clearTimeout));

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">Livello: <span data-lvl>0</span></div>
        <div class="hud-item">Record: <span data-best>${DB.state.stats.bestScores.simon?.value ?? "—"}</span></div>
      </div>
      <p class="game-msg" data-msg>Osserva la sequenza… poi ripetila!</p>
      <div class="simon-board" data-board></div>
      <div class="btn-row" style="justify-content:center; margin-top:1.2rem">
        <button class="btn btn-big" data-go>▶️ Inizia</button>
      </div>`;

    const board = container.querySelector("[data-board]");
    const elMsg = container.querySelector("[data-msg]");
    const elLvl = container.querySelector("[data-lvl]");
    const btnGo = container.querySelector("[data-go]");

    const padEls = PADS.map(p => {
      const b = document.createElement("button");
      b.className = `simon-pad ${p.cls}`;
      b.disabled = true;
      b.setAttribute("aria-label", `Tasto ${p.cls.replace("simon-", "")}`);
      b.addEventListener("click", () => tap(p, b));
      board.appendChild(b);
      return b;
    });

    function accendi(p, el, dur = 320) {
      el.classList.add("lit");
      App.beep(p.freq, dur / 1000);
      timeouts.push(setTimeout(() => el.classList.remove("lit"), dur));
    }

    function mostraSequenza() {
      accettaInput = false;
      padEls.forEach(e => (e.disabled = true));
      elMsg.textContent = "Osserva… 👀";
      const velocita = Math.max(650 - livello * 22, 320);
      seq.forEach((idx, i) => {
        timeouts.push(setTimeout(() => {
          accendi(PADS[idx], padEls[idx]);
          if (i === seq.length - 1) {
            timeouts.push(setTimeout(() => {
              accettaInput = true;
              pos = 0;
              padEls.forEach(e => (e.disabled = false));
              elMsg.textContent = "Tocca a te! 🎯";
            }, velocita));
          }
        }, 600 + i * velocita));
      });
    }

    function prossimoLivello() {
      livello++;
      elLvl.textContent = livello;
      seq.push(Math.floor(Math.random() * 4));
      mostraSequenza();
    }

    function tap(p, el) {
      if (!accettaInput) return;
      accendi(p, el, 200);
      if (p.id === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          accettaInput = false;
          elMsg.textContent = "Perfetto! ✨";
          timeouts.push(setTimeout(prossimoLivello, 900));
        }
      } else {
        accettaInput = false;
        App.beep(140, 0.4);
        const raggiunto = livello - 1;
        const isRecord = raggiunto > 0 && DB.submitScore("simon", "Sequenza luminosa", raggiunto, "high");
        gameOverCard(container, {
          emoji: raggiunto >= 8 ? "🧠" : "🎵",
          titolo: "Sequenza interrotta!",
          righe: [`Livelli completati: <strong>${raggiunto}</strong>`],
          isRecord, replay: start,
        });
      }
    }

    btnGo.addEventListener("click", () => {
      btnGo.remove();
      prossimoLivello();
    });
  }

  start();
}

/* ============================================================
   5) CACCIA AI NUMERI (tabella di Schulte)
   ============================================================ */
function renderNumeri(container) {
  const LIVELLI = [
    { id: "4", nome: "4×4", n: 16, cols: 4 },
    { id: "5", nome: "5×5", n: 25, cols: 5 },
  ];

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Caccia ai numeri</h2>
        <p style="color:var(--text-soft); margin-bottom:1rem">Tocca i numeri in ordine crescente, da 1 in su, il più in fretta possibile.<br>Consiglio pro: tieni lo sguardo al centro e usa la visione periferica.</p>
        <div class="btn-row" style="justify-content:center">
          ${LIVELLI.map(l => `<button class="btn btn-big" data-lvl="${l.id}">${l.nome}</button>`).join("")}
        </div>
      </div>`;
    container.querySelectorAll("[data-lvl]").forEach(b =>
      b.addEventListener("click", () => start(LIVELLI.find(l => l.id === b.dataset.lvl))));
  }

  function start(lvl) {
    const numeri = shuffle(Array.from({ length: lvl.n }, (_, i) => i + 1));
    let atteso = 1, partito = null, dec = 0;

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">Cerca: <span data-next>1</span></div>
        <div class="hud-item">⏱ <span data-tempo>0.0s</span></div>
      </div>
      <div class="schulte-grid ${lvl.cols === 4 ? "cols-4" : ""}" data-grid></div>`;

    const grid = container.querySelector("[data-grid]");
    const elNext = container.querySelector("[data-next]");
    const elTempo = container.querySelector("[data-tempo]");

    const timer = setInterval(() => {
      if (partito) {
        dec = (performance.now() - partito) / 1000;
        elTempo.textContent = `${dec.toFixed(1)}s`;
      }
    }, 100);
    App.addCleanup(() => clearInterval(timer));

    numeri.forEach(n => {
      const b = document.createElement("button");
      b.className = "schulte-cell";
      b.textContent = n;
      b.addEventListener("click", () => {
        if (b.classList.contains("done")) return;
        if (!partito) partito = performance.now();
        if (n === atteso) {
          b.classList.add("done");
          App.beep(500 + n * 14, 0.04);
          atteso++;
          elNext.textContent = atteso;
          if (atteso > lvl.n) {
            clearInterval(timer);
            const finale = Math.round(((performance.now() - partito) / 1000) * 10) / 10;
            const isRecord = DB.submitScore(`numeri-${lvl.id}`, `Caccia ai numeri (${lvl.nome})`, finale, "low");
            gameOverCard(container, {
              emoji: "🔍", titolo: "Griglia completata!",
              righe: [`Tempo: <strong>${finale.toFixed(1)}s</strong>`],
              isRecord, replay: () => start(lvl),
            });
          }
        } else {
          b.classList.add("wrong");
          App.beep(170, 0.1);
          setTimeout(() => b.classList.remove("wrong"), 350);
        }
      });
      grid.appendChild(b);
    });
  }

  menu();
}

/* ============================================================
   6) FLUSSO (n-back)
   ============================================================ */
function renderFlusso(container) {
  const SIMBOLI = ["🍎", "🌙", "⭐", "🐟", "🎩", "🔔"];
  const TOTALE = 20;

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Flusso</h2>
        <p style="color:var(--text-soft); max-width:48ch; margin:0 auto 1rem">
          Scorre un flusso di simboli. Per ognuno rispondi:<br>
          <strong>è uguale a quello di N posizioni fa?</strong><br>
          Livello 1 = confronta col precedente. Livello 2 = con due fa (tosto!).
        </p>
        <div class="btn-row" style="justify-content:center">
          <button class="btn btn-big" data-n="1">Livello 1</button>
          <button class="btn btn-big" data-n="2">Livello 2 🔥</button>
        </div>
      </div>`;
    container.querySelectorAll("[data-n]").forEach(b =>
      b.addEventListener("click", () => start(Number(b.dataset.n))));
  }

  function start(n) {
    // costruiamo la sequenza con ~40% di corrispondenze
    const seq = [];
    for (let i = 0; i < TOTALE + n; i++) {
      if (i >= n && Math.random() < 0.4) seq.push(seq[i - n]);
      else {
        let s;
        do { s = SIMBOLI[Math.floor(Math.random() * SIMBOLI.length)]; }
        while (i >= n && s === seq[i - n] && Math.random() > 0.3);
        seq.push(s);
      }
    }

    let idx = 0, giuste = 0, sbagliate = 0, risposto = false;
    let timeouts = [];
    App.addCleanup(() => timeouts.forEach(clearTimeout));

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">Simbolo: <span data-prog>0/${TOTALE}</span></div>
        <div class="hud-item">✅ <span data-ok>0</span></div>
        <div class="hud-item">❌ <span data-no>0</span></div>
      </div>
      <div class="card">
        <div class="flow-stim" data-stim></div>
        <div class="flow-btns">
          <button class="btn btn-big btn-accent" data-si>✅ Uguale</button>
          <button class="btn btn-big btn-warn" data-nope>❌ Diverso</button>
        </div>
        <p class="game-msg" data-msg style="margin-top:.8rem"></p>
      </div>`;

    const elStim = container.querySelector("[data-stim]");
    const elProg = container.querySelector("[data-prog]");
    const elOk = container.querySelector("[data-ok]");
    const elNo = container.querySelector("[data-no]");
    const elMsg = container.querySelector("[data-msg]");
    const btnSi = container.querySelector("[data-si]");
    const btnNo = container.querySelector("[data-nope]");

    function setBtns(on) { btnSi.disabled = !on; btnNo.disabled = !on; }

    function mostra() {
      if (idx >= TOTALE + n) return fine();
      elStim.textContent = seq[idx];
      risposto = false;
      const attivo = idx >= n; // i primi n simboli sono solo da memorizzare
      setBtns(attivo);
      elMsg.textContent = attivo ? "" : "Memorizza… 🧠";
      elProg.textContent = `${Math.max(idx - n + 1, 0)}/${TOTALE}`;
      timeouts.push(setTimeout(() => {
        if (attivo && !risposto) {
          sbagliate++; elNo.textContent = sbagliate;
          elMsg.textContent = "Tempo scaduto! ⏰";
        }
        idx++;
        mostra();
      }, attivo ? 2600 : 1400));
    }

    function rispondi(dice) {
      if (risposto || idx < n) return;
      risposto = true;
      setBtns(false);
      const uguale = seq[idx] === seq[idx - n];
      if (dice === uguale) {
        giuste++; elOk.textContent = giuste;
        elMsg.textContent = "Giusto! ✨"; App.beep(700, 0.06);
      } else {
        sbagliate++; elNo.textContent = sbagliate;
        elMsg.textContent = "Ops! 😅"; App.beep(180, 0.1);
      }
    }

    btnSi.addEventListener("click", () => rispondi(true));
    btnNo.addEventListener("click", () => rispondi(false));

    function fine() {
      const isRecord = DB.submitScore(`flusso-${n}`, `Flusso (livello ${n})`, giuste, "high");
      gameOverCard(container, {
        emoji: giuste >= TOTALE * 0.8 ? "🧠" : "🌊",
        titolo: "Flusso terminato!",
        righe: [`Risposte giuste: <strong>${giuste}/${TOTALE}</strong>`],
        isRecord, replay: () => start(n),
      });
    }

    mostra();
  }

  menu();
}

/* ============================================================
   7) UN MINUTO ESATTO (riproduzione temporale)
   ============================================================ */
function renderTempo(container) {
  const DURATE = [10, 30, 60];
  const ROUNDS = 3;

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Un minuto esatto</h2>
        <p style="color:var(--text-soft); max-width:48ch; margin:0 auto 1rem">
          Premi <strong>VIA</strong>, senti dentro di te passare il tempo richiesto,
          poi premi <strong>FERMA</strong> quando pensi che sia trascorso.<br>
          Niente orologi in vista, eh 😉 — 3 round, vince chi conosce il proprio orologio interno.
        </p>
        <div class="btn-row" style="justify-content:center">
          ${DURATE.map(d => `<button class="btn btn-big" data-durata="${d}">${d} secondi</button>`).join("")}
        </div>
      </div>`;
    container.querySelectorAll("[data-durata]").forEach(b =>
      b.addEventListener("click", () => start(Number(b.dataset.durata))));
  }

  function start(target) {
    let round = 0;
    const errori = [];
    const risultati = [];

    function schermataRound() {
      container.innerHTML = `
        <div class="game-hud">
          <div class="hud-item">Obiettivo: <span>${target}s</span></div>
          <div class="hud-item">Round: <span>${round + 1}/${ROUNDS}</span></div>
        </div>
        <div class="card" style="text-align:center; padding:2.5rem 1rem">
          <p class="game-msg" data-msg>Quando sei pronto…</p>
          <button class="btn btn-big" data-via style="font-size:1.5rem; padding:1.2rem 3rem">▶️ VIA</button>
        </div>`;
      const btn = container.querySelector("[data-via]");
      const msg = container.querySelector("[data-msg]");
      let partito = null;

      btn.addEventListener("click", () => {
        if (partito === null) {
          partito = performance.now();
          btn.textContent = "✋ FERMA";
          btn.classList.add("btn-warn");
          msg.textContent = `Senti passare ${target} secondi…`;
          App.beep(520, 0.08);
        } else {
          const trascorsi = (performance.now() - partito) / 1000;
          const err = Math.abs(trascorsi - target) / target * 100;
          errori.push(err);
          risultati.push(trascorsi);
          App.beep(700, 0.1);
          round++;
          if (round >= ROUNDS) fine();
          else feedback(trascorsi, err);
        }
      });
    }

    function feedback(trascorsi, err) {
      const direzione = trascorsi < target
        ? "il tuo orologio interno corre veloce ⏩"
        : "il tuo orologio interno va con calma ⏪";
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:2rem 1rem">
          <p class="result-line">Hai fermato a <strong>${trascorsi.toFixed(1)}s</strong> su ${target}s</p>
          <p class="result-line">Errore: <strong>${err.toFixed(0)}%</strong> — ${direzione}</p>
          <button class="btn btn-big" data-next style="margin-top:1rem">Round ${round + 1} →</button>
        </div>`;
      container.querySelector("[data-next]").addEventListener("click", schermataRound);
    }

    function fine() {
      const media = Math.round(errori.reduce((a, b) => a + b, 0) / errori.length * 10) / 10;
      const isRecord = DB.submitScore(`tempo-${target}`, `Un minuto esatto (${target}s)`, media, "low");
      if (media < 10) App.earn("signore-tempo");
      const tendenza = risultati.filter(r => r < target).length >= 2
        ? "Tendi ad anticipare: per te il tempo scorre più in fretta di quanto sembri. I timer esterni sono i tuoi migliori amici."
        : "Tendi a dilatare: gli intervalli ti sembrano più corti del reale. Occhio alle pause che si allungano!";
      gameOverCard(container, {
        emoji: media < 10 ? "🧙" : "⏱️",
        titolo: media < 10 ? "Orologio interno svizzero!" : "Ora conosci il tuo tempo!",
        righe: [
          `Errore medio: <strong>${media}%</strong>`,
          `<span style="font-size:.95rem; color:var(--text-soft)">${tendenza}</span>`,
        ],
        isRecord, replay: () => start(target),
      });
    }

    schermataRound();
  }

  menu();
}

/* ============================================================
   8) CAMBIO DI ROTTA (task switching)
   ============================================================ */
function renderRotta(container) {
  const DURATA = 45;
  const FORME = ["cerchio", "quadrato"];
  const COLORI_R = ["rosso", "blu"];
  const EMOJI = { "rosso-cerchio": "🔴", "blu-cerchio": "🔵", "rosso-quadrato": "🟥", "blu-quadrato": "🟦" };

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Cambio di rotta</h2>
        <p style="color:var(--text-soft); max-width:48ch; margin:0 auto 1rem">
          Vedrai una figura. In alto c'è la <strong>regola del momento</strong>:<br>
          se dice <strong>COLORE</strong>, rispondi al colore. Se dice <strong>FORMA</strong>, rispondi alla forma.<br>
          La regola cambia senza preavviso: resta elastico! Hai ${DURATA} secondi.
        </p>
        <button class="btn btn-big" data-start>▶️ Inizia</button>
      </div>`;
    container.querySelector("[data-start]").addEventListener("click", start);
  }

  function start() {
    let punti = 0, errori = 0, resta = DURATA;
    let regola = "colore", daUltimoCambio = 0, corrente = null;

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">✅ <span data-ok>0</span></div>
        <div class="hud-item">❌ <span data-no>0</span></div>
        <div class="hud-item">⏱ <span data-tempo>${DURATA}s</span></div>
      </div>
      <div class="card" style="text-align:center">
        <div class="rotta-regola" data-regola>🎯 Regola: COLORE</div>
        <div class="flow-stim" data-stim></div>
        <div class="flow-btns" data-btns></div>
      </div>`;

    const elRegola = container.querySelector("[data-regola]");
    const elStim = container.querySelector("[data-stim]");
    const elBtns = container.querySelector("[data-btns]");
    const elOk = container.querySelector("[data-ok]");
    const elNo = container.querySelector("[data-no]");
    const elTempo = container.querySelector("[data-tempo]");

    function disegnaBottoni() {
      const opzioni = regola === "colore"
        ? [["rosso", "🔴 ROSSO"], ["blu", "🔵 BLU"]]
        : [["cerchio", "⚪ CERCHIO"], ["quadrato", "⬜ QUADRATO"]];
      elBtns.innerHTML = opzioni.map(([v, label]) =>
        `<button class="btn btn-big btn-soft" data-risposta="${v}">${label}</button>`).join("");
      elBtns.querySelectorAll("[data-risposta]").forEach(b =>
        b.addEventListener("click", () => rispondi(b.dataset.risposta)));
    }

    function prossima() {
      daUltimoCambio++;
      // dopo almeno 2 prove, la regola può cambiare (25% di probabilità)
      if (daUltimoCambio >= 2 && Math.random() < 0.25) {
        regola = regola === "colore" ? "forma" : "colore";
        daUltimoCambio = 0;
        elRegola.textContent = `🎯 Regola: ${regola.toUpperCase()}`;
        elRegola.classList.add("cambiata");
        setTimeout(() => elRegola.classList.remove("cambiata"), 500);
        App.beep(940, 0.1);
        disegnaBottoni();
      }
      corrente = {
        colore: COLORI_R[Math.floor(Math.random() * 2)],
        forma: FORME[Math.floor(Math.random() * 2)],
      };
      elStim.textContent = EMOJI[`${corrente.colore}-${corrente.forma}`];
    }

    function rispondi(v) {
      if (!corrente) return;
      const giusta = regola === "colore" ? corrente.colore : corrente.forma;
      if (v === giusta) { punti++; elOk.textContent = punti; App.beep(700, 0.05); }
      else { errori++; elNo.textContent = errori; App.beep(180, 0.12); }
      prossima();
    }

    const timer = setInterval(() => {
      resta--;
      elTempo.textContent = `${resta}s`;
      if (resta <= 0) {
        clearInterval(timer);
        const isRecord = DB.submitScore("rotta", "Cambio di rotta", punti, "high");
        gameOverCard(container, {
          emoji: punti >= 25 ? "🤸" : "🔀",
          titolo: "Tempo scaduto!",
          righe: [`Risposte giuste: <strong>${punti}</strong>`, `Errori: <strong>${errori}</strong>`],
          isRecord, replay: start,
        });
      }
    }, 1000);
    App.addCleanup(() => clearInterval(timer));

    disegnaBottoni();
    prossima();
  }

  menu();
}

/* ============================================================
   9) COLPO D'OCCHIO (stima numerica / senso del numero)
   ============================================================ */
function renderStima(container) {
  const TRIALS = 12;

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Colpo d'occhio</h2>
        <p style="color:var(--text-soft); max-width:48ch; margin:0 auto 1rem">
          Due nuvole di pallini compaiono per un attimo:<br>
          <strong>tocca il lato che ne ha di più</strong>.<br>
          Niente tempo per contare: fidati dell'istinto. ${TRIALS} sfide.
        </p>
        <button class="btn btn-big" data-start>▶️ Inizia</button>
      </div>`;
    container.querySelector("[data-start]").addEventListener("click", start);
  }

  function nuvola(el, n) {
    el.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const d = document.createElement("span");
      d.className = "stima-dot";
      d.style.left = 8 + Math.random() * 84 + "%";
      d.style.top = 8 + Math.random() * 84 + "%";
      el.appendChild(d);
    }
  }

  function start() {
    let trial = 0, giuste = 0, attesa = false, lati = null, timeoutId = null;
    App.addCleanup(() => clearTimeout(timeoutId));

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">Sfida: <span data-prog>1/${TRIALS}</span></div>
        <div class="hud-item">✅ <span data-ok>0</span></div>
      </div>
      <p class="game-msg" data-msg>Chi ne ha di più?</p>
      <div class="stima-boards">
        <button class="stima-board" data-lato="sx" aria-label="Lato sinistro"><div class="stima-area" data-area-sx></div></button>
        <button class="stima-board" data-lato="dx" aria-label="Lato destro"><div class="stima-area" data-area-dx></div></button>
      </div>`;

    const elSx = container.querySelector("[data-area-sx]");
    const elDx = container.querySelector("[data-area-dx]");
    const elMsg = container.querySelector("[data-msg]");
    const elProg = container.querySelector("[data-prog]");
    const elOk = container.querySelector("[data-ok]");

    function prossima() {
      if (trial >= TRIALS) return fine();
      elProg.textContent = `${trial + 1}/${TRIALS}`;
      // rapporti sempre più difficili man mano che avanzi (da 2:1 a ~10:9)
      const base = 8 + Math.floor(Math.random() * 15);
      const rapporto = trial < 4 ? 1.7 : trial < 8 ? 1.35 : 1.18;
      const altro = Math.max(base + 2, Math.round(base * rapporto));
      const sxMaggiore = Math.random() < 0.5;
      lati = { sx: sxMaggiore ? altro : base, dx: sxMaggiore ? base : altro };
      nuvola(elSx, lati.sx);
      nuvola(elDx, lati.dx);
      attesa = true;
      elMsg.textContent = "Guarda… 👀";
      // dopo 1.5 secondi i pallini spariscono: si risponde a memoria
      timeoutId = setTimeout(() => {
        elSx.innerHTML = ""; elDx.innerHTML = "";
        elMsg.textContent = "Quale lato ne aveva di più?";
      }, 1500);
    }

    container.querySelectorAll("[data-lato]").forEach(b => b.addEventListener("click", () => {
      if (!attesa) return;
      attesa = false;
      clearTimeout(timeoutId);
      const scelto = b.dataset.lato;
      const giusto = lati.sx === lati.dx ? scelto : (lati.sx > lati.dx ? "sx" : "dx");
      if (scelto === giusto) {
        giuste++; elOk.textContent = giuste;
        elMsg.textContent = `Giusto! ${lati.sx} contro ${lati.dx} ✨`;
        App.beep(700, 0.06);
      } else {
        elMsg.textContent = `Erano ${lati.sx} contro ${lati.dx} 😅`;
        App.beep(180, 0.1);
      }
      trial++;
      timeoutId = setTimeout(prossima, 900);
    }));

    function fine() {
      const isRecord = DB.submitScore("stima", "Colpo d'occhio", giuste, "high");
      gameOverCard(container, {
        emoji: giuste >= TRIALS * 0.8 ? "🦅" : "👁️",
        titolo: giuste >= TRIALS * 0.8 ? "Occhio di falco!" : "Il colpo d'occhio si allena!",
        righe: [`Risposte giuste: <strong>${giuste}/${TRIALS}</strong>`],
        isRecord, replay: start,
      });
    }

    prossima();
  }

  menu();
}

/* ============================================================
   10) PERCORSO DI BLOCCHI (compito di Corsi)
   ============================================================ */
function renderCorsi(container) {
  function start() {
    let seq = [], pos = 0, accetta = false, span = 0;
    let timeouts = [];
    App.addCleanup(() => timeouts.forEach(clearTimeout));

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">Lunghezza: <span data-span>0</span></div>
        <div class="hud-item">Record: <span>${DB.state.stats.bestScores.corsi?.value ?? "—"}</span></div>
      </div>
      <p class="game-msg" data-msg>Guarda il percorso, poi rifallo!</p>
      <div class="corsi-grid" data-grid></div>
      <div class="btn-row" style="justify-content:center; margin-top:1.2rem">
        <button class="btn btn-big" data-go>▶️ Inizia</button>
      </div>`;

    const grid = container.querySelector("[data-grid]");
    const elMsg = container.querySelector("[data-msg]");
    const elSpan = container.querySelector("[data-span]");
    const btnGo = container.querySelector("[data-go]");

    const celle = Array.from({ length: 9 }, (_, i) => {
      const b = document.createElement("button");
      b.className = "corsi-cell";
      b.disabled = true;
      b.setAttribute("aria-label", `Blocco ${i + 1}`);
      b.addEventListener("click", () => tap(i, b));
      grid.appendChild(b);
      return b;
    });

    function accendi(i, dur = 450) {
      celle[i].classList.add("lit");
      App.beep(360 + i * 40, dur / 1000);
      timeouts.push(setTimeout(() => celle[i].classList.remove("lit"), dur));
    }

    function nuovaSequenza() {
      // sequenza senza ripetizioni consecutive
      const len = span + 2; // si parte da 2 blocchi
      seq = [];
      while (seq.length < len) {
        const c = Math.floor(Math.random() * 9);
        if (seq[seq.length - 1] !== c) seq.push(c);
      }
      mostra();
    }

    function mostra() {
      accetta = false;
      celle.forEach(c => (c.disabled = true));
      elMsg.textContent = "Osserva il percorso… 👀";
      seq.forEach((idx, i) => {
        timeouts.push(setTimeout(() => {
          accendi(idx);
          if (i === seq.length - 1) {
            timeouts.push(setTimeout(() => {
              accetta = true; pos = 0;
              celle.forEach(c => (c.disabled = false));
              elMsg.textContent = "Tocca a te: rifai il percorso! 🎯";
            }, 550));
          }
        }, 500 + i * 650));
      });
    }

    function tap(i, el) {
      if (!accetta) return;
      accendi(i, 250);
      if (i === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          accetta = false;
          span++;
          elSpan.textContent = seq.length;
          elMsg.textContent = "Perfetto! Percorso più lungo… ✨";
          timeouts.push(setTimeout(nuovaSequenza, 1000));
        }
      } else {
        accetta = false;
        App.beep(140, 0.4);
        const raggiunto = span > 0 ? span + 1 : 0; // lunghezza massima completata
        const isRecord = raggiunto > 0 && DB.submitScore("corsi", "Percorso di blocchi", raggiunto, "high");
        gameOverCard(container, {
          emoji: raggiunto >= 6 ? "🧠" : "🟪",
          titolo: "Percorso interrotto!",
          righe: [`Percorso più lungo completato: <strong>${raggiunto || "—"} blocchi</strong>`,
            `<span style="font-size:.9rem; color:var(--text-soft)">La media degli adulti nel compito di Corsi è 5-6 blocchi.</span>`],
          isRecord, replay: start,
        });
      }
    }

    btnGo.addEventListener("click", () => { btnGo.remove(); nuovaSequenza(); });
  }

  start();
}

/* ============================================================
   11) SEMAFORO (go/no-go)
   ============================================================ */
function renderGonogo(container) {
  const DURATA = 45;

  function menu() {
    container.innerHTML = `
      <div class="card" style="text-align:center">
        <h2 style="margin-bottom:.6rem">Semaforo</h2>
        <p style="color:var(--text-soft); max-width:48ch; margin:0 auto 1rem">
          <strong>🟢 verde → PREMI</strong> il pulsante, più veloce che puoi.<br>
          <strong>🔴 rosso → FERMO</strong>: non premere niente.<br>
          Il rosso arriva quando meno te lo aspetti. ${DURATA} secondi.
        </p>
        <button class="btn btn-big" data-start>▶️ Inizia</button>
      </div>`;
    container.querySelector("[data-start]").addEventListener("click", start);
  }

  function start() {
    let hits = 0, falsi = 0, mancati = 0, resta = DURATA;
    let corrente = null, risposto = false;
    let timeouts = [];
    App.addCleanup(() => timeouts.forEach(clearTimeout));

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-item">✅ <span data-ok>0</span></div>
        <div class="hud-item">🚫 Falsi: <span data-falsi>0</span></div>
        <div class="hud-item">💤 Persi: <span data-persi>0</span></div>
        <div class="hud-item">⏱ <span data-tempo>${DURATA}s</span></div>
      </div>
      <div class="card" style="text-align:center">
        <div class="flow-stim" data-stim style="min-height:7rem"></div>
        <button class="btn btn-big btn-accent" data-premi style="font-size:1.4rem; padding:1.1rem 3rem">PREMI!</button>
      </div>`;

    const elStim = container.querySelector("[data-stim]");
    const elOk = container.querySelector("[data-ok]");
    const elFalsi = container.querySelector("[data-falsi]");
    const elPersi = container.querySelector("[data-persi]");
    const elTempo = container.querySelector("[data-tempo]");
    const btn = container.querySelector("[data-premi]");

    function prossimo() {
      if (resta <= 0) return;
      // 70% verde (go), 30% rosso (no-go)
      corrente = Math.random() < 0.7 ? "go" : "nogo";
      risposto = false;
      elStim.textContent = corrente === "go" ? "🟢" : "🔴";
      timeouts.push(setTimeout(() => {
        if (corrente === "go" && !risposto) {
          mancati++; elPersi.textContent = mancati;
        }
        corrente = null;
        elStim.textContent = "";
        timeouts.push(setTimeout(prossimo, 250 + Math.random() * 350));
      }, 750));
    }

    btn.addEventListener("click", () => {
      if (!corrente || risposto) return;
      risposto = true;
      if (corrente === "go") {
        hits++; elOk.textContent = hits; App.beep(700, 0.05);
      } else {
        falsi++; elFalsi.textContent = falsi; App.beep(160, 0.15);
      }
    });

    const timer = setInterval(() => {
      resta--;
      elTempo.textContent = `${resta}s`;
      if (resta <= 0) {
        clearInterval(timer);
        const punteggio = Math.max(hits - falsi, 0);
        const isRecord = DB.submitScore("gonogo", "Semaforo", punteggio, "high");
        gameOverCard(container, {
          emoji: falsi <= 1 ? "🧘" : "🚦",
          titolo: falsi <= 1 ? "Freno di ferro!" : "Tempo scaduto!",
          righe: [
            `Verdi presi: <strong>${hits}</strong> · Persi: <strong>${mancati}</strong>`,
            `Partenze false sul rosso: <strong>${falsi}</strong>`,
            `Punteggio: <strong>${punteggio}</strong>`,
          ],
          isRecord, replay: start,
        });
      }
    }, 1000);
    App.addCleanup(() => clearInterval(timer));

    prossimo();
  }

  menu();
}
