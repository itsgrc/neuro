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
    id: "genitori",
    emoji: "👨‍👩‍👧",
    titolo: "Per genitori e insegnanti",
    consigli: [
      "Usate NeuroSpazio INSIEME, almeno all'inizio: per i bambini il gioco condiviso vale doppio e vi mostra come ragionano.",
      "Le etichette con l'età (6+, 8+…) e i livelli “consigliato 6–10” sono indicativi: seguite il bambino reale, non l'etichetta.",
      "Festeggiate lo sforzo e i tentativi, mai solo il punteggio: è il modo più solido di costruire motivazione.",
      "Le routine guidate funzionano benissimo per mattina e compiti: costruitele con il bambino, non per il bambino.",
      "A scuola, ricordate: con una diagnosi DSA la Legge 170/2010 dà diritto a strumenti compensativi e a un piano personalizzato (PDP).",
      "Nessuna app sostituisce la valutazione di neuropsichiatria infantile o dei servizi per l'età evolutiva: se avete dubbi, partite dal pediatra."
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
  { id: "primo-giorno-percorso", emoji: "🎓", nome: "In cammino", desc: "Primo giorno di un percorso completato" },
  { id: "percorso-completo", emoji: "🏔️", nome: "Vetta raggiunta", desc: "Un percorso di 7 giorni completato" },
  { id: "signore-tempo", emoji: "⏱️", nome: "Signore del tempo", desc: "Errore medio sotto il 10% in Un minuto esatto" },
  { id: "primo-allenamento", emoji: "🏋️", nome: "Palestra aperta", desc: "Primo allenamento del giorno completato" },
  { id: "atleta-mente", emoji: "🏅", nome: "Atleta della mente", desc: "7 allenamenti del giorno completati" },
];

/* ============================================================
   Basi scientifiche
   Ogni gioco e strumento è collegato alle neurodivergenze per
   cui è più utile e alla letteratura che ne descrive il
   meccanismo. Citazioni verificate e verificabili.
   ============================================================ */

/* Fasce d'età: usate per consigliare giochi, strumenti e livelli.
   Le età sono indicative: ogni persona ha i suoi tempi. */
const ETA_INFO = {
  bambini: { emoji: "🧒", nome: "Bambini", range: "6–10 anni", maxMin: 10 },
  ragazzi: { emoji: "🧑", nome: "Ragazzi", range: "11–17 anni", maxMin: 17 },
  adulti:  { emoji: "🧑‍💼", nome: "Adulti", range: "18+ anni", maxMin: 99 },
};

/* Età minima indicativa per ogni gioco e strumento */
const ETA_MIN = {
  /* giochi */
  memoria: 6, stroop: 8, riflessi: 6, simon: 6, numeri: 7, flusso: 10,
  tempo: 8, rotta: 7, stima: 6, corsi: 6, gonogo: 6,
  /* strumenti */
  pomodoro: 8, attivita: 8, dump: 10, abitudini: 6, umore: 6, routine: 6,
  decisioni: 6, suoni: 6, respiro: 6, grounding: 8, sos: 6, bodyscan: 8, gratitudine: 8, coach: 10,
};

const ND_INFO = {
  adhd:     { emoji: "⚡",  nome: "ADHD",             classe: "nd-adhd" },
  autismo:  { emoji: "♾️", nome: "Autismo",          classe: "nd-autismo" },
  dsa:      { emoji: "📖", nome: "DSA",              classe: "nd-dsa" },
  ansia:    { emoji: "🌊", nome: "Ansia ed emozioni", classe: "nd-ansia" },
  tourette: { emoji: "🌀", nome: "Tourette",         classe: "nd-tourette" },
};

const FONTI = [
  { id: "stroop1935",     testo: "Stroop, J. R. (1935). Studies of interference in serial verbal reactions. <em>Journal of Experimental Psychology</em>, 18(6), 643–662." },
  { id: "kirchner1958",   testo: "Kirchner, W. K. (1958). Age differences in short-term retention of rapidly changing information. <em>Journal of Experimental Psychology</em>, 55(4), 352–358." },
  { id: "barkley1997",    testo: "Barkley, R. A. (1997). Behavioral inhibition, sustained attention, and executive functions: Constructing a unifying theory of ADHD. <em>Psychological Bulletin</em>, 121(1), 65–94." },
  { id: "faraone2021",    testo: "Faraone, S. V., et al. (2021). The World Federation of ADHD International Consensus Statement: 208 evidence-based conclusions about the disorder. <em>Neuroscience & Biobehavioral Reviews</em>, 128, 789–818." },
  { id: "lord2018",       testo: "Lord, C., Elsabbagh, M., Baird, G., & Veenstra-Vanderweele, J. (2018). Autism spectrum disorder. <em>The Lancet</em>, 392(10146), 508–520." },
  { id: "peterson2012",   testo: "Peterson, R. L., & Pennington, B. F. (2012). Developmental dyslexia. <em>The Lancet</em>, 379(9830), 1997–2007." },
  { id: "butterworth2011",testo: "Butterworth, B., Varma, S., & Laurillard, D. (2011). Dyscalculia: From brain to education. <em>Science</em>, 332(6033), 1049–1053." },
  { id: "piacentini2010", testo: "Piacentini, J., et al. (2010). Behavior therapy for children with Tourette disorder: A randomized controlled trial. <em>JAMA</em>, 303(19), 1929–1937." },
  { id: "shaw2014",       testo: "Shaw, P., Stringaris, A., Nigg, J., & Leibenluft, E. (2014). Emotion dysregulation in attention deficit hyperactivity disorder. <em>American Journal of Psychiatry</em>, 171(3), 276–293." },
  { id: "martinussen2005",testo: "Martinussen, R., Hayden, J., Hogg-Johnson, S., & Tannock, R. (2005). A meta-analysis of working memory impairments in children with attention-deficit/hyperactivity disorder. <em>Journal of the American Academy of Child & Adolescent Psychiatry</em>, 44(4), 377–384." },
  { id: "kofler2013",     testo: "Kofler, M. J., et al. (2013). Reaction time variability in ADHD: A meta-analytic review of 319 studies. <em>Clinical Psychology Review</em>, 33(6), 795–811." },
  { id: "soderlund2007",  testo: "Söderlund, G., Sikström, S., & Smart, A. (2007). Listen to the noise: Noise is beneficial for cognitive performance in ADHD. <em>Journal of Child Psychology and Psychiatry</em>, 48(8), 840–847." },
  { id: "jaeggi2008",     testo: "Jaeggi, S. M., Buschkuehl, M., Jonides, J., & Perrig, W. J. (2008). Improving fluid intelligence with training on working memory. <em>PNAS</em>, 105(19), 6829–6833." },
  { id: "melby2013",      testo: "Melby-Lervåg, M., & Hulme, C. (2013). Is working memory training effective? A meta-analytic review. <em>Developmental Psychology</em>, 49(2), 270–291." },
  { id: "simons2016",     testo: "Simons, D. J., et al. (2016). Do “brain-training” programs work? <em>Psychological Science in the Public Interest</em>, 17(3), 103–186." },
  { id: "gollwitzer1999", testo: "Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. <em>American Psychologist</em>, 54(7), 493–503." },
  { id: "lally2010",      testo: "Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. <em>European Journal of Social Psychology</em>, 40(6), 998–1009." },
  { id: "lieberman2007",  testo: "Lieberman, M. D., et al. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. <em>Psychological Science</em>, 18(5), 421–428." },
  { id: "pennebaker1997", testo: "Pennebaker, J. W. (1997). Writing about emotional experiences as a therapeutic process. <em>Psychological Science</em>, 8(3), 162–166." },
  { id: "borkovec1983",   testo: "Borkovec, T. D., Wilkinson, L., Folensbee, R., & Lerman, C. (1983). Stimulus control applications to the treatment of worry. <em>Behaviour Research and Therapy</em>, 21(3), 247–251." },
  { id: "zaccaro2018",    testo: "Zaccaro, A., et al. (2018). How breath-control can change your life: A systematic review on psycho-physiological correlates of slow breathing. <em>Frontiers in Human Neuroscience</em>, 12." },
  { id: "lehrer2014",     testo: "Lehrer, P. M., & Gevirtz, R. (2014). Heart rate variability biofeedback: How and why does it work? <em>Frontiers in Psychology</em>, 5." },
  { id: "iyengar2000",    testo: "Iyengar, S. S., & Lepper, M. R. (2000). When choice is demotivating: Can one desire too much of a good thing? <em>Journal of Personality and Social Psychology</em>, 79(6), 995–1006." },
  { id: "mesibov2005",    testo: "Mesibov, G. B., Shea, V., & Schopler, E. (2005). <em>The TEACCH Approach to Autism Spectrum Disorders</em>. Springer." },
  { id: "hull2017",       testo: "Hull, L., et al. (2017). “Putting on my best normal”: Social camouflaging in adults with autism spectrum conditions. <em>Journal of Autism and Developmental Disorders</em>, 47(8), 2519–2534." },
  { id: "kapp2019",       testo: "Kapp, S. K., et al. (2019). “People should be allowed to do what they like”: Autistic adults' views and experiences of stimming. <em>Autism</em>, 23(7), 1782–1792." },
  { id: "najavits2002",   testo: "Najavits, L. M. (2002). <em>Seeking Safety: A Treatment Manual for PTSD and Substance Abuse</em>. Guilford Press." },
  { id: "volkow2009",     testo: "Volkow, N. D., et al. (2009). Evaluating dopamine reward pathway in ADHD: Clinical implications. <em>JAMA</em>, 302(10), 1084–1091." },
  { id: "knouse2010",     testo: "Knouse, L. E., & Safren, S. A. (2010). Current status of cognitive behavioral therapy for adult attention-deficit hyperactivity disorder. <em>Psychiatric Clinics of North America</em>, 33(3), 497–509." },
  { id: "gathercole2008", testo: "Gathercole, S. E., & Alloway, T. P. (2008). <em>Working Memory and Learning: A Practical Guide for Teachers</em>. Sage." },
  { id: "cirillo2018",    testo: "Cirillo, F. (2018). <em>The Pomodoro Technique: The Life-Changing Time-Management System</em>. Virgin Books." },
  { id: "legge170",       testo: "Legge 8 ottobre 2010, n. 170 — “Nuove norme in materia di disturbi specifici di apprendimento in ambito scolastico” (Italia)." },
  { id: "toplak2006",     testo: "Toplak, M. E., Dockstader, C., & Tannock, R. (2006). Temporal information processing in ADHD: Findings to date and new methods. <em>Journal of Neuroscience Methods</em>, 151(1), 15–29." },
  { id: "noreika2013",    testo: "Noreika, V., Falter, C. M., & Rubia, K. (2013). Timing deficits in attention-deficit/hyperactivity disorder (ADHD): Evidence from neurocognitive and neuroimaging studies. <em>Neuropsychologia</em>, 51(2), 235–266." },
  { id: "miyake2000",     testo: "Miyake, A., Friedman, N. P., Emerson, M. J., Witzki, A. H., Howerter, A., & Wager, T. D. (2000). The unity and diversity of executive functions and their contributions to complex “frontal lobe” tasks: A latent variable analysis. <em>Cognitive Psychology</em>, 41(1), 49–100." },
  { id: "monsell2003",    testo: "Monsell, S. (2003). Task switching. <em>Trends in Cognitive Sciences</em>, 7(3), 134–140." },
  { id: "beukelman2013",  testo: "Beukelman, D. R., & Mirenda, P. (2013). <em>Augmentative and Alternative Communication: Supporting Children and Adults with Complex Communication Needs</em> (4ª ed.). Paul H. Brookes." },
  { id: "cortese2009",    testo: "Cortese, S., Faraone, S. V., Konofal, E., & Lecendreux, M. (2009). Sleep in children with attention-deficit/hyperactivity disorder: Meta-analysis of subjective and objective studies. <em>Journal of the American Academy of Child & Adolescent Psychiatry</em>, 48(9), 894–908." },
  { id: "irish2015",      testo: "Irish, L. A., Kline, C. E., Gunn, H. E., Buysse, D. J., & Hall, M. H. (2015). The role of sleep hygiene in promoting public health: A review of empirical evidence. <em>Sleep Medicine Reviews</em>, 22, 23–36." },
  { id: "korotitsch1999", testo: "Korotitsch, W. J., & Nelson-Gray, R. O. (1999). An overview of self-monitoring research in assessment and treatment. <em>Psychological Assessment</em>, 11(4), 415–425." },
  { id: "emmons2003",     testo: "Emmons, R. A., & McCullough, M. E. (2003). Counting blessings versus burdens: An experimental investigation of gratitude and subjective well-being in daily life. <em>Journal of Personality and Social Psychology</em>, 84(2), 377–389." },
  { id: "gross1998",      testo: "Gross, J. J. (1998). The emerging field of emotion regulation: An integrative review. <em>Review of General Psychology</em>, 2(3), 271–299." },
  { id: "wood2018",       testo: "Wood, S. G., Moxley, J. H., Tighe, E. L., & Wagner, R. K. (2018). Does use of text-to-speech and related read-aloud tools improve reading comprehension for students with reading disabilities? A meta-analysis. <em>Journal of Learning Disabilities</em>, 51(1), 73–84." },
  { id: "denheijer2017",  testo: "Den Heijer, A. E., et al. (2017). Sweat it out? The effects of physical exercise on cognition and behavior in children and adults with ADHD: A systematic literature review. <em>Journal of Neural Transmission</em>, 124(S1), 3–26." },
  { id: "cepeda2006",     testo: "Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. <em>Psychological Bulletin</em>, 132(3), 354–380." },
  { id: "halberda2008",   testo: "Halberda, J., Mazzocco, M. M. M., & Feigenson, L. (2008). Individual differences in non-verbal number acuity correlate with maths achievement. <em>Nature</em>, 455(7213), 665–668." },
  { id: "kessels2000",    testo: "Kessels, R. P. C., van Zandvoort, M. J. E., Postma, A., Kappelle, L. J., & de Haan, E. H. F. (2000). The Corsi Block-Tapping Task: Standardization and normative data. <em>Applied Neuropsychology</em>, 7(4), 252–258." },
  { id: "verbruggen2008", testo: "Verbruggen, F., & Logan, G. D. (2008). Response inhibition in the stop-signal paradigm. <em>Trends in Cognitive Sciences</em>, 12(11), 418–424." },
  { id: "khoury2013",     testo: "Khoury, B., et al. (2013). Mindfulness-based therapy: A comprehensive meta-analysis. <em>Clinical Psychology Review</em>, 33(6), 763–771." },
  { id: "seligman2005",   testo: "Seligman, M. E. P., Steen, T. A., Park, N., & Peterson, C. (2005). Positive psychology progress: Empirical validation of interventions. <em>American Psychologist</em>, 60(5), 410–421." },
  { id: "kessler2005",    testo: "Kessler, R. C., et al. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS): A short screening scale for use in the general population. <em>Psychological Medicine</em>, 35(2), 245–256." },
  { id: "allison2012",    testo: "Allison, C., Auyeung, B., & Baron-Cohen, S. (2012). Toward brief “red flags” for autism screening: The Short Autism Spectrum Quotient and the Short Quantitative Checklist in 1,000 cases and 3,000 controls. <em>Journal of the American Academy of Child & Adolescent Psychiatry</em>, 51(2), 202–212." },
  { id: "spitzer2006",    testo: "Spitzer, R. L., Kroenke, K., Williams, J. B. W., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: The GAD-7. <em>Archives of Internal Medicine</em>, 166(10), 1092–1097." },
  { id: "dunlosky2013",   testo: "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques: Promising directions from cognitive and educational psychology. <em>Psychological Science in the Public Interest</em>, 14(1), 4–58." },
  { id: "roediger2006",   testo: "Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. <em>Psychological Science</em>, 17(3), 249–255." },
  { id: "rohrer2007",     testo: "Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. <em>Instructional Science</em>, 35(6), 481–498." },
  { id: "bjork2011",      testo: "Bjork, R. A., & Bjork, E. L. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), <em>Psychology and the Real World</em> (pp. 56–64). Worth Publishers." },
  { id: "ericsson1993",   testo: "Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. <em>Psychological Review</em>, 100(3), 363–406." },
];

/* Fonti principali per ogni scheda della sezione Risorse */
const FONTI_CONDIZIONI = {
  "adhd":         ["faraone2021", "barkley1997", "volkow2009", "shaw2014"],
  "autismo":      ["lord2018", "hull2017", "kapp2019", "mesibov2005"],
  "dislessia":    ["peterson2012", "wood2018", "legge170"],
  "discalculia":  ["butterworth2011", "legge170"],
  "disgrafia":    ["legge170", "gathercole2008"],
  "tourette":     ["piacentini2010"],
  "dsa-generale": ["barkley1997", "gollwitzer1999", "gathercole2008", "knouse2010"],
  "ansia-nd":     ["shaw2014", "lieberman2007", "zaccaro2018"],
};

/* Scheda scientifica di ogni gioco e strumento:
   nd    = neurodivergenze per cui è più indicato
   perche = meccanismo, spiegato in modo onesto
   fonti = riferimenti in bibliografia */
const SCHEDE_SCIENZA = {
  /* --- giochi --- */
  memoria: {
    nd: ["adhd", "dsa"],
    perche: "La memoria di lavoro — tenere informazioni in mente mentre le usi — è spesso ridotta nell'ADHD (Martinussen et al., 2005) ed è centrale nelle difficoltà di apprendimento (Gathercole & Alloway, 2008). Questo gioco la esercita in modo giocoso e ti fa vedere, partita dopo partita, come varia con stanchezza e stress. Onestà: l'allenamento migliora soprattutto il compito che alleni — usalo come palestra e termometro, non come cura.",
    fonti: ["martinussen2005", "gathercole2008", "melby2013"],
  },
  stroop: {
    nd: ["adhd", "tourette"],
    perche: "Il compito di Stroop (Stroop, 1935) misura il controllo inibitorio: la capacità di frenare la risposta automatica (leggere la parola) per dare quella richiesta (nominare il colore). L'inibizione è al centro dei modelli scientifici dell'ADHD (Barkley, 1997) ed è la stessa abilità coinvolta nella gestione dei tic, allenata da terapie come la CBIT (Piacentini et al., 2010).",
    fonti: ["stroop1935", "barkley1997", "piacentini2010"],
  },
  riflessi: {
    nd: ["adhd"],
    perche: "Nell'ADHD i tempi di reazione non sono tanto più lenti quanto più variabili: momenti brillanti alternati a “vuoti” di attenzione. Questa variabilità è uno dei reperti più solidi della ricerca (Kofler et al., 2013, meta-analisi su 319 studi). Qui misuri media e oscillazioni: conoscere il proprio ritmo è il primo passo per lavorarci insieme, non contro.",
    fonti: ["kofler2013", "faraone2021"],
  },
  simon: {
    nd: ["adhd", "dsa"],
    perche: "Ripetere sequenze crescenti impegna la memoria di lavoro sequenziale e l'attenzione sostenuta, funzioni spesso fragili nell'ADHD e nei DSA (Martinussen et al., 2005; Gathercole & Alloway, 2008). Colori e suoni insieme sfruttano la codifica multisensoriale: più canali usi, più tracce lasci in memoria.",
    fonti: ["martinussen2005", "gathercole2008"],
  },
  numeri: {
    nd: ["adhd"],
    perche: "Le tabelle di Schulte sono un classico esercizio di scansione visiva e attenzione selettiva: trovare un bersaglio ignorando i distrattori — la stessa abilità che usi per trovare le chiavi su una scrivania piena. L'attenzione sostenuta su compiti poco stimolanti è tra le aree più studiate dell'ADHD (Barkley, 1997; Faraone et al., 2021).",
    fonti: ["barkley1997", "faraone2021"],
  },
  flusso: {
    nd: ["adhd", "dsa"],
    perche: "L'n-back (Kirchner, 1958) è il paradigma più usato nella ricerca sulla memoria di lavoro, resa famosa dallo studio di Jaeggi et al. (2008) sull'intelligenza fluida. La scienza però è divisa: le meta-analisi mostrano che i benefici si trasferiscono poco fuori dal compito (Melby-Lervåg & Hulme, 2013; Simons et al., 2016). Prendilo come una sfida stimolante, non come una promessa.",
    fonti: ["kirchner1958", "jaeggi2008", "melby2013", "simons2016"],
  },
  /* --- strumenti --- */
  pomodoro: {
    nd: ["adhd", "dsa"],
    perche: "L'ADHD comporta spesso “cecità al tempo”: l'orologio interno è poco affidabile e il tempo o vola o non passa mai (Barkley, 1997). Un timer visibile rende il tempo esterno e concreto (tecnica del Pomodoro: Cirillo, 2018), e i blocchi brevi con pause programmate rispettano l'attenzione fluttuante invece di combatterla. Utile anche nello studio con DSA, dove la fatica cognitiva cresce in fretta.",
    fonti: ["barkley1997", "cirillo2018", "knouse2010"],
  },
  attivita: {
    nd: ["adhd", "autismo"],
    perche: "Limitare le priorità a 3 riduce il sovraccarico da scelta, e trasformare “devo studiare” in un passo piccolo e concreto sfrutta le implementation intentions, uno degli effetti più replicati della psicologia (Gollwitzer, 1999). Per l'ADHD le strutture esterne funzionano più della forza di volontà (Knouse & Safren, 2010); per le persone autistiche una lista chiara e prevedibile abbassa l'ansia da indeterminatezza.",
    fonti: ["gollwitzer1999", "knouse2010", "iyengar2000"],
  },
  dump: {
    nd: ["adhd", "ansia"],
    perche: "Scrivere i pensieri li scarica dalla memoria di lavoro, che nell'ADHD è una risorsa preziosa e limitata (Martinussen et al., 2005). Rimandare le preoccupazioni a un momento dedicato è una tecnica clinica validata contro la ruminazione (Borkovec et al., 1983), e mettere le esperienze in parole ha effetti benefici documentati (Pennebaker, 1997).",
    fonti: ["borkovec1983", "pennebaker1997", "martinussen2005"],
  },
  abitudini: {
    nd: ["adhd", "autismo"],
    perche: "Le abitudini si formano ripetendo un gesto nello stesso contesto: in media 66 giorni, con enorme variabilità individuale — e saltare un giorno non azzera nulla (Lally et al., 2010). Il tracciamento visivo con serie 🔥 dà al cervello ADHD la ricompensa immediata di cui il suo sistema dopaminergico ha bisogno (Volkow et al., 2009). Per chi è autistico, le routine sono spesso già alleate naturali: qui diventano visibili.",
    fonti: ["lally2010", "volkow2009"],
  },
  umore: {
    nd: ["ansia", "adhd", "autismo"],
    perche: "Dare un nome a ciò che provi (“affect labeling”) riduce l'attivazione dell'amigdala, il centro dell'allarme emotivo (Lieberman et al., 2007). La disregolazione emotiva è parte integrante dell'ADHD (Shaw et al., 2014) e molte persone autistiche faticano a riconoscere le proprie emozioni: un registro quotidiano di 5 secondi costruisce quella consapevolezza, un giorno alla volta.",
    fonti: ["lieberman2007", "shaw2014"],
  },
  routine: {
    nd: ["autismo", "adhd"],
    perche: "Sapere che cosa viene dopo riduce carico cognitivo e ansia: la strutturazione visiva delle attività è il cuore di approcci validati per l'autismo come il TEACCH (Mesibov et al., 2005). Per l'ADHD, una routine guidata passo-passo aggira il blocco dell'avvio: non devi decidere niente, solo seguire il passo corrente (Knouse & Safren, 2010).",
    fonti: ["mesibov2005", "knouse2010"],
  },
  decisioni: {
    nd: ["adhd", "autismo", "ansia"],
    perche: "Troppe opzioni paralizzano e tolgono soddisfazione anche dopo la scelta (Iyengar & Lepper, 2000). Le funzioni esecutive che servono per decidere si esauriscono con l'uso (Barkley, 1997): per le scelte a basso rischio — cosa mangiare, da dove iniziare — delegare al caso rompe lo stallo e conserva energia per le decisioni che contano davvero.",
    fonti: ["iyengar2000", "barkley1997"],
  },
  suoni: {
    nd: ["adhd", "autismo"],
    perche: "Sembra un paradosso, ma un rumore di fondo moderato può migliorare memoria e attenzione nell'ADHD: il fenomeno della risonanza stocastica, per cui un cervello poco “attivato” lavora meglio con un po' di stimolazione costante (Söderlund et al., 2007). Per chi è autistico, un tappeto sonoro prevedibile può coprire stimoli improvvisi e faticosi (Lord et al., 2018).",
    fonti: ["soderlund2007", "lord2018"],
  },
  respiro: {
    nd: ["ansia", "autismo", "tourette"],
    perche: "Respirare lentamente (circa 6 respiri al minuto) attiva il sistema parasimpatico e abbassa l'attivazione fisiologica: gli effetti su stress e attenzione sono documentati da revisioni sistematiche (Zaccaro et al., 2018; Lehrer & Gevirtz, 2014). Utile prima di un compito difficile, dopo un sovraccarico sensoriale, o quando i tic aumentano con lo stress (Piacentini et al., 2010).",
    fonti: ["zaccaro2018", "lehrer2014", "piacentini2010"],
  },
  grounding: {
    nd: ["ansia", "autismo"],
    perche: "Il 5-4-3-2-1 àncora l'attenzione ai cinque sensi, interrompendo la spirale di ansia, ruminazione o sovraccarico sensoriale: è una tecnica di grounding standard nella clinica dell'ansia e del trauma (Najavits, 2002). Non ti chiede di calmarti — solo di notare ciò che c'è. Il corpo fa il resto.",
    fonti: ["najavits2002", "zaccaro2018"],
  },
  tempo: {
    nd: ["adhd"],
    perche: "La “cecità al tempo” non è un modo di dire: la ricerca documenta nell'ADHD differenze misurabili nel percepire, stimare e riprodurre gli intervalli di tempo (Noreika et al., 2013; Toplak et al., 2006). Questo gioco usa il paradigma di riproduzione temporale dei laboratori: scopri di quanto — e in che direzione — sbaglia il tuo orologio interno. Conoscere il proprio errore sistematico è il primo passo per compensarlo con timer e allarmi (Barkley, 1997).",
    fonti: ["noreika2013", "toplak2006", "barkley1997"],
  },
  rotta: {
    nd: ["adhd", "autismo"],
    perche: "Passare da un compito all'altro ha un costo cognitivo misurabile, lo “switch cost” (Monsell, 2003). La flessibilità cognitiva è una delle tre funzioni esecutive fondamentali (Miyake et al., 2000) e può essere faticosa sia nell'ADHD sia nell'autismo, dove i cambi di contesto improvvisi pesano di più. Qui alleni il cambio di regola in un ambiente sicuro, dove sbagliare fa solo +1 sul contatore.",
    fonti: ["miyake2000", "monsell2003"],
  },
  sos: {
    nd: ["autismo", "ansia"],
    perche: "Durante uno shutdown o un sovraccarico, il canale verbale può chiudersi davvero: non è capriccio, è neurologia (Lord et al., 2018). Preparare in anticipo un messaggio e dei bisogni da indicare è un principio base della Comunicazione Aumentativa e Alternativa (Beukelman & Mirenda, 2013): quando le parole non escono, la carta parla per te.",
    fonti: ["beukelman2013", "lord2018"],
  },
  stima: {
    nd: ["dsa"],
    perche: "Tutti nasciamo con un “senso del numero”: la capacità di stimare quantità a colpo d'occhio, senza contare. La sua precisione correla con le abilità matematiche (Halberda et al., 2008, pubblicato su Nature) ed è spesso più debole nella discalculia (Butterworth et al., 2011). Qui lo eserciti in sicurezza: niente calcoli, niente voti — solo il tuo colpo d'occhio che si affina.",
    fonti: ["halberda2008", "butterworth2011"],
  },
  corsi: {
    nd: ["adhd", "dsa"],
    perche: "Questo gioco è la versione digitale del compito di Corsi, uno dei test di memoria spaziale più usati in neuropsicologia da cinquant'anni (Kessels et al., 2000). La memoria visuo-spaziale lavora insieme a quella verbale ed è tra le componenti spesso fragili nell'ADHD e nei DSA (Martinussen et al., 2005): allenarla in forma di gioco la rende un po' meno estranea.",
    fonti: ["kessels2000", "martinussen2005"],
  },
  gonogo: {
    nd: ["adhd", "tourette"],
    perche: "Il paradigma go/no-go è lo standard dei laboratori per misurare l'inibizione della risposta: agire quando serve, fermarsi quando non serve (Verbruggen & Logan, 2008). È la funzione al centro dei modelli dell'ADHD (Barkley, 1997) e coinvolta nel controllo dei tic. Qui il “no” diventa un gesto allenabile: non premere è la mossa vincente.",
    fonti: ["verbruggen2008", "barkley1997"],
  },
  bodyscan: {
    nd: ["ansia", "autismo"],
    perche: "La scansione corporea è uno degli esercizi centrali dei protocolli mindfulness, la cui efficacia su ansia e stress è documentata da meta-analisi (Khoury et al., 2013). Portare l'attenzione nel corpo, una zona alla volta, allena l'interocezione — sentire i propri segnali interni — che per molte persone (neurodivergenti e non) è la base per accorgersi in tempo di fame, stanchezza e sovraccarico.",
    fonti: ["khoury2013", "zaccaro2018"],
  },
  gratitudine: {
    nd: ["ansia"],
    perche: "“Tre cose buone” è uno degli esercizi più studiati della psicologia positiva: annotare ogni sera tre cose andate bene ha mostrato effetti misurabili su benessere e umore in studi controllati (Seligman et al., 2005; Emmons & McCullough, 2003). Non serve fingere ottimismo: serve dare al positivo lo stesso tempo di attenzione che il cervello dà gratis al negativo.",
    fonti: ["seligman2005", "emmons2003"],
  },
  coach: {
    nd: ["adhd", "dsa"],
    perche: "Non tutte le tecniche di studio sono ugualmente efficaci: la più ampia rassegna mai condotta sull'argomento ha promosso il richiamo attivo (fare pratica di recupero, come nei giochi di memoria) e la pratica distribuita nel tempo a “alta utilità”, mentre ha bocciato abitudini diffusissime come rileggere e sottolineare, di “bassa utilità” (Dunlosky et al., 2013). Il richiamo attivo migliora la ritenzione a lungo termine più della semplice rilettura, anche quando ci si sente meno sicuri durante il test (Roediger & Karpicke, 2006). Questo coach osserva i TUOI dati locali — orari, durate di sessione completate, velocità con cui agisci sulle attività, punti di forza nei giochi — per suggerirti, con queste basi, cosa provare per primo. Nessun modello di intelligenza artificiale è coinvolto: è un motore di regole trasparente, e resta tutto sul tuo dispositivo.",
    fonti: ["dunlosky2013", "roediger2006", "cepeda2006", "rohrer2007"],
  },
};

/* ============================================================
   Percorsi guidati: 7 giorni, un passo al giorno.
   Ogni giorno = una micro-lezione + un'azione concreta + la fonte.
   ============================================================ */

const PERCORSI = [
  {
    id: "adhd7",
    emoji: "⚡",
    nome: "Conosci il tuo ADHD",
    desc: "7 giorni per capire come funziona il tuo motore — e smettere di dartene la colpa.",
    giorni: [
      {
        t: "Non è pigrizia",
        testo: "L'ADHD è una differenza neurobiologica nei circuiti di attenzione, ricompensa e autoregolazione — non un difetto di carattere. Il più grande consenso scientifico mai pubblicato sul tema (208 conclusioni basate su evidenze) lo dice chiaramente: nessuno “se lo inventa”, e non dipende da scarsa volontà. Oggi inizia da qui: il problema non sei tu, è l'attrito tra il tuo cervello e ambienti progettati per cervelli diversi dal tuo.",
        azione: { label: "Leggi la scheda ADHD nelle Risorse", href: "#/risorse" },
        fonte: "faraone2021",
      },
      {
        t: "Il motore a interesse",
        testo: "Il sistema dopaminergico ADHD risponde poco ai premi lontani e molto a interesse, novità, urgenza e sfida. Ecco perché riesci a fare per ore ciò che ti appassiona (iperfocus) e non riesci a iniziare ciò che è “importante ma noioso”. Non è incoerenza: è il tuo carburante. La strategia non è forzare la noia, ma agganciare le cose noiose a qualcosa che accende: musica, gara contro il timer, compagnia.",
        azione: { label: "Scrivi in Svuota la mente 3 attività che ti mandano in iperfocus", href: "#/strumento/dump" },
        fonte: "volkow2009",
      },
      {
        t: "Il tempo invisibile",
        testo: "La ricerca documenta nell'ADHD vere differenze nel percepire e riprodurre il tempo: gli intervalli si accorciano o si allungano rispetto all'orologio reale. Le conseguenze le conosci: ritardi cronici, “ancora 5 minuti” che diventano un'ora, panico da scadenza. Il rimedio non è impegnarsi di più, è rendere il tempo visibile: timer, allarmi, orologi analogici in vista.",
        azione: { label: "Misura il tuo orologio interno con Un minuto esatto", href: "#/gioco/tempo" },
        fonte: "noreika2013",
      },
      {
        t: "La RAM esterna",
        testo: "La memoria di lavoro — il taccuino mentale dove tieni le cose mentre le usi — è in media più piccola nell'ADHD. Per questo entri in una stanza e dimentichi perché, o perdi il filo a metà frase. La soluzione degli esperti è unanime: esternalizzare. Liste, promemoria, oggetti messi sulla porta. Non è barare: è dare al cervello la RAM aggiuntiva che merita.",
        azione: { label: "Metti 3 promemoria fisici per le cose che dimentichi sempre", href: "#/strumento/dump" },
        fonte: "martinussen2005",
      },
      {
        t: "Dopamina buona",
        testo: "Le abitudini si formano ripetendo un gesto nello stesso contesto — in media 66 giorni, e saltare un giorno non azzera nulla. Per un cervello ADHD la chiave è la ricompensa immediata: la spunta, la serie che cresce, il piccolo premio subito dopo. Inizia ridicolmente in piccolo: un bicchiere d'acqua, due minuti di riordino. La costanza nasce dalla facilità, non dallo sforzo.",
        azione: { label: "Crea una micro-abitudine con premio immediato", href: "#/strumento/abitudini" },
        fonte: "lally2010",
      },
      {
        t: "Il corpo nel gioco",
        testo: "L'esercizio fisico è tra gli interventi non farmacologici più studiati per l'ADHD: le revisioni sistematiche mostrano effetti positivi su attenzione, funzioni esecutive e umore. Non serve la maratona: camminare ascoltando musica, ballare in cucina, salire le scale. Il movimento è per il cervello ADHD ciò che il caffè è per gli altri — solo che funziona meglio.",
        azione: { label: "Oggi: 10 minuti di movimento, come preferisci. Poi segna l'umore", href: "#/strumento/umore" },
        fonte: "denheijer2017",
      },
      {
        t: "Il tuo manuale personale",
        testo: "Le emozioni intense — inclusa la fitta dolorosa davanti a un rifiuto percepito — sono parte integrante dell'ADHD, non un difetto aggiuntivo. Oggi chiudi il percorso costruendo il tuo manuale: quali strategie di questa settimana hanno funzionato per te? Scrivile. Sei l'esperto mondiale del tuo cervello: da oggi hai anche la documentazione.",
        azione: { label: "Stampa il tuo report e scrivi le 3 strategie da tenere", href: "#/report" },
        fonte: "shaw2014",
      },
    ],
  },
  {
    id: "sonno7",
    emoji: "😴",
    nome: "Dormire, missione possibile",
    desc: "7 giorni per fare pace con la notte, senza prediche sull'igiene del sonno.",
    giorni: [
      {
        t: "Non sei tu che “non vuoi” dormire",
        testo: "La meta-analisi degli studi sul sonno nell'ADHD è chiara: più difficoltà ad addormentarsi, più risvegli, più resistenza all'ora di andare a letto — anche a livello oggettivo, misurato in laboratorio. Il primo passo è togliere la colpa: il tuo rapporto difficile col sonno ha basi neurobiologiche. Il secondo è raccogliere dati: da stasera, annota solo a che ora spegni la luce.",
        azione: { label: "Annota stasera l'ora in Svuota la mente", href: "#/strumento/dump" },
        fonte: "cortese2009",
      },
      {
        t: "La vendetta di mezzanotte",
        testo: "Quella voglia di restare svegli fino a tardi “per avere finalmente tempo per te” ha perfino un nome: procrastinazione vendicativa dell'ora di dormire. Il trucco non è resistere, è togliere il motivo: programma 30 minuti di tempo VERAMENTE tuo prima di sera — non ritagli, tempo protetto. Se il tempo per te esiste di giorno, la notte smette di essere l'unico rifugio.",
        azione: { label: "Pianifica ora i tuoi 30 minuti di domani", href: "#/strumento/attivita" },
        fonte: "irish2015",
      },
      {
        t: "L'allarme al contrario",
        testo: "Il cervello ADHD non sente il tempo passare: alle 23:00 “è ancora presto” fino a quando sono le 2:00. La soluzione è banale e potentissima: una sveglia che suona per INIZIARE la sera, non per svegliarti. Quando suona, non devi dormire: devi solo iniziare la rampa di discesa. È il timer esterno che sostituisce l'orologio interno che non suona mai.",
        azione: { label: "Imposta ora sul telefono la sveglia “inizio nanna”", href: "#/strumento/routine" },
        fonte: "barkley1997",
      },
      {
        t: "La rampa di discesa",
        testo: "Il cervello non ha un interruttore on/off: ha bisogno di una rampa. Le revisioni sull'igiene del sonno confermano l'efficacia di routine regolari pre-sonno. Costruiscine una TUA di 3 passi, piacevole (non “lavati i denti”: quello è ovvio) — ad esempio: tisana, pigiama comodo, 10 pagine di un libro leggero. Sempre gli stessi passi, sempre nello stesso ordine: diventano il segnale condizionato del sonno.",
        azione: { label: "Crea la tua routine della sera (3 passi)", href: "#/strumento/routine" },
        fonte: "irish2015",
      },
      {
        t: "Scarica la testa",
        testo: "Ti sdrai e il cervello parte: cose da fare, figuracce del 2019, idee geniali. La tecnica del “rinvio programmato delle preoccupazioni” è validata da decenni: scrivi tutto su carta PRIMA di sdraiarti, con l'impegno esplicito di occupartene domani a un'ora precisa. La mente lascia andare ciò che sa essere al sicuro da qualche parte.",
        azione: { label: "Stasera, 5 minuti di Svuota la mente prima del letto", href: "#/strumento/dump" },
        fonte: "borkovec1983",
      },
      {
        t: "Il freno di emergenza",
        testo: "Se il corpo è attivato, la mente non scende. La respirazione lenta (circa 6 respiri al minuto) attiva il sistema parasimpatico — il freno fisiologico — ed è documentata da revisioni sistematiche. Il 4-7-8 è perfetto da letto: inspira 4, trattieni 7, espira 8. L'espirazione lunga è il segnale di sicurezza più antico che il tuo sistema nervoso conosca.",
        azione: { label: "Stasera: 4 cicli di respirazione 4-7-8 a letto", href: "#/strumento/respiro" },
        fonte: "zaccaro2018",
      },
      {
        t: "Il bilancio del dormiglione",
        testo: "Ultima sera: guarda la settimana. Cosa ha funzionato anche solo un po'? La sveglia della sera? Lo scarico dei pensieri? Tienine due, lascia il resto. E ricorda la regola che batte tutti i trucchi: orari costanti, anche nel weekend. Non per moralismo — perché il tuo ritmo circadiano è un'orchestra che suona bene solo con un direttore prevedibile.",
        azione: { label: "Scrivi le 2 cose da tenere nella routine della sera", href: "#/strumento/dump" },
        fonte: "irish2015",
      },
    ],
  },
  {
    id: "emozioni7",
    emoji: "🌊",
    nome: "Emozioni: dalla piena alla mappa",
    desc: "7 giorni per conoscere le tue onde emotive e costruire la tua cassetta degli attrezzi.",
    giorni: [
      {
        t: "Il volume è più alto, davvero",
        testo: "Se le tue emozioni sembrano sempre “troppo”, non è una tua impressione: la disregolazione emotiva è parte integrante del quadro ADHD (e di molte altre neurodivergenze), documentata da revisioni su American Journal of Psychiatry. Le emozioni arrivano più in fretta, più forti, e ci mettono di più ad andarsene. Primo passo, come sempre: osservare senza giudicare. Da oggi, registra l'umore ogni giorno.",
        azione: { label: "Registra come stai adesso", href: "#/strumento/umore" },
        fonte: "shaw2014",
      },
      {
        t: "Dagli un nome (preciso)",
        testo: "Mettere le emozioni in parole non è un gesto simbolico: negli studi di neuroimaging, l'“affect labeling” riduce l'attivazione dell'amigdala, il centro dell'allarme. Ma funziona meglio con parole precise: non “sto male” — deluso? invidioso? stanco? umiliato? in ansia? Più preciso è il nome, più il cervello passa dalla sirena antincendio alla mappa dell'incendio.",
        azione: { label: "Oggi registra l'umore CON una parola precisa nella nota", href: "#/strumento/umore" },
        fonte: "lieberman2007",
      },
      {
        t: "Prima il corpo, poi la mente",
        testo: "Quando l'onda è alta, ragionare non funziona: il corpo comanda. La strada più rapida per abbassare l'attivazione fisiologica è la respirazione lenta, i cui effetti su stress e stato emotivo sono documentati da revisioni sistematiche. Non devi “calmarti” (ordine impossibile): devi solo allungare l'espirazione per 2 minuti. Il resto lo fa la fisiologia.",
        azione: { label: "Fai 3 cicli di respirazione, adesso che sei calmo: è allenamento", href: "#/strumento/respiro" },
        fonte: "zaccaro2018",
      },
      {
        t: "L'onda passa (sempre)",
        testo: "Le emozioni sono onde: salgono, hanno un picco, scendono. Sempre. Durante il picco il compito non è risolvere, è restare ancorato finché scende: il grounding 5-4-3-2-1 usa i cinque sensi come ancora, ed è tecnica standard nella clinica dell'ansia e del trauma. Provalo oggi da calmo, così al prossimo picco il corpo saprà già la strada.",
        azione: { label: "Prova il 5-4-3-2-1 adesso", href: "#/strumento/grounding" },
        fonte: "najavits2002",
      },
      {
        t: "Quando il rifiuto brucia",
        testo: "Una critica leggera che ti devasta, un messaggio senza risposta che diventa un processo: la sensibilità estrema al rifiuto è comune nell'ADHD e ha basi nella disregolazione emotiva documentata dalla ricerca. Il antidoto quotidiano è l'autocompassione concreta: parlarti come parleresti al tuo migliore amico nella stessa situazione. Non è indulgenza: è accuratezza — tu meriti la stessa gentilezza.",
        azione: { label: "Scrivi a te stesso 3 righe da migliore amico", href: "#/strumento/dump" },
        fonte: "shaw2014",
      },
      {
        t: "Tre cose buone",
        testo: "L'attenzione neurodivergente si aggancia al negativo con l'iperfocus. L'esercizio della gratitudine — annotare regolarmente cose buone concrete — ha mostrato in studi sperimentali effetti misurabili sul benessere. Non serve fingere che vada tutto bene: serve dare al positivo lo stesso tempo di schermo che dai al negativo. Tre cose, anche piccole: il caffè buono, un messaggio carino, il sole.",
        azione: { label: "Scrivi le 3 cose buone di oggi", href: "#/strumento/dump" },
        fonte: "emmons2003",
      },
      {
        t: "La tua cassetta degli attrezzi",
        testo: "La ricerca sulla regolazione emotiva distingue le strategie che agiscono PRIMA (scegliere le situazioni, prepararsi, reinterpretare) da quelle che agiscono DOPO (sopprimere — la meno efficace e la più costosa). Oggi scrivi il tuo “piano piena”: quali sono i tuoi primi segnali d'onda? Quale strumento usi per ciascuno? Un piano scritto da calmo vale oro quando sei nel picco.",
        azione: { label: "Scrivi il tuo piano piena e salvalo", href: "#/strumento/dump" },
        fonte: "gross1998",
      },
    ],
  },
];

/* ============================================================
   Test di screening: questionari validati e riconosciuti,
   in adattamento italiano. NON producono diagnosi: indicano
   solo se ha senso un approfondimento professionale.
   ============================================================ */

const TEST_DISCLAIMER = "Questo è uno strumento di screening, NON una diagnosi. Nessun questionario può dirti se sei ADHD, autistico o ansioso: può solo suggerire se ha senso approfondire con una persona professionista (medico, psicologo, neuropsichiatra). Qualunque sia il risultato, se qualcosa ti pesa, meriti ascolto. Le risposte restano solo sul tuo dispositivo.";

const TESTS = [
  {
    id: "asrs",
    emoji: "⚡",
    nome: "Screening ADHD adulti",
    strumento: "ASRS v1.1 · parte A (Organizzazione Mondiale della Sanità)",
    per: "ADHD · dai 18 anni",
    nd: "adhd",
    fonte: "kessler2005",
    tipo: "asrs",
    intro: "Le 6 domande di screening della Adult ADHD Self-Report Scale, sviluppata con l'OMS (Kessler et al., 2005). Rispondi pensando a come ti sei sentito e comportato negli ultimi 6 mesi.",
    opzioni: ["Mai", "Raramente", "A volte", "Spesso", "Molto spesso"],
    domande: [
      { t: "Quanto spesso hai difficoltà a completare i dettagli finali di un progetto, una volta fatte le parti più impegnative?", soglia: 2 },
      { t: "Quanto spesso hai difficoltà a mettere le cose in ordine quando devi svolgere un compito che richiede organizzazione?", soglia: 2 },
      { t: "Quanto spesso hai problemi a ricordare appuntamenti o impegni?", soglia: 2 },
      { t: "Quando un compito richiede molta riflessione, quanto spesso eviti di iniziarlo o lo rimandi?", soglia: 3 },
      { t: "Quanto spesso muovi o agiti mani o piedi quando devi stare seduto a lungo?", soglia: 3 },
      { t: "Quanto spesso ti senti eccessivamente attivo e spinto a fare cose, come se avessi un motore dentro?", soglia: 3 },
    ],
    sogliaPositiva: 4,
    max: 6,
    unita: "risposte significative su 6",
  },
  {
    id: "aq10",
    emoji: "♾️",
    nome: "Screening tratti autistici",
    strumento: "AQ-10 adulti (Autism Research Centre, Università di Cambridge)",
    per: "Autismo · dai 18 anni",
    nd: "autismo",
    fonte: "allison2012",
    tipo: "aq",
    intro: "La versione breve dell'Autism Spectrum Quotient (Allison, Auyeung & Baron-Cohen, 2012), usata anche dal sistema sanitario inglese come 'bandierina' per l'invio alla valutazione. Rispondi d'istinto: non ci sono risposte giuste.",
    opzioni: ["Decisamente d'accordo", "Abbastanza d'accordo", "Abbastanza in disaccordo", "Decisamente in disaccordo"],
    domande: [
      { t: "Noto spesso piccoli suoni che gli altri non notano.", agree: true },
      { t: "Di solito mi concentro più sull'insieme che sui piccoli dettagli.", agree: false },
      { t: "Trovo facile fare più cose contemporaneamente.", agree: false },
      { t: "Se vengo interrotto, riesco a tornare molto in fretta a ciò che stavo facendo.", agree: false },
      { t: "Trovo facile “leggere tra le righe” quando qualcuno mi parla.", agree: false },
      { t: "Capisco se chi mi ascolta si sta annoiando.", agree: false },
      { t: "Quando leggo una storia, faccio fatica a capire le intenzioni dei personaggi.", agree: true },
      { t: "Mi piace raccogliere informazioni su categorie di cose (tipi di auto, di uccelli, di treni, di piante…).", agree: true },
      { t: "Trovo facile capire cosa pensa o prova qualcuno guardandolo in viso.", agree: false },
      { t: "Faccio fatica a capire le intenzioni delle persone.", agree: true },
    ],
    sogliaPositiva: 6,
    max: 10,
    unita: "punti su 10",
  },
  {
    id: "gad7",
    emoji: "🌊",
    nome: "Screening ansia",
    strumento: "GAD-7 (Spitzer, Kroenke, Williams & Löwe)",
    per: "Ansia · dai 18 anni",
    nd: "ansia",
    fonte: "spitzer2006",
    tipo: "gad",
    intro: "Il questionario più usato al mondo per lo screening dell'ansia generalizzata (Spitzer et al., 2006), liberamente utilizzabile. Pensa alle ULTIME 2 SETTIMANE: quanto spesso ti hanno dato fastidio questi problemi?",
    opzioni: ["Mai", "Diversi giorni", "Più della metà dei giorni", "Quasi ogni giorno"],
    domande: [
      { t: "Sentirti nervoso/a, ansioso/a o con i nervi a fior di pelle." },
      { t: "Non riuscire a smettere di preoccuparti o a tenere sotto controllo le preoccupazioni." },
      { t: "Preoccuparti troppo per cose diverse." },
      { t: "Avere difficoltà a rilassarti." },
      { t: "Essere così irrequieto/a da far fatica a stare fermo/a." },
      { t: "Infastidirti o irritarti facilmente." },
      { t: "Avere paura che possa succedere qualcosa di terribile." },
    ],
    sogliaPositiva: 10,
    max: 21,
    unita: "punti su 21",
  },
];

const NOTA_SCIENZA = {
  titolo: "La scienza, con onestà",
  testo: "Ogni gioco e strumento di NeuroSpazio è costruito su meccanismi descritti nella letteratura scientifica: li trovi citati nelle schede “🔬 Per chi è pensato e perché funziona” e per esteso qui sotto. Un patto di onestà, però: i giochi cognitivi migliorano soprattutto la prestazione nel gioco stesso — il trasferimento alla vita quotidiana è dibattuto (Melby-Lervåg & Hulme, 2013; Simons et al., 2016). Usali come palestra, termometro dell'attenzione e fonte di dopamina buona. Gli strumenti (timer, liste, routine, respirazione, grounding) si basano invece su strategie con prove di efficacia clinica ed educativa consolidate. E in ogni caso: nessuna app sostituisce una valutazione e un supporto professionale.",
};
