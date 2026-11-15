// Calcoli, formati e componenti condivisi da index.html e dem.html.
window.LULOP = (function () {
  'use strict';
  var D = window.LULOP_DATA;

  var MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var MONTHS_LONG = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // toLocaleString('it-IT') perde il separatore delle migliaia nei browser con ICU ridotto
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function pct(x) { return (x * 100).toFixed(1).replace('.', ',') + '%'; }
  function inRange(d, r) { return d >= r[0] && d <= r[1]; }
  function sum(list, k) { return list.reduce(function (a, d) { return a + d[k]; }, 0); }
  function parts(s) { var p = s.split('-'); return { y: p[0], m: parseInt(p[1], 10) - 1, d: parseInt(p[2], 10) }; }
  function dateShort(s) { var p = parts(s); return p.d + ' ' + MONTHS[p.m]; }
  function dateLong(s) { var p = parts(s); return p.d + ' ' + MONTHS_LONG[p.m] + ' ' + p.y; }
  function dayMonth(s) { var p = parts(s); return p.d + ' ' + MONTHS_LONG[p.m]; }
  function addDays(s, n) { var t = new Date(Date.parse(s) + n * 86400000); return t.toISOString().slice(0, 10); }
  function daysSince(s) { return Math.round((Date.parse(D.TODAY) - Date.parse(s)) / 86400000); }
  function isPartial(d) { return daysSince(d.date) < 7; }
  function completeLabel(d) { return 'Dati in corso · completi dal ' + dayMonth(addDays(d.date, 7)); }
  // Solo le DEM con dati completi: quelle in corso non entrano in riepiloghi e confronti
  function completed(list) { return list.filter(function (d) { return !isPartial(d); }); }

  function chrono() { return D.DEMS.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id; }); }
  function demById(id) { return D.DEMS.filter(function (d) { return d.id === id; })[0] || null; }
  function latest(n) { return chrono().reverse().slice(0, n); }

  function totals(list) {
    var inv = sum(list, 'invii'), ap = sum(list, 'ap'), cu = sum(list, 'cu');
    return { n: list.length, inv: inv, ap: ap, cu: cu, or: inv ? ap / inv : 0, ctr: inv ? cu / inv : 0 };
  }

  function delta(cur, prev, isRate) {
    if (prev === null || prev === undefined) return { icon: '–', main: 'nessun confronto', suffix: '', cls: 'none' };
    if (isRate) {
      var pp = (cur - prev) * 100;
      if (Math.abs(pp) < 0.05) return { icon: '–', main: 'invariato', suffix: 'vs periodo prec.', cls: 'flat' };
      return { icon: pp > 0 ? '▲' : '▼', main: (pp > 0 ? '+' : '') + pp.toFixed(1).replace('.', ',') + ' punti', suffix: 'vs periodo prec.', cls: pp > 0 ? 'up' : 'down' };
    }
    if (!prev) return { icon: '–', main: 'nessun dato nel periodo prec.', suffix: '', cls: 'none' };
    var v = (cur - prev) / prev * 100;
    if (Math.abs(v) < 0.5) return { icon: '–', main: 'invariato', suffix: 'vs periodo prec.', cls: 'flat' };
    return { icon: v > 0 ? '▲' : '▼', main: (v > 0 ? '+' : '') + Math.round(v) + '%', suffix: 'vs periodo prec.', cls: v > 0 ? 'up' : 'down' };
  }

  // Click per tipo di link, in numeri assoluti ("Altri link" da definire con Lulop)
  function breakdownOf(list) {
    var items = [
      { label: 'Lettura delle news', value: sum(list, 'news') },
      { label: 'Download', value: sum(list, 'dl') },
      { label: 'Interazione web', value: sum(list, 'web') },
      { label: 'Altri link', value: sum(list, 'altro') }
    ];
    var max = Math.max.apply(null, items.map(function (i) { return i.value; })) || 1;
    return items.map(function (i) {
      return { label: i.label, value: fmt(i.value), width: (i.value / max * 100).toFixed(1) };
    });
  }

  // Campagna in corso: come si dividono gli invii finora
  function pieOf(d) {
    var clicked = d.cu, openedOnly = d.ap - d.cu, bounce = d.bounce, notOpened = d.invii - d.ap - d.bounce;
    return [
      { key: 'open', label: 'Solo aperta', value: openedOnly, color: '#F39200' },
      { key: 'click', label: 'Aperta e cliccata', value: clicked, color: '#1E6B33' },
      { key: 'bounce', label: 'Bounce', value: bounce, color: '#A3261E' },
      { key: 'none', label: 'Non aperta', value: notOpened, color: '#D6D6D0' }
    ];
  }

  // Per ogni DEM le 8 testate più attive sono quelle delle liste di interesse che l'hanno aperta di più
  function testateOf(list) {
    var acc = {};
    list.forEach(function (d) {
      D.TESTATE.map(function (t, i) { return { t: t, i: i, w: d.lists[t[2]].ap }; })
        .sort(function (a, b) { return b.w - a.w || a.i - b.i; })
        .slice(0, D.T_AP.length)
        .forEach(function (x, k) {
          var t = x.t;
          if (!acc[t[0]]) acc[t[0]] = { name: t[0], cat: t[1], ap: 0, cl: 0 };
          acc[t[0]].ap += d.ap * D.T_AP[k];
          acc[t[0]].cl += d.cu * D.T_CL[k];
        });
    });
    return Object.keys(acc).map(function (k) { return acc[k]; })
      .sort(function (a, b) { return b.ap - a.ap; })
      .map(function (t) { return { name: t.name, cat: t.cat, apN: t.ap, ap: fmt(t.ap), cl: fmt(Math.max(1, t.cl)) }; });
  }

  // Aperture e click per lista di interesse, sommati sulle DEM date, dalla lista con più aperture
  function listsOf(list) {
    return D.LISTS.map(function (l, i) {
      return { name: l.name, ap: list.reduce(function (a, d) { return a + d.lists[i].ap; }, 0), cl: list.reduce(function (a, d) { return a + d.lists[i].cl; }, 0) };
    }).sort(function (a, b) { return b.ap - a.ap; });
  }

  // ---------- componenti HTML ----------
  var ICONS = {
    link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
    download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    inbox: '<path d="M3 10l2-6h14l2 6"/><path d="M3 10v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8"/><path d="M3 10h5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2h5"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4"/><path d="M12 17v.5"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
    arrowDown: '<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
    send: '<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2"/><path d="M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.6-.6 5-1.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 10"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronUp: '<path d="M6 15l6-6 6 6"/>'
  };
  function icon(name, size) {
    var s = size || 20;
    return '<svg class="ico" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  function infoBtn(key) {
    return '<button type="button" class="info-btn" data-action="info-toggle" aria-label="Definizione">i<span class="info-tip" role="tooltip">' + esc(D.DEFS[key]) + '</span></button>';
  }

  // Etichette su due righe all'ultimo spazio, così non vengono troncate su schermi stretti
  function twoLines(n) {
    var i = n.lastIndexOf(' ');
    return i > -1 ? esc(n.slice(0, i)) + '<br>' + esc(n.slice(i + 1)) : esc(n);
  }

  function barChart(items, opts) {
    var max = Math.max.apply(null, items.map(function (b) { return b.value; })) || 1;
    var h = opts.height;
    var bars = items.map(function (b) {
      return '<div class="bar-col"><span class="val">' + b.label + '</span><div class="bar' + (b.current ? ' current' : '') + '" style="height:' + Math.max(2, Math.round(b.value / max * h)) + 'px"></div></div>';
    }).join('');
    var names = items.map(function (b) { return '<span>' + twoLines(b.name) + '</span>'; }).join('');
    return '<div class="bars" style="height:' + (h + 40) + 'px">' + bars + '</div><div class="bar-names">' + names + '</div>';
  }

  function hbar(label, valueHtml, width, muted) {
    return '<div class="hbar"><div class="hbar-top"><span>' + esc(label) + '</span><span class="n">' + valueHtml + '</span></div>' +
      '<div class="track"><div class="fill' + (muted ? ' muted' : '') + '" style="width:' + width + '%"></div></div></div>';
  }
  function breakdownHtml(list) {
    return breakdownOf(list).map(function (c) { return hbar(c.label, c.value, c.width, false); }).join('');
  }

  // Torta in SVG; parte dall'alto e gira in senso orario
  function pieSvg(segs, size) {
    var tot = segs.reduce(function (a, s) { return a + s.value; }, 0) || 1;
    var r = 50, cx = 50, cy = 50, a0 = -Math.PI / 2, paths = '';
    segs.forEach(function (s) {
      if (!s.value) return;
      var frac = s.value / tot;
      if (frac >= 0.9999) { paths += '<circle cx="50" cy="50" r="50" fill="' + s.color + '"/>'; return; }
      var a1 = a0 + frac * 2 * Math.PI;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      paths += '<path d="M50 50L' + x0.toFixed(3) + ' ' + y0.toFixed(3) + 'A50 50 0 ' + (frac > 0.5 ? 1 : 0) + ' 1 ' + x1.toFixed(3) + ' ' + y1.toFixed(3) + 'Z" fill="' + s.color + '" stroke="#fff" stroke-width="0.8"/>';
      a0 = a1;
    });
    return '<svg class="pie" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + paths + '</svg>';
  }
  // compact: solo le percentuali, per la card del carosello
  function pieLegendHtml(segs, compact) {
    var tot = segs.reduce(function (a, s) { return a + s.value; }, 0) || 1;
    return '<ul class="pie-legend' + (compact ? ' compact' : '') + '">' + segs.map(function (s) {
      return '<li><span class="sw" style="background:' + s.color + '"></span><span class="l">' + esc(s.label) + '</span><span class="v">' +
        (compact ? pct(s.value / tot) : fmt(s.value) + ' <span class="p">· ' + pct(s.value / tot) + '</span>') + '</span></li>';
    }).join('') + '</ul>';
  }

  function ongoingFacts(d) {
    return '<dl class="ongoing-facts">' +
      '<div><dt>Invii</dt><dd>' + fmt(d.invii) + '</dd></div>' +
      '<div><dt>Inviata</dt><dd>' + dateShort(d.date) + ', ' + d.time + '</dd></div>' +
      '<div><dt>Liste</dt><dd>' + d.sentTo.map(esc).join(', ') + '</dd></div>' +
    '</dl>';
  }

  // Grafico a linea: la linea in SVG si adatta alla larghezza, testi e punti restano in HTML (mai sotto i 13 px)
  function lineChart(items, opts) {
    var h = opts.height || 170, n = items.length;
    var vals = items.filter(function (i) { return i.value !== null; }).map(function (i) { return i.value; });
    var max = Math.max.apply(null, vals.concat([0])) || 1;
    function x(i) { return (i + 0.5) / n * 100; }
    function y(v) { return 100 - v / max * 100; }
    var lines = '', areas = '', run = [];
    function flush() {
      if (run.length > 1) {
        var pts = run.map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' ');
        lines += '<polyline points="' + pts + '" fill="none" stroke="#A35200" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
        areas += '<polygon points="' + run[0][0].toFixed(2) + ',100 ' + pts + ' ' + run[run.length - 1][0].toFixed(2) + ',100" fill="rgba(243,146,0,.14)"/>';
      }
      run = [];
    }
    items.forEach(function (it, i) { if (it.value === null) flush(); else run.push([x(i), y(it.value)]); });
    flush();
    var marks = items.map(function (it, i) {
      if (it.value === null) return '';
      var pos = 'left:' + x(i).toFixed(2) + '%;top:' + y(it.value).toFixed(2) + '%';
      return '<span class="lc-dot' + (it.current ? ' current' : '') + '" style="' + pos + '"></span><span class="lc-val" style="' + pos + '">' + it.label + '</span>';
    }).join('');
    var names = items.map(function (it) { return '<span' + (it.current ? ' class="current"' : '') + '>' + it.name + '</span>'; }).join('');
    var table = '<table class="visually-hidden"><caption>' + esc(opts.caption || '') + '</caption><tbody>' + items.map(function (it) {
      return '<tr><th scope="row">' + it.name.replace(/<br>/g, ' ') + '</th><td>' + (it.value === null ? 'nessun dato' : it.label) + '</td></tr>';
    }).join('') + '</tbody></table>';
    return '<div class="line-chart" aria-hidden="true"><div class="lc-plot" style="height:' + h + 'px">' +
        '<svg class="lc-svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">' + areas + lines + '</svg>' + marks +
      '</div><div class="lc-names">' + names + '</div></div>' + table;
  }
  function listBarsHtml(lists) {
    var max = Math.max.apply(null, lists.map(function (l) { return l.ap; })) || 1;
    return lists.map(function (l) {
      return hbar(l.name, fmt(l.ap) + ' <span class="sep">aperture &middot; ' + fmt(l.cl) + ' click</span>', (l.ap / max * 100).toFixed(1), false);
    }).join('');
  }

  function stateMsg(o) {
    return '<div class="state-msg">' + icon(o.icon, 40) +
      '<h2>' + esc(o.title) + '</h2><p>' + esc(o.text) + '</p>' +
      (o.action ? '<button type="button" class="btn primary" data-action="' + o.action + '">' + esc(o.button) + '</button>' : '') +
      (o.href ? '<a class="btn primary" href="' + o.href + '">' + esc(o.button) + '</a>' : '') +
    '</div>';
  }

  function glossaryHtml() {
    return D.GLOSSARY.map(function (g) { return '<p><strong>' + esc(g[0]) + '</strong>: ' + esc(g[1]) + '</p>'; }).join('');
  }

  // ---------- comportamenti ----------
  // Sposta il tooltip quanto basta perché non esca dai bordi dello schermo
  function placeTip(btn) {
    var tip = btn.querySelector('.info-tip');
    if (!tip) return;
    tip.style.marginLeft = '0px';
    var r = tip.getBoundingClientRect();
    if (!r.width) return;
    var vw = document.documentElement.clientWidth, pad = 8, shift = 0;
    if (r.right > vw - pad) shift = vw - pad - r.right;
    if (r.left + shift < pad) shift = pad - r.left;
    tip.style.marginLeft = shift + 'px';
  }
  function bindTooltips() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-action="info-toggle"]');
      var open = document.querySelectorAll('.info-btn.show, .star-icon.show');
      if (!t) { open.forEach(function (x) { x.classList.remove('show'); }); return; }
      e.preventDefault();
      e.stopPropagation();
      var wasOpen = t.classList.contains('show');
      open.forEach(function (x) { x.classList.remove('show'); });
      if (!wasOpen) { t.classList.add('show'); placeTip(t); }
    }, true);
    ['mouseover', 'focusin'].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        var t = e.target.closest && e.target.closest('.info-btn, .star-icon');
        if (t) placeTip(t);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.querySelectorAll('.info-btn.show, .star-icon.show').forEach(function (x) { x.classList.remove('show'); });
      var t = e.target.closest && e.target.closest('span[data-action="info-toggle"]');
      if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.click(); }
    });
  }

  // Ridisegna un contenitore mantenendo il focus sul controllo equivalente
  function keyOf(el) {
    if (!el || !el.dataset) return null;
    if (el.id) return '#' + el.id;
    if (el.dataset.action) return '[data-action="' + el.dataset.action + '"]' + (el.dataset.value ? '[data-value="' + el.dataset.value + '"]' : '') + (el.dataset.key ? '[data-key="' + el.dataset.key + '"]' : '');
    return null;
  }
  function renderKeepingFocus(host, html, fallbackSelector) {
    var active = document.activeElement;
    var key = host.contains(active) ? keyOf(active) : null;
    host.innerHTML = html;
    if (!key) return;
    var again = host.querySelector(key);
    if (!again || again.disabled) again = fallbackSelector ? host.querySelector(fallbackSelector) : null;
    if (again) again.focus({ preventScroll: true });
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage non disponibile */ } }
  function load(key) { try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; } }
  function drop(key) { try { sessionStorage.removeItem(key); } catch (e) { /* storage non disponibile */ } }

  // ---------- accesso (simulato: nessun backend) ----------
  var AUTH_KEY = 'lulop-auth';
  function readFrom(storage) {
    try {
      var a = JSON.parse(storage.getItem(AUTH_KEY));
      if (a && a.exp && a.exp < Date.now()) { storage.removeItem(AUTH_KEY); return null; }
      return a;
    } catch (e) { return null; }
  }
  function isAuthed() { return !!(readFrom(window.localStorage) || readFrom(window.sessionStorage)); }
  function saveAuth(email, rememberDevice) {
    var a = { email: email, exp: rememberDevice ? Date.now() + 30 * 86400000 : null };
    try { (rememberDevice ? localStorage : sessionStorage).setItem(AUTH_KEY, JSON.stringify(a)); } catch (e) { /* storage non disponibile */ }
  }
  function logout() {
    try { localStorage.removeItem(AUTH_KEY); } catch (e) { /* storage non disponibile */ }
    try { sessionStorage.removeItem(AUTH_KEY); } catch (e) { /* storage non disponibile */ }
    location.href = 'login.html';
  }
  // Solo pagine del report, mai URL esterni
  function safeNext(n) { return n && /^(index|dem|invia)\.html(\?[A-Za-z0-9=&%._-]*)?$/.test(n) ? n : 'index.html'; }
  function requireAuth() {
    if (isAuthed()) return true;
    document.documentElement.style.display = 'none';
    var page = (location.pathname.split('/').pop() || 'index.html') + location.search;
    location.replace('login.html?next=' + encodeURIComponent(page));
    return false;
  }
  function bindLogout() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="logout"]')) { e.preventDefault(); logout(); }
    });
  }

  // ---------- DEM inviate e programmate ----------
  function findDem(id) {
    var d = demById(id);
    if (d) return { id: d.id, date: d.date, time: d.time, title: d.title, scheduled: false };
    var s = D.SCHEDULED.filter(function (x) { return x.id === id; })[0];
    return s ? { id: s.id, date: s.date, time: s.time, title: s.title, scheduled: true } : null;
  }
  function scheduledLabel(d) { return 'Programmata · ' + dateShort(d.date) + ', ' + d.time; }

  return {
    data: D, esc: esc, fmt: fmt, pct: pct, inRange: inRange, sum: sum,
    dateShort: dateShort, dateLong: dateLong, dayMonth: dayMonth, daysSince: daysSince, isPartial: isPartial, completeLabel: completeLabel, completed: completed,
    chrono: chrono, demById: demById, latest: latest, totals: totals, delta: delta,
    breakdownOf: breakdownOf, testateOf: testateOf, listsOf: listsOf, pieOf: pieOf, addDays: addDays,
    icon: icon, infoBtn: infoBtn, twoLines: twoLines, barChart: barChart, hbar: hbar, breakdownHtml: breakdownHtml, listBarsHtml: listBarsHtml,
    pieSvg: pieSvg, pieLegendHtml: pieLegendHtml, lineChart: lineChart, ongoingFacts: ongoingFacts,
    stateMsg: stateMsg, glossaryHtml: glossaryHtml,
    bindTooltips: bindTooltips, renderKeepingFocus: renderKeepingFocus,
    reduceMotion: reduceMotion, store: store, load: load, drop: drop,
    isAuthed: isAuthed, saveAuth: saveAuth, logout: logout, safeNext: safeNext, requireAuth: requireAuth, bindLogout: bindLogout,
    findDem: findDem, scheduledLabel: scheduledLabel
  };
})();
