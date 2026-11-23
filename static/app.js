/* WASD project page: every figure on the page is built here so that it can be clicked. No dependencies. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const S = (tag, attrs = {}, parent, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; };
const H = (tag, attrs = {}, parent, html) => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
const C = { agent: '#2f6fb7', agentSoft: '#e4eef8', wam: '#e0762c', wamSoft: '#fbe6d6', wamInk: '#b3541a', tune: '#6b54b6', ok: '#2e9e5b', bad: '#d4453c', grey: '#8a857e', greySoft: '#e9e4dd', ink: '#1b1a17', card: '#fffdfa', line: '#d3cabf' };
const IMG = 'assets/img/', VID = 'assets/demo/';

/* ---------- tooltip, toast ---------- */
const tipEl = $('#tip');
const tip = { show(html, ev) { tipEl.innerHTML = html; tipEl.hidden = false; this.move(ev); }, move(ev) { const w = tipEl.offsetWidth, h = tipEl.offsetHeight; let x = ev.clientX + 16, y = ev.clientY + 16; if (x + w > innerWidth - 8) x = ev.clientX - w - 14; if (y + h > innerHeight - 8) y = ev.clientY - h - 14; tipEl.style.left = x + 'px'; tipEl.style.top = y + 'px'; }, hide() { tipEl.hidden = true; } };
let tipT; const hover = (el, html) => { const get = () => typeof html === 'function' ? html() : html;
  el.addEventListener('pointerenter', ev => { if (ev.pointerType !== 'touch') tip.show(get(), ev); }); el.addEventListener('pointermove', ev => { if (ev.pointerType !== 'touch') tip.move(ev); }); el.addEventListener('pointerleave', ev => { if (ev.pointerType !== 'touch') tip.hide(); });
  el.addEventListener('pointerup', ev => { if (ev.pointerType === 'touch') { tip.show(get(), ev); clearTimeout(tipT); tipT = setTimeout(() => tip.hide(), 2400); } }); };
let toastT; const toast = msg => { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 1600); };
$$('[data-soon]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast('Coming soon'); }));

/* ---------- the keycap logo: four separate keys seen from above, W over A S D ---------- */
function keycaps(host, opt = {}) {
  const K = 172, GAP = 46, STEP = K + GAP, ROW = 240, id = 'kc' + Math.random().toString(36).slice(2, 7);
  const svg = S('svg', { viewBox: `-34 -22 ${3 * K + 2 * GAP + 68} ${ROW + K + 106}`, class: 'kc-svg' + (opt.dim ? ' kc-dim' : ''), role: 'img', 'aria-label': 'WASD keys' }, host), defs = S('defs', {}, svg);
  const lg = (n, stops) => { const g = S('linearGradient', { id: id + n, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); stops.forEach(([o, c]) => S('stop', { offset: o, 'stop-color': c }, g)); return `url(#${id + n})`; };
  const gFace = lg('f', [[0, '#ffffff'], [1, '#edf5fb']]), gSkirt = lg('s', [[0, '#d1d6df'], [0.7, '#bbc4d1'], [0.9, '#adb8c8'], [0.94, '#9eaabf'], [1, '#a7b2c4']]), gGloss = lg('g', [[0, 'rgba(255,255,255,0.9)'], [1, 'rgba(255,255,255,0)']]);
  S('feGaussianBlur', { stdDeviation: 13 }, S('filter', { id: id + 'b', x: '-40%', y: '-120%', width: '180%', height: '340%' }, defs));
  const keys = {};
  [['W', 1, 0], ['A', 0, 1], ['S', 1, 1], ['D', 2, 1]].forEach(([ch, cx, cy]) => {
    const g = S('g', { class: 'kc-key', 'data-k': ch, transform: `translate(${cx * STEP},${cy * ROW})` }, svg), inn = S('g', { class: 'kc-in' }, g);
    S('ellipse', { cx: K / 2, cy: K + 46, rx: K * 0.5, ry: 17, fill: 'rgba(49,61,76,0.24)', filter: `url(#${id}b)`, class: 'kc-shadow' }, inn);
    S('rect', { x: -10, y: -7, width: K + 20, height: K + 50, rx: 34, fill: gSkirt }, inn);                                   // the body of the key, seen below and around the top
    const top = S('g', { class: 'kc-top' }, inn);
    S('rect', { x: 0, y: 0, width: K, height: K, rx: 29, fill: gFace, stroke: '#f9fcff', 'stroke-width': 2 }, top);
    S('rect', { x: 9, y: 7, width: K - 18, height: K * 0.42, rx: 21, fill: gGloss, opacity: 0.55 }, top);                       // soft light on the upper half
    S('text', { x: K / 2, y: K / 2 + 4, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 104, 'font-weight': 800, 'font-family': 'Inter, "Arial Black", "Helvetica Neue", Arial, sans-serif', class: 'kc-letter' }, top, ch);
    const k = keys[ch] = { g, t: 0, press() { g.classList.add('down'); clearTimeout(this.t); this.t = setTimeout(() => g.classList.remove('down'), 150); if (opt.onPress) opt.onPress(ch); } };
    g.addEventListener('pointerdown', e => { e.preventDefault(); k.press(); }); });
  return { svg, keys, drop(order = ['W', 'A', 'S', 'D'], t0 = 0.1, dt = 0.13) { order.forEach((ch, i) => $('.kc-in', keys[ch].g).style.animationDelay = (t0 + i * dt) + 's'); svg.classList.add('kc-drop'); } };
}
$$('[data-kc]').forEach(el => { const k = keycaps(el); el.addEventListener('pointerenter', () => ['W', 'A', 'S', 'D'].forEach((ch, i) => setTimeout(() => k.keys[ch].press(), i * 90))); });
const heroSub = $('#hero-sub'), heroKc = keycaps($('#hero-kc'), { onPress: ch => { const w = $(`[data-k="${ch}"]`, heroSub); w.classList.add('lit'); clearTimeout(w._t); w._t = setTimeout(() => w.classList.remove('lit'), 900); } });
addEventListener('keydown', e => { const ch = (e.key || '').toUpperCase(); if (!e.metaKey && !e.ctrlKey && !e.altKey && heroKc.keys[ch] && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) heroKc.keys[ch].press(); });

/* ---------- intro, nav, reveal, counters ---------- */
const intro = $('#intro'); let introT = []; const endIntro = () => { introT.forEach(clearTimeout); intro.classList.add('done'); };
if (matchMedia('(prefers-reduced-motion: reduce)').matches || (location.hash && location.hash !== '#top')) endIntro();
else { const k = keycaps($('#intro-kc'), { dim: true }); k.drop(); const words = $$('.intro-line span', intro);
  ['W', 'A', 'S', 'D'].forEach((ch, i) => introT.push(setTimeout(() => { k.keys[ch].g.classList.add('lit'); k.keys[ch].press(); words[i].classList.add('in'); }, 900 + i * 240)));
  introT.push(setTimeout(endIntro, 2750)); intro.addEventListener('click', endIntro); addEventListener('keydown', endIntro, { once: true }); }
addEventListener('scroll', () => $('#nav').classList.toggle('stuck', scrollY > 8), { passive: true });
const secObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
$$('main section[id]').forEach(s => secObs.observe(s));
const onSeen = (el, fn, opt = { threshold: 0.25 }) => { const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { o.disconnect(); fn(); } }), opt); o.observe(el); };
$$('.sec h2, .sec .card, .mtabs, .facts, .dtabs, .stats, .linkbar').forEach(el => { el.classList.add('rv'); onSeen(el, () => el.classList.add('in'), { threshold: 0.08 }); });
onSeen($('#stats'), () => $$('#stats b').forEach(b => { const to = +b.dataset.count, from = +b.dataset.from, dec = b.dataset.dec != null ? +b.dataset.dec : 1, suf = b.dataset.suffix || '', t0 = performance.now(), D = 1300;
  const step = t => { const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3); b.textContent = (from + (to - from) * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }));

/* ---------- teaser ---------- */
(() => {
  const host = $('#teaser-svg'), cap = $('#teaser-cap'); const svg = S('svg', { viewBox: '0 0 1600 590', role: 'img', 'aria-label': 'An agent rewrites the imagined future of a world action model' }, host);
  const defs = S('defs', {}, svg); const mk = (id, col) => S('path', { d: 'M0,0 L10,5 L0,10 z', fill: col }, S('marker', { id, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs));
  mk('ah-tune', C.tune); mk('ah-ok', C.ok);
  const G = k => S('g', { class: 't-g', 'data-k': k }, svg);
  const frame = (g, src, x, y, label) => { const cp = 'cp' + Math.random().toString(36).slice(2, 8); S('rect', { x, y, width: 188, height: 125, rx: 4 }, S('clipPath', { id: cp }, defs)); const im = S('image', { href: IMG + src, x, y, width: 188, height: 125, preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${cp})`, class: 't-frame' }, g); im.addEventListener('click', ev => { ev.stopPropagation(); tip.show(`<img src="${IMG + src}" width="360" style="border-radius:6px;margin-bottom:6px"><b>${label}</b>`, ev); const off = () => { tip.hide(); removeEventListener('pointerdown', off); }; setTimeout(() => addEventListener('pointerdown', off), 0); }); return im; };
  const holes = (g, x0, x1, y) => S('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: '#fff', 'stroke-width': 7, 'stroke-dasharray': '10 10', 'stroke-opacity': 0.92 }, g);
  const XS = [617, 819, 1021, 1222];
  // post-training loop
  const post = G('post'); S('path', { d: 'M1497,196 L1497,70 Q1497,38 1465,38 L177,38 Q145,38 145,70 L145,258', fill: 'none', stroke: C.tune, 'stroke-width': 3.5, 'marker-end': 'url(#ah-tune)', class: 'post-line' }, post);
  S('rect', { x: 690, y: 14, width: 262, height: 48, fill: C.card }, post); S('text', { x: 821, y: 51, 'text-anchor': 'middle', 'font-size': 36, fill: C.tune, class: 't-lab' }, post, 'Post Training');
  // lower strip: the WAM's own imagination
  const bot = G('alone'); S('path', { d: 'M455,330 C545,330 520,390 600,390 L600,558 C520,558 545,440 455,440 Z', class: 'bot-fill' }, bot); S('rect', { x: 596, y: 390, width: 827, height: 168, rx: 14, class: 'bot-fill' }, bot);
  holes(bot, 612, 1412, 401); holes(bot, 612, 1412, 547); const botIm = XS.map((x, i) => frame(bot, `t_bot${i + 1}.jpg`, x, 412, `WAM's own imagination, frame ${[2, 4, 6, 8][i]} of the chunk`));
  // upper strip: rewritten, then continued by the WAM
  const top = G('wasd'); S('rect', { x: 1000, y: 150, width: 423, height: 168, rx: 14, fill: C.wam }, top); S('path', { d: 'M455,270 C535,270 525,150 600,150 L1013,150 L1013,318 L600,318 C525,318 535,440 455,440 Z', fill: '#4a90c4', class: 'blue-band' }, top);
  holes(top, 612, 1412, 161); holes(top, 612, 1412, 307);
  ['Written by the agent, frame 4', 'Written by the agent, frame 8', "WAM's own imagination, step 32", "WAM's own imagination, step 96"].forEach((l, i) => frame(top, `t_top${i + 1}.jpg`, XS[i], 172, l));
  S('rect', { x: 606, y: 156, width: 401, height: 156, rx: 8, class: 't-ring', id: 'ring-rw' }, top);
  // the WAM block
  const wam = S('g', { class: 't-g', 'data-k': 'wam' }, svg); S('rect', { x: 65, y: 270, width: 392, height: 170, rx: 16, fill: C.wam }, wam);
  S('rect', { x: 113, y: 312, width: 64, height: 44, rx: 9, fill: 'none', stroke: '#fff', 'stroke-width': 5 }, wam); S('line', { x1: 145, x2: 145, y1: 312, y2: 298, stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round' }, wam);
  S('circle', { cx: 134, cy: 334, r: 4.5, fill: '#fff' }, wam); S('circle', { cx: 156, cy: 334, r: 4.5, fill: '#fff' }, wam);
  S('text', { x: 145, y: 407, 'text-anchor': 'middle', 'font-size': 36, fill: '#fff', class: 't-lab', 'font-weight': 500 }, wam, 'WAM'); holes(wam, 240, 448, 281); holes(wam, 240, 448, 429);
  frame(wam, 't_now.jpg', 245, 292, 'Current observation'); S('text', { x: 338, y: 484, 'text-anchor': 'middle', 'font-size': 34, fill: C.wamInk, class: 't-lab' }, svg, 'Imagination');
  // the agent
  const ag = G('agent'); S('path', { d: 'M526,97 L975,97 Q1013,97 1013,135 L1013,150', fill: 'none', stroke: '#4a90c4', 'stroke-width': 3.5 }, ag); S('path', { d: 'M480,138 C480,215 455,215 455,270', fill: 'none', stroke: '#4a90c4', 'stroke-width': 3.5 }, ag);
  S('rect', { x: 434, y: 56, width: 92, height: 82, rx: 13, fill: '#4a90c4' }, ag); S('path', { d: 'M452,97 Q480,70 508,97 Q480,124 452,97 Z', fill: 'none', stroke: '#fff', 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, ag); S('circle', { cx: 480, cy: 97, r: 8, fill: '#fff' }, ag);
  S('text', { x: 296, y: 218, 'font-size': 36, fill: C.agent, class: 't-lab' }, ag, 'Rewrite'); S('text', { x: 546, y: 86, 'font-size': 24, fill: C.agent, class: 't-lab' }, ag, 'Agent');
  // outcome marks
  const okM = S('g', { class: 't-g', 'data-k': 'wasd' }, svg); S('circle', { cx: 1497, cy: 235, r: 22, fill: C.ok }, okM); S('path', { d: 'M1486,236 l8,8 l15,-17', fill: 'none', stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, okM);
  const badM = S('g', { class: 't-g', 'data-k': 'alone' }, svg); S('circle', { cx: 1497, cy: 474, r: 22, fill: C.bad }, badM); S('path', { d: 'M1488,465 l18,18 M1506,465 l-18,18', fill: 'none', stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round' }, badM);
  const gain = S('g', { class: 't-g', 'data-k': 'post' }, svg); S('line', { x1: 1497, x2: 1497, y1: 440, y2: 388, stroke: C.ok, 'stroke-width': 3 }, gain); S('line', { x1: 1497, x2: 1497, y1: 322, y2: 272, stroke: C.ok, 'stroke-width': 3, 'marker-end': 'url(#ah-ok)' }, gain);
  S('text', { x: 1497, y: 366, 'text-anchor': 'middle', 'font-size': 30, fill: C.ok, class: 't-lab', 'font-weight': 500 }, gain, '+19.6');
  const st = document.createElement('style'); st.textContent = '.bot-fill{fill:#fbd9c3;transition:fill .45s}.is-alone .bot-fill{fill:' + C.wam + '}.post-line{transition:stroke-width .3s}.t-hot .post-line{stroke-width:6}'; document.head.appendChild(st);
  const CAP = { wasd: '<b>Rewritten.</b> The agent writes the first frames of a new route. The WAM carries it on and finishes the task.', alone: '<b>Lost.</b> The WAM follows its own imagined future, and the episode fails.',
    agent: '<b>One rewrite.</b> Blue frames are written by the agent before the first action. Orange frames are the WAM&rsquo;s own again.', post: '<b>Post-training.</b> Guided successes go back into the WAM. Together: +19.6 points on LIBERO-Recover.' };
  let mode = 'wasd', focus = null;
  const render = () => { svg.classList.toggle('is-alone', mode === 'alone'); const dim = mode === 'alone' ? ['wasd', 'agent', 'post'] : ['alone'];
    $$('.t-g', svg).forEach(g => { const k = g.dataset.k; g.classList.toggle('t-dim', dim.includes(k) && focus !== k); g.style.opacity = (mode === 'wasd' && k === 'alone') ? 0.5 : ''; g.classList.toggle('t-hot', focus === k || (focus === 'agent' && g === top)); });
    botIm.forEach(im => im.style.opacity = mode === 'alone' ? 1 : 0.6); cap.innerHTML = CAP[focus || mode]; $$('#teaser .seg button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode)); };
  const setMode = m => { mode = m; focus = null; render(); };
  $$('#teaser .seg button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $$('.t-g', svg).forEach(g => g.addEventListener('click', () => { const k = g.dataset.k; if (k === 'wasd' || k === 'alone') setMode(k); else if (k === 'agent' || k === 'post') { mode = 'wasd'; focus = focus === k ? null : k; render(); } }));
  render();
})();

/* ---------- method: WASD-Zero and WASD-Tune in one figure; the tabs choose which half is lit, the steps sit below ---------- */
(() => {
  const fig = $('#method-fig'), list = $('#steps'), detail = $('#step-detail');
  const svg = S('svg', { viewBox: '0 0 1900 790' }); fig.appendChild(svg);
  const d0 = S('defs', {}, svg); [['a-ink', '#6b665f'], ['a-agent', C.agent], ['a-wam', C.wam], ['a-tune', C.tune]].forEach(([id, col]) => S('path', { d: 'M0,0 L10,5 L0,10 z', fill: col }, S('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, d0)));
  const node = (g0, id, x, y, w, h, label, o = {}) => { const g = S('g', { class: 'm-node', 'data-id': id }, g0); S('rect', { x, y, width: w, height: h, rx: o.rx ?? 12, fill: o.fill || '#fff', stroke: o.stroke || C.line, 'stroke-width': o.sw ?? 1.6, class: 'box' }, g);
    if (label) String(label).split('\n').forEach((t, i, a) => S('text', { x: x + w / 2 + (o.dx || 0), y: y + h / 2 + 7 + (i - (a.length - 1) / 2) * 24 + (o.dy || 0), 'text-anchor': 'middle', 'font-size': o.fs || 21, fill: o.color || C.ink, class: 'm-txt' }, g, t)); return g; };
  const diamond = (g0, id, cx, cy, w, h, label, col) => { const g = S('g', { class: 'm-node', 'data-id': id }, g0); S('polygon', { points: `${cx - w / 2},${cy} ${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2}`, fill: '#fff', stroke: col, 'stroke-width': 2, class: 'box' }, g); S('text', { x: cx, y: cy + 7, 'text-anchor': 'middle', 'font-size': 20, fill: col, class: 'm-txt' }, g, label); return g; };
  const edge = (g0, id, d, col = 'ink', o = {}) => S('path', { d, fill: 'none', stroke: { ink: '#6b665f', agent: C.agent, wam: C.wam, tune: C.tune, white: '#fff' }[col], 'stroke-width': o.w || 2.2, 'marker-end': o.noHead || col === 'white' ? '' : `url(#a-${col})`, 'stroke-dasharray': o.dash || '', class: 'm-edge', 'data-id': id, 'stroke-linejoin': 'round' }, g0);
  const badge = (g0, id, cx, cy, ok) => { const g = S('g', { class: 'm-edge', 'data-id': id }, g0); S('circle', { cx, cy, r: 11, fill: ok ? C.ok : C.bad, stroke: '#fff', 'stroke-width': 2 }, g); S('path', { d: ok ? `M${cx - 5},${cy} l4,4 l7,-8` : `M${cx - 4},${cy - 4} l8,8 M${cx + 4},${cy - 4} l-8,8`, fill: 'none', stroke: '#fff', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g); return g; };
  const label = (g0, id, x, y, t, col = '#4b4741', fs = 17) => S('text', { x, y, 'font-size': fs, fill: col, class: 'm-txt m-edge', 'data-id': id }, g0, t);
  const thumb = (g, src, x, y, w, h) => S('image', { href: IMG + src, x, y, width: w, height: h, preserveAspectRatio: 'xMidYMid slice' }, g);
  const panel = (sys, x, w, title, sub, col, ox, oy) => { const g = S('g', { class: 'm-sys', 'data-sys': sys }, svg); S('rect', { x, y: 4, width: w, height: 782, rx: 22, fill: '#faf7f3', stroke: C.line, 'stroke-width': 1.5, class: 'm-panel' }, g);
    S('rect', { x: x + 22, y: 22, width: 42, height: 42, rx: 10, fill: col, class: 'm-head' }, g); S('path', { d: sys === 'zero' ? `M${x + 37},${x * 0 + 33} l15,10 l-15,10 z` : `M${x + 52},${37} a11,11 0 1 0 2,9 M${x + 53},${30} v8 h-8`, fill: sys === 'zero' ? '#fff' : 'none', stroke: '#fff', 'stroke-width': sys === 'zero' ? 0 : 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'm-head' }, g);
    const t = S('text', { x: x + 78, y: 55, class: 'm-txt m-head' }, g); S('tspan', { 'font-size': 36, fill: C.ink }, t, title); S('tspan', { 'font-size': 22, fill: '#7d776f', dx: 14 }, t, sub);
    return S('g', { transform: `translate(${x + ox},${oy})` }, g); };

  // ---- left: WASD-Zero (runtime) ----
  const z = panel('zero', 4, 1200, 'WASD-Zero', 'Runtime', '#4a90c4', 8, 76);
  S('rect', { x: 270, y: 96, width: 890, height: 584, rx: 18, fill: '#fdeee2', stroke: '#f1cdb2', 'stroke-width': 1.5 }, z); S('text', { x: 296, y: 138, 'font-size': 22, fill: C.wamInk, class: 'm-txt' }, z, '❄ Frozen WAM');
  S('rect', { x: 20, y: 20, width: 200, height: 660, rx: 18, fill: '#4a90c4' }, z); S('text', { x: 120, y: 66, 'text-anchor': 'middle', 'font-size': 25, fill: '#fff', class: 'm-txt' }, z, 'Agent');
  S('path', { d: 'M86,130 Q120,98 154,130 Q120,162 86,130 Z', fill: 'none', stroke: '#fff', 'stroke-width': 4 }, z); S('circle', { cx: 120, cy: 130, r: 9, fill: '#fff' }, z);
  const rw = S('g', { class: 'm-node', 'data-id': 'rwbox' }, z); S('rect', { x: 300, y: 452, width: 760, height: 206, rx: 14, fill: C.agentSoft, stroke: '#bcd3ea', 'stroke-width': 1.5, class: 'box' }, rw);
  node(z, 'env', 270, 20, 890, 48, 'Robot / Environment'); node(z, 'obs', 720, 110, 250, 46, 'Observation', { color: C.wamInk, fs: 19 });
  const im = node(z, 'imag', 290, 190, 400, 110, 'Imagination', { stroke: C.wam, sw: 2, color: C.wamInk, dx: 105 }); ['t_bot1.jpg', 't_bot2.jpg', 't_bot3.jpg'].forEach((s, i) => thumb(im, s, 304 + i * 56, 208 + i * 6, 96, 64));
  const den = node(z, 'den', 720, 190, 270, 110, '', { stroke: C.wam, sw: 2 }); S('text', { x: 855, y: 222, 'text-anchor': 'middle', 'font-size': 21, fill: C.wamInk, class: 'm-txt' }, den, 'Denoising');
  for (let r = 0; r < 2; r++) { for (let i = 0; i < 8; i++) S('rect', { x: 766 + i * 26, y: 236 + r * 28, width: 21, height: 21, rx: 4, fill: r === 1 && i > 4 ? '#4a90c4' : '#f29a55' }, den); S('circle', { cx: 746, cy: 246.5 + r * 28, r: 8, fill: r ? C.bad : C.ok }, den); }
  node(z, 'act', 1020, 190, 120, 110, 'Action', { stroke: C.wam, sw: 2, color: C.wamInk });
  node(z, 'read', 36, 223, 168, 44, 'Read', { color: C.agent }); node(z, 'judge', 36, 348, 168, 44, 'Judge', { color: C.agent }); node(z, 'reaim', 36, 440, 168, 44, 'Re-aim', { color: C.agent }); node(z, 'write', 36, 518, 168, 44, 'Write', { color: C.agent }); node(z, 'sync', 36, 610, 168, 44, 'Synchronize', { color: C.agent, fs: 19 });
  diamond(z, 'feas', 420, 370, 210, 84, 'Feasible?', C.agent);
  node(z, 'way', 330, 500, 140, 80, 'Waypoints', { color: C.agent }); const fr = S('g', { class: 'm-node', 'data-id': 'frames' }, z); ['t_top1.jpg', 't_top2.jpg', 't_top2.jpg'].forEach((s, i) => { S('rect', { x: 508 + i * 122, y: 494, width: 116, height: 82, rx: 6, fill: '#fff', stroke: '#bcd3ea', class: 'box' }, fr); thumb(fr, s, 512 + i * 122, 498, 108, 74); });
  S('text', { x: 687, y: 612, 'text-anchor': 'middle', 'font-size': 16, fill: C.agent, class: 'm-txt' }, fr, 'rendered future frames');
  node(z, 'enc', 900, 500, 130, 80, 'Video\nEncoder', { color: C.wamInk, stroke: C.wam });
  edge(z, 'e-imag-read', 'M290,245 L208,245', 'ink'); edge(z, 'e-read-judge', 'M120,267 L120,346', 'white'); edge(z, 'e-judge-reaim', 'M120,392 L120,438', 'white'); edge(z, 'e-reaim-write', 'M120,484 L120,516', 'white');
  edge(z, 'e-judge-feas', 'M204,370 L312,370', 'agent'); edge(z, 'e-accept', 'M525,370 L855,370 L855,303', 'wam'); badge(z, 'e-accept', 560, 370, true); label(z, 'e-accept', 580, 358, 'Accept: runs unchanged');
  edge(z, 'e-rewrite', 'M420,412 L420,498', 'agent'); badge(z, 'e-rewrite', 420, 440, false); label(z, 'e-rewrite', 440, 446, 'Rewrite');
  edge(z, 'e-write-way', 'M204,540 L328,540', 'agent'); edge(z, 'e-way-fr', 'M470,540 L504,540', 'agent'); edge(z, 'e-fr-enc', 'M874,540 L898,540', 'agent'); edge(z, 'e-pin', 'M965,500 L965,303', 'agent', { w: 2.6 }); label(z, 'e-pin', 976, 410, 'Pin', C.agent, 18);
  edge(z, 'e-obs-den', 'M845,156 L845,188', 'wam'); edge(z, 'e-den-imag', 'M720,245 L693,245', 'wam'); edge(z, 'e-den-act', 'M990,245 L1018,245', 'wam'); edge(z, 'e-act-env', 'M1080,190 L1080,71', 'wam'); edge(z, 'e-env-obs', 'M845,68 L845,108', 'ink');

  // ---- right: WASD-Tune (post-training) ----
  const u = panel('tune', 1228, 668, 'WASD-Tune', 'Post-training', C.wam, 14, 84);
  const flow = (id, d, col, w) => S('path', { d, fill: 'none', stroke: col, 'stroke-width': w, class: 'm-edge', 'data-id': id, opacity: 0.9 }, u);
  // shares of the post-training mixture as given in the paper; flow widths are proportional to them
  flow('f-skill', 'M95,128 C95,230 462,180 462,300', '#f29a55', 15); flow('f-libero', 'M300,128 C300,215 495,205 495,300', '#f6c9a8', 50); flow('f-roll', 'M505,128 C505,205 538,215 538,300', '#4a90c4', 35);
  const src = (id, x, pct, lab, fill, stroke, col) => { const g = node(u, id, x, 20, 190, 108, '', { fill, stroke }); S('text', { x: x + 16, y: 76, 'font-size': 48, fill: col, class: 'm-txt', style: 'font-weight:300;letter-spacing:-0.02em' }, g, pct + '%'); S('text', { x: x + 18, y: 108, 'font-size': 18, fill: col, class: 'm-txt' }, g, lab); };
  src('skill', 0, 15, 'Agent-written skills', '#fdeee2', '#f1cdb2', C.wamInk); src('libero', 205, 50, 'LIBERO demos', '#fff7f0', '#f1cdb2', C.wamInk); src('roll', 410, 35, 'Guided successes', C.agentSoft, '#bcd3ea', C.agent);
  node(u, 'mixed', 400, 300, 200, 96, 'Mixed data'); node(u, 'updated', 30, 300, 230, 96, 'Updated WAM', { stroke: C.wam, sw: 2, color: C.wamInk });
  edge(u, 'e-pt', 'M400,348 L264,348', 'wam', { w: 2.6 }); label(u, 'e-pt', 274, 334, 'Post-training', C.wamInk, 18);
  diamond(u, 'gate', 145, 480, 210, 86, 'Task gate', C.agent); edge(u, 'e-up-gate', 'M145,396 L145,434', 'wam');
  node(u, 'alone', 330, 442, 190, 76, 'WAM alone', { stroke: C.wam, color: C.wamInk }); node(u, 'zero', 40, 600, 210, 70, 'WASD-Zero', { fill: C.agentSoft, stroke: C.agent, color: C.agent });
  edge(u, 'e-no', 'M250,480 L326,480', 'agent', { dash: '7 6' }); badge(u, 'e-no', 288, 480, false); edge(u, 'e-yes', 'M145,523 L145,598', 'agent'); badge(u, 'e-yes', 145, 560, true);
  edge(u, 'e-loop', 'M250,635 L610,635 Q628,635 628,617 L628,92 Q628,74 612,74 L604,74', 'agent', { w: 2.6 }); edge(u, 'e-alone-loop', 'M520,480 L628,480', 'agent', { noHead: true }); S('circle', { cx: 628, cy: 480, r: 5, fill: C.agent, class: 'm-edge', 'data-id': 'e-alone-loop' }, u);
  label(u, 'e-loop', 360, 662, 'new rollouts', C.agent, 17);
  edge(u, 'e-link', 'M40,635 L-36,635', 'agent', { dash: '7 6', noHead: true }); label(u, 'e-link', -30, 622, '', C.agent, 15);
  $$('[data-id]', z).forEach(e => e.dataset.sys = 'zero'); $$('[data-id]', u).forEach(e => e.dataset.sys = 'tune');

  const DATA = { zero: [
      { k: 'Read', s: 'the WAM’s imagined future', p: 'Before the first action and after a failed grasp or a drop, the robot waits while the agent looks at the frames the WAM predicts.', parts: ['imag', 'read', 'sync', 'e-imag-read', 'e-den-imag', 'den'] },
      { k: 'Judge', s: 'right object, right place?', p: 'A feasible plan is accepted and runs unchanged. The WAM then behaves exactly as released.', parts: ['read', 'judge', 'feas', 'e-read-judge', 'e-judge-feas', 'e-accept', 'den'] },
      { k: 'Rewrite', s: 'draw the corrected route as frames', p: 'The agent re-aims the target and writes a short route. A renderer turns the route into future frames.', parts: ['judge', 'reaim', 'write', 'way', 'frames', 'rwbox', 'feas', 'e-rewrite', 'e-judge-reaim', 'e-reaim-write', 'e-write-way', 'e-way-fr'] },
      { k: 'Pin', s: 'into the WAM’s latent denoising', p: 'The WAM’s own video encoder encodes the frames. They replace the imagined latents at the future slots throughout denoising.', parts: ['frames', 'rwbox', 'enc', 'den', 'e-fr-enc', 'e-pin'] },
      { k: 'Act', s: 'the frozen WAM outputs every action', p: 'No weights change. The action chunk is generated from the pinned future.', parts: ['obs', 'den', 'act', 'env', 'e-obs-den', 'e-den-act', 'e-act-env', 'e-env-obs'] }],
    tune: [
      { k: 'Collect', s: '50% LIBERO demos · 35% guided successes · 15% agent-written skills', p: 'WASD-Zero guides the original WAM from failure states and the successful rollouts are kept. No recovery demonstration is collected by hand.', parts: ['skill', 'libero', 'roll', 'mixed', 'f-skill', 'f-libero', 'f-roll'] },
      { k: 'Post-train', s: 'fine-tune, anneal, interpolate back', p: 'Fine-tune on the mixture, then interpolate toward the released weights so that standard skills are kept.', parts: ['mixed', 'updated', 'e-pt'] },
      { k: 'Gate', s: 'guide only where it helps', p: 'Per task, on a small calibration split: keep guidance only if it beats the WAM alone.', parts: ['updated', 'gate', 'alone', 'zero', 'e-up-gate', 'e-no', 'e-yes'] },
      { k: 'Loop', s: 'the updated WAM runs in the same loop', p: 'The post-trained WAM replaces the original at run time, inside the WASD-Zero loop on the left, and yields new rollouts.', parts: ['zero', 'alone', 'roll', 'e-loop', 'e-alone-loop', 'e-link'] }] };
  let cur = 'zero', active = -1;
  const pan = els => { if (fig.scrollWidth <= fig.clientWidth + 4 || !els.length) return; const fr0 = fig.getBoundingClientRect(); let x0 = Infinity, x1 = -Infinity; els.forEach(n => { const r = n.getBoundingClientRect(); x0 = Math.min(x0, r.left); x1 = Math.max(x1, r.right); });
    const want = x1 - x0 > fig.clientWidth ? x0 - fr0.left - 12 : (x0 + x1) / 2 - fr0.left - fig.clientWidth / 2; fig.scrollTo({ left: Math.max(0, fig.scrollLeft + want), behavior: 'smooth' }); };
  const paint = () => { const st = active < 0 ? null : DATA[cur][active], parts = st ? new Set(st.parts) : null;
    $$('.m-sys', svg).forEach(g => g.classList.toggle('m-sysdim', g.dataset.sys !== cur));
    $$('[data-id]', svg).forEach(e => { const mine = e.dataset.sys === cur, on = mine && (!parts || parts.has(e.dataset.id)); e.classList.toggle('m-off', mine && !on); e.classList.toggle('m-on', !!parts && on && e.classList.contains('m-node')); });
    $$('li', list).forEach((li, i) => li.classList.toggle('on', i === active));
    detail.innerHTML = st ? `<b>${st.s}.</b> ${st.p}` : (cur === 'zero' ? 'No retraining. The agent steps in before the first action and after a failure. Click a step or a block of the figure.' : 'Guided successes become the WAM’s own recovery data. Click a step or a block of the figure.');
    pan(st ? $$('.m-node.m-on', svg) : [$(`.m-sys[data-sys="${cur}"] .m-panel`, svg)]);
    if (st && list.scrollWidth > list.clientWidth + 4) { const li = $$('li', list)[active]; list.scrollTo({ left: Math.max(0, li.offsetLeft - list.offsetLeft - 16), behavior: 'smooth' }); } else if (!st && list.scrollLeft) list.scrollTo({ left: 0, behavior: 'smooth' }); };
  const show = (m, step = -1) => { cur = m; active = step; list.className = 'steps ' + m; list.innerHTML = ''; list.style.setProperty('--n', DATA[m].length);
    DATA[m].forEach((s, i) => { const li = H('li', {}, list, `<b>${s.k}</b><span>${s.s}</span>`); li.addEventListener('click', () => { active = active === i ? -1 : i; paint(); }); });
    $$('.mtab').forEach(b => b.classList.toggle('on', b.dataset.m === m)); paint(); };
  $$('.mtab').forEach(b => b.addEventListener('click', () => show(b.dataset.m)));
  $$('.m-sys', svg).forEach(g => g.addEventListener('click', () => { if (g.dataset.sys !== cur) show(g.dataset.sys); }));
  $$('.m-node', svg).forEach(n => n.addEventListener('click', ev => { const sys = n.dataset.sys, id = n.dataset.id, st = DATA[sys]; if (sys !== cur) { ev.stopPropagation(); show(sys, st.findIndex(s => s.parts.includes(id))); return; }
    let i = st.findIndex((s, j) => j > active && s.parts[0] === id); if (i < 0) i = st.findIndex((s, j) => j !== active && s.parts.includes(id)); if (i < 0) i = st.findIndex(s => s.parts.includes(id)); if (i >= 0) { active = i; paint(); } }));
  show('zero'); onSeen(fig, () => { let i = 0; const run = () => { if (cur !== 'zero' || (active !== i - 1 && i > 0)) return; if (i >= DATA.zero.length) { active = -1; paint(); return; } active = i++; paint(); setTimeout(run, 1100); }; setTimeout(run, 500); }, { threshold: 0.5 });
})();

/* ---------- charts ---------- */
const hatch = (svg, id, col) => { const d = svg.querySelector('defs') || S('defs', {}, svg); const p = S('pattern', { id, width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, d); S('rect', { width: 7, height: 7, fill: '#fff' }, p); S('rect', { width: 3.2, height: 7, fill: col }, p); };
function bars(el, cfg) { // cfg: {max, groups:[{label, bars:[{name, short, v, color, hatch, base}]}], unit}
  el.innerHTML = ''; el._cfg = cfg; const narrow = (el.clientWidth || 640) < 470; el._narrow = narrow; const W = narrow ? 390 : 640, Hh = narrow ? 310 : 330, m = { l: narrow ? 28 : 34, r: narrow ? 4 : 10, t: 26, b: 58 }, ph = Hh - m.t - m.b; const svg = S('svg', { viewBox: `0 0 ${W} ${Hh}` }, el); hatch(svg, 'hx-' + el.id, '#e9a26f');
  const y = v => m.t + ph * (1 - v / cfg.max); for (let t = 0; t <= cfg.max; t += cfg.tick || 20) { S('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), class: 'grid' }, svg); S('text', { x: m.l - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'ax' }, svg, t); }
  const n = cfg.groups.reduce((a, g) => a + g.bars.length, 0), gap = cfg.groups.length > 1 ? (narrow ? 14 : 30) : 0, slot = (W - m.l - m.r - gap * (cfg.groups.length - 1)) / n, bw = Math.min(78, slot * 0.66), dec = cfg.dec ?? 1; let xs = m.l;
  cfg.groups.forEach(g => { const x0 = xs; g.bars.forEach(b => { const x = xs + (slot - bw) / 2, gg = S('g', { class: 'bar-g' }, svg), h = ph * b.v / cfg.max;
      const r = S('rect', { x, y: y(b.v), width: bw, height: h, rx: 4, fill: b.hatch ? `url(#hx-${el.id})` : b.color, stroke: b.hatch ? '#e9a26f' : 'none', class: 'bar-el', style: 'transform-box:fill-box;transform-origin:bottom;transform:scaleY(0);transition:transform .8s cubic-bezier(.2,.8,.2,1)' }, gg);
      S('rect', { x: xs, y: m.t, width: slot, height: ph + 40, fill: 'transparent' }, gg); S('text', { x: x + bw / 2, y: y(b.v) - 8, 'text-anchor': 'middle', class: 'vlab' }, gg, b.v.toFixed(dec) + (cfg.suffix || ''));
      ((narrow && b.tiny) || b.short || b.name).split('\n').forEach((t, i) => S('text', { x: x + bw / 2, y: Hh - m.b + 18 + i * 15, 'text-anchor': 'middle', class: 'clab' }, gg, t));
      const base = g.bars[0]; hover(gg, () => `<b>${b.v.toFixed(dec)}${cfg.unit || ' %'}</b>${b.name.replace('\n', ' ')}${b !== base && cfg.delta !== false ? `<br><small>${(b.v - base.v >= 0 ? '+' : '') + (b.v - base.v).toFixed(1)} pts vs. ${base.name.replace('\n', ' ')}</small>` : ''}${b.note ? `<br><small>${b.note}</small>` : ''}`);
      gg.addEventListener('pointerenter', () => { el.classList.add('hovering'); gg.classList.add('hot'); }); gg.addEventListener('pointerleave', () => { el.classList.remove('hovering'); gg.classList.remove('hot'); });
      requestAnimationFrame(() => requestAnimationFrame(() => r.style.transform = 'scaleY(1)')); xs += slot; });
    if (g.label) S('text', { x: (x0 + xs) / 2, y: Hh - 6, 'text-anchor': 'middle', class: 'ax' }, svg, g.label.toUpperCase()); xs += gap; });
  if (cfg.legend) { const L = H('div', { class: 'legend' }, el); cfg.legend.forEach(([name, col, hx]) => H('span', {}, L, `<i style="background:${hx ? 'repeating-linear-gradient(45deg,#e9a26f 0 2px,#fff 2px 5px)' : col}"></i>${name}`)); } }
const SU = ['All', 'Spatial', 'Object', 'Goal'];
const R = { openwam: [52.2, 58.8, 53.4, 28.2], ow_oracle: [66.4, 71.4, 75.1, 36.4], ow_zero: [67.0, 72.3, 76.8, 34.2], cosmos: [42.7, 52.7, 37.1, 18.0], cos_zero: [61.4, 71.6, 66.1, 20.4], naive: [50.1, 46.9, 64.5, 38.4], star: [68.5, 69.5, 74.9, 55.4], star_oracle: [73.7, 74.9, 84.5, 52.6], star_zero: [70.5, 73.5, 77.3, 50.4], tune: [71.8, 74.0, 77.7, 55.4] };
const table = (el, head, rows) => { el.innerHTML = '<table><thead><tr>' + head.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>' + rows.map(r => `<tr class="${r.cls || ''}">` + r.c.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>'; };
const segFor = (name, onPick) => { const seg = $(`.seg[data-for="${name}"]`); SU.forEach((s, i) => { const b = H('button', { class: i ? '' : 'on' }, seg, s); b.addEventListener('click', () => { $$('button', seg).forEach(x => x.classList.toggle('on', x === b)); onPick(i); }); }); };
const drawZero = i => bars($('#chart-zero'), { max: 100, legend: [['WAM alone', C.grey], ['+ WASD-Zero', C.agent], ['+ oracle (privileged)', '', 1]], groups: [
  { label: 'OpenWAM', bars: [{ name: 'OpenWAM', short: 'alone', v: R.openwam[i], color: C.grey }, { name: 'OpenWAM + WASD-Zero', short: '+ WASD-Zero', tiny: '+ WASD\nZero', v: R.ow_zero[i], color: C.agent }, { name: 'OpenWAM + WASD-Zero-oracle', short: '+ oracle', v: R.ow_oracle[i], hatch: 1, note: 'reads the simulator state' }] },
  { label: 'Cosmos', bars: [{ name: 'Cosmos', short: 'alone', v: R.cosmos[i], color: C.grey }, { name: 'Cosmos + WASD-Zero', short: '+ WASD-Zero', tiny: '+ WASD\nZero', v: R.cos_zero[i], color: C.agent }] }] });
const drawTune = i => bars($('#chart-tune'), { max: 100, legend: [['no guidance', C.grey], ['OpenWAM* (ours, post-trained)', '#f0b48d'], ['+ WASD-Zero', C.agent], ['WASD-Tune', C.wam]], groups: [{ bars: [
  { name: 'OpenWAM', short: 'OpenWAM', tiny: 'Open\nWAM', v: R.openwam[i], color: C.grey }, { name: 'Naive post-training', short: 'Naive\npost-training', tiny: 'Naive\npost-train', v: R.naive[i], color: C.grey }, { name: 'OpenWAM* (post-trained)', short: 'OpenWAM*', tiny: 'Open\nWAM*', v: R.star[i], color: '#f0b48d' },
  { name: 'OpenWAM* + WASD-Zero', short: '+ WASD-Zero\nevery task', tiny: '+ WASD\nZero', v: R.star_zero[i], color: C.agent }, { name: 'WASD-Tune (task gate)', short: 'WASD-Tune\ntask gate', tiny: 'WASD\nTune', v: R.tune[i], color: C.wam }] }] });
const fmt = a => [a[1], a[2], a[3], a[0]].map(v => v.toFixed(1));
onSeen($('#chart-zero'), () => drawZero(0)); onSeen($('#chart-tune'), () => drawTune(0)); segFor('zero', drawZero); segFor('tune', drawTune);
table($('#tbl-zero'), ['Method', 'Spatial', 'Object', 'Goal', 'All'], [{ c: ['OpenWAM', ...fmt(R.openwam)] }, { c: ['+ WASD-Zero-oracle', ...fmt(R.ow_oracle)], cls: 'priv' }, { c: ['+ WASD-Zero', ...fmt(R.ow_zero)], cls: 'ours' }, { c: ['Cosmos', ...fmt(R.cosmos)] }, { c: ['+ WASD-Zero', ...fmt(R.cos_zero)], cls: 'ours' }]);
table($('#tbl-tune'), ['Method', 'Spatial', 'Object', 'Goal', 'All'], [{ c: ['OpenWAM', ...fmt(R.openwam)] }, { c: ['Naive post-training', ...fmt(R.naive)] }, { c: ['OpenWAM*', ...fmt(R.star)] }, { c: ['+ WASD-Zero-oracle', ...fmt(R.star_oracle)], cls: 'priv' }, { c: ['+ WASD-Zero', ...fmt(R.star_zero)] }, { c: ['+ task gate (WASD-Tune)', ...fmt(R.tune)], cls: 'ours' }]);
table($('#tbl-keep'), ['Model', 'Spatial', 'Object', 'Goal'], [{ c: ['OpenWAM', '99.0', '100.0', '99.0'] }, { c: ['Naive post-training', '92.0', '95.0', '72.0'] }, { c: ['OpenWAM* (ours)', '99.0', '99.0', '88.0'], cls: 'ours' }]);
$$('[data-toggle]').forEach(b => b.addEventListener('click', () => { const k = b.dataset.toggle, c = $('#chart-' + k), t = $('#tbl-' + k); const toTable = t.hidden; t.hidden = !toTable; c.hidden = toTable; b.textContent = toTable ? 'Chart' : 'Table'; if (!toTable && c._cfg) bars(c, c._cfg); }));
onSeen($('#chart-why'), () => bars($('#chart-why'), { max: 50, tick: 10, delta: false, dec: 0, suffix: '%', groups: [{ bars: [{ name: 'Language', v: 11, color: C.grey }, { name: 'Proprioception', short: 'Proprio.', v: 14, color: C.grey }, { name: 'Current images', short: 'Current\nimages', v: 40, color: C.grey }, { name: 'Imagined future', short: 'Imagined\nfuture', v: 35, color: C.wam, note: 'changes the action without touching the observation' }] }] }));

function rows(el, list, max = 100) { el.innerHTML = ''; list.forEach(r => { const row = H('div', { class: 'row' + (r.ours ? ' ours' : '') }, el, `<div class="nm">${r.name}<small>${r.sub || ''}</small></div><div class="trk"><i></i></div><div class="val">${r.v.toFixed(1)}</div>`); if (r.tip) hover(row, r.tip); row._w = r.v / max * 100; }); onSeen(el, () => $$('.row', el).forEach((row, i) => setTimeout(() => $('i', row).style.width = row._w + '%', 90 * i))); }
rows($('#rows-agents'), [{ name: 'OpenWAM + WASD-Zero', sub: '30.2k tokens / episode', v: 67.0, ours: 1, tip: '<b>67.0 %</b>Spatial 72.3 · Object 76.8 · Goal 34.2' }, { name: 'OpenWAM + Harness', sub: '1.30M tokens / episode', v: 47.3, tip: '<b>47.3 %</b>Spatial 48.2 · Object 63.6 · Goal 20.0' },
  { name: 'π<sub>0.5</sub> with GT subtasks', sub: 'no agent', v: 45.5, tip: '<b>45.5 %</b>Spatial 46.0 · Object 58.4 · Goal 24.0' }, { name: 'GPT-as-Policy', sub: '10.06M tokens / episode', v: 23.5, tip: '<b>23.5 %</b>Spatial 27.0 · Object 24.7 · Goal 12.0' }]);
rows($('#rows-abl'), [{ name: 'WASD-Zero', sub: 'full method', v: 69.9, ours: 1 }, { name: 'No initial read', sub: '−4.8 pts', v: 65.1 }, { name: 'No failure-stop', sub: '−6.6 pts', v: 63.3 }, { name: 'No route', sub: '−12.1 pts', v: 57.9 }, { name: 'No synchronization', sub: '−13.7 pts', v: 56.3 }, { name: 'Text instead of imagination', sub: '−15.3 pts', v: 54.7 }].map(r => ({ ...r, tip: `<b>${r.v.toFixed(1)} %</b>${r.name}<br><small>OpenWAM, 439 episodes</small>` })));

const drawTiming = () => { const el = $('#chart-timing'); el.innerHTML = ''; const narrow = (el.clientWidth || 640) < 470; el._narrow = narrow; el._drawn = true; const W = narrow ? 390 : 640, Hh = narrow ? 310 : 330, m = { l: narrow ? 30 : 40, r: narrow ? 8 : 26, t: 30, b: 62 }, pw = W - m.l - m.r, ph = Hh - m.t - m.b; const svg = S('svg', { viewBox: `0 0 ${W} ${Hh}` }, el);
  const P = [['Never', 48.3, 'no agent'], [narrow ? 'Start\nonly' : 'Start only', 53.3, '+5.0 pts'], ['Start +\nfailures', 79.3, 'ours: +31.0 pts'], [narrow ? '+ every\nclose' : '+ every\ngripper close', 83.6, '+4.3 pts more, more stops'], ['Every\nchunk', 85.3, '+6.0 pts more, 2–5 extra stops']];
  const pad = narrow ? 22 : 30, y = v => m.t + ph * (1 - (v - 40) / 50), x = i => m.l + pad + (pw - 2 * pad) * i / (P.length - 1); for (let t = 40; t <= 90; t += 10) { S('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), class: 'grid' }, svg); S('text', { x: m.l - 8, y: y(t) + 4, 'text-anchor': 'end', class: 'ax' }, svg, t); }
  const d = P.map((p, i) => (i ? 'L' : 'M') + x(i) + ',' + y(p[1])).join(' '); const line = S('path', { d, fill: 'none', stroke: C.grey, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, svg); const len = line.getTotalLength(); line.style.strokeDasharray = len; line.style.strokeDashoffset = len; line.style.transition = 'stroke-dashoffset 1.3s ease'; requestAnimationFrame(() => requestAnimationFrame(() => line.style.strokeDashoffset = 0));
  const cross = S('line', { y1: m.t, y2: Hh - m.b, stroke: C.line, 'stroke-width': 1, opacity: 0 }, svg);
  P.forEach((p, i) => { const ours = i === 2, g = S('g', { class: 'bar-g' }, svg); S('rect', { x: x(i) - (narrow ? 34 : 50), y: m.t, width: narrow ? 68 : 100, height: ph + 44, fill: 'transparent' }, g); S('circle', { cx: x(i), cy: y(p[1]), r: ours ? 9 : 6, fill: ours ? C.wam : C.card, stroke: ours ? C.card : C.grey, 'stroke-width': ours ? 3 : 2.2 }, g);
    S('text', { x: x(i), y: y(p[1]) - 15, 'text-anchor': 'middle', class: 'vlab' }, g, p[1].toFixed(1)); p[0].split('\n').forEach((t, j) => S('text', { x: x(i), y: Hh - m.b + 20 + j * 15, 'text-anchor': 'middle', class: 'clab', 'font-weight': ours ? 600 : 400 }, g, t));
    hover(g, `<b>${p[1].toFixed(1)} %</b>${p[0].replace('\n', ' ')}<br><small>${p[2]}</small>`); g.addEventListener('pointerenter', () => { cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', 1); }); g.addEventListener('pointerleave', () => cross.setAttribute('opacity', 0)); });
  S('text', { x: m.l, y: 14, class: 'ax' }, svg, narrow ? 'SUCCESS (%) · DENSER SCHEDULES →' : 'SUCCESS (%) ON TWO TASKS · DENSER SCHEDULES →'); };
onSeen($('#chart-timing'), drawTiming);
let rsT; addEventListener('resize', () => { clearTimeout(rsT); rsT = setTimeout(() => { $$('.chart').forEach(el => { if (el.hidden || !el.clientWidth) return; const n = el.clientWidth < 470; if (el._cfg && el._narrow !== n) bars(el, el._cfg); else if (el.id === 'chart-timing' && el._drawn && el._narrow !== n) drawTiming(); }); }, 180); });

/* ---------- carousel ---------- */
(() => { const car = $('#carousel'), cards = $$('.rc', car), dots = $('#car-dots'), prev = $('#car-prev'), next = $('#car-next');
  const go = i => car.scrollTo({ left: cards[Math.max(0, Math.min(cards.length - 1, i))].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
  cards.forEach((c, i) => H('button', {}, dots, c.dataset.title).addEventListener('click', () => go(i)));
  const idx = () => { const step = cards[1].offsetLeft - cards[0].offsetLeft; return Math.round(car.scrollLeft / step); };
  const sync = () => { const i = idx(), end = car.scrollLeft + car.clientWidth >= car.scrollWidth - 4; $$('button', dots).forEach((b, j) => b.classList.toggle('on', j === i)); prev.disabled = i === 0; next.disabled = end; };
  car.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true }); prev.addEventListener('click', () => go(idx() - 1)); next.addEventListener('click', () => go(idx() + 1)); sync(); })();

/* ---------- demos ---------- */
(() => {
  // One clock runs for both sides and never stops. While the agent reads and rewrites, the robot on the right waits and the
  // clock keeps counting: that thinking time is part of the cost. TH and the three phases are the ones of the mechanism demo videos.
  const TH = 9.0, P_READ = 2.4, P_WRITE = 6.4, FLIP = [2.9, 3.7, 4.5, 5.3], VERDICT = 1.4;
  // times in seconds of each take; bt / gt = when the recording reaches each frame of the strip
  const DEMOS = [
    { id: 'box', title: 'Box placement', trap: 'A bottle lies closer to the gripper than the box.', dur: { alone: 58.6, wasd: 48.81 },
      alone: { out: 'Wrong object', cap: 'The WAM follows its own plan and takes the bottle.', bt: [0.5, 2.0, 3.6, 6.0], marks: [[6.0, 'Grasps the bottle', 'r'], [19.0, 'Releases the bottle at the basket', 'r']] },
      wasd: { out: 'Box in basket', marks: [[24.87, 'Box grasped', 'g'], [40.87, 'Box released into the basket', 'g']],
        writes: [{ t: 0, key: 'startup', name: 'Before the first action', read: 'The agent reads the plan: it reaches for the bottle.', bad: 'Wrong object', write: 'The agent rewrites the future: approach the box.', act: 'The WAM acts on the written frames.', gt: [5.6, 9.0, 14.0, 23.5] }] } },
    { id: 'drawer', title: 'Block retrieval', trap: 'The red block sits beside an open drawer.', dur: { alone: 55.81, wasd: 42.16 },
      alone: { out: 'No pickup', cap: 'The WAM follows its own plan and never picks up the block.', bt: [2, 4, 6, 9], marks: [] },
      wasd: { out: 'Block placed', marks: [],
        writes: [{ t: 0, key: 'startup', name: 'Before the first action', read: 'The agent reads the plan: an approach beside the drawer.', bad: 'Misses the block', write: 'The agent rewrites the future: a route to the block.', act: 'The WAM acts on the written frames.', gt: [0.5, 2.1, 3.9, 6.6] },
          { t: 9.6, key: 'miss', name: 'After the failed grasp', read: 'The fingers closed on nothing. The agent reads again.', bad: 'Empty grasp', write: 'The agent re-aims at the block and rewrites the approach.', act: 'The WAM acts on the new frames.', gt: [12.7, 15.5, 18.5, 23] }] } },
    { id: 'cup', title: 'Cup placement', trap: 'The robot starts holding the cup right above a basket.', dur: { alone: 9.8, wasd: 27.44 },
      alone: { out: 'In basket', cap: 'The WAM follows its own plan and lowers the cup into the basket.', bt: [1, 3, 5, 8], marks: [] },
      wasd: { out: 'On cabinet', marks: [],
        writes: [{ t: 0, key: 'startup', name: 'Before the first action', read: 'The agent reads the plan: the cup goes into the basket.', bad: 'Wrong goal', write: 'The agent rewrites the future: carry the cup to the cabinet.', act: 'The WAM acts on the written frames.', gt: [4.8, 7.8, 11.0, 17.0] }] } }];
  const root = $('#demo'), tabs = $('#dtabs'), V = {}, playB = $('#d-play'), lb = $('#lb'), stg = $('#stg');
  $$('.pane', root).forEach(p => { const k = p.dataset.side; V[k] = { p, main: $('video.main', p), ins: $('.inset video', p), fill: $('.fill', p), marks: $('.marks', p), time: $('.tl-time', p), state: $('.tl-state', p), bar: $('.bar', p), film: $('.film', p), txt: $('.lane-txt', p), verdict: $('.verdict', p), key: null, swapped: false }; });
  let cur, speed = 2, playing = false, clock = 0, lbOpen = false, lastTs = 0;
  const mmss = t => { t = Math.max(0, t || 0); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + (t % 60).toFixed(1).padStart(4, '0'); };
  const dur = k => (V[k].main.duration && isFinite(V[k].main.duration)) ? V[k].main.duration : cur.dur[k];
  const tc = i => cur.wasd.writes[i].t + i * TH;                                  // clock time at which write i starts
  const totalW = () => dur('wasd') + cur.wasd.writes.length * TH, endClock = () => Math.max(dur('alone'), totalW());
  const clockOfW = t => t + TH * cur.wasd.writes.filter(w => w.t <= t + 1e-6).length;   // clock time of second t of the With-WASD take
  const stateW = c => { const ws = cur.wasd.writes; for (let i = 0; i < ws.length; i++) { if (c < tc(i)) return { think: -1, vt: c - i * TH, done: i }; if (c < tc(i) + TH) return { think: i, el: c - tc(i), vt: ws[i].t, done: i }; } return { think: -1, vt: Math.min(c - ws.length * TH, dur('wasd')), done: ws.length }; };
  const drive = (v, want, vt) => { v.playbackRate = speed; const end = (isFinite(v.duration) && v.duration ? v.duration : 1e9) - 0.05; if (want && vt < end) { if (Math.abs(v.currentTime - vt) > 0.45 && !v.seeking) v.currentTime = vt; if (v.paused) v.play().catch(() => {}); } else { if (!v.paused) v.pause(); const to = Math.max(0, Math.min(vt, end)); if (Math.abs(v.currentTime - to) > 0.08 && !v.seeking && v.readyState > 0) v.currentTime = to; } };
  const ui = think => { root.classList.toggle('is-playing', playing); root.classList.toggle('is-seq', think); playB.textContent = playing ? '❚❚' : '▶'; };

  // the film strip of one pane
  const buildFilm = (k, key, both) => { const v = V[k]; v.film.innerHTML = ''; v.key = key;
    for (let i = 1; i <= 4; i++) { const c = H('button', { class: 'cell', 'aria-label': 'Enlarge frame ' + i }, v.film, `<span class="fr"><img class="b" src="${IMG}im_${cur.id}_${key}_b${i}.jpg" alt="">${both ? `<img class="w" src="${IMG}im_${cur.id}_${key}_w${i}.jpg" alt="">` : ''}</span><em>${i}</em>`);
      c.addEventListener('click', e => { e.stopPropagation(); openLb(key, i, c.classList.contains('flip')); }); } };
  const reach = (k, times, t) => { const cells = $$('.cell', V[k].film); let now = -1; cells.forEach((c, i) => { const r = t >= times[i] - 0.05; c.classList.toggle('reached', r); if (!r && now < 0) now = i; }); cells.forEach((c, i) => c.classList.toggle('now', i === now && playing)); V[k].film.classList.add('live'); };
  const chips = (on, past) => $$('button', stg).forEach((b, i) => { b.classList.toggle('on', i === on); b.classList.toggle('past', i < past); });
  const laneIdle = (wi, vt) => { const ws = cur.wasd.writes, w = ws[Math.max(0, wi)], v = V.wasd; if (v.key !== w.key) buildFilm('wasd', w.key, true);
    $$('.cell', v.film).forEach(c => c.classList.toggle('flip', wi >= 0)); v.film.classList.remove('reading'); v.verdict.hidden = wi < 0; v.verdict.className = 'verdict ok'; v.verdict.textContent = 'Rewritten';
    v.txt.textContent = wi >= 0 ? w.act : 'The same plan as on the left. Press play: the agent reads it first.'; chips(wi >= 0 ? 2 : -1, wi >= 0 ? 2 : 0); v.state.textContent = 'Execution';
    if (wi >= 0) reach('wasd', w.gt, vt); else { v.film.classList.remove('live'); $$('.cell', v.film).forEach(c => c.classList.remove('reached', 'now')); } };
  const laneThink = (wi, el) => { const w = cur.wasd.writes[wi], v = V.wasd; if (v.key !== w.key) buildFilm('wasd', w.key, true);
    const stage = el < P_READ ? 0 : el < P_WRITE ? 1 : 2; v.film.classList.remove('live'); v.film.classList.toggle('reading', stage === 0 && el < 1.9);
    $$('.cell', v.film).forEach((c, i) => { c.classList.toggle('flip', el >= FLIP[i]); c.classList.remove('reached', 'now'); });
    const bad = el >= VERDICT && stage < 2; v.verdict.hidden = !(bad || stage === 2); v.verdict.className = 'verdict' + (stage === 2 ? ' ok' : ''); v.verdict.textContent = stage === 2 ? 'Rewritten' : w.bad;
    v.txt.textContent = [w.read, w.write, w.act][stage]; chips(stage, stage); v.state.textContent = 'Thinking · ' + ['agent reads', 'agent rewrites', 'WAM replans'][stage]; };
  const seekClock = c => { clock = Math.max(0, Math.min(c, endClock())); };
  const toggle = () => { if (lbOpen) return closeLb(); if (!playing && clock >= endClock() - 0.02) clock = 0; playing = !playing; };

  // enlarged frame
  const openLb = (key, i, written) => { lbOpen = true; const f = `${IMG}imL_${cur.id}_${key}_${written ? 'w' : 'b'}${i}_`; $('#lb-e').src = f + 'e.jpg'; $('#lb-r').src = f + 'r.jpg'; $('#lb-title').textContent = written ? `Written future, frame ${i} of 4` : `Imagined future, frame ${i} of 4`; lb.hidden = false; };
  const closeLb = () => { lbOpen = false; lb.hidden = true; };
  lb.addEventListener('click', closeLb); addEventListener('keydown', e => { if (e.key === 'Escape' && lbOpen) closeLb(); });

  const tick = ts => { const dt = Math.min(0.1, (ts - lastTs) / 1000 || 0); lastTs = ts;
    if (cur) { const run = playing && !lbOpen, dA = dur('alone'), dW = dur('wasd'), tot = totalW(); let sw = stateW(clock);
      if (run) { const aMove = clock < dA - 0.05, wMove = sw.think < 0 && sw.vt < dW - 0.05, wait = (aMove && V.alone.main.readyState < 2) || (wMove && V.wasd.main.readyState < 2);
        if (!wait) clock = Math.min(endClock(), clock + dt * speed); if (clock >= endClock() - 1e-3) playing = false; sw = stateW(clock); }
      const a = Math.min(clock, dA), go = playing && !lbOpen;
      drive(V.alone.main, go && clock < dA, a); drive(V.alone.ins, go && clock < dA, a); drive(V.wasd.main, go && sw.think < 0, sw.vt); drive(V.wasd.ins, go && sw.think < 0, sw.vt);
      V.alone.fill.style.width = (a / dA * 100) + '%'; V.alone.time.textContent = mmss(a) + ' / ' + mmss(dA);
      const cw = Math.min(clock, tot); V.wasd.fill.style.width = (cw / tot * 100) + '%'; V.wasd.time.textContent = mmss(cw) + ' / ' + mmss(tot);
      if (sw.think >= 0) laneThink(sw.think, sw.el); else laneIdle(sw.done - 1, sw.vt); reach('alone', cur.alone.bt, a); ui(sw.think >= 0); }
    requestAnimationFrame(tick); };
  const buildMarks = () => { const dA = dur('alone'), tot = totalW(); for (const k in V) V[k].marks.innerHTML = '';
    const add = (k, c, total, lab, cls, fn) => { const b = H('button', { class: 'mk ' + cls, style: `left:${Math.min(98.5, Math.max(1.5, c / total * 100))}%`, 'aria-label': lab }, V[k].marks); hover(b, `<b>${lab}</b><small>${mmss(c)}</small>`); b.addEventListener('click', e => { e.stopPropagation(); fn(); }); };
    cur.wasd.writes.forEach((w, i) => { H('span', { class: 'think', style: `left:${tc(i) / tot * 100}%;width:${TH / tot * 100}%` }, V.wasd.marks); add('wasd', tc(i), tot, w.name + ': the agent reads and rewrites (' + TH.toFixed(0) + ' s)', 'w', () => { seekClock(tc(i)); playing = true; }); });
    cur.wasd.marks.forEach(mk => add('wasd', clockOfW(mk[0]), tot, mk[1], mk[2], () => seekClock(clockOfW(mk[0])))); cur.alone.marks.forEach(mk => add('alone', mk[0], dA, mk[1], mk[2], () => seekClock(mk[0]))); };
  const load = d => { playing = false; lbOpen = false; lb.hidden = true; cur = d; clock = 0;
    $('#d-title').textContent = d.title; $('#d-trap').textContent = d.trap; $('#out-alone').textContent = d.alone.out; $('#out-wasd').textContent = d.wasd.out;
    for (const k in V) { const v = V[k]; v.swapped = false; v.key = null; v.main.poster = `${VID}${d.id}_${k}_poster.jpg`; v.ins.poster = `${VID}${d.id}_${k}_wrist_poster.jpg`; v.main.src = `${VID}${d.id}_${k}_ext.mp4`; v.ins.src = `${VID}${d.id}_${k}_wrist.mp4`; $('.inset span', v.p).textContent = 'Wrist'; v.main.onloadedmetadata = buildMarks; }
    buildFilm('alone', d.wasd.writes[0].key, false); V.alone.txt.textContent = d.alone.cap; V.alone.film.classList.remove('live'); buildMarks(); $$('.dtab', tabs).forEach(b => b.classList.toggle('on', b.dataset.id === d.id)); };
  DEMOS.forEach(d => { const b = H('button', { class: 'dtab', 'data-id': d.id }, tabs, `<img src="${VID}${d.id}_wasd_poster.jpg" alt=""><div><b>${d.title}</b><span>${d.alone.out} → ${d.wasd.out}</span></div>`); b.addEventListener('click', () => load(d)); });
  playB.addEventListener('click', toggle);
  $('#d-restart').addEventListener('click', () => { closeLb(); clock = 0; playing = true; });
  $$('#d-speed button').forEach(b => b.addEventListener('click', () => { speed = +b.dataset.s; $$('#d-speed button').forEach(x => x.classList.toggle('on', x === b)); }));
  $$('button', stg).forEach(b => b.addEventListener('click', () => { const sw = stateW(clock), wi = sw.think >= 0 ? sw.think : Math.max(0, sw.done - 1); seekClock(tc(wi) + [0, P_READ, P_WRITE][+b.dataset.s] + 0.02); playing = true; }));
  for (const k in V) { const v = V[k];
    $('.vwrap', v.p).addEventListener('click', e => { if (!e.target.closest('.inset')) toggle(); });
    v.bar.addEventListener('click', e => { const r = v.bar.getBoundingClientRect(), f = (e.clientX - r.left) / r.width; seekClock(f * (k === 'alone' ? dur('alone') : totalW())); });
    $('.inset', v.p).addEventListener('click', e => { e.stopPropagation(); const a = v.main.src, pa = v.main.poster; v.main.src = v.ins.src; v.main.poster = v.ins.poster; v.ins.src = a; v.ins.poster = pa; v.swapped = !v.swapped; $('.inset span', v.p).textContent = v.swapped ? 'External' : 'Wrist'; }); }
  load(DEMOS[0]); requestAnimationFrame(tick);
  new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting && playing) playing = false; }), { threshold: 0.05 }).observe(root);
})();

/* ---------- citation ---------- */
$('#copy-bib').addEventListener('click', async () => { const t = $('#bib').textContent; try { await navigator.clipboard.writeText(t); } catch { const r = document.createRange(); r.selectNodeContents($('#bib')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); s.removeAllRanges(); } toast('BibTeX copied'); });
})();
