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

  function breakdownOf(list) {
    var items = [
      { label: 'Lettura della news', value: sum(list, 'news'), muted: false },
      { label: 'Download (foto e allegati)', value: sum(list, 'dl'), muted: false },
      { label: 'Versione web', value: sum(list, 'web'), muted: false },
      { label: 'Altri link', value: sum(list, 'altro'), muted: false },
      { label: 'Disiscrizione', value: sum(list, 'unsub'), muted: true }
    ];
    var tot = items.reduce(function (a, i) { return a + i.value; }, 0) || 1;
    return items.map(function (i) {
      return { label: i.label, value: fmt(i.value), pct: pct(i.value / tot), width: (i.value / tot * 100).toFixed(1), muted: i.muted };
    });
  }

  function testateOf(list) {
    var acc = {};
    list.forEach(function (d) {
      D.TESTATE[d.lang].forEach(function (t, i) {
        if (!acc[t[0]]) acc[t[0]] = { name: t[0], cat: t[1], ap: 0, cl: 0 };
        acc[t[0]].ap += d.ap * D.T_AP[i];
        acc[t[0]].cl += d.cu * D.T_CL[i];
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
    close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'
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
    return breakdownOf(list).map(function (c) { return hbar(c.label, c.value + ' <span class="sep">&middot; ' + c.pct + '</span>', c.width, c.muted); }).join('');
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
  function bindTooltips() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-action="info-toggle"]');
      var open = document.querySelectorAll('.info-btn.show, .star-icon.show');
      if (!t) { open.forEach(function (x) { x.classList.remove('show'); }); return; }
      e.preventDefault();
      e.stopPropagation();
      var wasOpen = t.classList.contains('show');
      open.forEach(function (x) { x.classList.remove('show'); });
      if (!wasOpen) t.classList.add('show');
    }, true);
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
    if (d) return { id: d.id, date: d.date, time: d.time, lang: d.lang, title: d.title, scheduled: false };
    var s = D.SCHEDULED.filter(function (x) { return x.id === id; })[0];
    return s ? { id: s.id, date: s.date, time: s.time, lang: s.lang, title: s.title, scheduled: true } : null;
  }
  function scheduledLabel(d) { return 'Programmata · ' + dateShort(d.date) + ', ' + d.time; }

  return {
    data: D, esc: esc, fmt: fmt, pct: pct, inRange: inRange, sum: sum,
    dateShort: dateShort, dateLong: dateLong, dayMonth: dayMonth, daysSince: daysSince, isPartial: isPartial, completeLabel: completeLabel,
    chrono: chrono, demById: demById, latest: latest, totals: totals, delta: delta,
    breakdownOf: breakdownOf, testateOf: testateOf, listsOf: listsOf,
    icon: icon, infoBtn: infoBtn, twoLines: twoLines, barChart: barChart, hbar: hbar, breakdownHtml: breakdownHtml, listBarsHtml: listBarsHtml,
    stateMsg: stateMsg, glossaryHtml: glossaryHtml,
    bindTooltips: bindTooltips, renderKeepingFocus: renderKeepingFocus,
    reduceMotion: reduceMotion, store: store, load: load, drop: drop,
    isAuthed: isAuthed, saveAuth: saveAuth, logout: logout, safeNext: safeNext, requireAuth: requireAuth, bindLogout: bindLogout,
    findDem: findDem, scheduledLabel: scheduledLabel
  };
})();
