  /* ============================================================
     かたち パズル（図形・空間認知）
     タングラム・おてほん うつし・まわすと どれ？・かたち はめ
     ============================================================ */
  // タングラムの ピース（ますめの ちょうてん。90どずつ まわすと ずっと ますめの うえ）
  const PIECES = {
    L: [[0, 0], [4, 0], [2, 2]], M: [[0, 0], [2, 0], [0, 2]], S: [[0, 0], [2, 0], [1, 1]],
    Q: [[1, 0], [2, 1], [1, 2], [0, 1]], P: [[1, 0], [3, 0], [2, 1], [0, 1]]
  };
  const PCOL = { L: ['#FA5252', '#FF922B'], M: ['#FCC419'], S: ['#51CF66', '#20C997'], Q: ['#339AF0'], P: ['#CC5DE8'] };
  // パズル（こたえの かたちを そのまま かく → シルエットは その あわせ）
  const PUZ = [
    { n: 'さんかく', e: '🔺', lv: 1, t: [[[0, 0], [4, 0], [2, 2]], [[4, 0], [4, 4], [2, 2]]] },
    { n: 'ふね', e: '⛵', lv: 1, t: [[[2, 0], [2, 2], [0, 2]], [[0, 2], [2, 2], [1, 3], [-1, 3]]] },
    { n: 'ダイヤ', e: '💎', lv: 1, t: [[[0, 1], [2, 1], [1, 2]], [[0, 1], [2, 1], [1, 0]]] },
    { n: 'さかな', e: '🐟', lv: 2, t: [[[0, 2], [4, 2], [2, 4]], [[0, 2], [4, 2], [2, 0]], [[5, 1], [5, 3], [4, 2]]] },
    { n: 'いえ', e: '🏠', lv: 2, t: [[[0, 2], [4, 2], [2, 0]], [[1, 2], [3, 2], [1, 4]], [[3, 2], [3, 4], [2, 3]], [[3, 4], [1, 4], [2, 3]]] },
    { n: 'き', e: '🌲', lv: 2, t: [[[0, 2], [4, 2], [2, 0]], [[0, 4], [4, 4], [2, 2]], [[1, 4], [3, 4], [2, 5]], [[2, 5], [3, 6], [2, 7], [1, 6]]] },
    { n: 'しかく（7こ）', e: '🟥', lv: 3, t: [[[0, 0], [4, 0], [2, 2]], [[0, 0], [2, 2], [0, 4]], [[4, 0], [4, 2], [3, 1]], [[3, 1], [4, 2], [3, 3], [2, 2]], [[2, 2], [3, 3], [1, 3]], [[0, 4], [1, 3], [3, 3], [2, 4]], [[4, 2], [4, 4], [2, 4]]] },
    { n: 'おおきな さかな（7こ）', e: '🐠', lv: 3, t: [[[0, 4], [4, 4], [2, 6]], [[0, 4], [4, 4], [2, 2]], [[4, 4], [6, 4], [6, 2]], [[4, 4], [6, 4], [5, 5]], [[5, 5], [6, 4], [6, 6]], [[2, 0], [3, 1], [2, 2], [1, 1]], [[1, 6], [3, 6], [2, 7], [0, 7]]] }
  ];
  const GAMES = [
    { id: 'tan', e: '🔷', n: 'タングラム', s: 'ピースで かたちを つくる', c: '#0B7285' },
    { id: 'copy', e: '🔲', n: 'おてほん うつし', s: 'おなじ もようを つくる', c: '#E8590C' },
    { id: 'rot', e: '🔄', n: 'まわすと どれ？', s: 'まわす・かがみに うつす', c: '#7048E8' },
    { id: 'fit', e: '⭐', n: 'かたち はめ', s: 'おなじ かたちの あなに いれる', c: '#E64980' }
  ];
  const APP = {
    id: 'katachi-puzzle', title: 'かたち パズル', ls: 'katachi.v1', db: false, sw: true, color: '#0B7285',
    defaults: { level: 1, guide: 'auto' },
    newProfile: (name, icon) => ({ id: 'p' + Math.random().toString(36).slice(2, 9), name, icon, best: {}, log: [], tan: {} }),
    normProfile(p) { p.best = p.best && typeof p.best === 'object' ? p.best : {}; p.log = Array.isArray(p.log) ? p.log : []; p.tan = p.tan && typeof p.tan === 'object' ? p.tan : {}; },
    childScreens: ['play'], topScreens: ['home', 'tanlist'],
    renderHome: () => renderHome(),
    profileNote: p => 'あそんだ ' + p.log.length + 'かい',
    helpNote: 'かたちを みる・まわす・くみあわせる ちから（図形・空間認知）を そだてます。タングラムは ピースを ゆびで うごかし、タッチで 90ど まわします（はじめは なかの せん＝ヒントつき）。おてほん うつしは、いろや さんかくの むきまで よく みて うつします。まわすと どれ？ は、まわした かたち と うらがえした（かがみ）かたち の ちがいに きづく れんしゅうです。かたち はめは ちいさい 子むけの はじめの いっぽ。タングラムは シルエットと きりとる ピースを プリント できるので、つくえの うえでも あそべます。'
  };
/*BASE_HERE*/

  const L = () => Number(S().level) || 1;
  const rotP = (pts, r) => { let o = pts.map(p => p.slice()); for (let i = 0; i < ((r % 4) + 4) % 4; i++) o = o.map(([x, y]) => [-y, x]); return o; };
  const keyOf = pts => { const mx = Math.min(...pts.map(p => p[0])), my = Math.min(...pts.map(p => p[1])); return pts.map(p => (p[0] - mx) + ',' + (p[1] - my)).sort().join(';'); };
  const absKey = pts => pts.map(p => Math.round(p[0] * 100) / 100 + ',' + Math.round(p[1] * 100) / 100).sort().join(';');
  function typeOf(poly) { const k = keyOf(poly); for (const t of Object.keys(PIECES)) for (let r = 0; r < 4; r++) if (keyOf(rotP(PIECES[t], r)) === k) return t; return null; }
  const ptsStr = pts => pts.map(p => p.join(',')).join(' ');
  const SVGNS = 'http://www.w3.org/2000/svg';

  /* ============================================================
     ホーム
     ============================================================ */
  function renderHome() {
    screen = 'home';
    const p = cur(), st = S();
    setView('home', [
      h('h1', { class: 'title' }, '🔷 かたち パズル', h('small', null, 'よく みて、まわして、くみあわせよう')),
      h('div', { class: 'lvl' }, [[1, '🌱 やさしい'], [2, '🌿 ふつう'], [3, '🌳 むずかしい']].map(l => h('button', { type: 'button', class: Number(st.level) === l[0] ? 'on' : '', onclick: () => { st.level = l[0]; persist(); sfx.tap(); renderHome(); } }, l[1]))),
      h('div', { class: 'menu' }, GAMES.map(g => h('button', { type: 'button', class: 'mcard', style: '--c:' + g.c, onclick: () => { if (!tapOk()) return; sfx.tap(); if (g.id === 'tan') renderTanList(); else startGame(g.id); } },
        p.best[g.id + st.level] ? h('span', { class: 'st' }, '⭐'.repeat(p.best[g.id + st.level])) : null, E(g.e), h('b', null, g.n), h('small', null, g.s))))
    ]);
  }
  function renderTanList() {
    screen = 'tanlist';
    const p = cur();
    setView('home', [h('h1', { class: 'title' }, '🔷 タングラム', h('small', null, 'つくりたい かたちを えらぼう')),
      h('div', { class: 'menu' }, PUZ.map((z, i) => h('button', { type: 'button', class: 'mcard', style: '--c:' + ['#40C057', '#FAB005', '#E8590C'][z.lv - 1], onclick: () => { if (tapOk()) { sfx.tap(); startTan(i); } } },
        p.tan[i] ? h('span', { class: 'st' }, '✅') : null, E(z.e), h('b', null, z.n), h('small', null, z.t.length + 'こ の ピース')))),
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'mid-btn', onclick: () => { if (tapOk()) renderHome(); } }, '◀ もどる'))]);
  }

  /* ============================================================
     ドラッグの きょうつう（SVG の なかで うごかす）
     ============================================================ */
  function svgPt(svg, e) { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
  function dragIn(svg, el, o) {
    let st = null;
    el.addEventListener('pointerdown', e => {
      if (o.locked && o.locked()) return;
      e.preventDefault(); e.stopPropagation();
      const p = svgPt(svg, e); st = { sx: p.x, sy: p.y, moved: false, cx: e.clientX, cy: e.clientY };
      // いちばん うえに だしてから つかむ（つかんだ あとに うごかすと つかみが はずれる）
      if (svg.lastChild !== el) svg.appendChild(el);
      try { el.setPointerCapture(e.pointerId); } catch (er) { /* 無視 */ }
      el.classList.add('drag'); if (o.start) o.start();
    });
    el.addEventListener('pointermove', e => {
      if (!st) return;
      if (!st.moved && Math.hypot(e.clientX - st.cx, e.clientY - st.cy) > 8) st.moved = true;
      if (st.moved) { const p = svgPt(svg, e); o.move(p.x - st.sx, p.y - st.sy); }
    });
    const end = e => { if (!st) return; const m = st.moved; st = null; el.classList.remove('drag'); if (m) o.drop(); else if (o.tap) o.tap(); };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }

  /* ============================================================
     🔷 タングラム
     ============================================================ */
  let T = null;
  function startTan(i) { T = { i, z: PUZ[i], t0: Date.now(), hints: 0 }; keepAwake(); renderTan(); }
  function renderTan() {
    screen = 'play';
    const z = T.z, targets = z.t.map(pts => ({ pts, type: typeOf(pts), done: false }));
    const minx = Math.min(...z.t.flat().map(p => p[0])), miny = Math.min(...z.t.flat().map(p => p[1]));
    targets.forEach(t => { t.pts = t.pts.map(p => [p[0] - minx, p[1] - miny]); t.key = absKey(t.pts); });
    const bw = Math.max(...targets.flatMap(t => t.pts.map(p => p[0]))), bh = Math.max(...targets.flatMap(t => t.pts.map(p => p[1])));
    // ピース（いろは しゅるいごと）
    const cnt = {};
    const pieces = targets.map(t => { cnt[t.type] = (cnt[t.type] || 0) + 1; return { type: t.type, base: PIECES[t.type], r: 0, x: 0, y: 0, col: PCOL[t.type][(cnt[t.type] - 1) % PCOL[t.type].length], lock: false }; });
    // はいち：よこながの がめんは みぎ、たてながは した に トレー
    const wide = innerWidth > innerHeight * 1.05, pad = 1;
    let tx = wide ? bw + 2 : 0, ty = wide ? 0 : bh + 2, cx = 0, cy = 0, rowH = 0;
    const trayW = wide ? Math.max(9, Math.ceil(pieces.length / 3) * 4.6) : Math.max(bw, 9);
    shuffle(pieces).forEach(pc => { pc.r = ri(0, 3); const pts = rotP(pc.base, pc.r), w = Math.max(...pts.map(p => p[0])) - Math.min(...pts.map(p => p[0])), hh = Math.max(...pts.map(p => p[1])) - Math.min(...pts.map(p => p[1])); if (cx + w > trayW) { cx = 0; cy += rowH + .6; rowH = 0; } pc.x = tx + cx - Math.min(...pts.map(p => p[0])); pc.y = ty + cy - Math.min(...pts.map(p => p[1])); cx += w + .6; rowH = Math.max(rowH, hh); });
    const allW = wide ? tx + trayW : Math.max(bw, trayW), allH = wide ? Math.max(bh, cy + rowH) : ty + cy + rowH;
    const guide = S().guide === 'on' || (S().guide === 'auto' && z.lv < 3);
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', (-pad) + ' ' + (-pad) + ' ' + (allW + pad * 2) + ' ' + (allH + pad * 2));
    svg.innerHTML = targets.map((t, k) => '<polygon class="sil' + (guide ? '' : ' noline') + '" data-k="' + k + '" points="' + ptsStr(t.pts) + '"/>').join('');
    const cntEl = h('span', { class: 'cnt' }, '0 / ' + targets.length);
    const draw = (pc, el) => el.setAttribute('points', ptsStr(rotP(pc.base, pc.r).map(p => [p[0] + pc.x, p[1] + pc.y])));
    const center = pc => { const pts = rotP(pc.base, pc.r); return [pts.reduce((a, p) => a + p[0], 0) / pts.length + pc.x, pts.reduce((a, p) => a + p[1], 0) / pts.length + pc.y]; };
    const check = (pc, el) => {
      const k = absKey(rotP(pc.base, pc.r).map(p => [p[0] + pc.x, p[1] + pc.y]));
      const t = targets.find(t => !t.done && t.key === k);
      if (t) { t.done = true; pc.lock = true; el.classList.add('lock'); sfx.step(); const n = targets.filter(x => x.done).length; cntEl.textContent = n + ' / ' + targets.length; if (n === targets.length) finishTan(svg); return true; }
      return false;
    };
    pieces.forEach(pc => {
      const el = pc.el = document.createElementNS(SVGNS, 'polygon'); el.setAttribute('class', 'pc'); el.setAttribute('fill', pc.col); draw(pc, el); svg.appendChild(el);
      let ox = 0, oy = 0;
      dragIn(svg, el, {
        locked: () => pc.lock,
        start: () => { ox = pc.x; oy = pc.y; },
        move: (dx, dy) => { pc.x = ox + dx; pc.y = oy + dy; draw(pc, el); },
        drop: () => { pc.x = Math.round(pc.x); pc.y = Math.round(pc.y); draw(pc, el); if (!check(pc, el)) tone(330, 0, .06, 'sine', .15); },
        tap: () => { const c0 = center(pc); pc.r = (pc.r + 1) % 4; const c1 = center(pc); pc.x = Math.round(pc.x + c0[0] - c1[0]); pc.y = Math.round(pc.y + c0[1] - c1[1]); draw(pc, el); tone(520, 0, .05, 'triangle', .2); check(pc, el); }
      });
    });
    if (TEST) T.dbg = { pieces, targets, set: (pc, r, x, y) => { pc.r = r; pc.x = x; pc.y = y; draw(pc, pc.el); return check(pc, pc.el); } };
    setView('k', [h('div', { class: 'khead' }, h('div', { class: 'ask' }, z.e + ' 「' + z.n + '」を つくろう'), cntEl),
      h('div', { class: 'board' }, svg),
      h('div', { class: 'tip2' }, '👆 ゆびで うごかす・タッチで まわす'),
      h('div', { class: 'tools' },
        h('button', { type: 'button', class: 'mid-btn', onclick: () => { const t = targets.find(x => !x.done); if (!t) return; T.hints++; const el = svg.querySelector('.sil[data-k="' + targets.indexOf(t) + '"]'); el.classList.remove('hint', 'noline'); void el.getBBox(); el.classList.add('hint'); } }, '💡 ヒント'),
        h('button', { type: 'button', class: 'mid-btn', onclick: () => { if (tapOk()) renderTan(); } }, '↺ はじめから'),
        h('button', { type: 'button', class: 'mid-btn', onclick: () => { if (tapOk()) renderTanList(); } }, '◀ ほかの かたち'))]);
    speak(z.n + 'を つくろう');
  }
  function finishTan(svg) {
    const p = cur(); p.tan[T.i] = true;
    const star = T.hints === 0 ? 3 : T.hints <= 2 ? 2 : 1, key = 'tan' + T.z.lv;
    p.best[key] = Math.max(p.best[key] || 0, star);
    p.log.push({ t: Date.now(), g: 'tan', lv: T.z.lv, name: T.z.n, ok: star, n: 3, sec: Math.round((Date.now() - T.t0) / 1000) }); persist();
    sfx.clear(); FX.big(); praise('できた！');
    svg.querySelectorAll('.sil').forEach(x => x.style.opacity = '0');
    after(2200, () => {
      screen = 'end';
      const next = PUZ.findIndex((z, i) => i > T.i);
      setView('center', [h('div', { class: 'center' }, h('div', { class: 'stars' }, [0, 1, 2].map(i => h('span', { class: i < star ? '' : 'off' }, '⭐'))),
        h('h1', { class: 'title' }, T.z.e + ' 「' + T.z.n + '」 できた！', h('small', null, Math.round((Date.now() - T.t0) / 1000) + 'びょう' + (T.hints ? '・ヒント ' + T.hints + 'かい' : ''))),
        h('div', { class: 'actions' }, next >= 0 ? h('button', { type: 'button', class: 'big-btn go', onclick: () => { if (tapOk()) startTan(next); } }, '▶ つぎの かたち') : null,
          h('button', { type: 'button', class: 'big-btn white', onclick: () => { if (tapOk()) renderTanList(); } }, '🔷 えらぶ')))]);
    });
  }

  /* ============================================================
     🔲 おてほん うつし
     ============================================================ */
  const CCOL = { 1: '#FA5252', 2: '#339AF0', 3: '#FCC419' }, TRI = { 4: '0,0 0,10 10,10', 5: '0,0 10,0 0,10', 6: '0,0 10,0 10,10', 7: '10,0 10,10 0,10' };
  const cellSVG = v => '<svg viewBox="0 0 10 10" preserveAspectRatio="none">' + (CCOL[v] ? '<rect width="10" height="10" fill="' + CCOL[v] + '"/>' : TRI[v] ? '<polygon points="' + TRI[v] + '" fill="#0B7285"/>' : '') + '</svg>';
  function genCopy(lv) {
    const n = lv === 1 ? 3 : 4, states = lv === 1 ? [1, 2] : lv === 2 ? [1, 2, 3] : [1, 2, 4, 5, 6, 7];
    let g;
    do { g = Array.from({ length: n * n }, () => Math.random() < .5 ? pick(states) : 0); } while (g.filter(Boolean).length < Math.ceil(n * n * .35));
    return { n, model: g, user: g.map(() => 0), states };
  }

  /* ============================================================
     🔄 まわすと どれ？（3×3 の ブロック。1つだけ いろが ちがう）
     ============================================================ */
  const nrm = cs => { const mx = Math.min(...cs.map(c => c[0])), my = Math.min(...cs.map(c => c[1])); return cs.map(c => [c[0] - mx, c[1] - my, c[2]]); };
  const rotC = cs => nrm(cs.map(([x, y, m]) => [2 - y, x, m])), mirC = cs => nrm(cs.map(([x, y, m]) => [2 - x, y, m]));
  const rotN = (cs, k) => { let o = cs; for (let i = 0; i < k; i++) o = rotC(o); return o; };
  const ckey = cs => nrm(cs).map(c => c.join(',')).sort().join(';');
  function randBlock(n) {
    for (let t = 0; t < 300; t++) {
      const cs = [[ri(0, 2), ri(0, 2)]];
      while (cs.length < n) { const b = pick(cs), d = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), x = b[0] + d[0], y = b[1] + d[1]; if (x < 0 || y < 0 || x > 2 || y > 2 || cs.some(c => c[0] === x && c[1] === y)) continue; cs.push([x, y]); }
      const m = ri(0, cs.length - 1), out = nrm(cs.map((c, i) => [c[0], c[1], i === m ? 1 : 0]));
      const ks = new Set(); let v = out; for (let i = 0; i < 4; i++) { ks.add(ckey(v)); ks.add(ckey(mirC(v))); v = rotC(v); }
      if (ks.size === 8) return out;
    }
    return nrm([[0, 0, 1], [1, 0, 0], [2, 0, 0], [0, 1, 0]]);
  }
  const blockSVG = (cs, col) => '<svg viewBox="-.2 -.2 3.4 3.4" xmlns="' + SVGNS + '">' + cs.map(([x, y, m]) => '<rect x="' + (x + .05) + '" y="' + (y + .05) + '" width=".9" height=".9" rx=".12" fill="' + (m ? '#343A40' : (col || '#20C997')) + '" stroke="rgba(0,0,0,.3)" stroke-width=".05"/>' + (m ? '<circle cx="' + (x + .5) + '" cy="' + (y + .5) + '" r=".18" fill="#FFE066"/>' : '')).join('') + '</svg>';
  function genRot(lv) {
    const b = randBlock(lv === 1 ? 4 : 5);
    const mirrorQ = lv === 3 && Math.random() < .5;
    const k = lv === 1 ? 1 : pick([1, 2, 3]);
    const ans = mirrorQ ? mirC(b) : rotN(b, k);
    const opts = [ans]; const used = new Set([ckey(ans)]);
    const add = c => { if (!used.has(ckey(c)) && opts.length < (lv === 1 ? 3 : 4)) { used.add(ckey(c)); opts.push(c); } };
    if (lv === 1) { add(randBlock(4)); add(randBlock(4)); add(randBlock(5)); }
    else { add(mirrorQ ? rotN(b, 2) : mirC(ans)); add(mirrorQ ? rotN(b, 1) : rotN(b, (k + 2) % 4 || 2)); add(mirC(rotN(b, (k + 1) % 4))); add(rotN(b, (k + 1) % 4)); }
    return { b, k, mirrorQ, ans, opts: shuffle(opts) };
  }

  /* ============================================================
     ⭐ かたち はめ
     ============================================================ */
  const SHP = {
    circle: 'M50 10 A40 40 0 1 1 49.9 10Z', square: 'M14 14H86V86H14Z', tri: 'M50 10L90 86H10Z', star: 'M50 6L61 38H94L67 57L77 90L50 70L23 90L33 57L6 38H39Z',
    heart: 'M50 88C12 62 6 40 18 26C30 12 46 18 50 32C54 18 70 12 82 26C94 40 88 62 50 88Z', diamond: 'M50 6L94 50L50 94L6 50Z', rect: 'M6 28H94V72H6Z', oval: 'M50 22C80 22 94 36 94 50S80 78 50 78S6 64 6 50S20 22 50 22Z', hex: 'M28 12H72L94 50L72 88H28L6 50Z', moon: 'M62 10A40 40 0 1 0 62 90A32 32 0 1 1 62 10Z'
  };
  const SCOL = ['#FA5252', '#339AF0', '#FCC419', '#51CF66', '#CC5DE8', '#FF922B'];
  function genFit(lv) { const set = lv === 1 ? shuffle(['circle', 'square', 'tri', 'star', 'heart']).slice(0, 3) : lv === 2 ? shuffle(['circle', 'square', 'tri', 'star', 'heart', 'moon']).slice(0, 5) : shuffle(['square', 'rect', 'diamond', 'circle', 'oval', 'hex']); return { set, done: 0 }; }

  /* ============================================================
     ゲーム（うつす・まわす・はめる）
     ============================================================ */
  let G = null;
  function startGame(id) { G = { id, i: 0, n: id === 'fit' ? 3 : 5, ok: 0, res: [], t0: Date.now() }; keepAwake(); nextQ(); }
  function nextQ() {
    if (G.i >= G.n) { endGame(); return; }
    G.miss = 0; G.busy = false;
    if (G.id === 'copy') G.q = genCopy(L());
    if (G.id === 'rot') G.q = genRot(L());
    if (G.id === 'fit') G.q = genFit(L());
    ({ copy: renderCopy, rot: renderRot, fit: renderFit })[G.id]();
  }
  function head(ask, cnt) { return h('div', { class: 'khead' }, h('div', { class: 'prog' }, Array.from({ length: G.n }, (_, k) => h('i', { class: k < G.i ? (G.res[k] ? 'ok' : '') : k === G.i ? 'now' : '' }))), h('div', { class: 'ask' }, ask), h('span', { class: 'cnt' }, cnt || '')); }
  function solved(el) { if (G.busy) return; G.busy = true; sfx.ok(); praise(); if (el) FX.small(el, { variant: 1 }); G.res[G.i] = G.miss <= 1; if (G.miss <= 1) G.ok++; after(1600, () => { G.i++; nextQ(); }); }
  function renderCopy() {
    screen = 'play';
    const q = G.q;
    let tool = q.states[0];
    const model = h('div', { class: 'cg', style: '--n:' + q.n }, q.model.map(v => h('div', { html: cellSVG(v) })));
    const user = h('div', { class: 'cg', style: '--n:' + q.n });
    const drawU = () => { user.innerHTML = ''; q.user.forEach((v, i) => user.append(h('button', { type: 'button', 'aria-label': 'ます', html: cellSVG(v), onclick: () => { if (G.busy) return; q.user[i] = q.user[i] === tool ? 0 : tool; tone(560, 0, .04, 'triangle', .2); drawU(); } }))); };
    const pal = h('div', { class: 'pal' });
    const drawP = () => { pal.innerHTML = ''; q.states.concat([0]).forEach(v => pal.append(h('button', { type: 'button', class: tool === v ? 'on' : '', 'aria-label': v ? 'いろ' : 'けす', html: v ? cellSVG(v) : '<span style="font-size:24px">🧽</span>', onclick: () => { tool = v; sfx.tap(); drawP(); } }))); };
    setView('k', [head('おてほんと おなじに しよう'), h('div', { class: 'copy' }, h('div', { class: 'side' }, h('b', null, 'おてほん'), model), h('div', { class: 'side' }, h('b', null, 'ここに つくる（いろを えらんで タッチ）'), user)), pal,
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'big-btn go', onclick: () => {
        if (!tapOk(500) || G.busy) return;
        const bad = q.model.map((v, i) => v !== q.user[i] ? i : -1).filter(i => i >= 0);
        if (!bad.length) solved(user);
        else { G.miss++; sfx.ng(); [...user.children].forEach((c, i) => c.classList.toggle('bad', bad.indexOf(i) >= 0)); speak('あかい わくの ところを よく みて'); }
      } }, '✓ できた'))]);
    drawU(); drawP();
    if (G.i === 0) speak('おてほんと おなじ もように しよう');
  }
  function renderRot() {
    screen = 'play';
    const q = G.q;
    const ask = q.mirrorQ ? 'かがみに うつすと どれ？' : (q.k === 2 ? 'さかさまに すると どれ？' : 'みぎに ' + (q.k === 3 ? 3 : q.k) + 'かい まわすと どれ？');
    const arrow = q.mirrorQ ? '🪞' : q.k === 1 ? '↻' : q.k === 2 ? '🔃' : '↻↻↻';
    setView('k', [head(ask), h('div', { class: 'rq' }, h('div', { class: 'src' }, h('div', { html: blockSVG(q.b) }), h('span', { class: 'arrow' }, arrow)),
      h('div', { class: 'opts', style: '--n:' + q.opts.length }, q.opts.map(o => { const b = h('button', { type: 'button', html: blockSVG(o, '#74C0FC'), onclick: () => { if (G.busy || b.classList.contains('ng')) return; if (ckey(o) === ckey(q.ans)) { b.classList.add('ok'); solved(b); } else { b.classList.add('ng'); G.miss++; sfx.ng(); speak(q.mirrorQ ? 'くろい ブロックの ばしょを よく みて' : 'まわすと くろい ブロックは どこに いくかな'); } } }); return b; })))]);
    speak(ask);
  }
  function renderFit() {
    screen = 'play';
    const q = G.q, n = q.set.length, cols = n;
    const svg = document.createElementNS(SVGNS, 'svg');
    const W2 = cols * 110 + 20, H2 = 300;
    svg.setAttribute('viewBox', '0 0 ' + W2 + ' ' + H2);
    let html = '<rect x="5" y="5" width="' + (W2 - 10) + '" height="130" rx="20" fill="#E9ECEF"/>';
    q.set.forEach((s, i) => { html += '<g transform="translate(' + (20 + i * 110) + ' 20) scale(.95)"><path d="' + SHP[s] + '" fill="#495057" data-hole="' + s + '"/></g>'; });
    svg.innerHTML = html;
    const order = shuffle(q.set.slice());
    order.forEach((s, i) => {
      const g = document.createElementNS(SVGNS, 'g'); const home = [20 + i * 110, 170]; let pos = home.slice();
      g.innerHTML = '<path d="' + SHP[s] + '" fill="' + SCOL[i % SCOL.length] + '" stroke="rgba(0,0,0,.3)" stroke-width="3"/>';
      const place = () => g.setAttribute('transform', 'translate(' + pos[0] + ' ' + pos[1] + ') scale(.95)');
      place(); svg.appendChild(g);
      let o = null, locked = false;
      dragIn(svg, g, {
        locked: () => locked,
        start: () => { o = pos.slice(); },
        move: (dx, dy) => { pos = [o[0] + dx, o[1] + dy]; place(); },
        drop: () => {
          const hi = q.set.findIndex((_, k) => Math.abs(pos[0] - (20 + k * 110)) < 45 && Math.abs(pos[1] - 20) < 55);
          if (hi >= 0 && q.set[hi] === s) { pos = [20 + hi * 110, 20]; place(); locked = true; sfx.step(); q.done++; if (q.done === n) solved(svg); }
          else { if (hi >= 0) { G.miss++; sfx.ng(); } pos = home.slice(); place(); }
        }
      });
    });
    setView('k', [head('おなじ かたちの あなに いれよう'), h('div', { class: 'board' }, svg)]);
    if (G.i === 0) speak('おなじ かたちの あなに いれよう');
  }
  function endGame() {
    const p = cur(), n = G.n, star = G.ok >= n ? 3 : G.ok >= n * .6 ? 2 : 1, key = G.id + S().level;
    p.best[key] = Math.max(p.best[key] || 0, star);
    p.log.push({ t: Date.now(), g: G.id, lv: S().level, ok: G.ok, n, sec: Math.round((Date.now() - G.t0) / 1000) }); if (p.log.length > 1000) p.log.splice(0, p.log.length - 1000); persist();
    screen = 'end';
    setView('center', [h('div', { class: 'center' }, h('div', { class: 'stars' }, [0, 1, 2].map(i => h('span', { class: i < star ? '' : 'off', style: 'animation-delay:' + (i * .2) + 's' }, '⭐'))),
      h('h1', { class: 'title' }, 'よく できました！', h('small', null, n + 'もん・' + Math.round((Date.now() - G.t0) / 1000) + 'びょう')),
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'big-btn go', onclick: () => { if (tapOk()) startGame(G.id); } }, '🔁 もういちど'), h('button', { type: 'button', class: 'big-btn white', onclick: () => { if (tapOk()) renderHome(); } }, '🏠 えらぶ')))]);
    sfx.clear(); if (star === 3) FX.big(); else FX.small(document.querySelector('.title'));
    speak('よく できました');
  }

  /* ============================================================
     プリント
       tan … タングラム（シルエット ＋ きりとる ピース）／ copy … おてほん うつし ／ rot … まわすと どれ？
     ============================================================ */
  const PF = '<div class="pf">© MieeL　かたち パズル　www.mieel-support-school.com</div>';
  const HD = (t, s) => '<div class="phd"><h1>' + t + '</h1><small>' + (s || '') + '</small><div class="nm">なまえ ＿＿＿＿＿＿＿＿</div></div>';
  function buildPages(type, o) {
    o = o || {};
    if (type === 'tan') {
      const z = PUZ[Number(o.p) || 0], guide = o.guide === 'on';
      const minx = Math.min(...z.t.flat().map(p => p[0])), miny = Math.min(...z.t.flat().map(p => p[1]));
      const T2 = z.t.map(t => t.map(p => [p[0] - minx, p[1] - miny]));
      const bw = Math.max(...T2.flat().map(p => p[0])), bh = Math.max(...T2.flat().map(p => p[1]));
      // ピースの ならべかた（2れつ）→ おなじ おおきさ（1ます = u mm）で 2まいに
      const ps = T2.map(t => typeOf(t)), rows = Math.ceil(ps.length / 2);
      const u = Math.min(22, 170 / Math.max(bw, 1), 210 / Math.max(bh, 1), 180 / 9.6, 225 / (rows * 2.8));
      const sil = '<svg viewBox="-.2 -.2 ' + (bw + .4) + ' ' + (bh + .4) + '" style="width:' + ((bw + .4) * u) + 'mm;height:' + ((bh + .4) * u) + 'mm">' + T2.map(t => '<polygon class="sil" points="' + ptsStr(t) + '" style="' + (guide ? '' : 'stroke:#DDD') + '"/>').join('') + '</svg>';
      let pcs = '';
      ps.forEach((t, i) => { const base = t === 'M' ? [[0, 0], [2, 0], [0, 2]] : PIECES[t], cx = (i % 2) * 4.8, cy = Math.floor(i / 2) * 2.8; pcs += '<polygon class="pp" points="' + ptsStr(base.map(p => [p[0] + cx, p[1] + cy])) + '"/>'; });
      const pw = 9.6, ph = rows * 2.8;
      const p2 = '<svg viewBox="-.2 -.2 ' + (pw + .4) + ' ' + (ph + .4) + '" style="width:' + ((pw + .4) * u) + 'mm;height:' + ((ph + .4) * u) + 'mm">' + pcs + '</svg>';
      return ['<div class="ppage">' + HD('🔷 「' + z.n + '」', 'ピースで つくろう') + '<div class="psil">' + sil + '</div>' + PF + '</div>',
        '<div class="ppage">' + HD('✂️ タングラムの ピース', 'てんせんで きりとって つかいます（' + ps.length + 'こ）') + '<div class="psil ppcs">' + p2 + '</div>' + PF + '</div>'];
    }
    if (type === 'copy') {
      const lv = Number(o.lv) || 1;
      const rows = Array.from({ length: 3 }, () => { const q = genCopy(lv), g = (cells, show) => '<div class="g" style="--n:' + q.n + '">' + cells.map(v => '<div>' + (show ? cellSVG(v).replace('#0B7285', '#555') : '') + '</div>').join('') + '</div>'; return '<div class="row">' + g(q.model, true) + '<span style="font-size:10mm">➡</span>' + g(q.model, o.ans === 'on') + '</div>'; }).join('');
      return ['<div class="ppage">' + HD('🔲 おてほん うつし', 'おなじに かこう') + '<div class="pcopy">' + rows + '</div>' + PF + '</div>'];
    }
    const lv = Number(o.lv) || 2;
    const qs = Array.from({ length: 4 }, () => { const q = genRot(lv); const t = q.mirrorQ ? '🪞 かがみ' : q.k === 2 ? '🔃 さかさま' : '↻ みぎに ' + q.k + 'かい'; return '<div class="q"><div class="s">' + blockSVG(q.b, '#ccc') + '</div><div class="t">' + t + '</div>' + q.opts.map(x => '<div class="o" style="' + (o.ans === 'on' && ckey(x) === ckey(q.ans) ? 'border:1mm solid #E03131' : '') + '">' + blockSVG(x, '#eee') + '</div>').join('') + '</div>'; }).join('');
    return ['<div class="ppage">' + HD('🔄 まわすと どれ？', 'ただしい ものに ○') + '<div class="prot">' + qs + '</div>' + PF + '</div>'];
  }
  window.MieelPrintAPI = {
    version: 1,
    app: { id: 'katachi-puzzle', title: 'かたち パズル', icon: '🔷' },
    list() {
      const lv = { key: 'lv', label: 'むずかしさ', opts: [[1, 'やさしい'], [2, 'ふつう'], [3, 'むずかしい']], def: Number(S().level) || 1 }, an = { key: 'ans', label: 'こたえ', opts: [['off', 'なし'], ['on', 'あり']], def: 'off' };
      return [
        { id: 'tan', name: 'タングラム（2まい）', icon: '🔷', params: [{ key: 'p', label: 'かたち', opts: PUZ.map((z, i) => [i, z.n]), def: 0 }, { key: 'guide', label: 'なかの せん', opts: [['on', 'あり（ヒント）'], ['off', 'なし']], def: 'on' }] },
        { id: 'copy', name: 'おてほん うつし', icon: '🔲', params: [lv, an] },
        { id: 'rot', name: 'まわすと どれ？', icon: '🔄', params: [lv, an] }
      ];
    },
    build(id, params) { return Promise.resolve({ pages: buildPages(id, params), css: document.querySelector('style').textContent }); }
  };

  /* ============================================================
     先生用せってい
     ============================================================ */
  APP.renderSettings = function (add, st, vp, pidSel) {
    add(h('h3', null, '🔷 せってい'),
      srow('むずかしさ', seg(st.level, [[1, 'やさしい'], [2, 'ふつう'], [3, 'むずかしい']], v => setS('level', Number(v)))),
      srow('タングラムの なかの せん', seg(st.guide, [['auto', 'じどう'], ['on', 'いつも'], ['off', 'なし']], v => setS('guide', v)), 'じどう：7こ の かたち だけ せん なし'));
    add(h('h3', null, '📊 きろく'), pidSel());
    const log = vp.log.slice().reverse().slice(0, 40);
    add(log.length ? h('table', { class: 'rec-table' }, h('tr', null, ['日時', 'あそび', 'レベル', 'けっか', 'じかん'].map(x => h('th', null, x))),
      log.map(r => { const d = new Date(r.t), g = GAMES.find(x => x.id === r.g); return h('tr', null, h('td', null, (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0')), h('td', null, (g ? g.e + ' ' + g.n : r.g) + (r.name ? '「' + r.name + '」' : '')), h('td', null, String(r.lv)), h('td', null, r.g === 'tan' ? '⭐'.repeat(r.ok) : r.ok + ' / ' + r.n), h('td', null, r.sec + 'びょう')); })) : h('p', { class: 'note' }, 'まだ きろくが ありません。'));
  };
  if (TEST) window.__kp = { store: () => store, PUZ, PIECES, typeOf, startTan, startGame, G: () => G, T: () => T, genRot, genCopy, ckey };
  startApp();
