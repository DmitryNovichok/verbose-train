/* Разбор и вычисление математических выражений, проверка ответов.
   Работает и в браузере (window.Expr), и в Node (сборщик проверяет ответы задач). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Expr = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FUNCS = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan, tg: Math.tan,
    cot: function (x) { return 1 / Math.tan(x); }, ctg: function (x) { return 1 / Math.tan(x); },
    sec: function (x) { return 1 / Math.cos(x); }, csc: function (x) { return 1 / Math.sin(x); },
    asin: Math.asin, arcsin: Math.asin, acos: Math.acos, arccos: Math.acos,
    atan: Math.atan, arctan: Math.atan, arctg: Math.atan,
    arcctg: function (x) { return Math.PI / 2 - Math.atan(x); }, arccot: function (x) { return Math.PI / 2 - Math.atan(x); },
    sinh: Math.sinh, sh: Math.sinh, cosh: Math.cosh, ch: Math.cosh, tanh: Math.tanh, th: Math.tanh,
    cth: function (x) { return 1 / Math.tanh(x); }, coth: function (x) { return 1 / Math.tanh(x); },
    arsh: Math.asinh, asinh: Math.asinh, arch: Math.acosh, acosh: Math.acosh, arth: Math.atanh, atanh: Math.atanh,
    ln: Math.log, lg: Math.log10, log2: Math.log2, log10: Math.log10,
    log: function (a, b) { return b === undefined ? Math.log(a) : Math.log(b) / Math.log(a); },
    exp: Math.exp, sqrt: Math.sqrt, cbrt: Math.cbrt,
    root: function (x, n) { return n === undefined ? Math.sqrt(x) : (x < 0 && n % 2 === 1 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n)); },
    abs: Math.abs, sign: Math.sign, sgn: Math.sign, floor: Math.floor, ceil: Math.ceil, round: Math.round,
    min: Math.min, max: Math.max,
    C: function (n, k) { return binom(n, k); }, binom: function (n, k) { return binom(n, k); },
    A: function (n, k) { return fact(n) / fact(n - k); },
    fact: function (n) { return fact(n); },
    heaviside: function (x) { return x >= 0 ? 1 : 0; }
  };
  var ARITY = { log: [1, 2], root: [1, 2], min: [1, 20], max: [1, 20], C: [2, 2], binom: [2, 2], A: [2, 2] };
  var CONSTS = { pi: Math.PI, e: Math.E, inf: Infinity, infinity: Infinity };
  var GREEK = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'rho', 'sigma', 'tau', 'phi', 'varphi', 'chi', 'psi', 'omega', 'Omega', 'Delta', 'Phi', 'Gamma'];

  function fact(n) {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    var r = 1; for (var i = 2; i <= n; i++) r *= i; return r;
  }
  function binom(n, k) {
    if (k < 0 || k > n) return 0;
    var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r);
  }

  function normalize(s) {
    s = String(s).trim();
    s = s.replace(/[−–—]/g, '-').replace(/[·×∙⋅]/g, '*').replace(/÷/g, '/').replace(/\*\*/g, '^')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/∞/g, 'inf')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/[{]/g, '(').replace(/[}]/g, ')');
    s = decimalCommas(s);
    // греческие буквы, набранные символами
    var gm = { 'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta', 'ε': 'epsilon', 'θ': 'theta', 'λ': 'lambda', 'μ': 'mu', 'ν': 'nu', 'ρ': 'rho', 'σ': 'sigma', 'τ': 'tau', 'φ': 'phi', 'ω': 'omega', 'Ω': 'Omega', 'Δ': 'Delta' };
    s = s.replace(/[αβγδεθλμνρστφωΩΔ]/g, function (c) { return ' ' + gm[c] + ' '; });
    return s;
  }

  // «1,5» → 1.5, но в C(5,2), log(2,8), min(1,2) запятая разделяет аргументы
  function decimalCommas(s) {
    var out = '', stack = [];
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '(') {
        var m = /([A-Za-z_][A-Za-z0-9_]*)\s*$/.exec(s.slice(0, i));
        stack.push(!!(m && ARITY[m[1]] && ARITY[m[1]][1] > 1));
      } else if (c === ')') stack.pop();
      else if (c === ',' && !stack[stack.length - 1] && /\d/.test(s[i - 1] || '') && /\d/.test(s[i + 1] || '')) c = '.';
      out += c;
    }
    return out;
  }

  // ---------- токенизатор ----------
  function tokenize(s, known) {
    var toks = [], i = 0, m;
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if ((m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(s.slice(i)))) {
        toks.push({ k: 'num', v: parseFloat(m[0]), s: m[0] }); i += m[0].length; continue;
      }
      if ((m = /^[A-Za-z_][A-Za-z0-9_]*'*/.exec(s.slice(i)))) {
        splitIdent(m[0], known).forEach(function (t) { toks.push(t); });
        i += m[0].length; continue;
      }
      if ('+-*/^()[],;|!'.indexOf(c) >= 0) {
        var k = c === '[' ? '(' : c === ']' ? ')' : c;
        toks.push({ k: 'op', v: k }); i++; continue;
      }
      if (c === '=') { toks.push({ k: 'op', v: '=' }); i++; continue; }
      throw new Error('Непонятный символ «' + c + '»');
    }
    return toks;
  }

  // «xsinx» → x, sin, x ; «log_2» → log с основанием 2
  function splitIdent(id, known) {
    var lb = /^log_(\d+(?:\.\d+)?)$/.exec(id);
    if (lb) return [{ k: 'id', v: 'log', base: parseFloat(lb[1]) }];
    if (isKnown(id, known)) return [{ k: 'id', v: id }];
    var out = [], rest = id;
    while (rest.length) {
      var best = null;
      for (var L = rest.length; L >= 1; L--) {
        var p = rest.slice(0, L);
        if (isKnown(p, known)) { best = p; break; }
      }
      if (!best) {
        // цифры внутри идентификатора (x2) → число
        var dm = /^\d+/.exec(rest);
        if (dm) { out.push({ k: 'num', v: parseFloat(dm[0]), s: dm[0] }); rest = rest.slice(dm[0].length); continue; }
        throw new Error('Неизвестное имя «' + id + '»');
      }
      out.push({ k: 'id', v: best });
      rest = rest.slice(best.length);
    }
    return out;
  }
  function isKnown(n, known) {
    return FUNCS.hasOwnProperty(n) || CONSTS.hasOwnProperty(n) || n === 'i' && known.complex || known.vars.indexOf(n) >= 0;
  }

  // ---------- парсер ----------
  function Parser(toks, known) { this.t = toks; this.p = 0; this.known = known; this.absDepth = 0; }
  Parser.prototype.peek = function () { return this.t[this.p]; };
  Parser.prototype.next = function () { return this.t[this.p++]; };
  Parser.prototype.isOp = function (v) { var t = this.peek(); return t && t.k === 'op' && t.v === v; };
  Parser.prototype.expect = function (v) {
    if (!this.isOp(v)) throw new Error(v === ')' ? 'Не хватает закрывающей скобки' : 'Ожидалось «' + v + '»');
    this.p++;
  };
  Parser.prototype.parseExpr = function () {
    var a = this.parseTerm();
    while (this.isOp('+') || this.isOp('-')) {
      var op = this.next().v;
      a = { t: 'bin', op: op, a: a, b: this.parseTerm() };
    }
    return a;
  };
  Parser.prototype.startsPrimary = function () {
    var t = this.peek();
    if (!t) return false;
    if (t.k === 'num' || t.k === 'id') return true;
    if (t.k === 'op' && t.v === '(') return true;
    if (t.k === 'op' && t.v === '|' && this.absDepth === 0) return true;
    return false;
  };
  Parser.prototype.parseTerm = function () {
    var a = this.parseUnary();
    for (;;) {
      if (this.isOp('*') || this.isOp('/')) {
        var op = this.next().v;
        a = { t: 'bin', op: op, a: a, b: this.parseUnary() };
      } else if (this.startsPrimary()) {
        a = { t: 'bin', op: '*', a: a, b: this.parsePower(), imp: true };
      } else break;
    }
    return a;
  };
  Parser.prototype.parseUnary = function () {
    if (this.isOp('-')) { this.next(); return { t: 'neg', a: this.parseUnary() }; }
    if (this.isOp('+')) { this.next(); return this.parseUnary(); }
    return this.parsePower();
  };
  Parser.prototype.parsePower = function () {
    var a = this.parsePostfix();
    if (this.isOp('^')) { this.next(); return { t: 'pow', a: a, b: this.parseUnary() }; }
    return a;
  };
  Parser.prototype.parsePostfix = function () {
    var a = this.parsePrimary();
    while (this.isOp('!')) { this.next(); a = { t: 'fn', n: 'fact', args: [a] }; }
    return a;
  };
  Parser.prototype.parsePrimary = function () {
    var t = this.next();
    if (!t) throw new Error('Выражение оборвалось');
    if (t.k === 'num') return { t: 'num', v: t.v, s: t.s };
    if (t.k === 'op' && t.v === '(') {
      var e = this.parseExpr(); this.expect(')'); return { t: 'par', a: e };
    }
    if (t.k === 'op' && t.v === '|') {
      this.absDepth++;
      var ae = this.parseExpr();
      this.absDepth--;
      this.expect('|');
      return { t: 'fn', n: 'abs', args: [ae] };
    }
    if (t.k === 'id') {
      var n = t.v;
      if (FUNCS.hasOwnProperty(n) && !(this.known.vars.indexOf(n) >= 0)) {
        var powE = null;
        if (this.isOp('^')) { this.next(); powE = this.parsePostfix(); }
        var args;
        if (this.isOp('(')) {
          this.next(); args = [this.parseExpr()];
          while (this.isOp(',') || this.isOp(';')) { this.next(); args.push(this.parseExpr()); }
          this.expect(')');
        } else {
          if (n === 'C' || n === 'A') throw new Error('После ' + n + ' нужны скобки: ' + n + '(n, k)');
          args = [this.parsePower()];
        }
        if (t.base !== undefined) args.unshift({ t: 'num', v: t.base, s: String(t.base) });
        var ar = ARITY[n] || [1, 1];
        if (args.length < ar[0] || args.length > ar[1]) throw new Error('У функции ' + n + ' неверное число аргументов');
        var f = { t: 'fn', n: n, args: args };
        return powE ? { t: 'pow', a: f, b: powE } : f;
      }
      if (CONSTS.hasOwnProperty(n) && this.known.vars.indexOf(n) < 0) return { t: 'const', n: n };
      if (n === 'i' && this.known.complex) return { t: 'const', n: 'i' };
      return { t: 'var', n: n };
    }
    if (t.k === 'op' && t.v === ')') throw new Error('Лишняя закрывающая скобка');
    throw new Error('Неожиданный знак «' + t.v + '»');
  };

  function parse(str, opts) {
    opts = opts || {};
    var known = { vars: opts.vars || [], complex: !!opts.complex };
    var s = normalize(str);
    if (!s) throw new Error('Пустое выражение');
    var toks = tokenize(s, known);
    var P = new Parser(toks, known);
    var ast = P.parseExpr();
    if (P.p < toks.length) {
      var t = toks[P.p];
      if (t.k === 'op' && t.v === ')') throw new Error('Лишняя закрывающая скобка');
      if (t.k === 'op' && t.v === '=') throw new Error('Знак «=» здесь не нужен — введите только ответ');
      throw new Error('Не понял продолжение после «' + (toks[P.p - 1] ? (toks[P.p - 1].s || toks[P.p - 1].v) : '') + '»');
    }
    return ast;
  }

  // ---------- вычисление (действительные числа) ----------
  function compile(ast) {
    switch (ast.t) {
      case 'num': var v = ast.v; return function () { return v; };
      case 'const': var cv = CONSTS[ast.n]; return function () { return cv; };
      case 'var': var nm = ast.n; return function (env) {
        if (!env || !(nm in env)) throw new Error('Неизвестная переменная «' + nm + '»');
        return env[nm];
      };
      case 'par': return compile(ast.a);
      case 'neg': var na = compile(ast.a); return function (env) { return -na(env); };
      case 'pow': var pa = compile(ast.a), pb = compile(ast.b);
        return function (env) {
          var x = pa(env), y = pb(env);
          if (x < 0 && Math.abs(y) < 1 && Math.abs(y) > 0) {
            // нечётный корень из отрицательного числа: (-8)^(1/3) = -2
            var q = 1 / y, qi = Math.round(q);
            if (Math.abs(q - qi) < 1e-9 && qi % 2 !== 0) return -Math.pow(-x, y);
          }
          return Math.pow(x, y);
        };
      case 'bin': var a = compile(ast.a), b = compile(ast.b);
        switch (ast.op) {
          case '+': return function (env) { return a(env) + b(env); };
          case '-': return function (env) { return a(env) - b(env); };
          case '*': return function (env) { return a(env) * b(env); };
          case '/': return function (env) { return a(env) / b(env); };
        }
        break;
      case 'fn': var f = FUNCS[ast.n], args = ast.args.map(compile);
        if (args.length === 1) { var a0 = args[0]; return function (env) { return f(a0(env)); }; }
        return function (env) { return f.apply(null, args.map(function (g) { return g(env); })); };
    }
    throw new Error('Не удалось вычислить');
  }

  // ---------- комплексные числа ----------
  function C(re, im) { return { re: re, im: im || 0 }; }
  var Cx = {
    add: function (a, b) { return C(a.re + b.re, a.im + b.im); },
    sub: function (a, b) { return C(a.re - b.re, a.im - b.im); },
    mul: function (a, b) { return C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); },
    div: function (a, b) { var d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); },
    exp: function (a) { var r = Math.exp(a.re); return C(r * Math.cos(a.im), r * Math.sin(a.im)); },
    ln: function (a) { return C(Math.log(Math.hypot(a.re, a.im)), Math.atan2(a.im, a.re)); },
    pow: function (a, b) {
      if (b.im === 0 && Number.isInteger(b.re) && Math.abs(b.re) <= 64) {
        var r = C(1, 0), base = a, n = Math.abs(b.re);
        for (var i = 0; i < n; i++) r = Cx.mul(r, base);
        return b.re < 0 ? Cx.div(C(1, 0), r) : r;
      }
      if (a.re === 0 && a.im === 0) return C(0, 0);
      return Cx.exp(Cx.mul(b, Cx.ln(a)));
    }
  };
  var CFUNCS = {
    exp: Cx.exp, ln: Cx.ln, log: Cx.ln,
    sqrt: function (a) { return Cx.pow(a, C(0.5, 0)); },
    sin: function (a) { return C(Math.sin(a.re) * Math.cosh(a.im), Math.cos(a.re) * Math.sinh(a.im)); },
    cos: function (a) { return C(Math.cos(a.re) * Math.cosh(a.im), -Math.sin(a.re) * Math.sinh(a.im)); },
    sh: function (a) { return Cx.div(Cx.sub(Cx.exp(a), Cx.exp(C(-a.re, -a.im))), C(2, 0)); },
    ch: function (a) { return Cx.div(Cx.add(Cx.exp(a), Cx.exp(C(-a.re, -a.im))), C(2, 0)); },
    abs: function (a) { return C(Math.hypot(a.re, a.im), 0); },
    conj: function (a) { return C(a.re, -a.im); }
  };
  CFUNCS.sinh = CFUNCS.sh; CFUNCS.cosh = CFUNCS.ch;
  function compileC(ast) {
    switch (ast.t) {
      case 'num': var v = C(ast.v, 0); return function () { return v; };
      case 'const': var cv = ast.n === 'i' ? C(0, 1) : C(CONSTS[ast.n], 0); return function () { return cv; };
      case 'var': var nm = ast.n; return function (env) {
        if (!env || !(nm in env)) throw new Error('Неизвестная переменная «' + nm + '»');
        var x = env[nm]; return typeof x === 'number' ? C(x, 0) : x;
      };
      case 'par': return compileC(ast.a);
      case 'neg': var na = compileC(ast.a); return function (env) { var z = na(env); return C(-z.re, -z.im); };
      case 'pow': var pa = compileC(ast.a), pb = compileC(ast.b); return function (env) { return Cx.pow(pa(env), pb(env)); };
      case 'bin': var a = compileC(ast.a), b = compileC(ast.b);
        var op = { '+': Cx.add, '-': Cx.sub, '*': Cx.mul, '/': Cx.div }[ast.op];
        return function (env) { return op(a(env), b(env)); };
      case 'fn':
        var f = CFUNCS[ast.n];
        if (!f) {
          var rf = FUNCS[ast.n], rargs = ast.args.map(compileC);
          return function (env) {
            return C(rf.apply(null, rargs.map(function (g) {
              var z = g(env);
              if (Math.abs(z.im) > 1e-12) throw new Error('Функция ' + ast.n + ' здесь только для действительных чисел');
              return z.re;
            })), 0);
          };
        }
        var ca = compileC(ast.args[0]); return function (env) { return f(ca(env)); };
    }
    throw new Error('Не удалось вычислить');
  }

  // ---------- вывод в TeX (предпросмотр того, как понят ввод) ----------
  var TEXFN = { sin: '\\sin', cos: '\\cos', tan: '\\operatorname{tg}', tg: '\\operatorname{tg}', cot: '\\operatorname{ctg}', ctg: '\\operatorname{ctg}',
    asin: '\\arcsin', arcsin: '\\arcsin', acos: '\\arccos', arccos: '\\arccos', atan: '\\operatorname{arctg}', arctan: '\\operatorname{arctg}', arctg: '\\operatorname{arctg}',
    arcctg: '\\operatorname{arcctg}', arccot: '\\operatorname{arcctg}', sinh: '\\operatorname{sh}', sh: '\\operatorname{sh}', cosh: '\\operatorname{ch}', ch: '\\operatorname{ch}',
    tanh: '\\operatorname{th}', th: '\\operatorname{th}', cth: '\\operatorname{cth}', coth: '\\operatorname{cth}', ln: '\\ln', lg: '\\lg', exp: '\\exp', sign: '\\operatorname{sign}', sgn: '\\operatorname{sign}',
    sec: '\\sec', csc: '\\csc', log2: '\\log_2', log10: '\\log_{10}', min: '\\min', max: '\\max', floor: '\\operatorname{floor}', ceil: '\\operatorname{ceil}', round: '\\operatorname{round}' };
  function prec(ast) {
    if (ast.t === 'par') return prec(ast.a);
    if (ast.t === 'bin') return ast.op === '+' || ast.op === '-' ? 1 : 2;
    if (ast.t === 'neg') return 1.5;
    if (ast.t === 'pow') return 3;
    return 4;
  }
  function wrap(s) { return '\\left(' + s + '\\right)'; }
  function numTeX(ast) {
    var s = ast.s || String(ast.v);
    if (/e/i.test(s)) { var m = s.split(/e/i); return m[0].replace('.', '{,}') + '\\cdot 10^{' + parseInt(m[1], 10) + '}'; }
    return s.replace('.', '{,}');
  }
  function toTeX(ast) {
    switch (ast.t) {
      case 'num': return numTeX(ast);
      case 'const': return ast.n === 'pi' ? '\\pi' : ast.n === 'inf' || ast.n === 'infinity' ? '\\infty' : ast.n;
      case 'var':
        var base = ast.n.replace(/'+$/, ''), primes = ast.n.slice(base.length);
        var bt = GREEK.indexOf(base) >= 0 ? '\\' + base + ' ' : base.length > 1 ? base.replace(/^([A-Za-z]+)(\d+)$/, '$1_{$2}') : base;
        return bt + primes;
      case 'par': return toTeX(ast.a);
      case 'neg':
        var inner = ast.a.t === 'par' ? ast.a.a : ast.a;
        var s = toTeX(inner);
        return '-' + (prec(inner) <= 1.5 ? wrap(s) : s);
      case 'pow':
        var a = ast.a.t === 'par' ? ast.a.a : ast.a;
        var bb = ast.b.t === 'par' ? ast.b.a : ast.b;
        if (a.t === 'fn' && TEXFN[a.n] && a.n !== 'exp') {
          return TEXFN[a.n] + '^{' + toTeX(bb) + '}' + argTeX(a.args[0]);
        }
        var at = toTeX(a);
        if (prec(a) < 4 || (a.t === 'num' && a.v < 0) || a.t === 'fn' && a.n === 'fact') at = wrap(at);
        return '{' + at + '}^{' + toTeX(bb) + '}';
      case 'bin':
        var l = ast.a, r = ast.b;
        if (ast.op === '/') return '\\dfrac{' + toTeX(l.t === 'par' ? l.a : l) + '}{' + toTeX(r.t === 'par' ? r.a : r) + '}';
        var p = prec(ast);
        var ls = toTeX(l), rs = toTeX(r);
        if (prec(l) < p) ls = wrap(ls);
        if (prec(r) < p || (ast.op === '-' && prec(r) === p) || r.t === 'neg' || (ast.op === '+' && r.t === 'num' && r.v < 0)) rs = wrap(rs);
        if (ast.op === '*') {
          var lf = r; while (lf.t === 'bin' || lf.t === 'pow') lf = lf.a;
          if (l.t === 'num' && lf.t !== 'num' && lf.t !== 'neg' && rs.indexOf('\\left(') === 0) return ls + rs;
          if (lf.t === 'num' || lf.t === 'neg' || rs.indexOf('\\left(') === 0) return ls + ' \\cdot ' + rs;
          if (l.t === 'num') return ls + rs;
          if (r.t === 'fn' || r.t === 'par' || (r.t === 'pow' && r.a.t !== 'var' && r.a.t !== 'const')) return ls + '\\,' + rs;
          return ls + ' \\cdot ' + rs;
        }
        return ls + ' ' + ast.op + ' ' + rs;
      case 'fn':
        var n = ast.n, args = ast.args;
        if (n === 'sqrt') return '\\sqrt{' + toTeX(args[0]) + '}';
        if (n === 'cbrt') return '\\sqrt[3]{' + toTeX(args[0]) + '}';
        if (n === 'root') return args.length === 2 ? '\\sqrt[' + toTeX(args[1]) + ']{' + toTeX(args[0]) + '}' : '\\sqrt{' + toTeX(args[0]) + '}';
        if (n === 'abs') return '\\left|' + toTeX(args[0]) + '\\right|';
        if (n === 'fact') { var fa = args[0].t === 'par' ? args[0].a : args[0]; var ft = toTeX(fa); return (prec(fa) < 4 ? wrap(ft) : ft) + '!'; }
        if (n === 'log') return args.length === 2 ? '\\log_{' + toTeX(args[0]) + '}' + argTeX(args[1]) : '\\ln' + argTeX(args[0]);
        if (n === 'C' || n === 'binom') return 'C_{' + toTeX(args[0]) + '}^{' + toTeX(args[1]) + '}';
        if (n === 'A') return 'A_{' + toTeX(args[0]) + '}^{' + toTeX(args[1]) + '}';
        if (n === 'heaviside') return '\\eta' + argTeX(args[0]);
        if (n === 'conj') return '\\overline{' + toTeX(args[0]) + '}';
        var name = TEXFN[n] || '\\operatorname{' + n + '}';
        return name + wrap(args.map(toTeX).join(';\\ '));
    }
    return '?';
  }
  function argTeX(a) {
    var inner = a.t === 'par' ? a.a : a;
    return wrap(toTeX(inner));
  }

  // ---------- проверка ответов ----------
  function parseTol(tol, fallback) {
    if (tol === undefined || tol === null || tol === '') return fallback || { rel: 1e-3, abs: 1e-9 };
    var s = String(tol).trim();
    if (/%$/.test(s)) return { rel: parseFloat(s) / 100, abs: 1e-12 };
    return { rel: 0, abs: parseFloat(s.replace(',', '.')) };
  }
  function close(a, b, tol) {
    if (a === b) return true;
    if (!isFinite(a) || !isFinite(b)) return false;
    return Math.abs(a - b) <= Math.max(tol.abs, tol.rel * Math.abs(b)) + 1e-12;
  }
  function evalNum(str, opts) {
    var ast = parse(str, opts);
    var v = compile(ast)({});
    return v;
  }
  function stripLhs(s) {
    // «y = 2x+1», «f(x) = ...», «x = 3» → правая часть
    return String(s).replace(/^\s*[A-Za-zА-Яа-я]'*\s*(\([^)]*\))?\s*=\s*/, '');
  }
  function splitList(s) {
    s = String(s).trim();
    if (/^[([{].*[)\]}]$/.test(s) && s.indexOf(';') >= 0) s = s.slice(1, -1);
    var parts;
    if (s.indexOf(';') >= 0) parts = s.split(';');
    else if (/,\s/.test(s)) parts = s.split(/,\s+/);
    else if (/\sи\s/.test(s)) parts = s.split(/\sи\s/);
    else parts = [s];
    return parts.map(function (p) { return stripLhs(p.trim()); }).filter(function (p) { return p.length; });
  }
  var EMPTY = /^(нет|нет решений|нет корней|пусто|пустое множество|∅|empty|none|-)$/i;

  // детерминированный генератор точек
  function points(n, lo, hi, dims) {
    var pts = [], seed = 12345;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < n; i++) {
      var p = [];
      for (var d = 0; d < dims; d++) p.push(lo + (hi - lo) * (0.05 + 0.9 * rnd()));
      pts.push(p);
    }
    return pts;
  }

  function prettyNum(v) {
    if (!isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : '—';
    var r = Math.round(v * 1e6) / 1e6;
    return String(r).replace('.', ',').replace('-', '−');
  }

  function check(task, input) {
    var type = task.type || 'num';
    var raw = Array.isArray(input) ? input : String(input == null ? '' : input).trim();
    if (type === 'choice') {
      var sel = (Array.isArray(raw) ? raw : [raw]).map(Number).sort();
      if (!sel.length || raw === '') return { error: 'Выберите вариант' };
      var cor = task.correct.slice().sort();
      return { ok: sel.length === cor.length && sel.every(function (v, i) { return v === cor[i]; }) };
    }
    if (!raw) return { error: 'Введите ответ' };
    try {
      if (type === 'text') {
        var norm = function (s) { return String(s).toLowerCase().replace(/ё/g, 'е').replace(/[\s.]+/g, ' ').trim(); };
        var alts = String(task.answer).split('|').map(norm);
        return { ok: alts.indexOf(norm(raw)) >= 0 };
      }
      if (type === 'num') {
        var v = evalNum(stripLhs(raw));
        if (isNaN(v)) return { error: 'Выражение не имеет числового значения' };
        var ref = evalNum(task.answer);
        return { ok: close(v, ref, parseTol(task.tol, task.defTol)), value: v };
      }
      if (type === 'set' || type === 'tuple') {
        var refEmpty = EMPTY.test(String(task.answer).trim());
        if (EMPTY.test(raw)) return { ok: refEmpty };
        if (refEmpty) { splitList(raw).forEach(function (p) { evalNum(p); }); return { ok: false }; }
        var us = splitList(raw).map(function (p) { return evalNum(p); });
        var rs = splitList(task.answer).map(function (p) { return evalNum(p); });
        var tl = parseTol(task.tol, task.defTol);
        if (type === 'tuple') {
          if (us.length !== rs.length) return { ok: false, msg: 'Нужно ' + rs.length + ' чисел(а), а введено ' + us.length };
          return { ok: us.every(function (u, i) { return close(u, rs[i], tl); }) };
        }
        // множество: каждый эталонный корень найден ровно один раз
        var used = us.map(function () { return false; });
        var okAll = rs.every(function (r) {
          for (var i = 0; i < us.length; i++) if (!used[i] && close(us[i], r, tl)) { used[i] = true; return true; }
          return false;
        });
        var uniq = [];
        us.forEach(function (u) { if (!uniq.some(function (q) { return close(q, u, tl); })) uniq.push(u); });
        if (okAll && uniq.length === rs.length) return { ok: true };
        if (okAll && uniq.length > rs.length) return { ok: false, msg: 'Есть лишние ответы' };
        return { ok: false, msg: us.length < rs.length ? 'Найдены не все ответы' : undefined };
      }
      if (type === 'expr' || type === 'antider') {
        var vars = task.vars || ['x'];
        var src = stripLhs(raw);
        if (type === 'antider') src = src.replace(/\s*\+\s*(C|c|const)\s*$/, '');
        var ua = parse(src, { vars: vars }), ra = parse(task.answer, { vars: vars });
        var uf = compile(ua), rf = compile(ra);
        var range = task.range || [0.5, 2.5];
        var pts = points(14, range[0], range[1], vars.length);
        var diffs = [], valid = 0, bad = false;
        pts.forEach(function (p) {
          var env = {}; vars.forEach(function (n, i) { env[n] = p[i]; });
          var rv = rf(env);
          if (!isFinite(rv)) return;
          var uv = uf(env);
          if (!isFinite(uv)) { bad = true; return; }
          valid++;
          diffs.push({ u: uv, r: rv });
        });
        if (bad) return { ok: false };
        if (valid < 4) return { error: 'Не удалось проверить выражение в этой области' };
        if (type === 'antider') {
          var c0 = diffs[0].u - diffs[0].r;
          return { ok: diffs.every(function (d) { return Math.abs((d.u - d.r) - c0) <= 1e-6 * Math.max(1, Math.abs(d.r), Math.abs(d.u)); }) };
        }
        return { ok: diffs.every(function (d) { return Math.abs(d.u - d.r) <= 1e-6 * Math.max(1, Math.abs(d.r)); }) };
      }
      if (type === 'cnum') {
        var uz = compileC(parse(stripLhs(raw), { complex: true }))({});
        var rz = compileC(parse(task.answer, { complex: true }))({});
        var t2 = parseTol(task.tol, task.defTol);
        return { ok: close(uz.re, rz.re, { rel: t2.rel, abs: Math.max(t2.abs, 1e-9) }) && close(uz.im, rz.im, { rel: t2.rel, abs: Math.max(t2.abs, 1e-9) }) };
      }
    } catch (e) {
      return { error: e.message };
    }
    return { error: 'Неизвестный тип задачи' };
  }

  // разбор ввода для предпросмотра
  function preview(task, input) {
    var type = task.type || 'num';
    var raw = String(input || '').trim();
    if (!raw || type === 'choice' || type === 'text' || type === 'self') return null;
    try {
      var opts = { vars: type === 'expr' || type === 'antider' ? (task.vars || ['x']) : [], complex: type === 'cnum' };
      if (type === 'set' || type === 'tuple') {
        if (EMPTY.test(raw)) return { tex: '\\varnothing' };
        var parts = splitList(raw).map(function (p) { return toTeX(parse(p, opts)); });
        return { tex: type === 'tuple' ? '\\left(' + parts.join(';\\ ') + '\\right)' : parts.join(';\\quad ') };
      }
      var src = stripLhs(raw);
      if (type === 'antider') src = src.replace(/\s*\+\s*(C|c|const)\s*$/, '');
      var ast = parse(src, opts);
      var tex = toTeX(ast);
      if (type === 'num') {
        try { var v = compile(ast)({}); if (isFinite(v) && ast.t !== 'num' && !(ast.t === 'neg' && ast.a.t === 'num')) tex += '\\approx ' + prettyNum(v).replace(',', '{,}').replace('−', '-'); } catch (e) { /* пусто */ }
      }
      if (type === 'antider') tex += ' + C';
      return { tex: tex };
    } catch (e) {
      return { error: e.message };
    }
  }

  return {
    parse: parse, compile: compile, compileC: compileC, toTeX: toTeX, evalNum: evalNum,
    check: check, preview: preview, parseTol: parseTol, prettyNum: prettyNum, normalize: normalize,
    FUNCS: FUNCS, CONSTS: CONSTS
  };
});
