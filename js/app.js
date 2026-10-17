/* Физмат с нуля — приложение: маршрутизация, страницы, задачи, тест уровня, прогресс. */
(function () {
  'use strict';

  var D = window.MPDATA || { topics: [], tests: {} };
  var TOPICS = D.topics;
  var byId = {};
  TOPICS.forEach(function (t, i) { t.idx = i; byId[t.id] = t; });
  var TASKS = {};
  TOPICS.forEach(function (t) { t.tasks.forEach(function (k, i) { k.topic = t.id; k.num = i + 1; TASKS[k.id] = k; }); });
  var MACROS = window.TEX_MACROS || {};

  var SUBJ = {
    math: { name: 'Математика', gen: 'математике', lead: 'От дробей и уравнений до функционального анализа и теории управления. Каждая тема — теория простым языком, разобранные примеры и задачи с автопроверкой.' },
    phys: { name: 'Физика', gen: 'физике', lead: 'От скорости и силы до квантовой механики, электродинамики и механики сплошных сред. Формулы с выводом, физический смысл и задачи с проверкой ответа.' }
  };
  var LEVELS = {
    math: [
      { name: 'Фундамент', sub: '5–9 класс', about: 'Числа, дроби, проценты, уравнения, функции и планиметрия — то, на чём стоит всё остальное.' },
      { name: 'Старшая школа', sub: '10–11 класс', about: 'Тригонометрия, логарифмы, производная, интеграл, стереометрия и вероятность — уровень профильного ЕГЭ.' },
      { name: '1 курс', sub: 'анализ, алгебра, геометрия', about: 'Пределы, производные и интегралы всерьёз; комплексные числа, матрицы, векторы, аналитическая геометрия.' },
      { name: '2 курс', sub: 'ряды, ФНП, диффуры', about: 'Ряды, функции многих переменных, кратные интегралы, теория поля, дифференциальные уравнения, линейные пространства.' },
      { name: '3 курс', sub: 'ТФКП, вероятность, матфизика', about: 'Комплексный анализ, преобразования Лапласа и Фурье, вероятность и статистика, уравнения матфизики, численные методы.' },
      { name: '4–5 курс', sub: 'специальные главы', about: 'Графы, оптимизация, устойчивость и управление, случайные процессы, функциональный анализ, тензоры, сигналы, МКЭ.' }
    ],
    phys: [
      { name: 'Основы', sub: '7–9 класс', about: 'Величины и единицы, движение, силы, давление, работа, теплота, ток и свет.' },
      { name: 'Школьная физика', sub: '10–11 класс', about: 'Механика, молекулярная физика, электродинамика, оптика и кванты на уровне ЕГЭ.' },
      { name: '1 курс', sub: 'механика и молекулярка', about: 'Общая физика с векторами и производными: динамика, твёрдое тело, колебания, СТО, термодинамика.' },
      { name: '2 курс', sub: 'электромагнетизм и оптика', about: 'Теорема Гаусса, цепи, магнитное поле, уравнения Максвелла, волны, интерференция и дифракция.' },
      { name: '3 курс', sub: 'кванты, атом, теормех', about: 'Квантовая механика, атом, твёрдое тело, ядро; лагранжева и гамильтонова механика, статистическая физика.' },
      { name: '4–5 курс', sub: 'специальные главы', about: 'Формализм КМ, электродинамика, сплошные среды, гидродинамика, теплопередача, полупроводники, плазма, лазеры.' }
    ]
  };
  ['math', 'phys'].forEach(function (s, k) { LEVELS[s].forEach(function (L, i) { L.short = (k ? ["7–9 класс", "10–11 класс", "1 курс", "2 курс", "3 курс", "4–5 курс"] : ["5–9 класс", "10–11 класс", "1 курс", "2 курс", "3 курс", "4–5 курс"])[i]; }); });
  var TYPE_HINT = {
    num: 'Число или выражение: 3/4, -2,5, sqrt(2), 2pi, 3e8',
    set: 'Все ответы через «;» — например: -2; 3. Если решений нет — напишите «нет»',
    tuple: 'Числа по порядку через «;» — например: 1; -2; 3',
    expr: 'Выражение: 2x*cos(x^2), e^(-x), sqrt(1+x^2), ln(x)/x',
    antider: 'Первообразная от x; «+ C» можно не писать',
    cnum: 'Комплексное число: 3-4i, (1+i)/2, 2e^(i*pi/3)',
    text: 'Слово или короткая фраза'
  };

  // ---------- хранилище ----------
  var KEY = 'fizmat.v1';
  var S = {
    d: null,
    load: function () {
      var d = null;
      try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { d = null; }
      this.d = Object.assign({ v: 1, tasks: {}, topics: {}, tests: {}, plan: { hours: 6 }, days: {}, last: null, theme: 'auto' }, d || {});
    },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch (e) { /* хранилище недоступно */ } },
    task: function (id) { return this.d.tasks[id] || null; },
    topic: function (id) { return this.d.topics[id] || (this.d.topics[id] = {}); }
  };
  S.load();

  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function recordTask(task, ok) {
    var r = S.d.tasks[task.id] || { s: 0, n: 0 };
    var first = ok && r.s !== 1;
    r.n++; r.t = Date.now();
    if (ok) r.s = 1; else if (r.s !== 1) { r.s = 0; r.w = (r.w || 0) + 1; }
    S.d.tasks[task.id] = r;
    if (first) S.d.days[today()] = (S.d.days[today()] || 0) + 1;
    var tp = byId[task.topic];
    if (tp) {
      var st = S.topic(tp.id);
      st.seen = st.seen || Date.now();
      if (first && !st.done && solvedCount(tp) >= Math.ceil(tp.tasks.length * 0.7)) {
        st.done = Date.now();
        toast('Тема «' + strip(tp.title) + '» освоена: решено ' + solvedCount(tp) + ' из ' + tp.tasks.length);
      }
    }
    S.save();
    updateCounts();
  }
  function solvedCount(t) { return t.tasks.filter(function (k) { var r = S.d.tasks[k.id]; return r && r.s === 1; }).length; }
  function topicStatus(t) {
    var st = S.d.topics[t.id] || {};
    if (st.known) return 'known';
    if (st.done) return 'done';
    if (st.seen || t.tasks.some(function (k) { return S.d.tasks[k.id]; })) return 'started';
    return 'new';
  }
  var ST_LABEL = { known: 'зачтено', done: 'освоена', started: 'в процессе', new: 'не начата' };

  // ---------- утилиты ----------
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function strip(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }
  function plural(n, a, b, c) { var m = n % 10, h = n % 100; return n + ' ' + (m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function hours(h) { return h < 1 ? Math.round(h * 60) + ' мин' : (Math.round(h * 10) / 10).toString().replace('.', ',') + ' ч'; }

  function renderMath(root) {
    if (!window.katex) return;
    $$('.tex, .tex-d', root).forEach(function (e) {
      if (e.dataset.r) return;
      var src = e.textContent;
      try {
        katex.render(src, e, { displayMode: e.classList.contains('tex-d'), throwOnError: false, strict: 'ignore', macros: Object.assign({}, MACROS) });
      } catch (err) { e.textContent = src; }
      e.dataset.r = '1';
    });
  }
  function tex(src, display) { return '<span class="' + (display ? 'tex-d' : 'tex') + '">' + esc(window.TEX_FIX ? TEX_FIX(src) : src) + '</span>'; }

  var toastTimer;
  function toast(msg) {
    var t = $('.toast');
    if (!t) { t = el('div', 'toast'); t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3600);
  }

  var ICON = {
    new: '<svg class="st-ico" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="var(--ink-3)" stroke-width="1.6"/></svg>',
    started: '<svg class="st-ico" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="var(--pen)" stroke-width="1.6"/><path d="M10 3a7 7 0 0 1 0 14z" fill="var(--pen)"/></svg>',
    done: '<svg class="st-ico" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="var(--green)"/><path d="M6 10.5l2.6 2.5L14 7.5" fill="none" stroke="var(--surface)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    known: '<svg class="st-ico" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="var(--green)" stroke-width="1.6"/><path d="M6 10.5l2.6 2.5L14 7.5" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  function dots(d) { var s = '<span class="dots" title="Сложность ' + d + ' из 3">'; for (var i = 1; i <= 3; i++) s += '<i' + (i <= d ? ' class="f"' : '') + '></i>'; return s + '</span>'; }

  function subjTopics(subj) { return TOPICS.filter(function (t) { return t.subject === subj; }); }
  function levelTopics(subj, lv) { return TOPICS.filter(function (t) { return t.subject === subj && t.level === lv; }); }
  function pct(list) {
    if (!list.length) return 0;
    var done = 0;
    list.forEach(function (t) { var s = topicStatus(t); if (s === 'known' || s === 'done') done += 1; else if (s === 'started') done += Math.min(0.9, solvedCount(t) / Math.max(1, t.tasks.length)); });
    return Math.round(100 * done / list.length);
  }

  // ---------- тема оформления ----------
  function applyTheme() {
    var th = S.d.theme || 'auto';
    if (th === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', th);
    $$('[data-theme-set]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-theme-set') === th); });
    window.dispatchEvent(new Event('fizmat-theme'));
  }
  $$('[data-theme-set]').forEach(function (b) {
    b.addEventListener('click', function () { S.d.theme = b.getAttribute('data-theme-set'); S.save(); applyTheme(); });
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onMq = function () { window.dispatchEvent(new Event('fizmat-theme')); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }

  // ---------- меню на телефоне ----------
  var side = $('#side');
  function closeMenu() { side.classList.remove('open'); var s = $('.scrim'); if (s) s.remove(); }
  $('#burger').addEventListener('click', function () {
    if (side.classList.contains('open')) { closeMenu(); return; }
    side.classList.add('open');
    var s = el('div', 'scrim'); s.addEventListener('click', closeMenu); document.body.appendChild(s);
  });

  function updateCounts() {
    ['math', 'phys'].forEach(function (s) { var c = $('#cnt-' + s); if (c) c.textContent = pct(subjTopics(s)) + '%'; });
  }

  // ---------- маршрутизация ----------
  var view = $('#view');
  var current = '';
  function go(h) { if (location.hash === '#' + h) route(); else location.hash = h; }
  function route() {
    var h = decodeURIComponent(location.hash.replace(/^#/, '')) || 'home';
    var dot = h.indexOf('.');
    var name = dot < 0 ? h : h.slice(0, dot);
    var arg = dot < 0 ? '' : h.slice(dot + 1);
    var fn = VIEWS[name] || VIEWS.home;
    if (!VIEWS[name]) { name = 'home'; arg = ''; }
    var prev = current;
    current = h;
    if (name !== 'search' && $('#q').value && prev.indexOf('search') === 0) $('#q').value = '';
    view.innerHTML = '';
    Widgets && Widgets.stopAll && Widgets.stopAll();
    fn(arg);
    renderMath(view);
    if (window.Widgets) Widgets.mountAll(view);
    $$('#nav a').forEach(function (a) {
      var r = a.getAttribute('data-r');
      a.classList.toggle('on', r === h || r === name || (name === 'topic' && byId[arg] && r === 'map.' + byId[arg].subject) || (name === 'map' && r === 'map.' + arg.split('.')[0]));
    });
    closeMenu();
    if (name !== 'search') window.scrollTo(0, 0);
    var t = $('h1', view);
    document.title = (t && name !== 'home' ? t.textContent + ' · ' : '') + 'Физмат с нуля';
  }
  window.addEventListener('hashchange', route);

  var VIEWS = {};

  // ---------- главная ----------
  VIEWS.home = function () {
    var anyProgress = Object.keys(S.d.tasks).length || Object.keys(S.d.topics).length;
    var nTasks = TOPICS.reduce(function (s, t) { return s + t.tasks.length; }, 0);
    var h = '<div class="sheet">';
    h += '<section class="hero"><div>' +
      '<div class="eyebrow">Самоучитель для взрослых · ' + plural(TOPICS.length, 'тема', 'темы', 'тем') + ' · ' + plural(nTasks, 'задача', 'задачи', 'задач') + '</div>' +
      '<h1 style="margin-top:12px">Математика и физика <span class="hand">с нуля</span> до пятого курса технического вуза</h1>' +
      '<p>Начните с короткого теста: он покажет, что вы уже знаете, и с какой темы идти дальше. Дальше — по маршруту: объяснение, разобранные примеры, задачи с мгновенной проверкой ответа.</p>' +
      '<div class="row">' +
      (S.d.tests.math || S.d.tests.phys ? '<a class="btn pri lg" href="#plan">Мой маршрут</a><a class="btn lg" href="#test">Пройти тест ещё раз</a>'
        : '<a class="btn pri lg" href="#test">Определить мой уровень</a><a class="btn lg" href="#map.math">Открыть программу</a>') +
      '</div></div><div class="ladder" id="ladder"></div></section>';

    if (anyProgress) {
      var last = S.d.last && byId[S.d.last];
      var next = nextInPlan('math') || nextInPlan('phys');
      var solved = Object.keys(S.d.tasks).filter(function (k) { return S.d.tasks[k].s === 1; }).length;
      var doneT = TOPICS.filter(function (t) { var s = topicStatus(t); return s === 'done' || s === 'known'; }).length;
      h += '<section class="sec"><div class="panel continue"><div><div class="eyebrow">' + (last ? 'Вы остановились на теме' : 'Следующая тема по маршруту') + '</div><div class="t">' + esc(strip((last || next || TOPICS[0]).title)) + '</div>' +
        (next && last && next.id !== last.id ? '<div class="muted ui" style="font-size:14px">Следующая по маршруту: <a href="#topic.' + next.id + '">' + esc(strip(next.title)) + '</a></div>' : '') +
        '</div><a class="btn pri" href="#topic.' + (last || next || TOPICS[0]).id + '">Продолжить</a></div>';
      h += '<div class="stats">' +
        stat(solved, 'задач решено') + stat(doneT, 'тем освоено или зачтено') + stat(streak(), 'дней подряд') + stat(reviewList().length, 'задач в работе над ошибками') + '</div></section>';
    }

    h += '<section class="sec"><div class="sec-h"><h2 class="h2">Программа</h2><a class="btn ghost" href="#plan">Настроить маршрут →</a></div><div class="cols2">';
    ['math', 'phys'].forEach(function (s) {
      var list = subjTopics(s);
      h += '<div class="panel subj"><div class="subj-h"><h3>' + SUBJ[s].name + '</h3><span class="muted ui" style="font-size:13px">' + plural(list.length, 'тема', 'темы', 'тем') + '</span></div><div class="lv-rows">';
      LEVELS[s].forEach(function (L, i) {
        var lt = levelTopics(s, i);
        var p = pct(lt);
        h += '<a class="lv-row" href="#map.' + s + '.' + i + '"><span>' + L.short + '</span><span class="bar"><i style="width:' + p + '%"></i></span><span class="n">' + (lt.length ? p + '%' : '—') + '</span></a>';
      });
      h += '</div><a class="btn sm" href="#map.' + s + '" style="align-self:flex-start">Все темы по ' + SUBJ[s].gen + '</a></div>';
    });
    h += '</div></section>';

    h += '<section class="sec"><h2 class="h2">Как здесь учиться</h2><div class="howto">' +
      '<div><b>1. Тест</b><p>Пятнадцать–тридцать минут. Вопросы идут от простого к сложному и останавливаются там, где начинаются пробелы. Не угадывайте: «Не знаю» — честный и полезный ответ.</p></div>' +
      '<div><b>2. Маршрут</b><p>Сайт отметит то, что вы уже знаете, и выстроит темы по порядку. Укажите, сколько часов в неделю готовы заниматься, — увидите примерную дату финиша.</p></div>' +
      '<div><b>3. Тема за темой</b><p>Прочитайте объяснение с ручкой и тетрадью, повторите примеры сами, решите задачи. Тема считается освоенной, когда решено 70% задач.</p></div>' +
      '</div></section>';
    h += '</div>';
    view.innerHTML = h;
    drawLadder($('#ladder'));
  };
  function stat(v, l) { return '<div class="stat"><b>' + v + '</b><span>' + l + '</span></div>'; }

  function drawLadder(box) {
    if (!box) return;
    var W = 460, H = 330, n = 6, sw = 64, sh = 44, x0 = 30, y0 = H - 34;
    var labels = ['5–9 кл.', '10–11', '1 курс', '2 курс', '3 курс', '4–5 курс'];
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Шесть ступеней программы и ваш прогресс по каждой">';
    for (var i = 0; i < n; i++) {
      var x = x0 + i * sw, y = y0 - (i + 1) * sh;
      var p = (pct(levelTopics('math', i)) + pct(levelTopics('phys', i))) / 200;
      s += '<rect x="' + x + '" y="' + y + '" width="' + sw + '" height="' + (y0 - y) + '" fill="var(--surface)" stroke="var(--line)"/>';
      if (p > 0) s += '<rect x="' + x + '" y="' + (y0 - (y0 - y) * p) + '" width="' + sw + '" height="' + ((y0 - y) * p) + '" fill="var(--green)" opacity=".28"/>';
      s += '<path d="M' + x + ' ' + y + 'h' + sw + '" stroke="var(--ink)" stroke-width="2.5"/>';
      s += '<text x="' + (x + sw / 2) + '" y="' + (y + 22) + '" text-anchor="middle" font-family="Caveat, cursive" font-size="26" font-weight="700" fill="var(--pen)">' + i + '</text>';
      s += '<text x="' + (x + sw / 2) + '" y="' + (y0 + 20) + '" text-anchor="middle" font-family="Golos Text, sans-serif" font-size="12" fill="var(--ink-3)">' + labels[i] + '</text>';
    }
    s += '<path d="M' + x0 + ' ' + y0 + 'H' + (x0 + n * sw + 20) + '" stroke="var(--ink)" stroke-width="1.5"/>';
    var lv = userLevel();
    if (lv >= 0) {
      var cx = x0 + lv * sw + sw / 2, cy = y0 - (lv + 1) * sh - 18;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="var(--red)"/><text x="' + (cx + 12) + '" y="' + (cy - 8) + '" font-family="Caveat, cursive" font-size="22" fill="var(--red)">вы здесь</text>';
    } else {
      s += '<text x="' + (x0 + 4) + '" y="' + 40 + '" font-family="Caveat, cursive" font-size="24" fill="var(--ink-2)">где вы? — пройдите тест</text>';
      s += '<path d="M' + (x0 + 40) + ' 52 q 10 50 4 120" fill="none" stroke="var(--ink-3)" stroke-width="1.5" stroke-dasharray="4 4"/>';
    }
    s += '</svg>';
    box.innerHTML = s;
  }
  function userLevel() {
    var lv = -1;
    ['math', 'phys'].forEach(function (s) {
      var n = nextInPlan(s);
      if (n && (S.d.tests[s] || S.d.plan[s])) lv = Math.max(lv, n.level);
    });
    if (lv < 0 && S.d.last && byId[S.d.last]) lv = byId[S.d.last].level;
    return lv;
  }
  function streak() {
    var n = 0, d = new Date();
    for (;;) {
      var k = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      if (S.d.days[k]) n++; else if (n > 0 || k !== today()) break;
      d.setDate(d.getDate() - 1);
      if (n > 3650) break;
    }
    return n;
  }

  // ---------- карта курса ----------
  VIEWS.map = function (arg) {
    var parts = arg.split('.');
    var subj = SUBJ[parts[0]] ? parts[0] : 'math';
    var focus = parts[1];
    var list = subjTopics(subj);
    var next = nextInPlan(subj);
    var h = '<div class="sheet"><div class="map-head"><div class="stack" style="gap:10px"><div class="eyebrow">Программа курса</div><h1 class="h1">' + SUBJ[subj].name + '</h1><p class="lead" style="margin:0">' + SUBJ[subj].lead + '</p></div>' +
      '<div class="subj-tabs"><a href="#map.math" class="' + (subj === 'math' ? 'on' : '') + '">Математика</a><a href="#map.phys" class="' + (subj === 'phys' ? 'on' : '') + '">Физика</a></div></div>';
    h += '<div class="row ui" style="margin-top:18px;font-size:14px;color:var(--ink-2)"><span class="chip">' + plural(list.length, 'тема', 'темы', 'тем') + '</span><span class="chip">≈ ' + list.reduce(function (s, t) { return s + t.hours; }, 0) + ' ч занятий</span><span class="chip ok">пройдено ' + pct(list) + '%</span>' +
      (next ? '<span class="chip pen">следующая: ' + esc(strip(next.title)) + '</span>' : '') + '</div>';
    LEVELS[subj].forEach(function (L, lv) {
      var lt = levelTopics(subj, lv);
      h += '<section class="level" id="lv-' + lv + '"><div class="level-side"><span class="level-num">' + lv + '</span><span class="level-name">' + L.name + '</span><span class="level-sub">' + L.sub + ' · ' + plural(lt.length, 'тема', 'темы', 'тем') + '</span><span class="level-about">' + L.about + '</span>' +
        (lt.length ? '<span class="bar" style="margin-top:6px"><i style="width:' + pct(lt) + '%"></i></span>' : '') + '</div><div>';
      if (!lt.length) h += '<div class="empty">Темы этого уровня готовятся.</div>';
      var mods = [];
      lt.forEach(function (t) { var m = mods.filter(function (x) { return x.name === t.module; })[0]; if (!m) { m = { name: t.module, list: [] }; mods.push(m); } m.list.push(t); });
      mods.forEach(function (m) {
        h += '<div class="mod"><div class="mod-h">' + esc(m.name) + '</div><div class="cards">';
        m.list.forEach(function (t) { h += topicCard(t, next && next.id === t.id); });
        h += '</div></div>';
      });
      h += '</div></section>';
    });
    h += '</div>';
    view.innerHTML = h;
    if (focus) setTimeout(function () { var e = $('#lv-' + focus); if (e) e.scrollIntoView({ block: 'start' }); }, 0);
  };
  function topicCard(t, isNext) {
    var st = topicStatus(t);
    var sc = solvedCount(t);
    return '<a class="tcard ' + st + (isNext ? ' next' : '') + '" href="#topic.' + t.id + '"><span class="tt">' + t.title + '</span>' +
      (t.tasks.length ? '<span class="bar"><i style="width:' + Math.round(100 * (st === 'known' ? 1 : sc / t.tasks.length)) + '%"></i></span>' : '') +
      '<span class="meta"><span>≈ ' + t.hours + ' ч</span><span>' + sc + '/' + t.tasks.length + ' задач</span><span class="st" title="' + ST_LABEL[st] + '">' + ICON[st] + '</span></span></a>';
  }

  // ---------- страница темы ----------
  VIEWS.topic = function (id) {
    var t = byId[id];
    if (!t) { view.innerHTML = '<div class="narrow empty">Такой темы нет. <a href="#map.math">К программе</a></div>'; return; }
    S.d.last = t.id;
    var st = S.topic(t.id); st.seen = st.seen || Date.now(); S.save();
    var subjList = subjTopics(t.subject);
    var pos = subjList.indexOf(t);
    var prev = subjList[pos - 1], next = subjList[pos + 1];
    var L = LEVELS[t.subject][t.level];
    var h = '<div class="topic"><article style="min-width:0">';
    h += '<header class="topic-head"><div class="crumbs"><a href="#map.' + t.subject + '">' + SUBJ[t.subject].name + '</a><span>›</span><a href="#map.' + t.subject + '.' + t.level + '">' + L.name + ' (' + L.sub + ')</a><span>›</span><span>' + esc(t.module) + '</span></div>' +
      '<h1>' + t.title + '</h1>' + (t.summary ? '<p class="lead" style="margin:0">' + t.summary + '</p>' : '') +
      '<div class="topic-meta"><span>≈ ' + t.hours + ' ч</span><span>' + plural(t.tasks.length, 'задача', 'задачи', 'задач') + '</span><span id="t-status"></span><span class="row" style="gap:6px" id="t-btns"></span></div>';
    var pre = t.prereq.map(function (p) { var q = byId[p]; return q ? '<a href="#topic.' + q.id + '">' + q.title + '</a>' : ''; }).filter(Boolean);
    if (pre.length) h += '<div class="prereq">Опирается на: ' + pre.join(', ') + '</div>';
    h += '</header><div class="prose" id="prose" style="margin-top:26px">' + t.html + '</div>';
    h += '<section class="tasks-sec" id="tasks"><div class="tasks-head"><h2 class="h2">Задачи</h2><span class="ui muted" id="t-solved"></span></div></section>';
    h += '<nav class="pager">' + (prev ? '<a href="#topic.' + prev.id + '"><span>← Предыдущая</span>' + prev.title + '</a>' : '') + (next ? '<a class="nx" href="#topic.' + next.id + '"><span>Следующая →</span>' + next.title + '</a>' : '') + '</nav>';
    h += '</article><aside class="toc"><div class="toc-box"><div class="eyebrow">Содержание</div><div class="toc-list">' +
      t.toc.map(function (s) { return '<a href="#" data-to="' + s.id + '">' + esc(s.title) + '</a>'; }).join('') + '<a href="#" data-to="tasks">Задачи (' + t.tasks.length + ')</a></div></div>' +
      '<div class="toc-box"><div class="eyebrow">Прогресс по теме</div><span class="bar"><i id="toc-bar"></i></span><span class="muted" id="toc-txt"></span></div></aside></div>';
    view.innerHTML = h;
    var sec = $('#tasks');
    if (!t.tasks.length) sec.appendChild(el('div', 'empty', 'Задачи к этой теме готовятся.'));
    t.tasks.forEach(function (k, i) { sec.appendChild(taskEl(k, i + 1, { mode: 'learn', onChange: refreshTopicStatus })); });
    $$('.toc-list a').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); var target = document.getElementById(a.getAttribute('data-to')); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });
    refreshTopicStatus();
    spyToc();
    function refreshTopicStatus() {
      var s = topicStatus(t), sc = solvedCount(t);
      $('#t-status').innerHTML = '<span class="chip ' + (s === 'done' || s === 'known' ? 'ok' : s === 'started' ? 'pen' : '') + '">' + ST_LABEL[s] + '</span>';
      $('#t-solved').textContent = 'решено ' + sc + ' из ' + t.tasks.length;
      $('#toc-bar').style.width = (t.tasks.length ? Math.round(100 * sc / t.tasks.length) : 0) + '%';
      $('#toc-txt').textContent = 'Решено ' + sc + ' из ' + t.tasks.length + '. Для зачёта нужно ' + Math.ceil(t.tasks.length * 0.7) + '.';
      var b = $('#t-btns');
      var stt = S.topic(t.id);
      b.innerHTML = '';
      if (stt.known || stt.done) {
        var u = el('button', 'btn sm ghost', 'Снять отметку'); u.type = 'button';
        u.onclick = function () { delete stt.known; delete stt.done; S.save(); refreshTopicStatus(); updateCounts(); };
        b.appendChild(u);
      } else {
        var k = el('button', 'btn sm', 'Я это уже знаю'); k.type = 'button';
        k.onclick = function () { stt.known = Date.now(); S.save(); refreshTopicStatus(); updateCounts(); toast('Тема отмечена как известная. Её можно пропускать в маршруте.'); };
        var d = el('button', 'btn sm ghost', 'Отметить освоенной'); d.type = 'button';
        d.onclick = function () { stt.done = Date.now(); S.save(); refreshTopicStatus(); updateCounts(); };
        b.appendChild(k); b.appendChild(d);
      }
    }
  };
  var spyHandler = null;
  function spyToc() {
    if (spyHandler) window.removeEventListener('scroll', spyHandler);
    var links = $$('.toc-list a');
    if (!links.length) return;
    spyHandler = function () {
      var y = 120, cur = null;
      links.forEach(function (a) { var t = document.getElementById(a.getAttribute('data-to')); if (t && t.getBoundingClientRect().top < y) cur = a; });
      links.forEach(function (a) { a.classList.toggle('on', a === cur); });
    };
    window.addEventListener('scroll', spyHandler, { passive: true });
    spyHandler();
  }

  // ---------- задача ----------
  function taskEl(task, num, opts) {
    opts = opts || {};
    var test = opts.mode === 'test';
    var box = el('div', 'task');
    box.setAttribute('data-id', task.id);
    var rec = S.task(task.id);
    if (!test && rec && rec.s === 1) box.classList.add('solved');
    var head = '<div class="task-h"><span class="task-n">' + (opts.label || '№ ' + num) + '</span>' + dots(task.d || 1) +
      (opts.from ? '<a href="#topic.' + task.topic + '" class="muted" style="text-decoration:none">' + esc(strip(byId[task.topic] ? byId[task.topic].title : '')) + '</a>' : '') +
      '<span class="st"></span></div>';
    box.innerHTML = head + '<div class="task-q">' + task.q + '</div>';
    var stEl = $('.st', box);
    function showStatus() {
      if (test) return;
      var r = S.task(task.id);
      stEl.innerHTML = r ? (r.s === 1 ? '<span class="chip ok">решена</span>' : '<span class="chip bad">пока не решена</span>') : '';
    }
    showStatus();

    var fb = el('div', 'fb'); fb.setAttribute('aria-live', 'polite');
    var tools = el('div', 'task-tools');
    var extra = el('div', 'stack'); extra.style.gap = '10px';
    var wrong = 0;
    var answered = false;

    function done(ok, msg) {
      fb.className = 'fb ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = ok ? '✓ Верно' + (msg ? ' — ' + esc(msg) : '') : '✗ ' + esc(msg || 'Неверно') + (test ? '' : wrong >= 2 && task.hint ? '. Загляните в подсказку.' : '. Попробуйте ещё раз.');
      if (test) { answered = true; lock(); opts.onResult && opts.onResult(ok); return; }
      recordTask(task, ok);
      if (ok) box.classList.add('solved');
      showStatus();
      opts.onChange && opts.onChange(ok);
    }
    function lock() { $$('input, button.chk, button.idk', box).forEach(function (i) { i.disabled = true; }); }

    if (task.type === 'choice') {
      var multi = task.correct.length > 1;
      var list = el('div', 'opts');
      task.opts.forEach(function (o, i) {
        var id = 'o-' + task.id.replace(/[^\w]/g, '_') + '-' + i + (test ? '-t' : '');
        var lab = el('label', 'opt', '<input type="' + (multi ? 'checkbox' : 'radio') + '" name="g-' + task.id + (test ? '-t' : '') + '" value="' + i + '" id="' + id + '"><span>' + o + '</span>');
        list.appendChild(lab);
      });
      box.appendChild(list);
      if (multi) box.appendChild(el('div', 'fmt-hint', 'Верных вариантов несколько — отметьте все.'));
      var row = el('div', 'row');
      var b = el('button', 'btn pri chk', test ? 'Ответить' : 'Проверить'); b.type = 'button';
      b.onclick = function () {
        var sel = $$('input:checked', list).map(function (i) { return +i.value; });
        var r = Expr.check(task, sel.length ? sel : '');
        if (r.error) { fb.className = 'fb bad'; fb.textContent = r.error; return; }
        if (!r.ok) wrong++;
        if (!test || true) {
          $$('.opt', list).forEach(function (o, i) {
            o.classList.remove('right', 'wrong');
            var checked = sel.indexOf(i) >= 0;
            if (r.ok && checked) o.classList.add('right');
            else if (!r.ok && checked && task.correct.indexOf(i) < 0) o.classList.add('wrong');
          });
        }
        done(r.ok);
      };
      row.appendChild(b);
      if (test) row.appendChild(idkBtn());
      box.appendChild(row);
    } else if (task.type === 'self') {
      var row2 = el('div', 'row');
      var sb = el('button', 'btn', 'Решил(а) — показать ответ'); sb.type = 'button';
      sb.onclick = function () {
        sb.remove();
        var solBox = el('div', 'sol-box', '<span class="box-k">Решение</span>' + (task.sol || ''));
        extra.appendChild(solBox); renderMath(solBox); Widgets.mountAll(solBox);
        var y = el('button', 'btn pri sm', 'Сошлось'); y.type = 'button';
        var n = el('button', 'btn sm', 'Не сошлось'); n.type = 'button';
        y.onclick = function () { done(true); y.disabled = n.disabled = true; };
        n.onclick = function () { done(false, 'Разберите решение и вернитесь к задаче позже'); y.disabled = n.disabled = true; };
        row2.appendChild(y); row2.appendChild(n);
      };
      row2.appendChild(sb);
      box.appendChild(row2);
    } else {
      var inId = 'in-' + task.id.replace(/[^\w]/g, '_') + (test ? '-t' : '');
      var ans = el('div', 'ans');
      var inp = el('input', 'input'); inp.type = 'text'; inp.id = inId; inp.autocomplete = 'off'; inp.spellcheck = false;
      inp.setAttribute('autocapitalize', 'off');
      inp.placeholder = task.type === 'expr' || task.type === 'antider' ? 'f(x) = …' : task.type === 'set' ? 'например: -1; 2' : 'Ответ';
      inp.setAttribute('aria-label', 'Ответ к задаче');
      ans.appendChild(inp);
      if (task.unit) ans.appendChild(el('span', 'unit', esc(task.unit)));
      var cb = el('button', 'btn pri chk', test ? 'Ответить' : 'Проверить'); cb.type = 'button';
      ans.appendChild(cb);
      if (test) ans.appendChild(idkBtn());
      box.appendChild(ans);
      var pv = el('div', 'pv');
      box.appendChild(pv);
      box.appendChild(el('div', 'fmt-hint', TYPE_HINT[task.type] || ''));
      var pvTimer;
      inp.addEventListener('input', function () {
        clearTimeout(pvTimer);
        pvTimer = setTimeout(function () {
          var p = Expr.preview(task, inp.value);
          if (!p) { pv.innerHTML = ''; return; }
          if (p.error) { pv.innerHTML = '<span class="err">' + esc(p.error) + '</span>'; return; }
          pv.innerHTML = '<span class="lbl">Понял так:</span>' + tex(p.tex) + (task.unit ? ' <span class="lbl">' + esc(task.unit) + '</span>' : '');
          renderMath(pv);
        }, 160);
      });
      var go = function () {
        if (answered) return;
        var r = Expr.check(task, inp.value);
        if (r.error) { fb.className = 'fb bad'; fb.textContent = r.error; return; }
        if (!r.ok) wrong++;
        done(r.ok, r.ok ? null : r.msg);
      };
      cb.onclick = go;
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    }
    box.appendChild(fb);

    if (!test) {
      if (task.hint) {
        var hb = el('button', 'btn ghost sm', 'Подсказка'); hb.type = 'button';
        var hintBox = null;
        hb.onclick = function () {
          if (hintBox) { hintBox.remove(); hintBox = null; return; }
          hintBox = el('div', 'hint-box', '<span class="box-k">Подсказка</span>' + task.hint);
          extra.insertBefore(hintBox, extra.firstChild); renderMath(hintBox);
        };
        tools.appendChild(hb);
      }
      if (task.sol && task.type !== 'self') {
        var solB = el('button', 'btn ghost sm', 'Решение'); solB.type = 'button';
        var solBox2 = null;
        solB.onclick = function () {
          if (solBox2) { solBox2.remove(); solBox2 = null; return; }
          var r = S.task(task.id);
          if (!r || r.s !== 1) { S.d.tasks[task.id] = Object.assign(r || { s: 0, n: 0 }, { peek: 1 }); S.save(); }
          var ansLine = task.type === 'choice' ? '' : task.answer ? '<p><b>Ответ:</b> ' + answerTeX(task) + '</p>' : '';
          solBox2 = el('div', 'sol-box', '<span class="box-k">Решение</span>' + task.sol + ansLine);
          extra.appendChild(solBox2); renderMath(solBox2); Widgets.mountAll(solBox2);
        };
        tools.appendChild(solB);
      }
      if (tools.children.length) box.appendChild(tools);
    }
    box.appendChild(extra);
    function idkBtn() {
      var k = el('button', 'btn idk', 'Не знаю'); k.type = 'button';
      k.onclick = function () { if (answered) return; answered = true; fb.className = 'fb bad'; fb.textContent = 'Пропущено — это нормально, тест отметит тему для изучения.'; lock(); opts.onResult && opts.onResult(false, true); };
      return k;
    }
    renderMath(box);
    return box;
  }
  function answerTeX(task) {
    try {
      if (task.type === 'text') return esc(task.answer.split('|')[0]);
      var p = Expr.preview(Object.assign({}, task, { type: task.type === 'num' ? 'num-plain' : task.type }), task.answer);
      if (task.type === 'num') { var ast = Expr.parse(task.answer); return tex(Expr.toTeX(ast)) + (task.unit ? ' ' + esc(task.unit) : ''); }
      return p && p.tex ? tex(p.tex) + (task.unit ? ' ' + esc(task.unit) : '') : esc(task.answer);
    } catch (e) { return esc(task.answer); }
  }

  // ---------- тест уровня ----------
  var TS = null; // состояние идущего теста
  VIEWS.test = function (arg) {
    var tests = D.tests || {};
    if (arg && tests[arg]) {
      if (!TS || TS.subj !== arg || TS.finished) TS = { subj: arg, bi: 0, qi: 0, res: {}, streak: 0, finished: false, order: tests[arg].blocks.map(function (b) { return shuffle(b.tasks.slice()); }) };
      runTest();
      return;
    }
    if (arg && arg.indexOf('result-') === 0) { showResult(arg.slice(7)); return; }
    var h = '<div class="test-wrap"><div class="stack" style="gap:10px"><div class="eyebrow">Диагностика</div><h1 class="h1">Тест уровня</h1>' +
      '<p class="lead" style="margin:0">Тест идёт лестницей: от арифметики к университетским темам. Каждый блок — три вопроса. Два верных ответа — блок зачтён, идём выше. Два незачтённых блока подряд — тест заканчивается: вы нашли свою границу.</p></div>' +
      '<div class="panel stack"><b>Как получить честный результат</b><ul class="intro-list">' +
      '<li>Решайте на бумаге, калькулятор можно. Гуглить и подсматривать — нельзя: тест нужен вам, а не для оценки.</li>' +
      '<li>Если не помните, как решать, нажимайте «Не знаю». Угаданный ответ отправит вас дальше, чем нужно, и придётся возвращаться.</li>' +
      '<li>Задачи простые по формулировке: проверяется понимание идеи, а не скорость счёта.</li>' +
      '<li>Займёт 10–30 минут. Математику и физику можно пройти в разные дни.</li></ul></div><div class="cols2">';
    ['math', 'phys'].forEach(function (s) {
      var t = tests[s];
      var prev = S.d.tests[s];
      var nq = t ? t.blocks.length : 0;
      h += '<div class="panel stack"><div class="eyebrow">' + (s === 'math' ? 'Математика' : 'Физика') + '</div><div style="font-size:20px;font-weight:650">' + (t ? plural(nq, 'блок', 'блока', 'блоков') + ' · до ' + nq * 3 + ' вопросов' : 'Готовится') + '</div>' +
        (prev ? '<div class="ui muted" style="font-size:14px">Последний результат ' + new Date(prev.date).toLocaleDateString('ru-RU') + ': ' + esc(prev.summary || '') + '</div>' : '') +
        '<div class="row">' + (t ? '<a class="btn pri" href="#test.' + s + '">' + (prev ? 'Пройти заново' : 'Начать') + '</a>' : '') + (prev ? '<a class="btn" href="#test.result-' + s + '">Результат</a>' : '') + '</div></div>';
    });
    h += '</div>';
    h += '<div class="panel stack"><b>Не хочется тестироваться?</b><p style="margin:0" class="muted">Откройте программу и нажмите «Я это уже знаю» на знакомых темах — маршрут построится по этим отметкам. Но тест обычно точнее самооценки: многое кажется знакомым, пока не попробуешь решить.</p><div class="row"><a class="btn sm" href="#map.math">Программа по математике</a><a class="btn sm" href="#map.phys">Программа по физике</a></div></div></div>';
    view.innerHTML = h;
  };

  function runTest() {
    var T = D.tests[TS.subj];
    var blocks = T.blocks;
    if (TS.finished || TS.bi >= blocks.length) { finishTest(); return; }
    var B = blocks[TS.bi];
    var R = TS.res[B.id] || (TS.res[B.id] = { ok: 0, bad: 0, n: 0 });
    var task = TS.order[TS.bi][TS.qi];
    var h = '<div class="test-wrap"><div class="test-prog"><div class="row" style="justify-content:space-between"><span>Блок ' + (TS.bi + 1) + ' из ' + blocks.length + ' · <b>' + esc(B.title) + '</b></span><span>' + LEVELS[TS.subj][B.level].sub + '</span></div><div class="steps">';
    blocks.forEach(function (b, i) {
      var r = TS.res[b.id];
      h += '<i class="' + (i === TS.bi ? 'cur' : r && r.pass === true ? 'ok' : r && r.pass === false ? 'bad' : '') + '"></i>';
    });
    h += '</div></div><div id="tq"></div><div class="row" style="justify-content:space-between"><button class="btn ghost sm" id="t-stop" type="button">Закончить тест сейчас</button><button class="btn pri" id="t-next" type="button" hidden>Дальше →</button></div></div>';
    view.innerHTML = h;
    var card = taskEl(task, 0, {
      mode: 'test', label: 'Вопрос ' + (R.n + 1), onResult: function (ok) {
        R.n++; if (ok) R.ok++; else R.bad++;
        var need = Math.ceil(B.tasks.length * 2 / 3);
        if (R.ok >= need) R.pass = true;
        else if (R.bad > B.tasks.length - need) R.pass = false;
        $('#t-next').hidden = false; $('#t-next').focus();
      }
    });
    $('#tq').appendChild(card);
    renderMath(view);
    Widgets.mountAll(view);
    var first = $('input', card); if (first && first.type === 'text') first.focus();
    $('#t-next').onclick = function () {
      if (R.pass === undefined) { TS.qi++; runTest(); return; }
      TS.streak = R.pass ? 0 : TS.streak + 1;
      TS.bi++; TS.qi = 0;
      if (TS.streak >= 2) TS.finished = true;
      runTest();
      window.scrollTo(0, 0);
    };
    $('#t-stop').onclick = function () { TS.finished = true; finishTest(); };
  }

  function finishTest() {
    var T = D.tests[TS.subj];
    var res = {};
    var firstFail = null, maxPassLevel = -1;
    T.blocks.forEach(function (b) {
      var r = TS.res[b.id];
      if (!r || r.pass === undefined) return;
      res[b.id] = { ok: r.ok, n: r.n, pass: r.pass };
      if (!r.pass && !firstFail) firstFail = b;
      if (r.pass && !firstFail) maxPassLevel = Math.max(maxPassLevel, b.level);
    });
    var tested = Object.keys(res).length;
    if (!firstFail) {
      var nextB = T.blocks.filter(function (b) { return !res[b.id]; })[0];
      if (nextB && tested) firstFail = nextB;
    }
    var start = firstFail ? firstFail.start : null;
    var summary;
    if (!tested) summary = 'тест не пройден';
    else if (!firstFail) summary = 'все блоки зачтены';
    else summary = 'старт с темы «' + strip(byId[start] ? byId[start].title : firstFail.title) + '»';
    S.d.tests[TS.subj] = { date: Date.now(), res: res, start: start, maxLevel: maxPassLevel, summary: summary };
    S.save();
    TS.finished = true;
    go('test.result-' + TS.subj);
  }

  function showResult(subj) {
    var T = D.tests[subj], R = S.d.tests[subj];
    if (!T || !R) { view.innerHTML = '<div class="test-wrap empty">Результатов пока нет. <a href="#test">Пройти тест</a></div>'; return; }
    var startT = R.start && byId[R.start];
    var passed = T.blocks.filter(function (b) { return R.res[b.id] && R.res[b.id].pass; });
    var h = '<div class="test-wrap"><div class="verdict"><div class="eyebrow">Результат теста · ' + SUBJ[subj].name + '</div>';
    if (!Object.keys(R.res).length) h += '<div class="big">Тест прерван в самом начале</div><p class="muted">Начните с основ — так надёжнее.</p>';
    else if (!startT && !R.start) h += '<div class="big">Все блоки зачтены</div><p class="lead" style="margin:0">Сильный результат. Выбирайте темы старших курсов по интересу или по программе своей специальности.</p>';
    else {
      var lvName = R.maxLevel >= 0 ? LEVELS[subj][R.maxLevel].sub : null;
      h += '<div class="big">' + (lvName ? 'Уверенно — до уровня «' + lvName + '»' : 'Начинаем с основ') + '</div>' +
        '<p class="lead" style="margin:0">Начните с темы <a href="#topic.' + (startT ? startT.id : '') + '">' + (startT ? startT.title : '') + '</a>. Всё, что ниже по лестнице, у вас есть; дальше начинаются пробелы.</p>';
    }
    h += '</div><div class="panel"><div class="test-blocks">';
    T.blocks.forEach(function (b) {
      var r = R.res[b.id];
      h += '<div class="tb"><span class="lv">' + b.level + '</span><div><div class="nm">' + esc(b.title) + '</div><div class="ab">' + esc(b.about || LEVELS[subj][b.level].sub) + '</div></div>' +
        (r ? '<span class="chip ' + (r.pass ? 'ok' : 'bad') + '">' + (r.pass ? 'зачтено' : 'пробел') + ' · ' + r.ok + '/' + r.n + '</span>' : '<span class="chip">не проверялось</span>') + '</div>';
    });
    h += '</div></div><div class="panel stack"><b>Что дальше</b>' +
      '<p style="margin:0" class="muted">Отметьте зачтённые блоки как известные: соответствующие темы пропустятся в маршруте (' + plural(coveredTopics(passed).length, 'тема', 'темы', 'тем') + '). Отметку всегда можно снять на странице темы.</p>' +
      '<div class="row"><button class="btn pri" id="apply" type="button">Отметить и построить маршрут</button><a class="btn" href="#test.' + subj + '">Пройти заново</a>' + (startT ? '<a class="btn ghost" href="#topic.' + startT.id + '">Сразу к теме →</a>' : '') + '</div></div></div>';
    view.innerHTML = h;
    $('#apply').onclick = function () {
      coveredTopics(passed).forEach(function (id) { var st = S.topic(id); if (!st.done) st.known = st.known || Date.now(); });
      S.d.plan[subj] = Object.assign(S.d.plan[subj] || {}, { start: R.start || null });
      S.save(); updateCounts();
      toast('Готово: зачтённые темы отмечены, маршрут обновлён');
      go('plan');
    };
  }
  function coveredTopics(blocks) {
    var ids = [];
    blocks.forEach(function (b) { b.covers.forEach(function (c) { if (byId[c] && ids.indexOf(c) < 0) ids.push(c); }); });
    return ids;
  }

  // ---------- маршрут ----------
  function planFor(subj) {
    var P = S.d.plan[subj] || {};
    var list = subjTopics(subj);
    var startIdx = 0;
    if (P.start && byId[P.start]) startIdx = Math.max(0, list.indexOf(byId[P.start]));
    else if (S.d.tests[subj] && S.d.tests[subj].start && byId[S.d.tests[subj].start]) startIdx = list.indexOf(byId[S.d.tests[subj].start]);
    var target = P.target === undefined ? 5 : +P.target;
    var route = list.filter(function (t, i) { return i >= startIdx && t.level <= target; });
    return { start: list[startIdx], target: target, route: route, all: list };
  }
  function nextInPlan(subj) {
    var p = planFor(subj);
    return p.route.filter(function (t) { var s = topicStatus(t); return s !== 'known' && s !== 'done'; })[0] || null;
  }

  VIEWS.plan = function () {
    var hrs = +S.d.plan.hours || 6;
    var h = '<div class="narrow"><div class="stack" style="gap:10px"><div class="eyebrow">Мой маршрут</div><h1 class="h1">Что учить и в каком порядке</h1>' +
      '<p class="lead" style="margin:0">Маршрут начинается с темы, которую подсказал тест (или которую вы выбрали сами), и идёт по программе до выбранного уровня. Освоенные и зачтённые темы пропускаются.</p></div>';
    h += '<div class="panel settings" style="margin-top:22px"><label class="field" for="hpw">Часов занятий в неделю<input class="input" id="hpw" type="number" min="1" max="60" value="' + hrs + '"></label>' +
      '<div class="ui muted" style="font-size:14px">Реалистично для работающего взрослого — 4–8 часов: по часу в будни и пара часов в выходной.</div></div>';
    ['math', 'phys'].forEach(function (s) {
      var p = planFor(s);
      var left = p.route.filter(function (t) { var st = topicStatus(t); return st !== 'known' && st !== 'done'; });
      var leftH = left.reduce(function (a, t) { return a + t.hours * (1 - 0.8 * solvedCount(t) / Math.max(1, t.tasks.length)); }, 0);
      var weeks = Math.ceil(leftH / hrs);
      var eta = new Date(Date.now() + weeks * 7 * 864e5);
      h += '<section class="sec"><div class="sec-h"><h2 class="h2">' + SUBJ[s].name + '</h2>' + (S.d.tests[s] ? '<a class="btn ghost sm" href="#test.result-' + s + '">результат теста</a>' : '<a class="btn sm" href="#test.' + s + '">Пройти тест</a>') + '</div>';
      h += '<div class="settings"><label class="field" for="st-' + s + '">Начать с темы<select class="input" id="st-' + s + '" data-s="' + s + '">' +
        p.all.map(function (t) { return '<option value="' + t.id + '"' + (p.start === t ? ' selected' : '') + '>' + t.level + ' · ' + esc(strip(t.title)) + '</option>'; }).join('') + '</select></label>' +
        '<label class="field" for="tg-' + s + '">Дойти до уровня<select class="input" id="tg-' + s + '" data-s="' + s + '">' +
        LEVELS[s].map(function (L, i) { return '<option value="' + i + '"' + (p.target === i ? ' selected' : '') + '>' + i + ' · ' + L.name + ' (' + L.sub + ')</option>'; }).join('') + '</select></label></div>';
      h += '<div class="row ui" style="font-size:14.5px"><span class="chip">' + plural(left.length, 'тема осталась', 'темы осталось', 'тем осталось') + '</span><span class="chip">≈ ' + Math.round(leftH) + ' ч</span>' +
        (left.length ? '<span class="chip pen">≈ ' + plural(weeks, 'неделя', 'недели', 'недель') + ' — к ' + eta.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) + '</span>' : '<span class="chip ok">маршрут пройден</span>') + '</div>';
      h += '<div class="route">';
      var lastLv = -1, n = 0, curSet = false;
      p.route.forEach(function (t) {
        if (t.level !== lastLv) { h += '<div class="lvl-sep">' + t.level + ' · ' + LEVELS[s][t.level].name + ' · ' + LEVELS[s][t.level].sub + '</div>'; lastLv = t.level; }
        var st = topicStatus(t);
        var skip = st === 'known' || st === 'done';
        var cur = !skip && !curSet; if (cur) curSet = true;
        n++;
        h += '<a class="route-item' + (cur ? ' cur' : '') + '" href="#topic.' + t.id + '" style="' + (skip ? 'opacity:.55' : '') + '"><span class="rn">' + n + '</span><span><span class="rt">' + t.title + '</span><br><span class="rs">≈ ' + t.hours + ' ч · ' + solvedCount(t) + '/' + t.tasks.length + ' задач · ' + ST_LABEL[st] + '</span></span>' + ICON[st] + '</a>';
      });
      h += '</div></section>';
    });
    h += '</div>';
    view.innerHTML = h;
    $('#hpw').addEventListener('change', function () { S.d.plan.hours = Math.max(1, Math.min(60, +this.value || 6)); S.save(); route(); });
    $$('select[data-s]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var s = sel.getAttribute('data-s');
        var P = S.d.plan[s] = S.d.plan[s] || {};
        if (sel.id.indexOf('st-') === 0) P.start = sel.value; else P.target = +sel.value;
        S.save(); route();
      });
    });
  };

  // ---------- тренировка ----------
  var PR = { mode: 'mix', subj: 'math', level: 0, topic: '', queue: [], i: 0, ok: 0, n: 0 };
  function reviewList() {
    return Object.keys(S.d.tasks).filter(function (id) { var r = S.d.tasks[id]; return TASKS[id] && (r.s !== 1 && (r.w || r.peek)); });
  }
  VIEWS.practice = function () {
    var h = '<div class="narrow"><div class="stack" style="gap:10px"><div class="eyebrow">Тренировка</div><h1 class="h1">Задачи вперемешку</h1>' +
      '<p class="lead" style="margin:0">Решение задач без подсказки из соседнего абзаца — лучший способ проверить, что тема действительно усвоена.</p></div>';
    h += '<div class="panel settings" style="margin-top:22px"><label class="field" for="pm">Режим<select class="input" id="pm">' +
      [['mix', 'Повторение: по начатым и освоенным темам'], ['review', 'Работа над ошибками (' + reviewList().length + ')'], ['level', 'Случайные задачи уровня'], ['topic', 'Одна тема']].map(function (o) { return '<option value="' + o[0] + '"' + (PR.mode === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
      '<label class="field" for="ps">Предмет<select class="input" id="ps"><option value="math"' + (PR.subj === 'math' ? ' selected' : '') + '>Математика</option><option value="phys"' + (PR.subj === 'phys' ? ' selected' : '') + '>Физика</option><option value="all"' + (PR.subj === 'all' ? ' selected' : '') + '>Оба предмета</option></select></label>' +
      '<label class="field" for="pl"' + (PR.mode === 'level' ? '' : ' hidden') + '>Уровень<select class="input" id="pl">' + LEVELS.math.map(function (L, i) { return '<option value="' + i + '"' + (PR.level === i ? ' selected' : '') + '>' + i + ' · ' + L.sub + '</option>'; }).join('') + '</select></label>' +
      '<label class="field" for="pt"' + (PR.mode === 'topic' ? '' : ' hidden') + '>Тема<select class="input" id="pt">' + TOPICS.filter(function (t) { return PR.subj === 'all' || t.subject === PR.subj; }).map(function (t) { return '<option value="' + t.id + '"' + (PR.topic === t.id ? ' selected' : '') + '>' + t.level + ' · ' + esc(strip(t.title)) + '</option>'; }).join('') + '</select></label>' +
      '<button class="btn pri" id="pgo" type="button">Начать</button></div><div id="parea" class="stack" style="margin-top:22px"></div></div>';
    view.innerHTML = h;
    var pm = $('#pm'), ps = $('#ps');
    pm.onchange = function () { PR.mode = pm.value; route(); };
    ps.onchange = function () { PR.subj = ps.value; route(); };
    $('#pl').onchange = function () { PR.level = +this.value; };
    $('#pt').onchange = function () { PR.topic = this.value; };
    $('#pgo').onclick = function () {
      PR.level = +$('#pl').value; PR.topic = $('#pt').value;
      PR.queue = buildQueue(); PR.i = 0; PR.ok = 0; PR.n = 0;
      showPractice();
    };
    if (PR.queue.length && PR.i < PR.queue.length) showPractice();
  };
  function buildQueue() {
    var inSubj = function (t) { return PR.subj === 'all' || t.subject === PR.subj; };
    var ids = [];
    if (PR.mode === 'review') ids = reviewList().filter(function (id) { return inSubj(byId[TASKS[id].topic]); });
    else {
      var topics = TOPICS.filter(inSubj).filter(function (t) {
        if (PR.mode === 'mix') return topicStatus(t) !== 'new';
        if (PR.mode === 'level') return t.level === PR.level;
        return t.id === PR.topic;
      });
      topics.forEach(function (t) { t.tasks.forEach(function (k) { ids.push(k.id); }); });
      // нерешённые вперёд
      ids = shuffle(ids).sort(function (a, b) { var ra = S.d.tasks[a], rb = S.d.tasks[b]; return (ra && ra.s === 1 ? 1 : 0) - (rb && rb.s === 1 ? 1 : 0); });
    }
    return ids.slice(0, 20);
  }
  function showPractice() {
    var area = $('#parea');
    if (!area) return;
    area.innerHTML = '';
    if (!PR.queue.length) {
      area.innerHTML = '<div class="empty">' + (PR.mode === 'mix' ? 'Пока нет начатых тем. Откройте любую тему из программы — её задачи появятся здесь.' : PR.mode === 'review' ? 'Ошибок нет — нечего исправлять.' : 'Здесь пока нет задач.') + '</div>';
      return;
    }
    if (PR.i >= PR.queue.length) {
      area.innerHTML = '<div class="panel stack"><div class="h2">Серия закончена</div><p style="margin:0">Верно с первой попытки: ' + PR.ok + ' из ' + PR.n + '.</p><div class="row"><button class="btn pri" id="again" type="button">Ещё серию</button></div></div>';
      $('#again').onclick = function () { PR.queue = buildQueue(); PR.i = 0; PR.ok = 0; PR.n = 0; showPractice(); };
      return;
    }
    var task = TASKS[PR.queue[PR.i]];
    var top = el('div', 'row ui', '<span class="muted" style="font-size:14px">Задача ' + (PR.i + 1) + ' из ' + PR.queue.length + ' · верно с первой попытки: ' + PR.ok + '</span>');
    area.appendChild(top);
    var first = true;
    var card = taskEl(task, PR.i + 1, { mode: 'learn', from: true, onChange: function (ok) { if (first) { PR.n++; if (ok) PR.ok++; first = false; } nb.hidden = false; } });
    area.appendChild(card);
    var nb = el('button', 'btn pri', 'Следующая задача →'); nb.type = 'button'; nb.hidden = true;
    var skip = el('button', 'btn ghost', 'Пропустить'); skip.type = 'button';
    var row = el('div', 'row'); row.appendChild(skip); row.appendChild(nb);
    area.appendChild(row);
    nb.onclick = skip.onclick = function () { PR.i++; showPractice(); };
    Widgets.mountAll(card);
  }

  // ---------- справочник ----------
  var CONSTANTS = [
    ['Скорость света в вакууме', 'c', '2{,}998\\cdot10^{8}\\ \\text{м/с}'],
    ['Гравитационная постоянная', 'G', '6{,}674\\cdot10^{-11}\\ \\text{Н·м}^2/\\text{кг}^2'],
    ['Ускорение свободного падения', 'g', '9{,}81\\ \\text{м/с}^2'],
    ['Постоянная Планка', 'h', '6{,}626\\cdot10^{-34}\\ \\text{Дж·с}'],
    ['Приведённая постоянная Планка', '\\hbar', '1{,}055\\cdot10^{-34}\\ \\text{Дж·с}'],
    ['Элементарный заряд', 'e', '1{,}602\\cdot10^{-19}\\ \\text{Кл}'],
    ['Масса электрона', 'm_e', '9{,}109\\cdot10^{-31}\\ \\text{кг}'],
    ['Масса протона', 'm_p', '1{,}673\\cdot10^{-27}\\ \\text{кг}'],
    ['Атомная единица массы', '\\text{а.е.м.}', '1{,}661\\cdot10^{-27}\\ \\text{кг} = 931{,}5\\ \\text{МэВ}/c^2'],
    ['Постоянная Больцмана', 'k', '1{,}381\\cdot10^{-23}\\ \\text{Дж/К}'],
    ['Число Авогадро', 'N_A', '6{,}022\\cdot10^{23}\\ \\text{моль}^{-1}'],
    ['Универсальная газовая постоянная', 'R', '8{,}314\\ \\text{Дж/(моль·К)}'],
    ['Электрическая постоянная', '\\varepsilon_0', '8{,}854\\cdot10^{-12}\\ \\text{Ф/м}'],
    ['Коэффициент в законе Кулона', 'k = \\frac{1}{4\\pi\\varepsilon_0}', '8{,}988\\cdot10^{9}\\ \\text{Н·м}^2/\\text{Кл}^2'],
    ['Магнитная постоянная', '\\mu_0', '1{,}257\\cdot10^{-6}\\ \\text{Гн/м}'],
    ['Постоянная Стефана — Больцмана', '\\sigma', '5{,}670\\cdot10^{-8}\\ \\text{Вт/(м}^2\\text{·К}^4)'],
    ['Постоянная Вина', 'b', '2{,}898\\cdot10^{-3}\\ \\text{м·К}'],
    ['Постоянная Ридберга', 'R_\\infty', '1{,}097\\cdot10^{7}\\ \\text{м}^{-1}'],
    ['Боровский радиус', 'a_0', '5{,}292\\cdot10^{-11}\\ \\text{м}'],
    ['Электронвольт', '1\\ \\text{эВ}', '1{,}602\\cdot10^{-19}\\ \\text{Дж}'],
    ['Нормальное атмосферное давление', 'p_0', '1{,}013\\cdot10^{5}\\ \\text{Па}'],
    ['Масса Земли / радиус Земли', 'M_З,\\ R_З', '5{,}97\\cdot10^{24}\\ \\text{кг},\\ 6{,}37\\cdot10^{6}\\ \\text{м}']
  ];
  var PREFIX = [['тера', 'Т', '10^{12}'], ['гига', 'Г', '10^{9}'], ['мега', 'М', '10^{6}'], ['кило', 'к', '10^{3}'], ['санти', 'с', '10^{-2}'], ['милли', 'м', '10^{-3}'], ['микро', 'мк', '10^{-6}'], ['нано', 'н', '10^{-9}'], ['пико', 'п', '10^{-12}']];
  var GREEKS = [['\\alpha', 'альфа'], ['\\beta', 'бета'], ['\\gamma\\ \\Gamma', 'гамма'], ['\\delta\\ \\Delta', 'дельта'], ['\\varepsilon', 'эпсилон'], ['\\zeta', 'дзета'], ['\\eta', 'эта'], ['\\theta\\ \\Theta', 'тета'], ['\\lambda\\ \\Lambda', 'лямбда'], ['\\mu', 'мю'], ['\\nu', 'ню'], ['\\xi', 'кси'], ['\\pi\\ \\Pi', 'пи'], ['\\rho', 'ро'], ['\\sigma\\ \\Sigma', 'сигма'], ['\\tau', 'тау'], ['\\varphi\\ \\Phi', 'фи'], ['\\chi', 'хи'], ['\\psi\\ \\Psi', 'пси'], ['\\omega\\ \\Omega', 'омега']];

  VIEWS.ref = function (arg) {
    var subj = arg === 'phys' ? 'phys' : arg === 'const' ? 'const' : 'math';
    var h = '<div class="sheet"><div class="map-head"><div class="stack" style="gap:10px"><div class="eyebrow">Справочник</div><h1 class="h1">Формулы и константы</h1><p class="lead" style="margin:0">Главные формулы всех тем в одном месте — для повторения перед задачами и для быстрого поиска.</p></div>' +
      '<div class="subj-tabs"><a href="#ref.math" class="' + (subj === 'math' ? 'on' : '') + '">Математика</a><a href="#ref.phys" class="' + (subj === 'phys' ? 'on' : '') + '">Физика</a><a href="#ref.const" class="' + (subj === 'const' ? 'on' : '') + '">Константы</a></div></div>';
    h += '<div class="ref" style="margin-top:24px">';
    if (subj === 'const') {
      h += '<h2 class="h2">Физические постоянные</h2><div class="tbl"><table><thead><tr><th>Величина</th><th>Обозначение</th><th>Значение</th></tr></thead><tbody>' +
        CONSTANTS.map(function (c) { return '<tr><td>' + c[0] + '</td><td>' + tex(c[1]) + '</td><td>' + tex(c[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      h += '<div class="cols2" style="margin-top:20px"><div class="stack"><h2 class="h2">Приставки СИ</h2><div class="tbl"><table><thead><tr><th>Приставка</th><th>Обозн.</th><th>Множитель</th></tr></thead><tbody>' +
        PREFIX.map(function (p) { return '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td><td>' + tex(p[2]) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
        '<div class="stack"><h2 class="h2">Греческий алфавит</h2><div class="tbl"><table><tbody>' +
        GREEKS.map(function (g) { return '<tr><td>' + tex(g[0]) + '</td><td>' + g[1] + '</td></tr>'; }).join('') + '</tbody></table></div></div></div>';
    } else {
      h += '<label class="search" style="max-width:420px;margin:0" for="rf"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="rf" class="input" type="search" placeholder="Фильтр по названию темы"></label>';
      LEVELS[subj].forEach(function (L, lv) {
        var lt = levelTopics(subj, lv).filter(function (t) { return t.formulas.length; });
        if (!lt.length) return;
        h += '<details class="lv" open><summary><span class="hand">' + lv + '</span>' + L.name + ' <span class="muted ui" style="font-size:14px;font-weight:400">' + L.sub + '</span></summary>';
        lt.forEach(function (t) {
          h += '<div class="ref-topic" data-name="' + esc(strip(t.title).toLowerCase()) + '"><h4><a href="#topic.' + t.id + '">' + t.title + '</a></h4><ul>' + t.formulas.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul></div>';
        });
        h += '</details>';
      });
    }
    h += '</div></div>';
    view.innerHTML = h;
    var rf = $('#rf');
    if (rf) rf.addEventListener('input', function () {
      var q = rf.value.trim().toLowerCase();
      $$('.ref-topic').forEach(function (r) { r.hidden = q && r.getAttribute('data-name').indexOf(q) < 0; });
    });
  };

  // ---------- инструменты ----------
  VIEWS.tools = function () {
    var h = '<div class="sheet"><div class="stack" style="gap:10px"><div class="eyebrow">Инструменты</div><h1 class="h1">Графики и калькулятор</h1><p class="lead" style="margin:0">Постройте график любой функции, чтобы проверить себя: где корни, где максимум, как ведёт себя функция на бесконечности. Перетаскивайте поле мышью, колесо — масштаб.</p></div>';
    h += '<section class="sec"><h2 class="h2">Графопостроитель</h2><div class="widget" data-w="plotter" data-a=""></div></section>';
    h += '<section class="sec"><h2 class="h2">Калькулятор выражений</h2><div class="panel stack"><label class="field" for="calc">Выражение<input class="input" id="calc" type="text" value="sqrt(2)*sin(pi/4) + ln(e^3)" autocomplete="off" spellcheck="false"></label><div class="calc-out" id="calc-out"></div><div class="fmt-hint">Тот же синтаксис, что и в ответах к задачам. Углы — в радианах.</div></div></section>';
    h += '</div>';
    view.innerHTML = h;
    var c = $('#calc'), out = $('#calc-out');
    var upd = function () {
      try {
        var ast = Expr.parse(c.value);
        var v = Expr.compile(ast)({});
        out.innerHTML = tex(Expr.toTeX(ast) + ' = ' + Expr.prettyNum(v).replace(',', '{,}').replace('−', '-') + (Number.isInteger(v) || !isFinite(v) ? '' : ''));
        renderMath(out);
      } catch (e) { out.innerHTML = '<span class="ui" style="font-size:15px;color:var(--amber)">' + esc(e.message) + '</span>'; }
    };
    c.addEventListener('input', upd); upd();
  };

  // ---------- как пользоваться ----------
  VIEWS.help = function () {
    var rows = [
      ['3/4', '\\dfrac34', 'дробь'], ['-2,5  или  -2.5', '-2{,}5', 'десятичная дробь — с запятой или точкой'], ['2^10', '2^{10}', 'степень'], ['sqrt(2)', '\\sqrt2', 'квадратный корень'],
      ['root(x, 3)  или  cbrt(x)', '\\sqrt[3]{x}', 'корень n-й степени'], ['pi, e', '\\pi,\\ e', 'константы'], ['2pi, 3x, 2sin(x)', '2\\pi,\\ 3x,\\ 2\\sin x', 'знак умножения можно не писать'],
      ['sin(x), cos, tg, ctg', '\\sin x', 'тригонометрия (аргумент в радианах)'], ['arcsin, arccos, arctg', '\\operatorname{arctg} x', 'обратные функции'], ['sin^2(x)', '\\sin^2 x', 'квадрат синуса'],
      ['ln(x), lg(x), log_2(8), log(3, 9)', '\\ln x,\\ \\lg x,\\ \\log_2 8', 'логарифмы'], ['e^(-x)  или  exp(-x)', 'e^{-x}', 'экспонента'], ['abs(x)  или  |x|', '|x|', 'модуль'],
      ['5!, C(5,2), A(5,2)', '5!,\\ C_5^2,\\ A_5^2', 'факториал, сочетания, размещения'], ['3e8', '3\\cdot10^8', 'запись с порядком'], ['inf, -inf', '\\pm\\infty', 'бесконечность (для пределов)'],
      ['-2; 3', 'x_1=-2,\\ x_2=3', 'несколько ответов — через точку с запятой'], ['нет', '\\varnothing', 'решений нет'], ['3-4i', '3-4i', 'комплексное число']
    ];
    var h = '<div class="narrow stack"><div class="eyebrow">Помощь</div><h1 class="h1">Как пользоваться сайтом</h1>' +
      '<p class="lead" style="margin:0">Сайт — это программа самостоятельного обучения математике и физике от 5 класса до 5 курса технического вуза. Всё работает в браузере, регистрация не нужна.</p>' +
      '<section class="sec"><h2 class="h2">Порядок работы</h2><div class="prose" style="margin-left:22px"><ol>' +
      '<li><b>Определите уровень.</b> <a href="#test">Тест</a> идёт от простого к сложному и останавливается там, где начинаются пробелы.</li>' +
      '<li><b>Постройте маршрут.</b> На странице <a href="#plan">«Мой маршрут»</a> выберите стартовую тему и цель — например, «2 курс». Сайт покажет темы по порядку и сроки.</li>' +
      '<li><b>Читайте с тетрадью.</b> Переписывайте определения своими словами, повторяйте примеры сами, не подглядывая в решение.</li>' +
      '<li><b>Решайте задачи.</b> Ответ проверяется сразу. Подсказка — если застряли больше чем на 10 минут; решение — после своей попытки.</li>' +
      '<li><b>Возвращайтесь.</b> Раз в неделю устраивайте <a href="#practice">тренировку</a>: задачи вперемешку из пройденных тем и работа над ошибками.</li></ol></div></section>' +
      '<section class="sec"><h2 class="h2">Как вводить ответы</h2><p style="margin:0" class="muted">Под полем ввода сайт показывает, как он понял ваш ответ, — проверяйте скобки по этой строке. Ответ можно дать выражением: <code>sqrt(3)/2</code> засчитается так же, как <code>0,866</code>. Если в условии сказано «округлите», округляйте как просят.</p>' +
      '<div class="tbl ref"><table class="syntax"><thead><tr><th>Пишите</th><th>Получится</th><th>Что это</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + tex(r[1]) + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div></section>' +
      '<section class="sec"><h2 class="h2">Где хранится прогресс</h2><p style="margin:0">В вашем браузере, на этом устройстве. Чтобы перенести его на другой компьютер, на странице <a href="#progress">«Прогресс»</a> скопируйте код прогресса и вставьте его там.</p></section>' +
      '<section class="sec"><h2 class="h2">Советы взрослому ученику</h2><div class="prose" style="margin-left:22px"><ul>' +
      '<li>Регулярность важнее объёма: 45 минут пять раз в неделю дают больше, чем пять часов в воскресенье.</li>' +
      '<li>Не перескакивайте через фундамент. Большинство трудностей с интегралами — это на самом деле трудности с дробями и степенями.</li>' +
      '<li>Математику учите чуть впереди физики: для механики 1 курса нужны производная и интеграл, для электродинамики — векторный анализ.</li>' +
      '<li>Если тема не идёт, вернитесь к темам из строки «Опирается на» в её начале.</li></ul></div></section></div>';
    view.innerHTML = h;
  };

  // ---------- прогресс ----------
  VIEWS.progress = function () {
    var solved = Object.keys(S.d.tasks).filter(function (k) { return S.d.tasks[k].s === 1; }).length;
    var tries = Object.keys(S.d.tasks).reduce(function (s, k) { return s + (S.d.tasks[k].n || 0); }, 0);
    var doneT = TOPICS.filter(function (t) { return topicStatus(t) === 'done'; });
    var knownT = TOPICS.filter(function (t) { return topicStatus(t) === 'known'; });
    var h = '<div class="sheet"><div class="stack" style="gap:10px"><div class="eyebrow">Статистика</div><h1 class="h1">Прогресс</h1></div>';
    h += '<section class="sec"><div class="stats">' + stat(solved, 'задач решено') + stat(tries, 'попыток всего') + stat(doneT.length, 'тем освоено') + stat(knownT.length, 'тем зачтено тестом или отметкой') + '</div></section>';
    h += '<section class="sec"><div class="sec-h"><h2 class="h2">Активность</h2><span class="ui muted" style="font-size:14px">решённые задачи по дням, последние 20 недель · серия: ' + plural(streak(), 'день', 'дня', 'дней') + '</span></div><div class="panel"><div class="heat" id="heat"></div></div></section>';
    h += '<section class="sec"><h2 class="h2">По уровням</h2><div class="cols2">';
    ['math', 'phys'].forEach(function (s) {
      h += '<div class="panel subj"><div class="subj-h"><h3>' + SUBJ[s].name + '</h3><span class="ui muted">' + pct(subjTopics(s)) + '%</span></div><div class="lv-rows">';
      LEVELS[s].forEach(function (L, i) {
        var lt = levelTopics(s, i); var p = pct(lt);
        h += '<a class="lv-row" href="#map.' + s + '.' + i + '"><span>' + L.short + '</span><span class="bar"><i style="width:' + p + '%"></i></span><span class="n">' + p + '%</span></a>';
      });
      h += '</div></div>';
    });
    h += '</div></section>';
    h += '<section class="sec"><h2 class="h2">Перенос и сброс</h2><div class="panel stack"><p style="margin:0" class="muted">Прогресс хранится только в этом браузере. Скопируйте код и вставьте его на другом устройстве, чтобы продолжить там.</p>' +
      '<textarea class="input" id="pcode" readonly></textarea><div class="row"><button class="btn" id="pcopy" type="button">Скопировать код</button></div>' +
      '<label class="field" for="pin">Вставьте код с другого устройства<textarea class="input" id="pin" placeholder="{&quot;v&quot;:1, …}"></textarea></label><div class="row"><button class="btn" id="pload" type="button">Загрузить прогресс</button><span id="pmsg" class="ui muted" style="font-size:14px"></span></div>' +
      '<div class="row" style="margin-top:8px"><button class="btn danger" id="preset" type="button">Удалить весь прогресс</button></div><div id="pconf"></div></div></section></div>';
    view.innerHTML = h;
    // тепловая карта
    var heat = $('#heat'), d = new Date();
    d.setDate(d.getDate() - (20 * 7 - 1) - ((d.getDay() + 6) % 7));
    var cells = '';
    for (var i = 0; i < 20 * 7 + ((new Date().getDay() + 6) % 7); i++) {
      var k = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      var n = S.d.days[k] || 0;
      cells += '<i class="' + (n ? 'l' + Math.min(4, Math.ceil(n / 3)) : '') + '" title="' + d.toLocaleDateString('ru-RU') + ': ' + n + '"></i>';
      d.setDate(d.getDate() + 1);
    }
    heat.innerHTML = cells;
    var code = JSON.stringify(S.d);
    $('#pcode').value = code;
    $('#pcopy').onclick = function () {
      var ta = $('#pcode');
      var fallback = function () { ta.focus(); ta.select(); toast('Код выделен — скопируйте его сочетанием Ctrl+C'); };
      try { navigator.clipboard.writeText(code).then(function () { toast('Код прогресса скопирован'); }, fallback); } catch (e) { fallback(); }
    };
    $('#pload').onclick = function () {
      try {
        var obj = JSON.parse($('#pin').value);
        if (!obj || typeof obj !== 'object' || !obj.tasks) throw new Error();
        S.d = Object.assign({ v: 1, tasks: {}, topics: {}, tests: {}, plan: { hours: 6 }, days: {}, last: null, theme: 'auto' }, obj);
        S.save(); applyTheme(); updateCounts(); toast('Прогресс загружен'); route();
      } catch (e) { $('#pmsg').textContent = 'Код не распознан: скопируйте его целиком, от { до }.'; }
    };
    $('#preset').onclick = function () {
      var c = $('#pconf');
      c.innerHTML = '<div class="confirm"><span>Удалить все решённые задачи, отметки и результаты тестов? Это нельзя отменить.</span><button class="btn sm danger" id="pyes" type="button">Да, удалить</button><button class="btn sm" id="pno" type="button">Отмена</button></div>';
      $('#pno').onclick = function () { c.innerHTML = ''; };
      $('#pyes').onclick = function () { var th = S.d.theme; S.d = null; try { localStorage.removeItem(KEY); } catch (e) { /* пусто */ } S.load(); S.d.theme = th; S.save(); updateCounts(); toast('Прогресс удалён'); route(); };
    };
  };

  // ---------- поиск ----------
  var IDX = null;
  function buildIndex() {
    IDX = TOPICS.map(function (t) {
      var d = document.createElement('div'); d.innerHTML = t.html;
      return { t: t, title: norm(strip(t.title)), sum: norm(strip(t.summary)), text: d.textContent.replace(/\s+/g, ' '), ntext: null, heads: t.toc.map(function (s) { return s.title; }) };
    });
    IDX.forEach(function (x) { x.ntext = norm(x.text); });
  }
  function norm(s) { return String(s).toLowerCase().replace(/ё/g, 'е'); }
  VIEWS.search = function () {
    var q = $('#q').value.trim();
    var h = '<div class="narrow"><div class="stack" style="gap:10px"><div class="eyebrow">Поиск</div><h1 class="h1">' + (q ? '«' + esc(q) + '»' : 'Что ищем?') + '</h1></div><div class="results" id="res" style="margin-top:20px"></div></div>';
    view.innerHTML = h;
    if (!q) { $('#res').innerHTML = '<div class="empty">Введите слово в строку поиска сверху: «производная», «Кирхгоф», «ряд Фурье»…</div>'; return; }
    if (!IDX) buildIndex();
    var words = norm(q).split(/\s+/).filter(Boolean);
    var found = [];
    IDX.forEach(function (x) {
      var score = 0;
      var all = true;
      words.forEach(function (w) {
        var stem = w.length > 5 ? w.slice(0, w.length - 2) : w;
        var inT = x.title.indexOf(stem) >= 0, inS = x.sum.indexOf(stem) >= 0, inX = x.ntext.indexOf(stem) >= 0;
        if (!inT && !inS && !inX) all = false;
        score += (inT ? 10 : 0) + (inS ? 4 : 0) + (inX ? 1 + Math.min(5, x.ntext.split(stem).length - 1) * 0.3 : 0);
      });
      if (all) found.push({ x: x, s: score });
    });
    found.sort(function (a, b) { return b.s - a.s; });
    var res = $('#res');
    if (!found.length) { res.innerHTML = '<div class="empty">Ничего не нашлось. Попробуйте другое слово или откройте <a href="#ref.math">справочник</a>.</div>'; return; }
    res.innerHTML = found.slice(0, 40).map(function (f) {
      var t = f.x.t;
      var w0 = words[0].length > 5 ? words[0].slice(0, words[0].length - 2) : words[0];
      var pos = f.x.ntext.indexOf(w0);
      var snip = pos >= 0 ? f.x.text.slice(Math.max(0, pos - 80), pos + 140) : strip(t.summary);
      snip = esc(snip);
      words.forEach(function (w) { var stem = w.length > 5 ? w.slice(0, w.length - 2) : w; snip = snip.replace(new RegExp('(' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
      return '<a class="res" href="#topic.' + t.id + '"><span class="rp">' + SUBJ[t.subject].name + ' · ' + LEVELS[t.subject][t.level].sub + ' · ' + esc(t.module) + '</span><span class="rt">' + t.title + '</span><span class="rx">…' + snip + '…</span></a>';
    }).join('');
  };
  var qTimer;
  $('#q').addEventListener('input', function () {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () {
      if (current.indexOf('search') === 0) { VIEWS.search(); renderMath(view); }
      else location.hash = 'search';
    }, 200);
  });
  $('#q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (current.indexOf('search') !== 0) location.hash = 'search'; else VIEWS.search(); } });

  // ---------- старт ----------
  var nT = TOPICS.reduce(function (s, t) { return s + t.tasks.length; }, 0);
  $('#foot-info').textContent = plural(TOPICS.length, 'тема', 'темы', 'тем') + ' · ' + plural(nT, 'задача', 'задачи', 'задач');
  applyTheme();
  updateCounts();
  route();
})();
