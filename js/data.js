/* ============================================================
   NeuroSpazio — data.js
   Contenuti informativi (in italiano), badge e consigli.
   Tono: rispettoso, concreto, neurodiversità-affermativo.
   ============================================================ */

const CONDIZIONI = [
  {
    id: "adhd",
    emoji: "⚡",
    nome: "ADHD",
    sottotitolo: "Disturbo da deficit di attenzione e iperattività",
    descrizione: "L'ADHD riguarda il modo in cui il cervello regola attenzione, impulsi ed energia. Non è pigrizia né mancanza di volontà: è una differenza neurologica. Chi ha l'ADHD può concentrarsi intensamente su ciò che lo appassiona (iperfocus) e fare fatica con compiti noiosi o poco stimolanti.",
    punti: [
      "La motivazione dipende da interesse, urgenza e novità, non dall'importanza.",
      "La memoria di lavoro può essere ridotta: usare promemoria esterni non è barare, è strategia.",
      "L'energia in eccesso ha bisogno di sfogo: movimento e fidgeting aiutano la concentrazione.",
      "La 'cecità al tempo' è reale: timer e allarmi sono i tuoi migliori alleati."
    ],
    strategie: [
      "Spezza ogni compito in passi minuscoli (il primo passo dev'essere ridicolmente facile).",
      "Usa il body doubling: lavorare accanto a qualcuno, anche in silenzio, aiuta a iniziare.",
      "Timer visivi (come il Pomodoro qui su NeuroSpazio) rendono il tempo concreto.",
      "Scrivi tutto subito: se resta solo in testa, per il cervello ADHD non esiste."
    ]
  },
  {
    id: "autismo",
    emoji: "♾️",
    nome: "Autismo",
    sottotitolo: "Spettro autistico",
    descrizione: "L'autismo è un modo diverso di percepire, elaborare e comunicare. Ogni persona autistica è unica: c'è chi cerca routine e prevedibilità, chi ha interessi profondi e appassionati, chi vive i sensi in modo amplificato. Non è qualcosa da 'correggere', ma da comprendere e rispettare.",
    punti: [
      "Il sovraccarico sensoriale (luci, suoni, folle) è faticoso e reale: le pause servono.",
      "Le routine danno sicurezza; i cambiamenti improvvisi possono essere destabilizzanti.",
      "Lo stimming (movimenti ripetitivi) è un modo naturale di autoregolarsi.",
      "Il masking (nascondere i propri tratti) è sfiancante: servono spazi in cui essere sé."
    ],
    strategie: [
      "Prepara i cambiamenti in anticipo: sapere cosa succederà riduce l'ansia.",
      "Crea un kit sensoriale: cuffie, occhiali da sole, oggetti da manipolare.",
      "Usa l'esercizio di respirazione o il grounding 5-4-3-2-1 quando senti il sovraccarico salire.",
      "Pianifica momenti di recupero dopo situazioni sociali intense."
    ]
  },
  {
    id: "dislessia",
    emoji: "📖",
    nome: "Dislessia",
    sottotitolo: "Disturbo specifico della lettura",
    descrizione: "La dislessia rende la lettura più lenta o faticosa, ma non ha nulla a che vedere con l'intelligenza. Il cervello dislessico elabora il linguaggio scritto in modo diverso e spesso brilla nel pensiero visivo, creativo e d'insieme.",
    punti: [
      "Leggere costa più energia: la stanchezza dopo tanto testo è normale.",
      "Font leggibili, spaziatura ampia e testi brevi aiutano molto (prova la modalità dislessia nelle Opzioni!).",
      "Gli audiolibri e la sintesi vocale sono strumenti legittimi, non scorciatoie.",
      "Molte persone dislessiche eccellono in creatività, problem solving e visione d'insieme."
    ],
    strategie: [
      "Attiva strumenti compensativi: mappe concettuali, registrazioni, sintesi vocale.",
      "Chiedi materiali in formato digitale per adattare font e dimensioni.",
      "Spezza la lettura in blocchi brevi con pause frequenti.",
      "A scuola e all'università hai diritto a misure compensative (Legge 170/2010 in Italia)."
    ]
  },
  {
    id: "discalculia",
    emoji: "🔢",
    nome: "Discalculia",
    sottotitolo: "Disturbo specifico del calcolo",
    descrizione: "La discalculia riguarda la difficoltà con i numeri, il calcolo e i concetti matematici di base. Come la dislessia, è una caratteristica neurobiologica, non mancanza di impegno.",
    punti: [
      "Contare, memorizzare le tabelline o leggere l'orologio può restare difficile anche da adulti.",
      "La calcolatrice è uno strumento compensativo legittimo, sempre.",
      "Stimare quantità, distanze e tempi può richiedere strategie esterne.",
      "Anche qui vale la Legge 170/2010: a scuola hai diritto a strumenti e misure adeguate."
    ],
    strategie: [
      "Usa supporti visivi: linee dei numeri, schemi, colori per le operazioni.",
      "Automatizza ciò che puoi: app per le finanze, allarmi per gli orari.",
      "Verifica i calcoli importanti due volte con la calcolatrice, senza vergogna.",
      "Scomponi i problemi in passi piccoli e scrivili."
    ]
  },
  {
    id: "disgrafia",
    emoji: "✍️",
    nome: "Disgrafia e disortografia",
    sottotitolo: "Disturbi della scrittura",
    descrizione: "La disgrafia riguarda il gesto della scrittura (calligrafia faticosa o poco leggibile), la disortografia le regole ortografiche. Entrambe rendono lo scrivere a mano più lento e stancante.",
    punti: [
      "Scrivere a mano può consumare tutta l'attenzione, lasciandone poca per i contenuti.",
      "La tastiera è spesso una soluzione, non una rinuncia.",
      "I correttori ortografici sono strumenti compensativi riconosciuti.",
      "La qualità delle idee non c'entra nulla con la calligrafia."
    ],
    strategie: [
      "Usa il computer o il tablet per i testi lunghi quando possibile.",
      "Detta i testi con il riconoscimento vocale.",
      "Per gli appunti prova schemi, frecce e disegni invece di frasi complete.",
      "Rileggi con calma in un secondo momento, o fai rileggere a qualcuno."
    ]
  },
  {
    id: "tourette",
    emoji: "🌀",
    nome: "Tourette e tic",
    sottotitolo: "Disturbi da tic",
    descrizione: "La sindrome di Tourette comporta tic motori e vocali involontari. I tic non sono capricci e sopprimerli a lungo è faticoso e spesso controproducente. Con comprensione e ambienti accoglienti, si convive bene.",
    punti: [
      "I tic aumentano con stress, stanchezza ed emozioni intense, anche positive.",
      "Sopprimere i tic richiede energia enorme e spesso li fa 'esplodere' dopo.",
      "Molte persone con Tourette hanno anche tratti ADHD o ossessivo-compulsivi.",
      "Ambienti informati e rilassati riducono naturalmente la frequenza dei tic."
    ],
    strategie: [
      "Riduci lo stress con pause regolari e tecniche di rilassamento.",
      "Informa chi ti sta intorno: la comprensione degli altri toglie pressione.",
      "Il sonno regolare aiuta molto la gestione dei tic.",
      "Esistono terapie specifiche (come la CBIT): parlane con specialisti."
    ]
  },
  {
    id: "dsa-generale",
    emoji: "🧩",
    nome: "Funzioni esecutive",
    sottotitolo: "La 'cabina di regia' del cervello",
    descrizione: "Le funzioni esecutive sono le abilità che permettono di pianificare, iniziare, organizzare e portare a termine le cose. In molte neurodivergenze (ADHD in primis) funzionano in modo discontinuo: sapere cosa fare non basta per riuscire a farlo.",
    punti: [
      "La 'paralisi da attivazione' (sapere cosa fare ma non riuscire a iniziare) è un blocco reale.",
      "Non è questione di forza di volontà: servono strutture esterne, non prediche.",
      "L'interesse e la scadenza imminente accendono il cervello più dell'importanza.",
      "Le energie esecutive si esauriscono: dosarle è saggezza, non debolezza."
    ],
    strategie: [
      "Regola dei 2 minuti: se richiede meno di 2 minuti, falla subito.",
      "Rendi visibile l'invisibile: liste, timer, oggetti in vista come promemoria.",
      "Abbassa la barriera d'ingresso: prepara tutto la sera prima.",
      "Festeggia ogni completamento: la dopamina del 'fatto!' costruisce lo slancio."
    ]
  },
  {
    id: "ansia-nd",
    emoji: "🌊",
    nome: "Emozioni intense",
    sottotitolo: "Disregolazione emotiva e RSD",
    descrizione: "Molte persone neurodivergenti vivono le emozioni a volume altissimo. La 'disforia sensibile al rifiuto' (RSD) — un dolore intenso di fronte a critiche o rifiuti percepiti — è frequente nell'ADHD. Le emozioni forti non sono esagerazioni: sono reali.",
    punti: [
      "Un'emozione intensa dura in media 90 secondi se non la alimenti con i pensieri.",
      "Nominare l'emozione ('sto provando frustrazione') ne abbassa già l'intensità.",
      "Il corpo aiuta la mente: respirare, muoversi e bere acqua regolano davvero.",
      "Registrare l'umore ogni giorno (c'è lo strumento qui!) aiuta a conoscere i propri schemi."
    ],
    strategie: [
      "Nei momenti di piena usa il grounding 5-4-3-2-1 di NeuroSpazio.",
      "Rimanda le decisioni importanti a quando l'onda è passata.",
      "Prepara frasi pronte per i momenti difficili: 'Ho bisogno di una pausa, torno tra poco.'",
      "Sii gentile con la persona che sarai domani: lasciale le cose un po' pronte."
    ]
  }
];

const GUIDE_PRATICHE = [
  {
    id: "studio",
    emoji: "🎓",
    titolo: "Studiare con un cervello neurodivergente",
    consigli: [
      "Sessioni brevi (15-25 minuti) con pause vere: alzati, muoviti, bevi.",
      "Cambia luogo o posizione quando l'attenzione cala: la novità risveglia il cervello.",
      "Studia ad alta voce, cammina mentre ripeti, disegna schemi: coinvolgi il corpo.",
      "Prima di chiudere, scrivi su un foglio il punto esatto in cui riprendere domani.",
      "Ricompense immediate dopo ogni blocco: piccole, ma subito."
    ]
  },
  {
    id: "lavoro",
    emoji: "💼",
    titolo: "Lavorare meglio",
    consigli: [
      "Blocca il tempo in agenda anche per i compiti, non solo per le riunioni.",
      "Una sola cosa alla volta: chiudi le schede e silenzia le notifiche nei blocchi di focus.",
      "Scrivi la 'prossima azione fisica' per ogni progetto, non solo il titolo del progetto.",
      "Usa il rumore di fondo (nella sezione Suoni) per coprire le distrazioni uditive.",
      "Se puoi, negozia orari flessibili: lavora quando il tuo cervello è acceso."
    ]
  },
  {
    id: "casa",
    emoji: "🏠",
    titolo: "Gestire la casa senza esaurirsi",
    consigli: [
      "Abbassa lo standard: una casa 'abbastanza in ordine' è un successo, non un compromesso.",
      "Timer da 10 minuti: metti in ordine solo finché suona, poi hai finito davvero.",
      "Ogni cosa ha una casa visibile: contenitori aperti battono cassetti chiusi.",
      "Raddoppia gli oggetti che perdi sempre (chiavi, caricabatterie, forbici).",
      "Fai le cose dove ti trovi: un cestino per stanza, prodotti per pulire in ogni bagno."
    ]
  },
  {
    id: "sonno",
    emoji: "😴",
    titolo: "Dormire (missione possibile)",
    consigli: [
      "Il cervello ADHD odia smettere: metti un allarme di 'inizio routine della buonanotte'.",
      "La 'vendetta del tempo per sé' di mezzanotte è comune: prevedi tempo per te PRIMA di sera.",
      "Rendi la camera noiosa per la mente e comoda per i sensi: buio, fresco, silenzio o rumore bianco.",
      "Scarica i pensieri su carta prima di dormire (usa Svuota la mente!).",
      "Stessa ora ogni giorno, anche nel weekend, aiuta più di qualsiasi trucco."
    ]
  },
  {
    id: "sociale",
    emoji: "💬",
    titolo: "Relazioni ed energia sociale",
    consigli: [
      "L'energia sociale è una batteria: pianifica la ricarica dopo eventi intensi.",
      "Va bene dire 'devo andare' senza scuse elaborate.",
      "Con le persone care, spiega il tuo funzionamento: 'se non rispondo non è disinteresse'.",
      "Promemoria per i legami: un allarme settimanale 'scrivi a qualcuno a cui tieni' non è freddo, è cura.",
      "Cerca community neurodivergenti: sentirsi capiti cambia tutto."
    ]
  },
  {
    id: "autostima",
    emoji: "💜",
    titolo: "Autostima e auto-compassione",
    consigli: [
      "Hai passato la vita a sentirti 'sbagliato' per un cervello che funziona diversamente: non era colpa tua.",
      "Parla a te stesso come parleresti a un amico caro nella stessa situazione.",
      "Tieni un 'barattolo dei successi': annota le cose fatte, anche piccole (i Progressi qui aiutano!).",
      "Confrontati solo con te stesso di ieri, non con i neurotipici di Instagram.",
      "Chiedere aiuto è un'abilità da persone intelligenti, non una sconfitta."
    ]
  }
];

const AIUTO_ITALIA = {
  titolo: "Dove trovare aiuto in Italia",
  intro: "NeuroSpazio è un supporto, non una diagnosi né una terapia. Se ti riconosci in queste pagine o stai attraversando un momento difficile, questi sono buoni punti di partenza:",
  voci: [
    { emoji: "🩺", testo: "Il medico di base può indirizzarti verso i servizi di neuropsichiatria (per minori) o i centri per l'ADHD e l'autismo degli adulti." },
    { emoji: "🏥", testo: "I Centri di Salute Mentale (CSM) della tua ASL offrono valutazioni e percorsi, anche per adulti." },
    { emoji: "🎓", testo: "A scuola e all'università: la Legge 170/2010 tutela i DSA con piani didattici personalizzati; chiedi del referente DSA/BES." },
    { emoji: "🤝", testo: "Associazioni: AIFA APS (famiglie ADHD), AIDAI (ADHD), AID (dislessia), ANGSA (autismo) offrono informazione e gruppi di supporto." },
    { emoji: "📞", testo: "Se stai vivendo un momento di crisi emotiva: Telefono Amico Italia risponde ogni giorno al 02 2327 2327." },
    { emoji: "🚨", testo: "In caso di emergenza chiama sempre il 112." }
  ]
};

const CONSIGLI_DEL_GIORNO = [
  "Se un compito richiede meno di 2 minuti, fallo adesso: il tuo io futuro ti ringrazia. ⚡",
  "Non riesci a iniziare? Rendi il primo passo ridicolmente piccolo: apri solo il file. 🐭",
  "Il fidgeting aiuta la concentrazione: muoviti pure, è il tuo cervello che si regola. 🌀",
  "Bere un bicchiere d'acqua è il cheat code più sottovalutato per la mente annebbiata. 💧",
  "Metti un timer anche per le cose belle: l'iperfocus è potente ma va addomesticato. ⏰",
  "Scrivi quel pensiero adesso (Svuota la mente!): la testa è per avere idee, non per conservarle. 📝",
  "Una cosa alla volta non è lentezza: è la velocità massima sostenibile. 🐢",
  "Se oggi hai fatto solo una cosa della lista, hai fatto una cosa. Conta. 💜",
  "Il disordine visibile ruba attenzione: copri o sposta, non serve riordinare tutto. 📦",
  "Le pause non sono premi da meritare: sono manutenzione della macchina. 🔋",
  "Confronta te stesso solo con te stesso di ieri. 🌱",
  "Dire 'no' a una cosa è dire 'sì' alla tua energia. 🛡️",
  "Prepara la roba di domani stasera: il te del mattino ha poche risorse, aiutalo. 🌙",
  "Due minuti di respirazione contano come reset del sistema. Provala oggi. 🫁",
  "Ricorda: non sei pigro. Il tuo cervello ha un motore diverso, servono solo strade adatte. 🏎️"
];

const BADGES = [
  { id: "primo-gioco", emoji: "🎮", nome: "Prima partita", desc: "Hai giocato il tuo primo gioco" },
  { id: "dieci-giochi", emoji: "🕹️", nome: "Giocatore", desc: "10 partite completate" },
  { id: "cinquanta-giochi", emoji: "👾", nome: "Veterano", desc: "50 partite completate" },
  { id: "primo-pomodoro", emoji: "🍅", nome: "Primo pomodoro", desc: "Prima sessione di focus completata" },
  { id: "dieci-pomodori", emoji: "🧑‍🌾", nome: "Coltivatore", desc: "10 sessioni di focus" },
  { id: "prima-attivita", emoji: "✅", nome: "Fatto!", desc: "Prima attività completata" },
  { id: "dieci-attivita", emoji: "📋", nome: "Macinatore", desc: "10 attività completate" },
  { id: "streak-3", emoji: "🔥", nome: "3 giorni di fila", desc: "Sei tornato per 3 giorni consecutivi" },
  { id: "streak-7", emoji: "🌟", nome: "Una settimana!", desc: "7 giorni consecutivi su NeuroSpazio" },
  { id: "primo-respiro", emoji: "🫁", nome: "Respira", desc: "Prima sessione di respirazione" },
  { id: "primo-grounding", emoji: "🌍", nome: "Con i piedi a terra", desc: "Primo esercizio 5-4-3-2-1" },
  { id: "umore-7", emoji: "📈", nome: "Mi conosco", desc: "Umore registrato per 7 giorni" },
  { id: "abitudine-7", emoji: "💪", nome: "Abitudine di ferro", desc: "Un'abitudine mantenuta 7 giorni di fila" },
];
