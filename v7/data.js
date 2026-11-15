// Dati di esempio del report DEM Michelin, condivisi da index.html e dem.html.
window.LULOP_DATA = (function () {
  'use strict';

  var TODAY = '2026-10-23';
  var UPDATED_LABEL = '23 ottobre 2026 alle 06:00';

  // Ordine delle liste di interesse: lo stesso usato in DEM[].lists
  var LISTS = [
    { name: 'Automotive', iscritti: 3820 },
    { name: 'Green e mobilità', iscritti: 2150 },
    { name: 'Moto', iscritti: 1940 },
    { name: 'Food & Wine', iscritti: 1120 },
    { name: 'Tecnologia', iscritti: 1610 },
    { name: 'Lifestyle', iscritti: 1380 },
    { name: 'Travel', iscritti: 890 }
  ];

  // id, data, ora, titolo, invii, aperture uniche,
  // click news, download, versione web, altri link, disiscrizioni,
  // [aperture, click] per lista di interesse (ordine di LISTS; un giornalista può stare in più liste)
  var ROWS = [
    [37388, '2026-09-02', '10:00', 'Michelin CrossClimate 3: la gamma si amplia a 40 misure', 4120, 1350, 160, 70, 22, 8, 6, [[603, 86], [194, 25], [136, 20], [63, 10], [200, 33], [101, 15], [80, 14]]],
    [37402, '2026-09-04', '15:30', 'Guida MICHELIN Italia 2027: i nuovi Bib Gourmand', 5210, 1610, 150, 55, 30, 10, 9, [[151, 18], [99, 13], [49, 6], [901, 88], [68, 7], [334, 38], [468, 64]]],
    [37431, '2026-09-10', '09:45', 'Michelin al Salone Auto Torino: le novità in mostra', 3980, 1180, 120, 48, 18, 6, 5, [[425, 60], [145, 18], [262, 29], [44, 6], [170, 21], [137, 19], [70, 9]]],
    [37456, '2026-09-16', '16:00', 'Michelin X Multi Energy: meno consumi per il trasporto regionale', 4870, 1420, 130, 62, 21, 9, 7, [[595, 75], [409, 55], [43, 6], [29, 3], [275, 28], [42, 6], [67, 9]]],
    [37470, '2026-09-18', '11:00', 'Guida MICHELIN Italia 2027: annunciata la data della presentazione', 4210, 1530, 210, 60, 28, 11, 4, [[142, 26], [96, 15], [49, 7], [820, 132], [62, 10], [355, 62], [457, 78]]],
    [37495, '2026-09-24', '10:15', 'Michelin Power Cup: il nuovo pneumatico per la pista', 3890, 1210, 140, 72, 19, 7, 6, [[247, 44], [74, 13], [738, 103], [24, 4], [89, 15], [115, 17], [90, 16]]],
    [37508, '2026-09-29', '15:00', 'Michelin Uptis: lo pneumatico senza aria arriva sulle flotte', 5020, 1490, 120, 58, 24, 8, 10, [[420, 47], [644, 82], [83, 10], [45, 6], [313, 37], [101, 11], [58, 7]]],
    [37522, '2026-10-01', '10:30', 'Michelin e la mobilità sostenibile: pneumatici con il 45% di materiali rinnovabili', 4180, 1390, 170, 80, 25, 9, 5, [[448, 61], [580, 92], [80, 14], [42, 6], [256, 44], [95, 16], [60, 10]]],
    [37541, '2026-10-06', '16:15', 'Guida MICHELIN Italia 2027: i premi speciali', 5150, 1720, 190, 60, 33, 11, 8, [[172, 24], [106, 12], [55, 8], [948, 133], [68, 9], [354, 54], [480, 61]]],
    [37563, '2026-10-09', '09:30', 'Michelin Pilot Sport 5 Energy: la versione per le auto elettriche', 4230, 1460, 195, 92, 27, 10, 6, [[418, 70], [626, 99], [81, 14], [41, 7], [270, 58], [104, 16], [56, 10]]],
    [37588, '2026-10-14', '11:30', 'Guida MICHELIN Italia 2027: le nuove Stelle Verdi', 4260, 1690, 260, 75, 35, 12, 4, [[165, 27], [107, 21], [50, 9], [821, 140], [66, 11], [391, 60], [468, 104]]],
    [37602, '2026-10-15', '15:45', 'Michelin a EICMA 2026: le novità in arrivo', 5090, 1550, 160, 70, 26, 9, 9, [[343, 42], [94, 11], [903, 141], [33, 4], [119, 16], [147, 23], [125, 18]]],
    [37627, '2026-10-20', '10:00', 'Michelin Anakee Road: il nuovo pneumatico per le maxi enduro', 3940, 1300, 185, 95, 21, 8, 7, [[278, 50], [82, 17], [797, 156], [27, 5], [99, 20], [127, 21], [96, 18]]],
    [37649, '2026-10-21', '16:30', 'Guida MICHELIN Italia 2027: tre nuovi ristoranti stellati', 5180, 1680, 175, 58, 31, 10, 8, [[162, 23], [108, 13], [54, 8], [937, 109], [64, 8], [352, 44], [514, 74]]],
    [37661, '2026-10-22', '09:15', 'Michelin X Line Energy: meno consumi per il trasporto pesante', 4050, 1240, 150, 88, 20, 7, 5, [[523, 84], [381, 69], [35, 7], [26, 5], [232, 38], [35, 7], [60, 12]]]
  ];

  // Per ogni DEM: bounce e liste di interesse a cui è stata inviata (indici di LISTS)
  var SENT = {
    37388: [22, [0, 4]], 37402: [31, [3, 6, 5]], 37431: [18, [0, 2]], 37456: [27, [0, 1, 4]],
    37470: [20, [3, 6, 5]], 37495: [16, [2, 0]], 37508: [29, [1, 0, 4]], 37522: [21, [1, 0, 4]],
    37541: [33, [3, 6, 5]], 37563: [19, [1, 0, 4]], 37588: [24, [3, 6, 5]], 37602: [28, [2, 0]],
    37627: [14, [2, 0]], 37649: [30, [3, 6, 5]], 37661: [12, [0, 1, 4]]
  };

  var DEMS = ROWS.map(function (d) {
    return {
      id: d[0], date: d[1], time: d[2], title: d[3],
      invii: d[4], ap: d[5], news: d[6], dl: d[7], web: d[8], altro: d[9], unsub: d[10],
      bounce: SENT[d[0]][0],
      sentTo: SENT[d[0]][1].map(function (i) { return LISTS[i].name; }),
      guide: /Guida MICHELIN/.test(d[3]),
      cu: Math.round((d[6] + d[7] + d[8] + d[9]) * 0.8),
      lists: d[11].map(function (v, i) { return { name: LISTS[i].name, ap: v[0], cl: v[1] }; })
    };
  });

  var WEEKS = [
    ['2026-08-31', '2026-09-06', '31 ago – 6 set'], ['2026-09-07', '2026-09-13', '7 – 13 set'],
    ['2026-09-14', '2026-09-20', '14 – 20 set'], ['2026-09-21', '2026-09-27', '21 – 27 set'],
    ['2026-09-28', '2026-10-04', '28 set – 4 ott'], ['2026-10-05', '2026-10-11', '5 – 11 ott'],
    ['2026-10-12', '2026-10-18', '12 – 18 ott'], ['2026-10-19', '2026-10-25', '19 – 25 ott']
  ];

  var MONTH_LIST = [
    { key: '2026-09', label: 'Settembre 2026', range: ['2026-09-01', '2026-09-30'], prev: null },
    { key: '2026-10', label: 'Ottobre 2026', range: ['2026-10-01', '2026-10-31'], prev: ['2026-09-01', '2026-09-30'] }
  ];

  // Testate: nome, categoria, indice della lista di interesse (ordine di LISTS).
  // Per ogni DEM le più attive sono quelle delle liste che l'hanno aperta di più.
  var TESTATE = [
    ['Quattroruote', 'Automotive', 0], ['Motor1 Italia', 'Automotive', 0],
    ['InsideEVs Italia', 'Green e mobilità', 1], ['Vaielettrico', 'Green e mobilità', 1],
    ['Motociclismo', 'Moto', 2], ['Dueruote', 'Moto', 2],
    ['Gambero Rosso', 'Food & Wine', 3], ['Dissapore', 'Food & Wine', 3], ['Identità Golose', 'Food & Wine', 3],
    ['Il Sole 24 Ore', 'Economia', 4], ['Wired Italia', 'Tecnologia', 4],
    ['Vanity Fair Italia', 'Lifestyle', 5], ['Dove Viaggi', 'Travel', 6]
  ];
  var T_AP = [0.032, 0.027, 0.022, 0.019, 0.017, 0.015, 0.013, 0.011];
  var T_CL = [0.045, 0.035, 0.03, 0.026, 0.022, 0.018, 0.016, 0.012];

  // Aperture uniche nelle fasce dopo l'invio
  var TIMELINE = { names: ['0–2 ore', '2–6 ore', '6–12 ore', '12–24 ore', '2° giorno', '3° giorno', '4–7 giorni'], shares: [0.38, 0.2, 0.12, 0.12, 0.09, 0.05, 0.04] };

  var DEFS = {
    aperture: 'Aperture uniche: destinatari che hanno aperto la DEM almeno una volta.',
    apmedia: 'Apertura media: aperture uniche divise per invii, nel periodo selezionato.',
    apertura: 'Apertura: aperture uniche divise per invii.',
    click: 'Click unici: destinatari che hanno cliccato almeno un link. Le disiscrizioni non sono conteggiate.',
    ctr: 'CTR: click unici diviso invii. Stesso calcolo del report mensile che ricevi già.',
    disiscrizioni: 'Disiscrizioni: destinatari che hanno scelto di non ricevere più le DEM.'
  };

  var GLOSSARY = [
    ['DEM', 'il comunicato che Lulop invia via email ai giornalisti delle liste di interesse scelte.'],
    ['Aperture uniche', 'destinatari che hanno aperto la DEM almeno una volta.'],
    ['Click unici', 'destinatari che hanno cliccato almeno un link, disiscrizioni escluse.'],
    ['CTR', 'click unici diviso invii. Stesso calcolo del report mensile.'],
    ['Dati in corso', 'nei 7 giorni dopo l’invio i numeri cambiano ancora: mostriamo solo come si dividono gli invii. Apertura e CTR arrivano a dati completi.'],
    ['Bounce', 'email non consegnate, per esempio perché l’indirizzo non esiste più.'],
    ['Lettura delle news', 'click sul link che apre il comunicato su Lulop.'],
    ['Download', 'click per scaricare immagini o allegati.'],
    ['Interazione web', 'click per aprire la DEM nel browser.'],
    ['Altri link', 'click sui link che non rientrano nelle voci precedenti.'],
    ['Aggiornamento', 'i dati si aggiornano ogni notte.']
  ];

  // ---------- Invia a un contatto ----------

  // DEM programmate su Lulop (non ancora inviate, quindi senza statistiche)
  var SCHEDULED = [
    { id: 37690, date: '2026-10-28', time: '10:00', title: 'Michelin Primacy 5: più chilometri e meno consumi per le auto di tutti i giorni' },
    { id: 37702, date: '2026-10-30', time: '09:30', title: 'Guida MICHELIN Italia 2027: come seguire la cerimonia di presentazione' }
  ];

  // Email già presenti tra i giornalisti Lulop (per l'avviso nel form)
  var JOURNALISTS = ['redazione@quattroruote.it', 'm.bianchi@motociclismo.it', 'redazione@dissapore.com', 'desk@gamberorosso.it'];

  // Invii già fatti dal cliente con "Invia a un contatto"
  var SEND_HISTORY = [
    { at: '2026-10-22T18:10', demId: 37690, status: 'scheduled', contacts: [
      { nome: 'Paolo', cognome: 'Greco', email: 'paolo.greco@autoblog.it', testata: 'Autoblog' }] },
    { at: '2026-10-17T11:24', demId: 37602, status: 'sent', contacts: [
      { nome: 'Luca', cognome: 'Ferri', email: 'luca.ferri@motoblog.it', testata: 'Motoblog' },
      { nome: 'Sara', cognome: 'Conti', email: 's.conti@dueruote.it', testata: 'Dueruote' }] },
    { at: '2026-10-15T16:02', demId: 37588, status: 'sent', contacts: [
      { nome: 'Elena', cognome: 'Marino', email: 'elena.marino@finedining.it', testata: 'Fine Dining Lovers' }] }
  ];

  var PREFIXES = [['+39', 'Italia'], ['+41', 'CH', 'Svizzera'], ['+33', 'FR', 'Francia'], ['+49', 'DE', 'Germania'], ['+34', 'ES', 'Spagna'], ['+43', 'AT', 'Austria'], ['+44', 'UK', 'Regno Unito'], ['+1', 'US', 'Stati Uniti']];

  var SEND_LIMIT = 10; // provvisorio, da confermare

  return {
    TODAY: TODAY, UPDATED_LABEL: UPDATED_LABEL, LISTS: LISTS, DEMS: DEMS,
    WEEKS: WEEKS, MONTH_LIST: MONTH_LIST,
    TESTATE: TESTATE, T_AP: T_AP, T_CL: T_CL, TIMELINE: TIMELINE, DEFS: DEFS, GLOSSARY: GLOSSARY,
    SCHEDULED: SCHEDULED, JOURNALISTS: JOURNALISTS, SEND_HISTORY: SEND_HISTORY, PREFIXES: PREFIXES, SEND_LIMIT: SEND_LIMIT
  };
})();
