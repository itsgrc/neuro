# 🧠 NeuroSpazio

**Giochi, strumenti e supporto per ADHD e altre neurodivergenze — in italiano, gratis, senza account.**

NeuroSpazio è una web app pensata per menti neurodivergenti (ADHD, autismo, DSA e non solo): un posto accogliente dove allenare l'attenzione giocando, organizzare le giornate senza sovraccaricarsi e ritrovare la calma nei momenti difficili.

## ✨ Cosa c'è dentro

### 🎮 6 giochi di allenamento cognitivo
| Gioco | Cosa allena |
|---|---|
| 🃏 **Coppie di memoria** | Memoria di lavoro (3 difficoltà) |
| 🌈 **Colore ribelle** (Stroop) | Controllo degli impulsi |
| ⚡ **Scatto felino** | Tempi di reazione |
| 🎵 **Sequenza luminosa** (Simon) | Memoria sequenziale, con suoni |
| 🔍 **Caccia ai numeri** (Schulte) | Attenzione visiva |
| 🌊 **Flusso** (n-back) | Memoria di lavoro avanzata |

Ogni gioco salva i record personali e sblocca badge. 🏆

### 🧰 10 strumenti quotidiani
- 🍅 **Timer di focus** (Pomodoro) con anello visivo e preset gentili
- ✅ **Le mie attività** — massimo 3 cose per oggi, il resto in "Dopo"
- 🧺 **Svuota la mente** — brain dump istantaneo, trasformabile in attività
- 🔁 **Abitudini** — micro-abitudini con serie e griglia settimanale
- 🌤️ **Come sto oggi** — registro dell'umore in 5 secondi, con storico
- 🧭 **Routine guidate** — routine passo-passo col pilota automatico
- 🎡 **Decidi per me** — ruota, moneta e dado contro la paralisi decisionale
- 🎧 **Suoni per il focus** — rumore bianco/rosa/marrone e onde (Web Audio)
- 🫁 **Respira con me** — respirazione guidata animata (4-4-4-4, 4-7-8, 5-5)
- 🌍 **SOS sovraccarico** — grounding 5-4-3-2-1 per i momenti "è troppo"

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
