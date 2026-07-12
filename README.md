# 🧠 NeuroSpazio

**Giochi, strumenti e supporto per ADHD e altre neurodivergenze — in italiano, gratis, senza account.**

NeuroSpazio è una web app pensata per menti neurodivergenti (ADHD, autismo, DSA e non solo): un posto accogliente dove allenare l'attenzione giocando, organizzare le giornate senza sovraccaricarsi e ritrovare la calma nei momenti difficili.

## ✨ Cosa c'è dentro

### 🎮 6 giochi di allenamento cognitivo
| Gioco | Cosa allena | Più indicato per | Base scientifica |
|---|---|---|---|
| 🃏 **Coppie di memoria** | Memoria di lavoro (3 difficoltà) | ⚡ ADHD · 📖 DSA | Martinussen et al., 2005; Gathercole & Alloway, 2008 |
| 🌈 **Colore ribelle** (Stroop) | Controllo degli impulsi | ⚡ ADHD · 🌀 Tourette | Stroop, 1935; Barkley, 1997 |
| ⚡ **Scatto felino** | Tempi di reazione e loro variabilità | ⚡ ADHD | Kofler et al., 2013 |
| 🎵 **Sequenza luminosa** (Simon) | Memoria sequenziale multisensoriale | ⚡ ADHD · 📖 DSA | Martinussen et al., 2005 |
| 🔍 **Caccia ai numeri** (Schulte) | Attenzione visiva selettiva | ⚡ ADHD | Barkley, 1997; Faraone et al., 2021 |
| 🌊 **Flusso** (n-back) | Memoria di lavoro avanzata | ⚡ ADHD · 📖 DSA | Kirchner, 1958; Jaeggi et al., 2008 |

Ogni gioco salva i record personali, sblocca badge 🏆 e include una scheda **"🔬 Per chi è pensato e perché funziona"** con le fonti.

### 🧰 10 strumenti quotidiani
| Strumento | Più indicato per | Base scientifica |
|---|---|---|
| 🍅 **Timer di focus** (Pomodoro) | ⚡ ADHD · 📖 DSA | "Cecità al tempo": Barkley, 1997; Cirillo, 2018 |
| ✅ **Le mie attività** (max 3 per oggi) | ⚡ ADHD · ♾️ Autismo | Implementation intentions: Gollwitzer, 1999 |
| 🧺 **Svuota la mente** (brain dump) | ⚡ ADHD · 🌊 Ansia | Borkovec et al., 1983; Pennebaker, 1997 |
| 🔁 **Abitudini** con serie 🔥 | ⚡ ADHD · ♾️ Autismo | Lally et al., 2010; Volkow et al., 2009 |
| 🌤️ **Come sto oggi** (umore) | 🌊 Ansia · ⚡ ADHD · ♾️ Autismo | Affect labeling: Lieberman et al., 2007; Shaw et al., 2014 |
| 🧭 **Routine guidate** passo-passo | ♾️ Autismo · ⚡ ADHD | TEACCH: Mesibov et al., 2005 |
| 🎡 **Decidi per me** (anti-paralisi) | ⚡ ADHD · ♾️ Autismo · 🌊 Ansia | Choice overload: Iyengar & Lepper, 2000 |
| 🎧 **Suoni per il focus** (Web Audio) | ⚡ ADHD · ♾️ Autismo | Risonanza stocastica: Söderlund et al., 2007 |
| 🫁 **Respira con me** (4-4-4-4, 4-7-8, 5-5) | 🌊 Ansia · ♾️ Autismo · 🌀 Tourette | Zaccaro et al., 2018; Lehrer & Gevirtz, 2014 |
| 🌍 **SOS sovraccarico** (grounding 5-4-3-2-1) | 🌊 Ansia · ♾️ Autismo | Najavits, 2002 |

Nelle pagine Giochi e Strumenti puoi **filtrare per neurodivergenza** (ADHD, autismo, DSA, ansia/emozioni, Tourette).

### 🔬 Basi scientifiche e onestà
Ogni scheda cita fonti accademiche verificate (32 riferimenti in bibliografia, consultabili su Google Scholar/PubMed), incluse le meta-analisi critiche sul brain training (Melby-Lervåg & Hulme, 2013; Simons et al., 2016): i giochi sono presentati come palestra e termometro dell'attenzione, non come terapia.

### 📚 Risorse
Spiegazioni chiare e rispettose su ADHD, autismo, dislessia, discalculia, disgrafia, Tourette, funzioni esecutive ed emozioni intense, con strategie concrete, guide pratiche (studio, lavoro, casa, sonno, relazioni, autostima) e indicazioni su dove trovare aiuto in Italia.

### 🏆 Progressi e motivazione
Streak giornaliera, statistiche, record dei giochi, grafico dell'umore e 13 badge da sbloccare: la dopamina giusta al momento giusto.

### ♿ Accessibilità
- Tema chiaro / scuro / automatico
- **Modalità dislessia** (font leggibile, spaziatura ampia)
- **Riduzione animazioni** (anche via `prefers-reduced-motion`)
- 4 dimensioni del testo
- Suoni disattivabili, navigazione da tastiera, etichette ARIA
- Layout mobile-first con barra di navigazione inferiore

## 🔒 Privacy
Tutti i dati (attività, umore, record…) restano **solo nel tuo browser** (localStorage). Niente account, niente tracciamento, niente server. Dalle Opzioni puoi esportare/importare un backup o cancellare tutto.

## 🚀 Come usarla
Nessuna build, nessuna dipendenza: è HTML/CSS/JS puro.

```bash
# apri direttamente…
open index.html

# …oppure servila in locale
python3 -m http.server 8000
# → http://localhost:8000
```

Funziona anche pubblicata così com'è su GitHub Pages o qualsiasi hosting statico.

## 🗂️ Struttura
```
index.html        # shell dell'app (SPA con routing via hash)
css/styles.css    # stili, temi, accessibilità
js/storage.js     # stato e persistenza (localStorage)
js/data.js        # contenuti: risorse, guide, badge, consigli
js/games.js       # i 6 giochi
js/tools.js       # i 10 strumenti
js/app.js         # router, viste, impostazioni, feedback
```

---

💜 *NeuroSpazio è un supporto, non una diagnosi né una terapia. Se stai attraversando un momento difficile, parlane con una persona professionista. In emergenza: 112.*
