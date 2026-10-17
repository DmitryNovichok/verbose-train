// Сборка контента: content/**/*.md → data/content.js
// Запуск: node build/build.mjs   (зависимостей нет, нужен только Node 18+)
// Проверяет все формулы через KaTeX и все ответы задач через js/expr.js.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const katex = require(path.join(ROOT, 'vendor/katex/katex.min.js'));
const Expr = require(path.join(ROOT, 'js/expr.js'));
const MACROS = require(path.join(ROOT, 'js/tex-macros.js'));
const texFix = MACROS.__fix; delete MACROS.__fix;

const errors = [];
const warnings = [];
let texCount = 0;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function checkTex(tex, display, where) {
  texCount++;
  try {
    katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: 'ignore', macros: { ...MACROS } });
  } catch (e) {
    errors.push(`${where}: формула «${tex.slice(0, 80)}»: ${e.message.split('\n')[0]}`);
  }
}

// ---------- строчная разметка ----------
function inline(text, where) {
  // делим на формулы и обычный текст
  let out = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '\\' && text[i + 1] === '$') { out += '$'; i += 2; continue; }
    if (text[i] === '$') {
      const dbl = text[i + 1] === '$';
      const open = dbl ? 2 : 1;
      let j = i + open;
      while (j < text.length) {
        if (text[j] === '\\') { j += 2; continue; }
        if (text[j] === '$' && (!dbl || text[j + 1] === '$')) break;
        j++;
      }
      if (j >= text.length) { errors.push(`${where}: незакрытый $ в «${text.slice(i, i + 60)}»`); out += esc(text.slice(i)); break; }
      const tex = texFix(text.slice(i + open, j).trim());
      checkTex(tex, dbl, where);
      out += dbl ? `<span class="tex-d">${esc(tex)}</span>` : `<span class="tex">${esc(tex)}</span>`;
      i = j + open;
      continue;
    }
    // обычный текст до следующего $
    let j = i;
    while (j < text.length && text[j] !== '$' && !(text[j] === '\\' && text[j + 1] === '$')) j++;
    out += fmt(text.slice(i, j));
    i = j;
  }
  return out;
}

function fmt(s) {
  // сырой HTML-тег <br>, <sub>, <sup>, <kbd> разрешаем
  const keep = [];
  s = s.replace(/<(\/?)(br|sub|sup|kbd|u|s|small)\s*\/?>/g, (m) => { keep.push(m); return `\u0001${keep.length - 1}\u0001`; });
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\((#[^)\s]+)\)/g, '<a href="$2" class="in">$1</a>');
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\u0001(\d+)\u0001/g, (m, k) => keep[+k]);
  return s;
}

// ---------- блочная разметка ----------
const CALLOUTS = {
  def: 'Определение', thm: 'Теорема', note: 'Заметка', warn: 'Типичная ошибка', idea: 'Идея',
  example: 'Пример', formulas: 'Главные формулы', law: 'Закон', hist: 'Из истории', algo: 'Алгоритм', proof: 'Доказательство'
};

function slug(n) { return 's' + n; }

function blocks(lines, where, ctx) {
  // ctx: { toc: [], formulas: [], h2: counter }
  let html = '';
  let i = 0;
  const para = [];
  const flush = () => {
    if (para.length) { html += `<p>${inline(para.join(' '), where)}</p>\n`; para.length = 0; }
  };
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t) { flush(); i++; continue; }

    let m;
    if ((m = /^(#{2,4})\s+(.*)$/.exec(t))) {
      flush();
      const lvl = m[1].length;
      if (lvl === 2 && ctx.toc) {
        const id = slug(ctx.toc.length + 1);
        ctx.toc.push({ id, title: m[2].replace(/\$[^$]*\$/g, '').trim() });
        html += `<h2 id="${id}">${inline(m[2], where)}</h2>\n`;
      } else html += `<h${lvl}>${inline(m[2], where)}</h${lvl}>\n`;
      i++; continue;
    }
    if ((m = /^:::(\w+)\s*(.*)$/.exec(t))) {
      flush();
      const kind = m[1];
      const title = m[2];
      const inner = [];
      i++;
      let depth = 1;
      while (i < lines.length) {
        const tt = lines[i].trim();
        if (/^:::\w+/.test(tt)) depth++;
        else if (tt === ':::') { depth--; if (depth === 0) break; }
        inner.push(lines[i]);
        i++;
      }
      if (i >= lines.length) errors.push(`${where}: незакрытый блок :::${kind}`);
      i++;
      if (!CALLOUTS[kind] && kind !== 'solution' && kind !== 'details') warnings.push(`${where}: неизвестный блок :::${kind}`);
      if (kind === 'formulas' && ctx.formulas) {
        inner.forEach((l) => {
          const fm = /^\s*[-*]\s+(.*)$/.exec(l);
          if (fm) ctx.formulas.push(inline(fm[1], where));
        });
      }
      const body = blocks(inner, where, { ...ctx, toc: null, formulas: null });
      if (kind === 'solution' || kind === 'details') {
        html += `<details class="sol"><summary>${title ? inline(title, where) : 'Показать решение'}</summary>${body}</details>\n`;
      } else {
        const label = CALLOUTS[kind] || kind;
        html += `<div class="co co-${kind}"><div class="co-h"><span class="co-k">${label}</span>${title ? ' <span class="co-t">' + inline(title, where) + '</span>' : ''}</div><div class="co-b">${body}</div></div>\n`;
      }
      continue;
    }
    if (t.startsWith('$$')) {
      flush();
      let buf = t;
      if (!(t.length > 3 && t.endsWith('$$'))) {
        i++;
        while (i < lines.length && !lines[i].trim().endsWith('$$')) { buf += '\n' + lines[i]; i++; }
        if (i < lines.length) buf += '\n' + lines[i].trim();
        else errors.push(`${where}: незакрытая формула $$`);
      }
      const tex = texFix(buf.slice(2, -2).trim());
      checkTex(tex, true, where);
      html += `<div class="tex-d">${esc(tex)}</div>\n`;
      i++; continue;
    }
    if ((m = /^\[\[(\w[\w-]*)\s*(.*)\]\]$/.exec(t))) {
      flush();
      checkWidget(m[1], m[2], where);
      html += `<div class="widget" data-w="${esc(m[1])}" data-a="${esc(m[2])}"></div>\n`;
      i++; continue;
    }
    if (/^[-*]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
      flush();
      const ordered = /^\d+[.)]\s+/.test(t);
      const items = [];
      while (i < lines.length) {
        const l = lines[i];
        const lt = l.trim();
        const im = ordered ? /^\d+[.)]\s+(.*)$/.exec(lt) : /^[-*]\s+(.*)$/.exec(lt);
        if (im && !/^\s{2,}/.test(l)) { items.push(im[1]); i++; continue; }
        if (lt && /^\s{2,}/.test(l) && items.length) { items[items.length - 1] += ' ' + lt; i++; continue; }
        break;
      }
      const tag = ordered ? 'ol' : 'ul';
      html += `<${tag}>${items.map((it) => `<li>${inline(it, where)}</li>`).join('')}</${tag}>\n`;
      continue;
    }
    if (t.startsWith('|')) {
      flush();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
      const cells = (r) => {
        // делим по |, но не внутри $...$
        const out = []; let cur = ''; let inMath = false;
        const s = r.replace(/^\|/, '').replace(/\|$/, '');
        for (let k = 0; k < s.length; k++) {
          const c = s[k];
          if (c === '\\' && s[k + 1] === '|') { cur += '\\|'; k++; continue; }
          if (c === '$') inMath = !inMath;
          if (c === '|' && !inMath) { out.push(cur.trim()); cur = ''; continue; }
          cur += c;
        }
        out.push(cur.trim());
        return out;
      };
      let head = null; let body = rows;
      if (rows.length > 1 && /^\|?\s*:?-{2,}/.test(rows[1])) { head = cells(rows[0]); body = rows.slice(2); }
      html += '<div class="tbl"><table>';
      if (head) html += '<thead><tr>' + head.map((c) => `<th>${inline(c, where)}</th>`).join('') + '</tr></thead>';
      html += '<tbody>' + body.map((r) => '<tr>' + cells(r).map((c) => `<td>${inline(c, where)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>\n';
      continue;
    }
    if (t.startsWith('<')) {
      flush();
      let buf = '';
      while (i < lines.length && lines[i].trim()) { buf += lines[i] + '\n'; i++; }
      html += buf;
      continue;
    }
    para.push(t);
    i++;
  }
  flush();
  return html;
}

// ---------- проверка чертежей ----------
const WIDGETS = ['plot', 'plotter', 'unitcircle', 'tangent', 'riemann', 'taylor', 'fourier', 'projectile', 'charges', 'oscillator', 'vectors', 'complex', 'phase', 'binom', 'lens', 'implicit', 'curve'];
function checkWidget(name, args, where) {
  if (!WIDGETS.includes(name)) { errors.push(`${where}: неизвестный чертёж ${name}`); return; }
  const parts = args.split('|').map((x) => x.trim());
  const strip = (x) => x.replace(/^\s*[a-zA-Z]\s*(\([^)]*\))?\s*=\s*/, '');
  try {
    if (name === 'plot') {
      const params = [];
      parts.slice(2).forEach((p) => { if (/=/.test(p)) p.split(',').forEach((q) => { const mm = /^\s*(\w+)\s*=/.exec(q); if (mm) params.push(mm[1]); }); });
      parts[0].split(';').filter((x) => x.trim()).forEach((f) => Expr.parse(strip(f), { vars: ['x', ...params] }));
    } else if (name === 'tangent' || name === 'riemann') {
      Expr.parse(strip(parts[0]), { vars: ['x'] });
    } else if (name === 'implicit') {
      parts[0].split(';').forEach((f) => f.split('=').forEach((side) => Expr.parse(side, { vars: ['x', 'y'] })));
    } else if (name === 'curve') {
      parts[0].split(';').forEach((f) => Expr.parse(f, { vars: ['t'] }));
    }
    (parts[1] || '').split(/\s+/).filter(Boolean).forEach((x) => { if (name !== 'taylor' && name !== 'fourier' && name !== 'phase') Expr.evalNum(x); });
  } catch (e) {
    errors.push(`${where}: чертёж ${name} «${args.slice(0, 60)}»: ${e.message}`);
  }
}

// ---------- задачи ----------
const TYPES = ['num', 'set', 'tuple', 'expr', 'antider', 'cnum', 'choice', 'text', 'self'];

function parseTasks(lines, where, prefix, defTol) {
  const tasks = [];
  let cur = null;
  let field = null;
  const fin = () => {
    if (!cur) return;
    const tw = `${where} задача ${tasks.length + 1}`;
    const t = { id: `${prefix}:${tasks.length + 1}`, type: cur.type, d: cur.d, q: blocks(cur.q, tw, {}) };
    if (cur.answer !== undefined) t.answer = cur.answer.join(' ').trim();
    if (cur.tol) t.tol = cur.tol.join(' ').trim();
    if (cur.unit) t.unit = cur.unit.join(' ').trim();
    if (cur.vars) t.vars = cur.vars.join(' ').trim().split(/[\s,]+/);
    if (cur.range) t.range = cur.range.join(' ').trim().split(/[\s;]+/).map((x) => Expr.evalNum(x));
    if (cur.hint) t.hint = blocks(cur.hint, tw, {});
    if (cur.solution) t.sol = blocks(cur.solution, tw, {});
    else if (t.type !== 'self') warnings.push(`${tw}: нет решения`);
    if (cur.opts.length) {
      t.opts = cur.opts.map((o) => inline(o.text, tw));
      t.correct = cur.opts.map((o, k) => (o.ok ? k : -1)).filter((k) => k >= 0);
    }
    if (defTol) t.defTol = defTol;
    // проверки
    if (!TYPES.includes(t.type)) errors.push(`${tw}: неизвестный тип «${t.type}»`);
    if (t.type === 'choice') {
      if (!t.opts || !t.correct.length) errors.push(`${tw}: у выбора нет верного варианта (@opt*)`);
    } else if (t.type !== 'self') {
      if (!t.answer) errors.push(`${tw}: нет @answer`);
      else {
        try {
          if (t.type === 'num') {
            const v = Expr.evalNum(t.answer);
            if (Number.isNaN(v)) throw new Error('ответ не число');
            const r = Expr.check(t, t.answer);
            if (!r.ok) throw new Error('ответ не проходит собственную проверку');
          } else if (t.type === 'text') {
            // ничего
          } else {
            const r = Expr.check(t, t.answer);
            if (r.error) throw new Error(r.error);
            if (!r.ok) throw new Error('ответ не проходит собственную проверку');
          }
        } catch (e) {
          errors.push(`${tw}: ответ «${t.answer}»: ${e.message}`);
        }
      }
    }
    if (!t.q.trim()) errors.push(`${tw}: пустое условие`);
    tasks.push(t);
    cur = null;
  };
  for (const line of lines) {
    const t = line.trim();
    let m;
    if ((m = /^@task\s+(\w+)(?:\s+(\d))?\s*$/.exec(t))) {
      fin();
      cur = { type: m[1], d: m[2] ? +m[2] : 1, q: [], opts: [] };
      field = 'q';
      continue;
    }
    if (!cur) { if (t) warnings.push(`${where}: строка вне задачи: «${t.slice(0, 50)}»`); continue; }
    if ((m = /^@(answer|tol|unit|vars|range|hint|solution)\b\s?(.*)$/.exec(t))) {
      field = m[1];
      cur[field] = m[2] ? [m[2]] : [];
      continue;
    }
    if (/^@\w+/.test(t) && !/^@(answer|tol|unit|vars|range|hint|solution|opt\*?)\b/.test(t)) {
      errors.push(`${where} задача ${tasks.length + 1}: неизвестное поле «${t.split(/\s/)[0]}»`);
      continue;
    }
    if ((m = /^@opt(\*?)\s+(.*)$/.exec(t))) {
      cur.opts.push({ ok: m[1] === '*', text: m[2] });
      field = null;
      continue;
    }
    if (field === 'q') cur.q.push(line);
    else if (field) cur[field].push(line);
  }
  fin();
  return tasks;
}

// ---------- файлы ----------
function frontMatter(src, where) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!m) { errors.push(`${where}: нет шапки --- ... ---`); return { meta: {}, body: src }; }
  const meta = {};
  m[1].split('\n').forEach((l) => {
    const k = /^(\w+):\s*(.*)$/.exec(l);
    if (k) meta[k[1]] = k[2].trim();
  });
  return { meta, body: src.slice(m[0].length) };
}

function buildTopic(file, subject) {
  const where = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const { meta, body } = frontMatter(src, where);
  const parts = body.split(/^@tasks\s*$/m);
  const ctx = { toc: [], formulas: [] };
  const html = blocks(parts[0].split('\n'), where, ctx);
  const defTol = meta.tol || (subject === 'phys' ? '2%' : undefined);
  const tasks = parts[1] ? parseTasks(parts[1].split('\n'), where, meta.id, defTol) : [];
  if (!meta.id) errors.push(`${where}: нет id`);
  if (!tasks.length) warnings.push(`${where}: нет задач`);
  return {
    id: meta.id, subject, level: +meta.level, module: meta.module || '', title: meta.title, hours: +(meta.hours || 3),
    prereq: (meta.prereq || '').split(/[\s,]+/).filter(Boolean), summary: meta.summary ? inline(meta.summary, where) : '',
    html, toc: ctx.toc, formulas: ctx.formulas, tasks
  };
}

function buildTest(file) {
  const where = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const { meta, body } = frontMatter(src, where);
  const chunks = body.split(/^@block\s+/m).slice(1);
  const blocksOut = chunks.map((ch) => {
    const lines = ch.split('\n');
    const id = lines.shift().trim();
    const info = {};
    let k = 0;
    while (k < lines.length && !/^@task/.test(lines[k].trim())) {
      const mm = /^(\w+):\s*(.*)$/.exec(lines[k].trim());
      if (mm) info[mm[1]] = mm[2].trim();
      k++;
    }
    const tasks = parseTasks(lines.slice(k), `${where} блок ${id}`, `test-${meta.subject}-${id}`, meta.subject === 'phys' ? '3%' : undefined);
    return {
      id, title: info.title, level: +info.level, start: info.start,
      covers: (info.covers || '').split(/[\s,]+/).filter(Boolean), about: info.about || '', tasks
    };
  });
  return { subject: meta.subject, title: meta.title, blocks: blocksOut };
}

function main() {
  const topics = [];
  for (const subject of ['math', 'phys']) {
    const dir = path.join(ROOT, 'content', subject);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort().forEach((f) => topics.push(buildTopic(path.join(dir, f), subject)));
  }
  const ids = new Set();
  topics.forEach((t) => { if (ids.has(t.id)) errors.push(`повтор id ${t.id}`); ids.add(t.id); });
  topics.forEach((t) => t.prereq.forEach((p) => { if (!ids.has(p)) warnings.push(`${t.id}: неизвестная тема в prereq: ${p}`); }));
  // ссылки на темы внутри текста
  topics.forEach((t) => {
    const all = t.html + t.tasks.map((x) => (x.q || '') + (x.sol || '') + (x.hint || '')).join('');
    for (const m of all.matchAll(/href="#topic\.([\w-]+)"/g)) if (!ids.has(m[1])) warnings.push(`${t.id}: ссылка на несуществующую тему ${m[1]}`);
  });

  const tests = {};
  const tdir = path.join(ROOT, 'content', 'tests');
  if (fs.existsSync(tdir)) {
    fs.readdirSync(tdir).filter((f) => f.endsWith('.md')).sort().forEach((f) => {
      const t = buildTest(path.join(tdir, f));
      t.blocks.forEach((b) => {
        if (b.start && !ids.has(b.start)) warnings.push(`тест ${t.subject}/${b.id}: start=${b.start} — нет такой темы`);
        b.covers.forEach((c) => { if (!ids.has(c)) warnings.push(`тест ${t.subject}/${b.id}: covers ${c} — нет такой темы`); });
      });
      tests[t.subject] = t;
    });
  }

  const data = { built: new Date().toISOString().slice(0, 10), topics, tests };
  const out = '/* Сгенерировано build/build.mjs из папки content — не редактируйте вручную */\nwindow.MPDATA = ' + JSON.stringify(data) + ';\n';
  fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'data', 'content.js'), out);

  const nTasks = topics.reduce((s, t) => s + t.tasks.length, 0);
  const nTest = Object.values(tests).reduce((s, t) => s + t.blocks.reduce((a, b) => a + b.tasks.length, 0), 0);
  warnings.forEach((w) => console.log('предупреждение: ' + w));
  errors.forEach((e) => console.log('ОШИБКА: ' + e));
  console.log(`Тем: ${topics.length} (математика ${topics.filter((t) => t.subject === 'math').length}, физика ${topics.filter((t) => t.subject === 'phys').length}), задач: ${nTasks}, вопросов теста: ${nTest}, формул: ${texCount}, размер: ${(out.length / 1024).toFixed(0)} КБ`);
  if (errors.length) { console.log(`Ошибок: ${errors.length}`); process.exitCode = 1; }
}

main();
