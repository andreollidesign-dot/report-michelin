// Dati di esempio del report DEM Michelin, condivisi da index.html e dem.html.
window.LULOP_DATA = (function () {
  'use strict';

  var TODAY = '2026-10-23';
  var UPDATED_LABEL = '23 ottobre 2026 alle 06:00';

  // Ordine delle liste di interesse: lo stesso usato in DEM[].lists
  var LISTS = [
    { name: 'Automotive', it: 3820, en: 4510 },
    { name: 'Green e mobilità', it: 2150, en: 2630 },
    { name: 'Moto', it: 1940, en: 2280 },
    { name: 'Food & Wine', it: 1120, en: 1460 },
    { name: 'Tecnologia', it: 1610, en: 1980 },
    { name: 'Lifestyle', it: 1380, en: 1720 },
    { name: 'Travel', it: 890, en: 1240 }
  ];

  // id, data, ora, lingua, titolo, invii, aperture uniche,
  // click news, download, versione web, altri link, disiscrizioni,
  // [aperture, click] per lista di interesse (ordine di LISTS; un giornalista può stare in più liste)
  var ROWS = [
    [37388, '2026-09-02', '10:00', 'IT', 'Michelin CrossClimate 3: la gamma si amplia a 40 misure', 4120, 1350, 160, 70, 22, 8, 6, [[603, 86], [194, 25], [136, 20], [63, 10], [200, 33], [101, 15], [80, 14]]],
    [37402, '2026-09-04', '15:30', 'EN', 'MICHELIN Guide Texas 2026: the new selection', 5210, 1610, 150, 55, 30, 10, 9, [[151, 18], [99, 13], [49, 6], [901, 88], [68, 7], [334, 38], [468, 64]]],
    [37431, '2026-09-10', '09:45', 'IT', 'Michelin al Salone Auto Torino: le novità in mostra', 3980, 1180, 120, 48, 18, 6, 5, [[425, 60], [145, 18], [262, 29], [44, 6], [170, 21], [137, 19], [70, 9]]],
    [37456, '2026-09-16', '16:00', 'EN', 'Michelin X Multi Energy: lower fuel consumption for long-haul trucks', 4870, 1420, 130, 62, 21, 9, 7, [[595, 75], [409, 55], [43, 6], [29, 3], [275, 28], [42, 6], [67, 9]]],
    [37470, '2026-09-18', '11:00', 'IT', 'Guida MICHELIN Italia 2027: annunciata la data della presentazione', 4210, 1530, 210, 60, 28, 11, 4, [[142, 26], [96, 15], [49, 7], [820, 132], [62, 10], [355, 62], [457, 78]]],
    [37495, '2026-09-24', '10:15', 'IT', 'Michelin Power Cup: il nuovo pneumatico per la pista', 3890, 1210, 140, 72, 19, 7, 6, [[247, 44], [74, 13], [738, 103], [24, 4], [89, 15], [115, 17], [90, 16]]],
    [37508, '2026-09-29', '15:00', 'EN', 'Michelin and sustainable mobility: tyres with 45% renewable materials', 5020, 1490, 120, 58, 24, 8, 10, [[420, 47], [644, 82], [83, 10], [45, 6], [313, 37], [101, 11], [58, 7]]],
    [37522, '2026-10-01', '10:30', 'IT', 'Michelin e la mobilità sostenibile: pneumatici con il 45% di materiali rinnovabili', 4180, 1390, 170, 80, 25, 9, 5, [[448, 61], [580, 92], [80, 14], [42, 6], [256, 44], [95, 16], [60, 10]]],
    [37541, '2026-10-06', '16:15', 'EN', 'MICHELIN Guide Nordic Countries 2026', 5150, 1720, 190, 60, 33, 11, 8, [[172, 24], [106, 12], [55, 8], [948, 133], [68, 9], [354, 54], [480, 61]]],
    [37563, '2026-10-09', '09:30', 'IT', 'Michelin Pilot Sport 5 Energy: la versione per le auto elettriche', 4230, 1460, 195, 92, 27, 10, 6, [[418, 70], [626, 99], [81, 14], [41, 7], [270, 58], [104, 16], [56, 10]]],
    [37588, '2026-10-14', '11:30', 'IT', 'Guida MICHELIN Italia 2027: le nuove Stelle Verdi', 4260, 1690, 260, 75, 35, 12, 4, [[165, 27], [107, 21], [50, 9], [821, 140], [66, 11], [391, 60], [468, 104]]],
    [37602, '2026-10-15', '15:45', 'EN', 'Michelin at EICMA 2026: what to expect', 5090, 1550, 160, 70, 26, 9, 9, [[343, 42], [94, 11], [903, 141], [33, 4], [119, 16], [147, 23], [125, 18]]],
    [37627, '2026-10-20', '10:00', 'IT', 'Michelin Anakee Road: il nuovo pneumatico per le maxi enduro', 3940, 1300, 185, 95, 21, 8, 7, [[278, 50], [82, 17], [797, 156], [27, 5], [99, 20], [127, 21], [96, 18]]],
    [37649, '2026-10-21', '16:30', 'EN', 'MICHELIN Guide Texas: three new stars', 5180, 1680, 175, 58, 31, 10, 8, [[162, 23], [108, 13], [54, 8], [937, 109], [64, 8], [352, 44], [514, 74]]],
    [37661, '2026-10-22', '09:15', 'IT', 'Michelin X Line Energy: meno consumi per il trasporto pesante', 4050, 1240, 150, 88, 20, 7, 5, [[523, 84], [381, 69], [35, 7], [26, 5], [232, 38], [35, 7], [60, 12]]]
  ];

  var DEMS = ROWS.map(function (d) {
    return {
      id: d[0], date: d[1], time: d[2], lang: d[3], title: d[4],
      invii: d[5], ap: d[6], news: d[7], dl: d[8], web: d[9], altro: d[10], unsub: d[11],
      cu: Math.round((d[7] + d[8] + d[9] + d[10]) * 0.8),
      lists: d[12].map(function (v, i) { return { name: LISTS[i].name, ap: v[0], cl: v[1] }; })
    };
  });

  var MONTH_BASE = [
    { name: 'Mag', it: [12300, 3900, 470], en: [15100, 4500, 430] },
    { name: 'Giu', it: [16400, 5300, 610], en: [15300, 4700, 450] },
    { name: 'Lug', it: [12100, 3800, 440], en: [15000, 4400, 400] },
    { name: 'Ago', it: [4000, 1100, 110], en: [5000, 1400, 120] }
  ];

  var WEEKS = [
    ['2026-08-31', '2026-09-06', '31 ago – 6 set'], ['2026-09-07', '2026-09-13', '7 – 13 set'],
    ['2026-09-14', '2026-09-20', '14 – 20 set'], ['2026-09-21', '2026-09-27', '21 – 27 set'],
    ['2026-09-28', '2026-10-04', '28 set – 4 ott'], ['2026-10-05', '2026-10-11', '5 – 11 ott'],
    ['2026-10-12', '2026-10-18', '12 – 18 ott'], ['2026-10-19', '2026-10-25', '19 – 25 ott']
  ];

  var MONTH_LIST = [
    { key: '2026-09', label: 'Settembre 2026', trendName: 'Set', range: ['2026-09-01', '2026-09-30'], prev: null },
    { key: '2026-10', label: 'Ottobre 2026', trendName: 'Ott', range: ['2026-10-01', '2026-10-31'], prev: ['2026-09-01', '2026-09-30'] }
  ];

  var CUSTOM = { range: ['2026-09-01', '2026-10-23'], label: '1 settembre – 23 ottobre 2026' };

  var TESTATE = {
    IT: [['Quattroruote', 'Automotive'], ['Motor1 Italia', 'Automotive'], ['InsideEVs Italia', 'Green'], ['Motociclismo', 'Moto'], ['Gambero Rosso', 'Food & Wine'], ['Il Sole 24 Ore', 'Economia'], ['Dissapore', 'Food & Wine'], ['Vaielettrico', 'Green']],
    EN: [['Autocar', 'Automotive'], ['Top Gear', 'Automotive'], ['Eater', 'Food & Wine'], ['Electrive', 'Green'], ['Visordown', 'Moto'], ['Fine Dining Lovers', 'Food & Wine'], ['Fleet News', 'Trasporti'], ['Wallpaper*', 'Lifestyle']]
  };
  var T_AP = [0.032, 0.027, 0.022, 0.019, 0.017, 0.015, 0.013, 0.011];
  var T_CL = [0.045, 0.035, 0.03, 0.026, 0.022, 0.018, 0.016, 0.012];

  // Aperture uniche nelle fasce dopo l'invio
  var TIMELINE = { names: ['0–2 h', '2–6 h', '6–12 h', '12–24 h', '2° g', '3° g', '4–7 g'], shares: [0.38, 0.2, 0.12, 0.12, 0.09, 0.05, 0.04] };

  var DEFS = {
    aperture: 'Aperture uniche: destinatari che hanno aperto la DEM almeno una volta.',
    apmedia: 'Apertura media: aperture uniche divise per invii, nel periodo selezionato.',
    apertura: 'Apertura: aperture uniche divise per invii.',
    click: 'Click unici: destinatari che hanno cliccato almeno un link. Le disiscrizioni non sono conteggiate.',
    ctr: 'CTR: click unici diviso invii. Stesso calcolo del report mensile che ricevi già.',
    disiscrizioni: 'Disiscrizioni: destinatari che hanno scelto di non ricevere più le DEM.'
  };

  var GLOSSARY = [
    ['Aperture uniche', 'destinatari che hanno aperto la DEM almeno una volta.'],
    ['Click unici', 'destinatari che hanno cliccato almeno un link, disiscrizioni escluse.'],
    ['CTR', 'click unici diviso invii. Stesso calcolo del report mensile.'],
    ['Aggiornamento', 'i dati si aggiornano ogni notte.']
  ];

  return {
    TODAY: TODAY, UPDATED_LABEL: UPDATED_LABEL, LISTS: LISTS, DEMS: DEMS,
    MONTH_BASE: MONTH_BASE, WEEKS: WEEKS, MONTH_LIST: MONTH_LIST, CUSTOM: CUSTOM,
    TESTATE: TESTATE, T_AP: T_AP, T_CL: T_CL, TIMELINE: TIMELINE, DEFS: DEFS, GLOSSARY: GLOSSARY
  };
})();
