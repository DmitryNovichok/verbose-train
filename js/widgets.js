/* Интерактивные чертежи для тем: графики с параметрами, единичная окружность, касательная,
   суммы Римана, ряды Тейлора и Фурье, бросок тела, поле зарядов, осциллятор, векторы,
   комплексная плоскость, фазовый портрет, биномиальное распределение, линза, неявные и параметрические кривые. */
(function () {
  'use strict';
  var REG = {};
  var timers = [];

  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'; }
  function colors() {
    return {
      bg: css('--surface'), ink: css('--ink'), ink2: css('--ink-2'), ink3: css('--ink-3'), grid: css('--grid'), line: css('--line'),
      pen: css('--pen'), red: css('--red'), green: css('--green'), amber: css('--amber'), paper: css('--paper'),
      series: [css('--pen'), css('--red'), css('--green'), css('--amber'), css('--ink-2')]
    };
  }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fmt(v, d) {
    if (!isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : '—';
    var p = Math.pow(10, d === undefined ? 3 : d);
    var r = Math.round(v * p) / p;
    if (r === 0) r = 0;
    return String(r).replace('.', ',').replace('-', '−');
  }
  function texInto(elm, src) {
    if (window.katex) { try { katex.render(src, elm, { throwOnError: false, strict: 'ignore', macros: Object.assign({}, window.TEX_MACROS || {}) }); return; } catch (e) { /* пусто */ } }
    elm.textContent = src;
  }
  function compileFn(src, vars) {
    var ast = Expr.parse(src.replace(/^\s*[a-zA-Z]\s*(\([^)]*\))?\s*=\s*/, ''), { vars: vars });
    return { f: Expr.compile(ast), tex: Expr.toTeX(ast) };
  }
  function num(s, def) { try { return s === undefined || s === '' ? def : Expr.evalNum(String(s)); } catch (e) { return def; } }

  // ---------- координатная плоскость ----------
  function Plane(container, o) {
    o = o || {};
    var self = this;
    this.o = o;
    this.box = h('div', 'wcanvas');
    this.cv = document.createElement('canvas');
    this.cv.setAttribute('role', 'img');
    this.cv.setAttribute('aria-label', o.label || 'Интерактивный чертёж');
    this.box.appendChild(this.cv);
    container.appendChild(this.box);
    this.ctx = this.cv.getContext('2d');
    this.v = { x0: o.x0 !== undefined ? o.x0 : -5, x1: o.x1 !== undefined ? o.x1 : 5, y0: o.y0, y1: o.y1 };
    this.home = null;
    this.draw = o.draw || function () {};
    this.cv.style.touchAction = o.touch || 'pan-y';
    if (o.zoom !== false) {
      var z = h('div', 'wzoom');
      [['+', 0.7], ['−', 1 / 0.7], ['⟲', 0]].forEach(function (b) {
        var bt = h('button', null, b[0]); bt.type = 'button';
        bt.title = b[1] ? (b[1] < 1 ? 'Приблизить' : 'Отдалить') : 'Исходный вид';
        bt.onclick = function () { if (b[1]) self.zoomAt((self.v.x0 + self.v.x1) / 2, (self.v.y0 + self.v.y1) / 2, b[1]); else { self.v = Object.assign({}, self.home); self.render(); } };
        z.appendChild(bt);
      });
      this.box.appendChild(z);
    }
    // перетаскивание
    var drag = null;
    this.cv.addEventListener('pointerdown', function (e) {
      var p = self.pos(e);
      if (o.onDown && o.onDown(p, e) === true) { drag = { custom: true }; self.cv.setPointerCapture(e.pointerId); return; }
      if (o.pan === false || (e.pointerType === 'touch' && o.touch !== 'none')) return;
      drag = { x: e.clientX, y: e.clientY, v: Object.assign({}, self.v) };
      self.cv.setPointerCapture(e.pointerId);
    });
    this.cv.addEventListener('pointermove', function (e) {
      var p = self.pos(e);
      if (!drag) { if (o.onHover) o.onHover(p); return; }
      if (drag.custom) { o.onDrag && o.onDrag(p, e); return; }
      var r = self.cv.getBoundingClientRect();
      var dx = (e.clientX - drag.x) / r.width * (drag.v.x1 - drag.v.x0);
      var dy = (e.clientY - drag.y) / r.height * (drag.v.y1 - drag.v.y0);
      self.v = { x0: drag.v.x0 - dx, x1: drag.v.x1 - dx, y0: drag.v.y0 + dy, y1: drag.v.y1 + dy };
      self.render();
    });
    var up = function () { if (drag && drag.custom && o.onUp) o.onUp(); drag = null; };
    this.cv.addEventListener('pointerup', up);
    this.cv.addEventListener('pointercancel', up);
    this.cv.addEventListener('pointerleave', function () { if (o.onHover) o.onHover(null); });
    this.cv.addEventListener('wheel', function (e) {
      if (o.pan === false) return;
      if (!o.wheel && !e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      var p = self.pos(e);
      self.zoomAt(p.x, p.y, e.deltaY > 0 ? 1.15 : 1 / 1.15);
    }, { passive: false });
    this.resize();
    if (window.ResizeObserver) { this.ro = new ResizeObserver(function () { self.resize(); }); this.ro.observe(this.box); }
    window.addEventListener('fizmat-theme', function () { self.render(); });
  }
  Plane.prototype.pos = function (e) {
    var r = this.cv.getBoundingClientRect();
    return { x: this.ix(e.clientX - r.left), y: this.iy(e.clientY - r.top), px: e.clientX - r.left, py: e.clientY - r.top };
  };
  Plane.prototype.resize = function () {
    var w = this.box.clientWidth || 600;
    if (Math.abs(w - (this.W || 0)) < 2 && this.W) return;
    var hh = this.o.height ? this.o.height(w) : Math.max(230, Math.min(440, Math.round(w * 0.58)));
    var dpr = window.devicePixelRatio || 1;
    this.W = w; this.H = hh;
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(hh * dpr);
    this.cv.style.height = hh + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.v.y0 === undefined || this.o.equal) {
      var cy = this.v.y0 !== undefined ? (this.v.y0 + this.v.y1) / 2 : 0;
      var span = (this.v.x1 - this.v.x0) * hh / w / 2;
      if (this.v.y0 === undefined || this.o.equal) { this.v.y0 = cy - span; this.v.y1 = cy + span; }
    }
    if (!this.home) this.home = Object.assign({}, this.v);
    this.render();
  };
  Plane.prototype.zoomAt = function (x, y, k) {
    var v = this.v;
    this.v = { x0: x + (v.x0 - x) * k, x1: x + (v.x1 - x) * k, y0: y + (v.y0 - y) * k, y1: y + (v.y1 - y) * k };
    this.render();
  };
  Plane.prototype.tx = function (x) { return (x - this.v.x0) / (this.v.x1 - this.v.x0) * this.W; };
  Plane.prototype.ty = function (y) { return this.H - (y - this.v.y0) / (this.v.y1 - this.v.y0) * this.H; };
  Plane.prototype.ix = function (px) { return this.v.x0 + px / this.W * (this.v.x1 - this.v.x0); };
  Plane.prototype.iy = function (py) { return this.v.y0 + (this.H - py) / this.H * (this.v.y1 - this.v.y0); };
  function niceStep(range, px) {
    var raw = range / Math.max(2, px / 70);
    var p = Math.pow(10, Math.floor(Math.log10(raw)));
    var m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }
  Plane.prototype.render = function () {
    if (!this.W) return;
    var c = this.ctx, C = colors(), v = this.v, self = this;
    this.C = C;
    c.clearRect(0, 0, this.W, this.H);
    c.fillStyle = C.bg; c.fillRect(0, 0, this.W, this.H);
    if (this.o.axes !== false) {
      var sx = this.o.stepX || niceStep(v.x1 - v.x0, this.W), sy = this.o.stepY || niceStep(v.y1 - v.y0, this.H);
      c.lineWidth = 1; c.strokeStyle = C.grid;
      c.beginPath();
      for (var x = Math.ceil(v.x0 / sx) * sx; x <= v.x1; x += sx) { var px = Math.round(this.tx(x)) + 0.5; c.moveTo(px, 0); c.lineTo(px, this.H); }
      for (var y = Math.ceil(v.y0 / sy) * sy; y <= v.y1; y += sy) { var py = Math.round(this.ty(y)) + 0.5; c.moveTo(0, py); c.lineTo(this.W, py); }
      c.stroke();
      // оси
      c.strokeStyle = C.ink3; c.lineWidth = 1.2;
      var ax = Math.round(Math.min(Math.max(this.ty(0), 0), this.H)) + 0.5, ay = Math.round(Math.min(Math.max(this.tx(0), 0), this.W)) + 0.5;
      c.beginPath(); c.moveTo(0, ax); c.lineTo(this.W, ax); c.moveTo(ay, 0); c.lineTo(ay, this.H); c.stroke();
      c.fillStyle = C.ink3; c.font = '11px "Golos Text", sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'top';
      var lab = function (val, step) {
        if (self.o.piTicks && Math.abs(step - Math.PI / 2) < 1e-9) {
          var k = Math.round(val / (Math.PI / 2));
          var map = { 0: '0', 1: 'π/2', 2: 'π', '-1': '−π/2', '-2': '−π' };
          return map[k] !== undefined ? map[k] : (k % 2 === 0 ? (k / 2 + 'π') : (k + 'π/2')).replace('-', '−');
        }
        return fmt(val, Math.max(0, -Math.floor(Math.log10(step)) + 1));
      };
      if (this.o.piTicks) sx = Math.PI / 2;
      for (x = Math.ceil(v.x0 / sx) * sx; x <= v.x1; x += sx) {
        if (Math.abs(x) < sx / 2) continue;
        var tyy = Math.min(Math.max(ax + 4, 2), this.H - 14);
        c.fillText(lab(x, sx), this.tx(x), tyy);
      }
      c.textAlign = 'right'; c.textBaseline = 'middle';
      for (y = Math.ceil(v.y0 / sy) * sy; y <= v.y1; y += sy) {
        if (Math.abs(y) < sy / 2) continue;
        var txx = Math.min(Math.max(ay - 5, 30), this.W - 4);
        c.fillText(fmt(y, Math.max(0, -Math.floor(Math.log10(sy)) + 1)), txx, this.ty(y));
      }
      if (this.o.xlabel) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.font = 'italic 13px "Literata", serif'; c.fillText(this.o.xlabel, this.W - 6, ax - 3); }
      if (this.o.ylabel) { c.textAlign = 'left'; c.textBaseline = 'top'; c.font = 'italic 13px "Literata", serif'; c.fillText(this.o.ylabel, ay + 6, 6); }
    }
    this.draw(c, this, C);
  };
  // график функции y=f(x) с разрывами
  Plane.prototype.fn = function (f, color, width, dash) {
    var c = this.ctx;
    c.save(); c.strokeStyle = color; c.lineWidth = width || 2.2; c.lineJoin = 'round';
    if (dash) c.setLineDash(dash);
    c.beginPath();
    var pen = false, prevY = null, N = Math.ceil(this.W * 1.5);
    var span = this.v.y1 - this.v.y0;
    for (var i = 0; i <= N; i++) {
      var x = this.v.x0 + (this.v.x1 - this.v.x0) * i / N, y;
      try { y = f(x); } catch (e) { y = NaN; }
      if (!isFinite(y) || (prevY !== null && Math.abs(y - prevY) > span * 3)) { pen = false; prevY = isFinite(y) ? y : null; if (!isFinite(y)) continue; }
      var py = this.ty(Math.max(this.v.y0 - span * 2, Math.min(this.v.y1 + span * 2, y)));
      if (!pen) { c.moveTo(this.tx(x), py); pen = true; } else c.lineTo(this.tx(x), py);
      prevY = y;
    }
    c.stroke(); c.restore();
  };
  Plane.prototype.path = function (pts, color, width, fill) {
    var c = this.ctx; if (!pts.length) return;
    c.save(); c.beginPath();
    c.moveTo(this.tx(pts[0][0]), this.ty(pts[0][1]));
    for (var i = 1; i < pts.length; i++) c.lineTo(this.tx(pts[i][0]), this.ty(pts[i][1]));
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (color) { c.strokeStyle = color; c.lineWidth = width || 2; c.stroke(); }
    c.restore();
  };
  Plane.prototype.dot = function (x, y, color, r) {
    var c = this.ctx; c.save(); c.fillStyle = color; c.beginPath(); c.arc(this.tx(x), this.ty(y), r || 4.5, 0, 7); c.fill(); c.restore();
  };
  Plane.prototype.arrow = function (x0, y0, x1, y1, color, width) {
    var c = this.ctx, a = this.tx(x0), b = this.ty(y0), p = this.tx(x1), q = this.ty(y1);
    var ang = Math.atan2(q - b, p - a), L = Math.hypot(p - a, q - b), hd = Math.min(12, L * 0.35);
    c.save(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = width || 2.2;
    c.beginPath(); c.moveTo(a, b); c.lineTo(p - Math.cos(ang) * hd * 0.6, q - Math.sin(ang) * hd * 0.6); c.stroke();
    c.beginPath(); c.moveTo(p, q); c.lineTo(p - hd * Math.cos(ang - 0.4), q - hd * Math.sin(ang - 0.4)); c.lineTo(p - hd * Math.cos(ang + 0.4), q - hd * Math.sin(ang + 0.4)); c.closePath(); c.fill();
    c.restore();
  };
  Plane.prototype.text = function (s, x, y, color, opts) {
    var c = this.ctx; opts = opts || {};
    c.save(); c.fillStyle = color; c.font = opts.font || '13px "Golos Text", sans-serif';
    c.textAlign = opts.align || 'left'; c.textBaseline = opts.base || 'bottom';
    c.fillText(s, this.tx(x) + (opts.dx || 0), this.ty(y) + (opts.dy || 0)); c.restore();
  };

  // ---------- общие элементы управления ----------
  function slider(ctl, name, val, min, max, step, onInput, fmtFn, title) {
    var id = 'w' + Math.random().toString(36).slice(2, 8);
    var lab = h('label', null, '<span>' + (title || name) + '</span>');
    lab.setAttribute('for', id);
    var r = document.createElement('input');
    r.type = 'range'; r.id = id; r.min = min; r.max = max; r.step = step || (max - min) / 200; r.value = val;
    var out = h('output', null, (fmtFn || fmt)(val));
    lab.appendChild(r); lab.appendChild(out);
    r.addEventListener('input', function () { out.textContent = (fmtFn || fmt)(+r.value); onInput(+r.value); });
    ctl.appendChild(lab);
    return { input: r, set: function (v) { r.value = v; out.textContent = (fmtFn || fmt)(v); } };
  }
  function shell(el, title) {
    var box = h('div', 'wbox');
    if (title) box.appendChild(h('div', 'wtitle', title));
    el.appendChild(box);
    return box;
  }
  function addCtl(box) { var c = h('div', 'wctl'); box.appendChild(c); return c; }
  function readout(box) { var r = h('div', 'wread'); box.appendChild(r); return r; }
  function every(fn, ms) { var id = setInterval(fn, ms); timers.push(id); return id; }
  function legend(ctl, items) {
    items.forEach(function (it) {
      var s = h('span', 'legend'); var i = h('i'); i.style.background = it.color; s.appendChild(i);
      var t = h('span'); s.appendChild(t); ctl.appendChild(s);
      if (it.tex) texInto(t, it.tex); else t.textContent = it.text;
    });
  }

  // ---------- plot: графики функций с параметрами ----------
  // [[plot sin(a*x); cos(x) | -6.3 6.3 -2 2 | a=1:0.5..3 | pi]]
  REG.plot = function (el, args) {
    var parts = args.split('|').map(function (s) { return s.trim(); });
    var srcs = parts[0].split(';').map(function (s) { return s.trim(); }).filter(Boolean);
    var rng = (parts[1] || '-5 5').split(/\s+/).map(function (s) { return num(s); });
    var params = [], flags = [];
    parts.slice(2).forEach(function (p) {
      if (/=/.test(p)) p.split(',').forEach(function (q) {
        var m = /^\s*(\w+)\s*=\s*([^:]+):\s*([^.]+(?:\.\d+)?)\s*\.\.\s*([^:]+?)\s*(?::\s*(.+))?$/.exec(q);
        if (m) params.push({ n: m[1], v: num(m[2], 1), min: num(m[3], 0), max: num(m[4], 1), step: m[5] ? num(m[5]) : null });
      });
      else flags = flags.concat(p.split(/\s+/));
    });
    var names = ['x'].concat(params.map(function (p) { return p.n; }));
    var fns;
    try { fns = srcs.map(function (s) { return compileFn(s, names); }); } catch (e) { el.textContent = 'Ошибка в графике: ' + e.message; return; }
    var env = {}; params.forEach(function (p) { env[p.n] = p.v; });
    var box = shell(el);
    var C0 = colors();
    var plane = new Plane(box, {
      x0: rng[0], x1: rng[1], y0: rng[2], y1: rng[3], piTicks: flags.indexOf('pi') >= 0, equal: flags.indexOf('eq') >= 0,
      draw: function (c, P, C) {
        fns.forEach(function (F, i) { P.fn(function (x) { env.x = x; return F.f(env); }, C.series[i % 5]); });
      }
    });
    if (rng[2] === undefined) autoY(plane, fns, env);
    var ctl = addCtl(box);
    legend(ctl, fns.map(function (F, i) { return { color: C0.series[i % 5], tex: 'y=' + F.tex }; }));
    params.forEach(function (p) {
      var s = slider(ctl, p.n, p.v, p.min, p.max, p.step, function (v) { env[p.n] = v; plane.render(); }, null, p.n.length === 1 ? '<i>' + p.n + '</i>' : p.n);
      if (p.n === 't') {
        var play = h('button', 'btn sm', '▶'); play.type = 'button';
        var tm = null;
        play.onclick = function () {
          if (tm) { clearInterval(tm); tm = null; play.textContent = '▶'; return; }
          play.textContent = '❚❚';
          tm = every(function () {
            var nv = env.t + (p.max - p.min) / 240; if (nv > p.max) nv = p.min;
            env.t = nv; s.set(nv); plane.render();
          }, 33);
        };
        ctl.appendChild(play);
      }
    });
    window.addEventListener('fizmat-theme', function () { ctl.querySelectorAll('.legend i').forEach(function (i, k) { i.style.background = colors().series[k % 5]; }); });
  };
  function autoY(plane, fns, env) {
    var lo = Infinity, hi = -Infinity;
    fns.forEach(function (F) {
      for (var i = 0; i <= 200; i++) {
        env.x = plane.v.x0 + (plane.v.x1 - plane.v.x0) * i / 200;
        var y; try { y = F.f(env); } catch (e) { y = NaN; }
        if (isFinite(y) && Math.abs(y) < 1e4) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
      }
    });
    if (!isFinite(lo)) { lo = -5; hi = 5; }
    if (hi - lo < 1e-6) { lo -= 1; hi += 1; }
    var pad = (hi - lo) * 0.12;
    lo -= pad; hi += pad;
    if (lo > 0 && lo < (hi - lo) * 0.5) lo = -(hi - lo) * 0.06;
    if (hi < 0 && -hi < (hi - lo) * 0.5) hi = (hi - lo) * 0.06;
    plane.v.y0 = lo; plane.v.y1 = hi; plane.home = Object.assign({}, plane.v); plane.render();
  }

  // ---------- графопостроитель ----------
  REG.plotter = function (el) {
    var box = shell(el);
    var list = [{ s: 'sin(x)' }, { s: 'x^2/4 - 1' }, { s: '' }];
    var env = {};
    var hover = null;
    var plane = new Plane(box, {
      x0: -7, x1: 7, wheel: true, touch: 'none',
      height: function (w) { return Math.max(300, Math.min(520, Math.round(w * 0.6))); },
      draw: function (c, P, C) {
        list.forEach(function (it, i) { if (it.F) P.fn(function (x) { env.x = x; return it.F(env); }, C.series[i % 5]); });
        if (hover) {
          c.save(); c.strokeStyle = C.ink3; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(P.tx(hover.x), 0); c.lineTo(P.tx(hover.x), P.H); c.stroke(); c.restore();
          list.forEach(function (it, i) { if (!it.F) return; env.x = hover.x; var y = it.F(env); if (isFinite(y)) P.dot(hover.x, y, C.series[i % 5], 4); });
        }
      },
      onHover: function (p) { hover = p; plane.render(); showRead(); }
    });
    var rd = readout(box);
    function showRead() {
      if (!hover) { rd.textContent = 'Наведите курсор на график, чтобы увидеть значения. Колесо мыши — масштаб.'; return; }
      var s = 'x = ' + fmt(hover.x, 3);
      list.forEach(function (it, i) { if (!it.F) return; env.x = hover.x; var y; try { y = it.F(env); } catch (e) { y = NaN; } s += '   y' + (i + 1) + ' = ' + fmt(y, 4); });
      rd.textContent = s;
    }
    var ctl = h('div', 'wctl'); ctl.style.flexDirection = 'column'; ctl.style.alignItems = 'stretch';
    var rows = h('div', 'fn-rows'); ctl.appendChild(rows); box.appendChild(ctl);
    function build() {
      rows.innerHTML = '';
      var C = colors();
      list.forEach(function (it, i) {
        var r = h('div', 'fn-row');
        var sw = h('i'); sw.style.background = C.series[i % 5];
        var inp = h('input', 'input'); inp.type = 'text'; inp.value = it.s; inp.placeholder = 'y = …'; inp.id = 'pf' + i; inp.spellcheck = false; inp.autocomplete = 'off';
        inp.setAttribute('aria-label', 'Функция ' + (i + 1));
        var msg = h('span', 'ui', ''); msg.style.fontSize = '12.5px'; msg.style.color = C.amber;
        var upd = function () {
          it.s = inp.value;
          if (!inp.value.trim()) { it.F = null; msg.textContent = ''; plane.render(); return; }
          try { it.F = compileFn(inp.value, ['x']).f; msg.textContent = ''; } catch (e) { it.F = null; msg.textContent = e.message; }
          plane.render();
        };
        inp.addEventListener('input', upd);
        r.appendChild(sw); r.appendChild(inp); r.appendChild(msg);
        rows.appendChild(r);
        upd();
      });
    }
    build();
    showRead();
    window.addEventListener('fizmat-theme', build);
  };

  // ---------- единичная окружность ----------
  REG.unitcircle = function (el) {
    var box = shell(el);
    var ang = Math.PI / 6;
    var plane = new Plane(box, {
      x0: -1.9, x1: 1.9, equal: true, pan: false, zoom: false, touch: 'none', stepX: 0.5, stepY: 0.5,
      height: function (w) { return Math.min(420, Math.max(280, w * 0.62)); },
      draw: function (c, P, C) {
        var cs = Math.cos(ang), sn = Math.sin(ang);
        c.save(); c.strokeStyle = C.ink2; c.lineWidth = 1.5; c.beginPath(); c.arc(P.tx(0), P.ty(0), P.tx(1) - P.tx(0), 0, 7); c.stroke(); c.restore();
        // дуга угла
        c.save(); c.strokeStyle = C.amber; c.lineWidth = 3; c.beginPath();
        var r0 = (P.tx(1) - P.tx(0)) * 0.22;
        c.arc(P.tx(0), P.ty(0), r0, 0, -ang, ang > 0); c.stroke(); c.restore();
        // линия тангенсов
        c.save(); c.strokeStyle = C.grid; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(P.tx(1), 0); c.lineTo(P.tx(1), P.H); c.stroke(); c.restore();
        if (Math.abs(cs) > 0.05) { var tg = sn / cs; if (Math.abs(tg) < 4) { P.path([[0, 0], [1, tg]], C.ink3, 1); P.path([[1, 0], [1, tg]], C.green, 3.5); P.text('tg', 1, tg / 2, C.green, { dx: 6, base: 'middle' }); } }
        P.path([[0, 0], [cs, sn]], C.ink, 2);
        P.path([[cs, 0], [cs, sn]], C.red, 3.5);
        P.path([[0, 0], [cs, 0]], C.pen, 3.5);
        P.text('sin', cs, sn / 2, C.red, { dx: cs >= 0 ? 6 : -30, base: 'middle' });
        P.text('cos', cs / 2, 0, C.pen, { align: 'center', dy: sn >= 0 ? 16 : -6 });
        P.dot(cs, sn, C.ink, 7);
      },
      onDown: function (p) { set(p); return true; },
      onDrag: function (p) { set(p); }
    });
    var rd = readout(box);
    var ctl = addCtl(box);
    ctl.appendChild(h('span', 'muted', 'Тяните точку по окружности. Около «табличных» углов она притягивается.'));
    function set(p) {
      var a = Math.atan2(p.y, p.x); if (a < 0) a += 2 * Math.PI;
      var deg = a * 180 / Math.PI, snap = Math.round(deg / 15) * 15;
      if (Math.abs(deg - snap) < 3) a = snap * Math.PI / 180;
      ang = a; plane.render(); show();
    }
    function piFrac(a) {
      var k = a / Math.PI * 12, kr = Math.round(k);
      if (Math.abs(k - kr) > 1e-6) return fmt(a, 3);
      if (kr === 0) return '0';
      var g = gcd(kr, 12), n = kr / g, d = 12 / g;
      return (n === 1 ? '' : n) + 'π' + (d === 1 ? '' : '/' + d);
    }
    function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
    function show() {
      var cs = Math.cos(ang), sn = Math.sin(ang);
      rd.innerHTML = '<span>угол: <b>' + fmt(ang * 180 / Math.PI, 1) + '°</b> = <b>' + piFrac(ang) + '</b> рад</span><span style="color:var(--pen)">cos = ' + fmt(cs, 4) + '</span><span style="color:var(--red)">sin = ' + fmt(sn, 4) + '</span><span style="color:var(--green)">tg = ' + (Math.abs(cs) < 1e-9 ? 'не определён' : fmt(sn / cs, 4)) + '</span>';
    }
    show();
  };

  // ---------- касательная как предел секущих ----------
  REG.tangent = function (el, args) {
    var parts = args.split('|').map(function (s) { return s.trim(); });
    var F = compileFn(parts[0] || 'x^2/2', ['x']);
    var rng = (parts[1] || '-3 3').split(/\s+/).map(function (s) { return num(s); });
    var x0 = num(parts[2], 1), hh = 1.5;
    var f = function (x) { return F.f({ x: x }); };
    var d = function (x) { var e = 1e-5; return (f(x + e) - f(x - e)) / (2 * e); };
    var box = shell(el);
    var plane = new Plane(box, {
      x0: rng[0], x1: rng[1], y0: rng[2], y1: rng[3],
      draw: function (c, P, C) {
        P.fn(f, C.ink2, 2.4);
        var y0 = f(x0), k = d(x0), x1 = x0 + hh, y1 = f(x1), ks = (y1 - y0) / hh;
        P.fn(function (x) { return y0 + ks * (x - x0); }, C.red, 1.8, [6, 5]);
        P.fn(function (x) { return y0 + k * (x - x0); }, C.pen, 2.2);
        P.path([[x0, y0], [x1, y0], [x1, y1]], C.amber, 1.5);
        P.text('Δx', (x0 + x1) / 2, y0, C.amber, { align: 'center', dy: y1 > y0 ? 16 : -4 });
        P.text('Δy', x1, (y0 + y1) / 2, C.amber, { dx: 5, base: 'middle' });
        P.dot(x0, y0, C.pen, 5.5); P.dot(x1, y1, C.red, 5);
      }
    });
    if (rng[2] === undefined) autoY(plane, [F], {});
    var ctl = addCtl(box);
    slider(ctl, 'x0', x0, rng[0] + 0.2, rng[1] - 0.2, 0.01, function (v) { x0 = v; plane.render(); show(); }, null, 'точка x₀');
    slider(ctl, 'dx', hh, 0.01, (rng[1] - rng[0]) / 3, 0.005, function (v) { hh = v; plane.render(); show(); }, null, 'шаг Δx');
    var rd = readout(box);
    function show() {
      var ks = (f(x0 + hh) - f(x0)) / hh;
      rd.innerHTML = '<span style="color:var(--red)">наклон секущей Δy/Δx = ' + fmt(ks, 4) + '</span><span style="color:var(--pen)">наклон касательной f′(x₀) = ' + fmt(d(x0), 4) + '</span><span class="muted">уменьшайте Δx — секущая прижимается к касательной</span>';
    }
    show();
  };

  // ---------- суммы Римана ----------
  REG.riemann = function (el, args) {
    var parts = args.split('|').map(function (s) { return s.trim(); });
    var F = compileFn(parts[0] || 'x^2', ['x']);
    var ab = (parts[1] || '0 2').split(/\s+/).map(function (s) { return num(s); });
    var a = ab[0], b = ab[1], n = 6, mode = 'mid';
    var f = function (x) { return F.f({ x: x }); };
    var pad = (b - a) * 0.25;
    var box = shell(el);
    var plane = new Plane(box, {
      x0: a - pad, x1: b + pad,
      draw: function (c, P, C) {
        var dx = (b - a) / n;
        for (var i = 0; i < n; i++) {
          var xl = a + i * dx, xr = xl + dx;
          if (mode === 'trap') { P.path([[xl, 0], [xl, f(xl)], [xr, f(xr)], [xr, 0]], C.pen, 1, hexA(C.pen, 0.18)); continue; }
          var xs = mode === 'left' ? xl : mode === 'right' ? xr : (xl + xr) / 2, y = f(xs);
          P.path([[xl, 0], [xl, y], [xr, y], [xr, 0]], C.pen, 1, hexA(C.pen, 0.18));
        }
        P.fn(f, C.ink, 2.4);
      }
    });
    autoY(plane, [F], {});
    if (plane.v.y0 > -0.1 * (plane.v.y1 - plane.v.y0)) { plane.v.y0 = -0.08 * (plane.v.y1 - plane.v.y0); plane.home = Object.assign({}, plane.v); plane.render(); }
    var ctl = addCtl(box);
    slider(ctl, 'n', n, 1, 100, 1, function (v) { n = v; plane.render(); show(); }, function (v) { return String(Math.round(v)); }, 'прямоугольников n');
    var sel = h('select', 'input'); sel.id = 'rm' + Math.random().toString(36).slice(2, 6);
    sel.setAttribute('aria-label', 'Способ');
    [['left', 'левые'], ['mid', 'средние'], ['right', 'правые'], ['trap', 'трапеции']].forEach(function (o) { var op = h('option', null, o[1]); op.value = o[0]; if (o[0] === mode) op.selected = true; sel.appendChild(op); });
    sel.style.padding = '4px 8px'; sel.style.fontSize = '14px';
    sel.onchange = function () { mode = sel.value; plane.render(); show(); };
    ctl.appendChild(sel);
    var rd = readout(box);
    function exact() { var N = 2000, s = 0, hx = (b - a) / N; for (var i = 0; i <= N; i++) s += f(a + i * hx) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); return s * hx / 3; }
    var I = exact();
    function show() {
      var dx = (b - a) / n, s = 0;
      for (var i = 0; i < n; i++) {
        var xl = a + i * dx;
        s += mode === 'trap' ? (f(xl) + f(xl + dx)) / 2 * dx : f(mode === 'left' ? xl : mode === 'right' ? xl + dx : xl + dx / 2) * dx;
      }
      rd.innerHTML = '<span>сумма = <b>' + fmt(s, 5) + '</b></span><span>интеграл = <b>' + fmt(I, 5) + '</b></span><span>погрешность = ' + fmt(Math.abs(s - I), 5) + '</span>';
    }
    show();
  };
  function hexA(col, a) {
    var m = /^#([0-9a-f]{6})$/i.exec(col);
    if (!m) return col;
    var n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  // ---------- ряд Тейлора ----------
  var TAYLOR = {
    sin: { f: Math.sin, c: function (k) { return k % 2 ? (((k - 1) / 2) % 2 ? -1 : 1) / fac(k) : 0; }, tex: '\\sin x', r: [-8, 8, -2.5, 2.5] },
    cos: { f: Math.cos, c: function (k) { return k % 2 ? 0 : ((k / 2) % 2 ? -1 : 1) / fac(k); }, tex: '\\cos x', r: [-8, 8, -2.5, 2.5] },
    exp: { f: Math.exp, c: function (k) { return 1 / fac(k); }, tex: 'e^x', r: [-4, 3, -1, 12] },
    ln: { f: function (x) { return Math.log(1 + x); }, c: function (k) { return k === 0 ? 0 : (k % 2 ? 1 : -1) / k; }, tex: '\\ln(1+x)', r: [-1.5, 2.5, -3, 2] },
    geom: { f: function (x) { return 1 / (1 - x); }, c: function () { return 1; }, tex: '\\frac{1}{1-x}', r: [-2, 1.5, -2, 8] },
    atan: { f: Math.atan, c: function (k) { return k % 2 ? (((k - 1) / 2) % 2 ? -1 : 1) / k : 0; }, tex: '\\arctg x', r: [-2.5, 2.5, -2, 2] }
  };
  function fac(k) { var r = 1; for (var i = 2; i <= k; i++) r *= i; return r; }
  REG.taylor = function (el, args) {
    var T = TAYLOR[(args || 'sin').trim()] || TAYLOR.sin;
    var n = 3;
    var box = shell(el);
    var poly = function (x) { var s = 0, p = 1; for (var k = 0; k <= n; k++) { s += T.c(k) * p; p *= x; } return s; };
    var plane = new Plane(box, {
      x0: T.r[0], x1: T.r[1], y0: T.r[2], y1: T.r[3],
      draw: function (c, P, C) { P.fn(T.f, C.ink2, 2.6); P.fn(poly, C.red, 2.2); }
    });
    var ctl = addCtl(box);
    var C0 = colors();
    legend(ctl, [{ color: C0.ink2, tex: T.tex }, { color: C0.red, text: 'многочлен Тейлора' }]);
    slider(ctl, 'n', n, 0, 25, 1, function (v) { n = v; plane.render(); showP(); }, function (v) { return String(Math.round(v)); }, 'степень n');
    var rd = readout(box);
    function showP() {
      var terms = [];
      for (var k = 0; k <= n && terms.length < 7; k++) {
        var cc = T.c(k); if (!cc) continue;
        var fr = frac(cc);
        terms.push((cc < 0 ? '-' : terms.length ? '+' : '') + (fr === '1' && k > 0 ? '' : fr) + (k === 0 ? '' : k === 1 ? 'x' : 'x^{' + k + '}'));
      }
      var s = terms.join(' ') + (n > 0 && countNZ() > 7 ? '+\\dots' : '');
      texInto(rd, 'P_{' + n + '}(x) = ' + (s || '0'));
    }
    function countNZ() { var c = 0; for (var k = 0; k <= n; k++) if (T.c(k)) c++; return c; }
    function frac(v) {
      v = Math.abs(v);
      for (var d = 1; d <= 50000000; d = d < 10 ? d + 1 : d * (d < 1000 ? 2 : 3)) { var nn = v * d; if (Math.abs(nn - Math.round(nn)) < 1e-9) return d === 1 ? String(Math.round(nn)) : '\\tfrac{' + Math.round(nn) + '}{' + d + '}'; }
      for (var k = 2; k < 20; k++) if (Math.abs(v * fac(k) - 1) < 1e-9) return '\\tfrac{1}{' + k + '!}';
      return fmt(v, 6);
    }
    showP();
  };

  // ---------- ряд Фурье ----------
  REG.fourier = function (el, args) {
    var kind = (args || 'square').trim(), N = 3;
    var waves = {
      square: { f: function (x) { var m = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return m < Math.PI ? 1 : -1; }, b: function (k) { return k % 2 ? 4 / (Math.PI * k) : 0; }, name: 'меандр' },
      saw: { f: function (x) { var m = ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return m; }, b: function (k) { return 2 * (k % 2 ? 1 : -1) / k; }, name: 'пила' },
      triangle: { f: function (x) { var m = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return m < Math.PI ? Math.PI / 2 - m : m - 3 * Math.PI / 2; }, cos: function (k) { return k % 2 ? 4 / (Math.PI * k * k) : 0; }, name: 'треугольник' }
    };
    var Wv = waves[kind] || waves.square;
    var S = function (x) { var s = 0; for (var k = 1; k <= N; k++) s += Wv.cos ? Wv.cos(k) * Math.cos(k * x) : Wv.b(k) * Math.sin(k * x); return s; };
    var box = shell(el);
    var plane = new Plane(box, {
      x0: -2 * Math.PI - 0.5, x1: 2 * Math.PI + 0.5, y0: kind === 'square' ? -1.6 : -3.6, y1: kind === 'square' ? 1.6 : 3.6, piTicks: true,
      draw: function (c, P, C) { P.fn(Wv.f, C.ink3, 2); P.fn(S, C.pen, 2.2); }
    });
    var ctl = addCtl(box);
    slider(ctl, 'N', N, 1, 60, 1, function (v) { N = v; plane.render(); }, function (v) { return String(Math.round(v)); }, 'гармоник N');
    ctl.appendChild(h('span', 'muted', 'Серая линия — исходный ' + Wv.name + ', синяя — сумма первых N гармоник.'));
  };

  // ---------- бросок под углом ----------
  REG.projectile = function (el, args) {
    var v0 = 20, a = 45, g = 9.81, t = null, ghosts = [];
    var box = shell(el);
    function traj(v, ang) {
      var r = ang * Math.PI / 180, T = 2 * v * Math.sin(r) / g, pts = [];
      for (var i = 0; i <= 80; i++) { var tt = T * i / 80; pts.push([v * Math.cos(r) * tt, v * Math.sin(r) * tt - g * tt * tt / 2]); }
      return { pts: pts, T: T, L: v * v * Math.sin(2 * r) / g, H: v * v * Math.sin(r) * Math.sin(r) / (2 * g) };
    }
    var plane = new Plane(box, {
      x0: -3, x1: 95, y0: -4, equal: true, pan: false, xlabel: 'x, м', ylabel: 'y, м',
      draw: function (c, P, C) {
        ghosts.forEach(function (gp) { P.path(gp, C.line, 1.5); });
        var tr = traj(v0, a);
        P.path(tr.pts, C.pen, 2.4);
        var tt = t === null ? 0 : t, r = a * Math.PI / 180;
        var x = v0 * Math.cos(r) * tt, y = v0 * Math.sin(r) * tt - g * tt * tt / 2;
        P.arrow(x, y, x + v0 * Math.cos(r) * 0.25, y + (v0 * Math.sin(r) - g * tt) * 0.25, C.red, 2);
        P.dot(x, y, C.ink, 6);
        P.dot(tr.L / 2, tr.H, C.amber, 3.5);
      }
    });
    var ctl = addCtl(box);
    var upd = function () { plane.render(); show(); };
    slider(ctl, 'v0', v0, 2, 30, 0.5, function (v) { keepGhost(); v0 = v; t = null; upd(); }, function (v) { return fmt(v, 1) + ' м/с'; }, 'скорость v₀');
    slider(ctl, 'a', a, 5, 85, 1, function (v) { keepGhost(); a = v; t = null; upd(); }, function (v) { return Math.round(v) + '°'; }, 'угол α');
    var play = h('button', 'btn sm', '▶ Бросить'); play.type = 'button';
    var tm = null;
    play.onclick = function () {
      if (tm) clearInterval(tm);
      t = 0; var T = traj(v0, a).T;
      tm = every(function () { t += T / 90; if (t >= T) { t = T; clearInterval(tm); tm = null; } plane.render(); }, 22);
    };
    ctl.appendChild(play);
    var ghostT = 0;
    function keepGhost() { var now = Date.now(); if (now - ghostT > 600) { ghosts.push(traj(v0, a).pts); if (ghosts.length > 4) ghosts.shift(); } ghostT = now; }
    var rd = readout(box);
    function show() { var tr = traj(v0, a); rd.innerHTML = '<span>время полёта = <b>' + fmt(tr.T, 2) + ' с</b></span><span>дальность = <b>' + fmt(tr.L, 1) + ' м</b></span><span>высота = <b>' + fmt(tr.H, 1) + ' м</b></span><span class="muted">g = 9,81 м/с², без сопротивления воздуха</span>'; }
    show();
  };

  // ---------- поле точечных зарядов ----------
  REG.charges = function (el, args) {
    var Q = [{ x: -1.5, y: 0, q: 1 }, { x: 1.5, y: 0, q: -1 }];
    var drag = null;
    var box = shell(el);
    function E(x, y) {
      var ex = 0, ey = 0;
      Q.forEach(function (c) { var dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy, r3 = Math.pow(r2, 1.5) || 1e-9; ex += c.q * dx / r3; ey += c.q * dy / r3; });
      return [ex, ey];
    }
    var plane = new Plane(box, {
      x0: -4, x1: 4, equal: true, pan: false, zoom: false, touch: 'none', axes: false,
      draw: function (c, P, C) {
        var pos = Q.filter(function (q) { return q.q > 0; }), neg = Q.filter(function (q) { return q.q < 0; });
        var src = pos.length ? pos : neg, sign = pos.length ? 1 : -1;
        src.forEach(function (s) {
          var nl = Math.max(4, Math.round(10 * Math.abs(s.q)));
          for (var k = 0; k < nl; k++) {
            var th = 2 * Math.PI * k / nl, x = s.x + 0.12 * Math.cos(th), y = s.y + 0.12 * Math.sin(th), pts = [[x, y]];
            for (var i = 0; i < 700; i++) {
              var e = E(x, y), m = Math.hypot(e[0], e[1]); if (!m) break;
              var st = 0.03 * sign;
              var mx = x + e[0] / m * st / 2, my = y + e[1] / m * st / 2, e2 = E(mx, my), m2 = Math.hypot(e2[0], e2[1]);
              x += e2[0] / m2 * st; y += e2[1] / m2 * st;
              pts.push([x, y]);
              if (Math.abs(x) > 9 || Math.abs(y) > 7) break;
              if (Q.some(function (q) { return q !== s && Math.hypot(q.x - x, q.y - y) < 0.1; })) break;
            }
            P.path(pts, C.ink3, 1.2);
            var mid = pts[Math.floor(pts.length / 3)], nx = pts[Math.floor(pts.length / 3) + 1];
            if (mid && nx) { var dx = (nx[0] - mid[0]) * sign, dy = (nx[1] - mid[1]) * sign; P.arrow(mid[0] - dx * 3, mid[1] - dy * 3, mid[0] + dx * 3, mid[1] + dy * 3, C.ink3, 1.2); }
          }
        });
        Q.forEach(function (q) {
          var col = q.q > 0 ? C.red : C.pen;
          c.save(); c.fillStyle = col; c.beginPath(); c.arc(P.tx(q.x), P.ty(q.y), 11 + 3 * Math.abs(q.q), 0, 7); c.fill();
          c.fillStyle = C.bg; c.font = 'bold 15px "Golos Text", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillText(q.q > 0 ? '+' : q.q < 0 ? '−' : '0', P.tx(q.x), P.ty(q.y) + 1); c.restore();
        });
      },
      onDown: function (p) { Q.forEach(function (q) { if (Math.hypot(q.x - p.x, q.y - p.y) < 0.45) drag = q; }); return !!drag; },
      onDrag: function (p) { if (drag) { drag.x = p.x; drag.y = p.y; plane.render(); } },
      onUp: function () { drag = null; }
    });
    var ctl = addCtl(box);
    slider(ctl, 'q1', Q[0].q, -3, 3, 1, function (v) { Q[0].q = v || 0.0001; plane.render(); }, function (v) { return (v > 0 ? '+' : '') + Math.round(v); }, 'заряд 1 (красный при +)');
    slider(ctl, 'q2', Q[1].q, -3, 3, 1, function (v) { Q[1].q = v || 0.0001; plane.render(); }, function (v) { return (v > 0 ? '+' : '') + Math.round(v); }, 'заряд 2');
    ctl.appendChild(h('span', 'muted', 'Заряды можно перетаскивать.'));
  };

  // ---------- осциллятор: свободные затухающие и вынужденные колебания ----------
  REG.oscillator = function (el) {
    var w0 = 2, gam = 0.15, F = 0, W = 1.5;
    var box = shell(el, 'x(t): уравнение ẍ + 2γẋ + ω₀²x = F·cos(Ωt), x(0)=1, ẋ(0)=0');
    function sim() {
      var pts = [], x = 1, v = 0, dt = 0.02, T = 40;
      var acc = function (t, x, v) { return -2 * gam * v - w0 * w0 * x + F * Math.cos(W * t); };
      for (var t = 0; t <= T; t += dt) {
        pts.push([t, x]);
        var k1x = v, k1v = acc(t, x, v);
        var k2x = v + k1v * dt / 2, k2v = acc(t + dt / 2, x + k1x * dt / 2, v + k1v * dt / 2);
        var k3x = v + k2v * dt / 2, k3v = acc(t + dt / 2, x + k2x * dt / 2, v + k2v * dt / 2);
        var k4x = v + k3v * dt, k4v = acc(t + dt, x + k3x * dt, v + k3v * dt);
        x += dt / 6 * (k1x + 2 * k2x + 2 * k3x + k4x); v += dt / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);
      }
      return pts;
    }
    var p1 = new Plane(box, {
      x0: -1, x1: 40, y0: -3, y1: 3, pan: false, xlabel: 't', ylabel: 'x',
      height: function (w) { return Math.max(200, Math.min(300, w * 0.36)); },
      draw: function (c, P, C) { if (gam > 0) { P.fn(function (t) { return t >= 0 ? Math.exp(-gam * t) : NaN; }, C.line, 1.2, [4, 4]); P.fn(function (t) { return t >= 0 ? -Math.exp(-gam * t) : NaN; }, C.line, 1.2, [4, 4]); } P.path(sim(), C.pen, 2); }
    });
    var p2wrap = h('div'); p2wrap.style.borderTop = '1px solid var(--line)'; box.appendChild(p2wrap);
    var p2 = new Plane(p2wrap, {
      x0: -0.2, x1: 5, y0: -0.3, y1: 6, pan: false, xlabel: 'Ω', ylabel: 'A',
      height: function (w) { return Math.max(170, Math.min(240, w * 0.28)); },
      draw: function (c, P, C) {
        var A = function (Om) { return 1 / Math.sqrt(Math.pow(w0 * w0 - Om * Om, 2) + 4 * gam * gam * Om * Om); };
        P.fn(function (x) { return x >= 0 ? A(x) : NaN; }, C.red, 2);
        P.dot(W, A(W), C.ink, 5);
        P.text('резонансная кривая A(Ω) при F = 1', P.v.x1, P.v.y1, C.ink3, { align: 'right', base: 'top', dx: -8, dy: 6 });
      }
    });
    var ctl = addCtl(box);
    var r = function () { p1.render(); p2.render(); };
    slider(ctl, 'w0', w0, 0.5, 4, 0.05, function (v) { w0 = v; r(); }, null, 'ω₀');
    slider(ctl, 'g', gam, 0, 1.5, 0.01, function (v) { gam = v; r(); }, null, 'затухание γ');
    slider(ctl, 'F', F, 0, 3, 0.05, function (v) { F = v; r(); }, null, 'сила F');
    slider(ctl, 'W', W, 0.1, 5, 0.05, function (v) { W = v; r(); }, null, 'частота силы Ω');
  };

  // ---------- векторы на плоскости ----------
  REG.vectors = function (el) {
    var A = [3, 1], B = [1, 2.5], drag = null;
    var box = shell(el);
    var plane = new Plane(box, {
      x0: -5, x1: 6, equal: true, pan: false, zoom: false, touch: 'none', stepX: 1, stepY: 1,
      draw: function (c, P, C) {
        P.path([[A[0], A[1]], [A[0] + B[0], A[1] + B[1]]], C.line, 1.2);
        P.path([[B[0], B[1]], [A[0] + B[0], A[1] + B[1]]], C.line, 1.2);
        P.arrow(0, 0, A[0] + B[0], A[1] + B[1], C.green, 2.4);
        P.arrow(0, 0, A[0], A[1], C.pen, 2.6);
        P.arrow(0, 0, B[0], B[1], C.red, 2.6);
        P.text('a', A[0], A[1], C.pen, { dx: 6, font: 'italic bold 16px Literata, serif' });
        P.text('b', B[0], B[1], C.red, { dx: 6, font: 'italic bold 16px Literata, serif' });
        P.text('a+b', A[0] + B[0], A[1] + B[1], C.green, { dx: 6, font: 'italic bold 15px Literata, serif' });
      },
      onDown: function (p) { if (Math.hypot(p.x - A[0], p.y - A[1]) < 0.6) drag = A; else if (Math.hypot(p.x - B[0], p.y - B[1]) < 0.6) drag = B; return !!drag; },
      onDrag: function (p) { if (!drag) return; drag[0] = Math.round(p.x * 2) / 2; drag[1] = Math.round(p.y * 2) / 2; plane.render(); show(); },
      onUp: function () { drag = null; }
    });
    var rd = readout(box);
    function show() {
      var dot = A[0] * B[0] + A[1] * B[1], la = Math.hypot(A[0], A[1]), lb = Math.hypot(B[0], B[1]);
      var ang = la && lb ? Math.acos(Math.max(-1, Math.min(1, dot / la / lb))) * 180 / Math.PI : 0;
      rd.innerHTML = '<span style="color:var(--pen)">a = (' + fmt(A[0]) + '; ' + fmt(A[1]) + ')</span><span style="color:var(--red)">b = (' + fmt(B[0]) + '; ' + fmt(B[1]) + ')</span><span style="color:var(--green)">a + b = (' + fmt(A[0] + B[0]) + '; ' + fmt(A[1] + B[1]) + ')</span><span>a·b = ' + fmt(dot) + '</span><span>угол = ' + fmt(ang, 1) + '°</span><span>площадь параллелограмма = ' + fmt(Math.abs(A[0] * B[1] - A[1] * B[0])) + '</span>';
    }
    show();
    var ctl = addCtl(box); ctl.appendChild(h('span', 'muted', 'Тяните концы векторов a и b.'));
  };

  // ---------- комплексная плоскость ----------
  REG.complex = function (el) {
    var z = [1.5, 1], drag = false, mode = 'sq';
    var box = shell(el);
    function op(a) {
      var x = a[0], y = a[1];
      if (mode === 'sq') return [x * x - y * y, 2 * x * y];
      if (mode === 'inv') { var d = x * x + y * y; return [x / d, -y / d]; }
      if (mode === 'conj') return [x, -y];
      if (mode === 'mul') return [x * 0 - y * 1, x * 1 + y * 0];
      return a;
    }
    var plane = new Plane(box, {
      x0: -4.5, x1: 4.5, equal: true, pan: false, zoom: false, touch: 'none', stepX: 1, stepY: 1, xlabel: 'Re', ylabel: 'Im',
      draw: function (c, P, C) {
        c.save(); c.strokeStyle = C.line; c.setLineDash([4, 4]); c.beginPath(); c.arc(P.tx(0), P.ty(0), P.tx(1) - P.tx(0), 0, 7); c.stroke(); c.restore();
        var w = op(z);
        P.arrow(0, 0, z[0], z[1], C.pen, 2.4); P.arrow(0, 0, w[0], w[1], C.red, 2.4);
        P.text('z', z[0], z[1], C.pen, { dx: 6, font: 'italic bold 16px Literata, serif' });
        P.text('w', w[0], w[1], C.red, { dx: 6, font: 'italic bold 16px Literata, serif' });
      },
      onDown: function (p) { drag = Math.hypot(p.x - z[0], p.y - z[1]) < 0.7; if (drag) { z = [p.x, p.y]; plane.render(); show(); } return drag; },
      onDrag: function (p) { if (drag) { z = [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10]; plane.render(); show(); } },
      onUp: function () { drag = false; }
    });
    var ctl = addCtl(box);
    var sel = h('select', 'input'); sel.setAttribute('aria-label', 'Операция'); sel.style.padding = '4px 8px'; sel.style.fontSize = '14px';
    [['sq', 'w = z²'], ['inv', 'w = 1/z'], ['conj', 'w = z̄ (сопряжённое)'], ['mul', 'w = i·z (поворот на 90°)']].forEach(function (o) { var e = h('option', null, o[1]); e.value = o[0]; sel.appendChild(e); });
    sel.onchange = function () { mode = sel.value; plane.render(); show(); };
    ctl.appendChild(sel);
    ctl.appendChild(h('span', 'muted', 'Тяните точку z. Пунктир — единичная окружность.'));
    var rd = readout(box);
    function polar(a) { return '|·| = ' + fmt(Math.hypot(a[0], a[1]), 3) + ', arg = ' + fmt(Math.atan2(a[1], a[0]) * 180 / Math.PI, 1) + '°'; }
    function show() {
      var w = op(z);
      rd.innerHTML = '<span style="color:var(--pen)">z = ' + fmt(z[0]) + (z[1] < 0 ? ' − ' : ' + ') + fmt(Math.abs(z[1])) + 'i  (' + polar(z) + ')</span><span style="color:var(--red)">w = ' + fmt(w[0]) + (w[1] < 0 ? ' − ' : ' + ') + fmt(Math.abs(w[1])) + 'i  (' + polar(w) + ')</span>';
    }
    show();
  };

  // ---------- фазовый портрет линейной системы ----------
  REG.phase = function (el, args) {
    var p = (args || '0 1 -1 -0.3').split(/\s+/).map(function (s) { return num(s, 0); });
    var M = { a: p[0], b: p[1], c: p[2], d: p[3] };
    var box = shell(el, 'Система: x′ = a·x + b·y,  y′ = c·x + d·y');
    var seeds = [];
    for (var k = 0; k < 12; k++) { var th = k * Math.PI / 6; seeds.push([2.6 * Math.cos(th), 2.6 * Math.sin(th)]); }
    var plane = new Plane(box, {
      x0: -3.2, x1: 3.2, equal: true, pan: false, zoom: false, touch: 'none', stepX: 1, stepY: 1,
      height: function (w) { return Math.min(440, Math.max(280, w * 0.6)); },
      draw: function (c, P, C) {
        var f = function (x, y) { return [M.a * x + M.b * y, M.c * x + M.d * y]; };
        for (var gx = -3; gx <= 3; gx += 0.5) for (var gy = -2.5; gy <= 2.5; gy += 0.5) {
          var v = f(gx, gy), m = Math.hypot(v[0], v[1]); if (!m) continue;
          P.arrow(gx, gy, gx + v[0] / m * 0.22, gy + v[1] / m * 0.22, C.line, 1.2);
        }
        seeds.forEach(function (s, i) {
          [1, -1].forEach(function (dir) {
            var x = s[0], y = s[1], pts = [[x, y]];
            for (var n = 0; n < 900; n++) {
              var v1 = f(x, y), mx = x + dir * v1[0] * 0.005, my = y + dir * v1[1] * 0.005, v2 = f(mx, my);
              x += dir * v2[0] * 0.01; y += dir * v2[1] * 0.01;
              pts.push([x, y]);
              if (Math.abs(x) > 6 || Math.abs(y) > 6 || Math.hypot(x, y) < 0.02) break;
            }
            P.path(pts, C.series[i % 3], 1.6);
          });
        });
        P.dot(0, 0, C.ink, 4);
      },
      onDown: function (pt) { seeds.push([pt.x, pt.y]); if (seeds.length > 24) seeds.shift(); plane.render(); return false; }
    });
    var ctl = addCtl(box);
    ['a', 'b', 'c', 'd'].forEach(function (k) { slider(ctl, k, M[k], -2, 2, 0.05, function (v) { M[k] = v; plane.render(); show(); }, null, '<i>' + k + '</i>'); });
    var rd = readout(box);
    function show() {
      var tr = M.a + M.d, det = M.a * M.d - M.b * M.c, disc = tr * tr - 4 * det, type;
      var l = disc >= 0 ? fmt((tr + Math.sqrt(disc)) / 2, 3) + ' и ' + fmt((tr - Math.sqrt(disc)) / 2, 3) : fmt(tr / 2, 3) + ' ± ' + fmt(Math.sqrt(-disc) / 2, 3) + 'i';
      if (Math.abs(det) < 1e-9) type = 'вырожденный случай (det = 0)';
      else if (det < 0) type = 'седло (неустойчиво)';
      else if (disc < 0) type = Math.abs(tr) < 1e-9 ? 'центр (устойчиво, не асимптотически)' : tr < 0 ? 'устойчивый фокус' : 'неустойчивый фокус';
      else type = tr < 0 ? 'устойчивый узел' : 'неустойчивый узел';
      rd.innerHTML = '<span>собственные числа: ' + l + '</span><span>tr = ' + fmt(tr) + ', det = ' + fmt(det) + '</span><span><b>' + type + '</b></span><span class="muted">щёлкните по полю — добавится траектория</span>';
    }
    show();
  };

  // ---------- биномиальное распределение и нормальное приближение ----------
  REG.binom = function (el) {
    var n = 20, p = 0.3;
    var box = shell(el);
    function pmf(k) { var c = 1; for (var i = 1; i <= k; i++) c = c * (n - k + i) / i; return c * Math.pow(p, k) * Math.pow(1 - p, n - k); }
    var plane = new Plane(box, {
      x0: -1, x1: 21, y0: -0.02, y1: 0.3, pan: false, zoom: false,
      draw: function (c, P, C) {
        for (var k = 0; k <= n; k++) { var y = pmf(k); P.path([[k - 0.4, 0], [k - 0.4, y], [k + 0.4, y], [k + 0.4, 0]], C.pen, 1, hexA(C.pen, 0.25)); }
        var m = n * p, s = Math.sqrt(n * p * (1 - p));
        P.fn(function (x) { return Math.exp(-(x - m) * (x - m) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); }, C.red, 2.2);
      }
    });
    function rescale() { var m = n * p, s = Math.sqrt(n * p * (1 - p)); plane.v.x0 = -1; plane.v.x1 = n + 1; var mx = 0; for (var k = 0; k <= n; k++) mx = Math.max(mx, pmf(k)); mx = Math.max(mx, 1 / (s * Math.sqrt(2 * Math.PI))); plane.v.y0 = -mx * 0.07; plane.v.y1 = mx * 1.15; plane.render(); show(); }
    var ctl = addCtl(box);
    slider(ctl, 'n', n, 1, 200, 1, function (v) { n = Math.round(v); rescale(); }, function (v) { return String(Math.round(v)); }, 'испытаний n');
    slider(ctl, 'p', p, 0.01, 0.99, 0.01, function (v) { p = v; rescale(); }, function (v) { return fmt(v, 2); }, 'вероятность p');
    var rd = readout(box);
    function show() { rd.innerHTML = '<span>M = np = ' + fmt(n * p, 2) + '</span><span>σ = √(np(1−p)) = ' + fmt(Math.sqrt(n * p * (1 - p)), 3) + '</span><span class="muted">столбики — биномиальный закон, красная линия — нормальная кривая с теми же M и σ</span>'; }
    rescale();
  };

  // ---------- собирающая линза ----------
  REG.lens = function (el) {
    var F = 2, d = 5, hObj = 1.4;
    var box = shell(el);
    var plane = new Plane(box, {
      x0: -10, x1: 10, equal: true, pan: false, zoom: false, axes: false,
      draw: function (c, P, C) {
        P.path([[P.v.x0, 0], [P.v.x1, 0]], C.ink3, 1);
        // линза
        c.save(); c.strokeStyle = C.pen; c.lineWidth = 2.5; c.beginPath(); c.ellipse(P.tx(0), P.ty(0), 6, P.ty(-3) - P.ty(0), 0, 0, 7); c.stroke(); c.restore();
        [-F, F, -2 * F, 2 * F].forEach(function (x, i) { P.dot(x, 0, C.ink2, 3); P.text(i < 2 ? 'F' : '2F', x, 0, C.ink2, { align: 'center', dy: 16, base: 'bottom' }); });
        var xo = -d;
        P.arrow(xo, 0, xo, hObj, C.green, 2.6);
        var f = 1 / (1 / F - 1 / d); // формула линзы 1/d + 1/f = 1/F
        var real = d > F, hi = -hObj * f / d;
        var col = C.amber;
        // луч 1: параллельно оси → через фокус
        P.path([[xo, hObj], [0, hObj]], col, 1.5);
        if (isFinite(f) && Math.abs(f) < 60) {
          var far = real ? Math.max(f, 0) + 3 : P.v.x1;
          P.path([[0, hObj], [far, hObj - hObj / F * far]], col, 1.5);
          // луч 2: через центр
          P.path([[xo, hObj], [far, hObj - hObj / d * (far - xo) + 0 * 0]], col, 1.5);
          if (!real) { c.save(); c.setLineDash([5, 5]); P.path([[0, hObj], [f, hi]], col, 1.2); P.path([[xo, hObj], [f, hi]], col, 1.2); c.restore(); }
          P.arrow(f, 0, f, hi, real ? C.red : hexA(C.red, 0.6), 2.6);
        }
      }
    });
    var ctl = addCtl(box);
    slider(ctl, 'd', d, 0.5, 9, 0.1, function (v) { d = v; plane.render(); show(); }, function (v) { return fmt(v, 1); }, 'расстояние до предмета d');
    slider(ctl, 'F', F, 1, 4, 0.1, function (v) { F = v; plane.render(); show(); }, function (v) { return fmt(v, 1); }, 'фокус F');
    var rd = readout(box);
    function show() {
      var f = 1 / (1 / F - 1 / d), G = -f / d;
      rd.innerHTML = Math.abs(d - F) < 0.05 ? '<span>Предмет в фокусе: лучи после линзы параллельны, изображения нет.</span>' :
        '<span>f = ' + fmt(f, 2) + '</span><span>увеличение Γ = ' + fmt(Math.abs(G), 2) + '</span><span><b>' + (f > 0 ? 'действительное, перевёрнутое' : 'мнимое, прямое') + (Math.abs(G) > 1 ? ', увеличенное' : ', уменьшенное') + '</b></span>';
    }
    show();
  };

  // ---------- неявная кривая F(x, y) = 0 ----------
  REG.implicit = function (el, args) {
    var parts = args.split('|').map(function (s) { return s.trim(); });
    var srcs = parts[0].split(';').map(function (s) { return s.trim(); }).filter(Boolean);
    var r = (parts[1] || '-5 5').split(/\s+/).map(function (s) { return num(s); });
    var Fs = srcs.map(function (s) { var q = s.split('='); var src = q.length === 2 ? '(' + q[0] + ')-(' + q[1] + ')' : s; return compileFn(src, ['x', 'y']); });
    var box = shell(el);
    new Plane(box, {
      x0: r[0], x1: r[1], y0: r[2], y1: r[3], equal: r[2] === undefined,
      draw: function (c, P, C) {
        var nx = 180, ny = Math.round(180 * P.H / P.W);
        Fs.forEach(function (F, fi) {
          var g = [], i, j;
          for (j = 0; j <= ny; j++) { g[j] = []; for (i = 0; i <= nx; i++) { var x = P.v.x0 + (P.v.x1 - P.v.x0) * i / nx, y = P.v.y0 + (P.v.y1 - P.v.y0) * j / ny; var v; try { v = F.f({ x: x, y: y }); } catch (e) { v = NaN; } g[j][i] = v; } }
          c.save(); c.strokeStyle = C.series[fi % 5]; c.lineWidth = 2.2; c.beginPath();
          var X = function (i) { return P.tx(P.v.x0 + (P.v.x1 - P.v.x0) * i / nx); }, Y = function (j) { return P.ty(P.v.y0 + (P.v.y1 - P.v.y0) * j / ny); };
          for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) {
            var a = g[j][i], b = g[j][i + 1], cc = g[j + 1][i + 1], d = g[j + 1][i];
            if (!isFinite(a) || !isFinite(b) || !isFinite(cc) || !isFinite(d)) continue;
            var pts = [];
            if ((a > 0) !== (b > 0)) pts.push([X(i + a / (a - b)), Y(j)]);
            if ((b > 0) !== (cc > 0)) pts.push([X(i + 1), Y(j + b / (b - cc))]);
            if ((d > 0) !== (cc > 0)) pts.push([X(i + d / (d - cc)), Y(j + 1)]);
            if ((a > 0) !== (d > 0)) pts.push([X(i), Y(j + a / (a - d))]);
            if (pts.length >= 2) { c.moveTo(pts[0][0], pts[0][1]); c.lineTo(pts[1][0], pts[1][1]); }
            if (pts.length === 4) { c.moveTo(pts[2][0], pts[2][1]); c.lineTo(pts[3][0], pts[3][1]); }
          }
          c.stroke(); c.restore();
        });
      }
    });
    var ctl = addCtl(box);
    var C0 = colors();
    legend(ctl, Fs.map(function (F, i) { return { color: C0.series[i % 5], tex: srcs[i].indexOf('=') >= 0 ? Expr.toTeX(Expr.parse(srcs[i].split('=')[0], { vars: ['x', 'y'] })) + '=' + Expr.toTeX(Expr.parse(srcs[i].split('=')[1], { vars: ['x', 'y'] })) : F.tex + '=0' }; }));
  };

  // ---------- параметрическая кривая ----------
  REG.curve = function (el, args) {
    var parts = args.split('|').map(function (s) { return s.trim(); });
    var xy = parts[0].split(';').map(function (s) { return compileFn(s.trim(), ['t']); });
    var tr = (parts[1] || '0 2pi').split(/\s+/).map(function (s) { return num(s); });
    var r = (parts[2] || '-3 3').split(/\s+/).map(function (s) { return num(s); });
    var tEnd = tr[1];
    var box = shell(el);
    var plane = new Plane(box, {
      x0: r[0], x1: r[1], y0: r[2], y1: r[3], equal: r[2] === undefined,
      draw: function (c, P, C) {
        var pts = []; for (var i = 0; i <= 600; i++) { var t = tr[0] + (tEnd - tr[0]) * i / 600; pts.push([xy[0].f({ t: t }), xy[1].f({ t: t })]); }
        P.path(pts, C.pen, 2.2);
        var l = pts[pts.length - 1]; P.dot(l[0], l[1], C.red, 5);
      }
    });
    var ctl = addCtl(box);
    var lg = h('span'); ctl.appendChild(lg); texInto(lg, 'x=' + xy[0].tex + ',\\ y=' + xy[1].tex);
    slider(ctl, 't', tEnd, tr[0], tr[1], (tr[1] - tr[0]) / 300, function (v) { tEnd = v; plane.render(); }, null, 'параметр t до');
  };

  // ---------- монтирование ----------
  function mountAll(root) {
    (root || document).querySelectorAll('.widget').forEach(function (el) {
      if (el.dataset.m) return;
      el.dataset.m = '1';
      var fn = REG[el.dataset.w];
      if (!fn) { el.textContent = 'Неизвестный чертёж: ' + el.dataset.w; return; }
      try { fn(el, el.dataset.a || ''); } catch (e) { el.textContent = 'Не удалось построить чертёж: ' + e.message; if (window.console) console.error(e); }
    });
  }
  function stopAll() { timers.forEach(clearInterval); timers = []; }
  window.Widgets = { mountAll: mountAll, stopAll: stopAll, Plane: Plane, REG: REG };
})();
