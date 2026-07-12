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

/* ============================================================
   Basi scientifiche
   Ogni gioco e strumento è collegato alle neurodivergenze per
   cui è più utile e alla letteratura che ne descrive il
   meccanismo. Citazioni verificate e verificabili.
   ============================================================ */

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
];

/* Fonti principali per ogni scheda della sezione Risorse */
const FONTI_CONDIZIONI = {
  "adhd":         ["faraone2021", "barkley1997", "volkow2009", "shaw2014"],
  "autismo":      ["lord2018", "hull2017", "kapp2019", "mesibov2005"],
  "dislessia":    ["peterson2012", "legge170"],
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
};

const NOTA_SCIENZA = {
  titolo: "La scienza, con onestà",
  testo: "Ogni gioco e strumento di NeuroSpazio è costruito su meccanismi descritti nella letteratura scientifica: li trovi citati nelle schede “🔬 Per chi è pensato e perché funziona” e per esteso qui sotto. Un patto di onestà, però: i giochi cognitivi migliorano soprattutto la prestazione nel gioco stesso — il trasferimento alla vita quotidiana è dibattuto (Melby-Lervåg & Hulme, 2013; Simons et al., 2016). Usali come palestra, termometro dell'attenzione e fonte di dopamina buona. Gli strumenti (timer, liste, routine, respirazione, grounding) si basano invece su strategie con prove di efficacia clinica ed educativa consolidate. E in ogni caso: nessuna app sostituisce una valutazione e un supporto professionale.",
};
