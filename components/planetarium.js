// Planetarium tab → Scientific + Graphing Calculator.
//
// A native (vanilla Vue) rebuild of the "mirai" calculator adapted to
// CosmoKlub's no-build stack and dark/violet theme. Two modes:
//   • Scientific — expression input with live result, DEG/RAD, Ans, history.
//   • Graphing   — Desmos-style. Each row can be:
//        y = f(x)            explicit function of x
//        x = g(y)            explicit function of y
//        x^2 + y^2 = 25      implicit relation  (marching-squares contour)
//        (1,2),(3,-1)        point list
//        a = 2               slider variable (drag / animate; usable in others)
//     with an interactive canvas (grid, labelled axes, curves), drag-to-pan,
//     scroll/buttons zoom, reset, grid toggle, hover/tap trace, and an
//     Analysis panel listing zeros, extrema and intersections.
//
// Everything shares one hand-written engine (tokenizer → AST → evaluator,
// NO eval()). Compiling to an AST lets the graph re-evaluate across hundreds
// of sample points per redraw cheaply. Semantics match mirai: logb(base,value),
// nthroot(degree,radicand), non-negative mod, −3^2 === −9, implicit
// multiplication (2π, 3(4), 2x). Graphs use radians.

// ── Expression engine (tokenizer → AST → evaluator) ─────────────────────────

function completeExpression(expr) {
  let depth = 0;
  for (const ch of expr) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
  }
  return expr + ')'.repeat(depth);
}

function wrapAbsoluteBars(s) {
  let out = '';
  let open = false;
  for (const ch of s) {
    if (ch === '|') { out += open ? ')' : 'abs('; open = !open; }
    else out += ch;
  }
  if (open) out += ')';
  return out;
}

function normalizeExpression(raw) {
  let s = raw
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/√/g, 'sqrt')
    .replace(/∛/g, 'cbrt')
    .replace(/π/g, ' PI ')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3');
  s = s.replace(/(\d+(?:\.\d+)?)\s*ncr\s*(\d+(?:\.\d+)?)/gi, 'ncr($1,$2)')
       .replace(/(\d+(?:\.\d+)?)\s*npr\s*(\d+(?:\.\d+)?)/gi, 'npr($1,$2)');
  return wrapAbsoluteBars(s);
}

function tokenize(src) {
  const tokens = [];
  let i = 0;
  const isDigit = (c) => c >= '0' && c <= '9';
  const isAlpha = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1]))) {
      let j = i + 1;
      while (j < src.length && (isDigit(src[j]) || src[j] === '.')) j++;
      const numStr = src.slice(i, j);
      if ((numStr.match(/\./g) || []).length > 1) throw new Error('Malformed number');
      tokens.push({ t: 'num', v: parseFloat(numStr) });
      i = j; continue;
    }
    if (isAlpha(c)) {
      let j = i + 1;
      while (j < src.length && (isAlpha(src[j]) || isDigit(src[j]) || src[j] === '_')) j++;
      tokens.push({ t: 'ident', v: src.slice(i, j) });
      i = j; continue;
    }
    if ('+-*/^%!'.includes(c)) { tokens.push({ t: 'op', v: c }); i++; continue; }
    if (c === '(') { tokens.push({ t: 'lparen' }); i++; continue; }
    if (c === ')') { tokens.push({ t: 'rparen' }); i++; continue; }
    if (c === ',') { tokens.push({ t: 'comma' }); i++; continue; }
    throw new Error('Unexpected character "' + c + '"');
  }
  return tokens;
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial needs a whole number ≥ 0');
  if (n > 170) throw new Error('Number too large');
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}
function gcd(a, b) { a = Math.abs(Math.trunc(a)); b = Math.abs(Math.trunc(b)); while (b) { [a, b] = [b, a % b]; } return a; }
function combinations(n, r) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) throw new Error('nCr needs whole numbers with r ≤ n');
  r = Math.min(r, n - r);
  let out = 1;
  for (let k = 0; k < r; k++) out = (out * (n - k)) / (k + 1);
  return Math.round(out);
}
function permutations(n, r) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) throw new Error('nPr needs whole numbers with r ≤ n');
  let out = 1;
  for (let k = 0; k < r; k++) out *= (n - k);
  return out;
}
function roundDecimal(x, p) {
  if (!Number.isInteger(p) || Math.abs(p) > 100) throw new Error('round precision must be a whole number');
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}

function applyFunction(name, args, ctx) {
  const fn = name.toLowerCase();
  const need = (n) => { if (args.length !== n) throw new Error(name + '() needs ' + n + ' argument' + (n > 1 ? 's' : '')); };
  const deg = ctx.angleMode === 'deg';
  const toRad = (a) => (deg ? (a % 360) * Math.PI / 180 : a);
  const fromRad = (r) => (deg ? r * 180 / Math.PI : r);
  switch (fn) {
    case 'sin': need(1); return Math.sin(toRad(args[0]));
    case 'cos': need(1); return Math.cos(toRad(args[0]));
    case 'tan': need(1); return Math.tan(toRad(args[0]));
    case 'sec': need(1); { const c = Math.cos(toRad(args[0])); if (c === 0) throw new Error('Undefined'); return 1 / c; }
    case 'csc': need(1); { const s = Math.sin(toRad(args[0])); if (s === 0) throw new Error('Undefined'); return 1 / s; }
    case 'cot': need(1); { const s = Math.sin(toRad(args[0])); if (s === 0) throw new Error('Undefined'); return Math.cos(toRad(args[0])) / s; }
    case 'asin': need(1); if (args[0] < -1 || args[0] > 1) throw new Error('Domain error'); return fromRad(Math.asin(args[0]));
    case 'acos': need(1); if (args[0] < -1 || args[0] > 1) throw new Error('Domain error'); return fromRad(Math.acos(args[0]));
    case 'atan': need(1); return fromRad(Math.atan(args[0]));
    case 'sinh': need(1); return Math.sinh(args[0]);
    case 'cosh': need(1); return Math.cosh(args[0]);
    case 'tanh': need(1); return Math.tanh(args[0]);
    case 'sqrt': need(1); if (args[0] < 0) throw new Error('Result is not a real number'); return Math.sqrt(args[0]);
    case 'cbrt': need(1); return Math.cbrt(args[0]);
    case 'nthroot': {
      need(2);
      const degree = args[0], radicand = args[1];
      if (degree === 0) throw new Error('Root degree cannot be zero');
      if (radicand < 0 && (!Number.isInteger(degree) || Math.abs(degree) % 2 === 0)) throw new Error('Result is not a real number');
      return radicand < 0 ? -(Math.abs(radicand) ** (1 / degree)) : radicand ** (1 / degree);
    }
    case 'exp': need(1); return Math.exp(args[0]);
    case 'log': need(1); if (args[0] <= 0) throw new Error('log needs a positive value'); return Math.log10(args[0]);
    case 'ln': need(1); if (args[0] <= 0) throw new Error('ln needs a positive value'); return Math.log(args[0]);
    case 'logb': need(2); if (args[0] <= 0 || args[0] === 1 || args[1] <= 0) throw new Error('Undefined logarithm base or value'); return Math.log(args[1]) / Math.log(args[0]);
    case 'abs': need(1); return Math.abs(args[0]);
    case 'floor': need(1); return Math.floor(args[0]);
    case 'ceil': need(1); return Math.ceil(args[0]);
    case 'round': return args.length === 1 ? roundDecimal(args[0], 0) : roundDecimal(args[0], args[1]);
    case 'sign': need(1); return Math.sign(args[0]);
    case 'mod': need(2); if (args[1] === 0) throw new Error('Undefined: modulo by zero'); return ((args[0] % args[1]) + args[1]) % args[1];
    case 'gcd': need(2); return gcd(args[0], args[1]);
    case 'lcm': need(2); if (args[0] === 0 || args[1] === 0) return 0; return Math.abs((args[0] / gcd(args[0], args[1])) * args[1]);
    case 'ncr': need(2); return combinations(args[0], args[1]);
    case 'npr': need(2); return permutations(args[0], args[1]);
    default: throw new Error('Unknown function "' + name + '"');
  }
}

function symbolValue(name, ctx) {
  const low = name.toLowerCase();
  if (ctx.vars && Object.prototype.hasOwnProperty.call(ctx.vars, low)) return ctx.vars[low];
  if (name === 'PI' || low === 'pi') return Math.PI;
  if (low === 'e') return Math.E;
  if (low === 'ans') return ctx.ans || 0;
  throw new Error('Unknown symbol "' + name + '"');
}

function parseToAst(raw) {
  const tokens = tokenize(normalizeExpression(completeExpression(raw)));
  if (!tokens.length) throw new Error('Empty expression');
  let pos = 0;
  const peek = () => tokens[pos];
  const startsPrimary = (tk) => tk && (tk.t === 'num' || tk.t === 'lparen' || tk.t === 'ident');
  function expr() { return additive(); }
  function additive() {
    let node = multiplicative();
    while (peek() && peek().t === 'op' && (peek().v === '+' || peek().v === '-')) {
      const op = tokens[pos++].v;
      node = { k: op === '+' ? 'add' : 'sub', a: node, b: multiplicative() };
    }
    return node;
  }
  function multiplicative() {
    let node = unary();
    while (true) {
      const tk = peek();
      if (tk && tk.t === 'op' && (tk.v === '*' || tk.v === '/')) { pos++; node = { k: tk.v === '*' ? 'mul' : 'div', a: node, b: unary() }; }
      else if (startsPrimary(tk)) { node = { k: 'mul', a: node, b: unary() }; }
      else break;
    }
    return node;
  }
  function unary() {
    const tk = peek();
    if (tk && tk.t === 'op' && (tk.v === '+' || tk.v === '-')) { pos++; const operand = unary(); return tk.v === '-' ? { k: 'neg', a: operand } : operand; }
    return power();
  }
  function power() {
    const base = postfix();
    const tk = peek();
    if (tk && tk.t === 'op' && tk.v === '^') { pos++; return { k: 'pow', a: base, b: unary() }; }
    return base;
  }
  function postfix() {
    let node = primary();
    while (peek() && peek().t === 'op' && (peek().v === '!' || peek().v === '%')) {
      const op = tokens[pos++].v;
      node = op === '!' ? { k: 'fact', a: node } : { k: 'pct', a: node };
    }
    return node;
  }
  function primary() {
    const tk = peek();
    if (!tk) throw new Error('Unexpected end of expression');
    if (tk.t === 'num') { pos++; return { k: 'num', v: tk.v }; }
    if (tk.t === 'lparen') { pos++; const v = expr(); if (!peek() || peek().t !== 'rparen') throw new Error('Missing ")"'); pos++; return v; }
    if (tk.t === 'ident') {
      pos++;
      if (peek() && peek().t === 'lparen') {
        pos++;
        const args = [];
        if (!(peek() && peek().t === 'rparen')) { args.push(expr()); while (peek() && peek().t === 'comma') { pos++; args.push(expr()); } }
        if (!peek() || peek().t !== 'rparen') throw new Error('Missing ")"');
        pos++;
        return { k: 'call', name: tk.v, args };
      }
      return { k: 'sym', name: tk.v };
    }
    throw new Error('Syntax error');
  }
  const ast = expr();
  if (pos < tokens.length) throw new Error('Unexpected token');
  return ast;
}

function evalNode(n, ctx) {
  switch (n.k) {
    case 'num': return n.v;
    case 'sym': return symbolValue(n.name, ctx);
    case 'call': return applyFunction(n.name, n.args.map((a) => evalNode(a, ctx)), ctx);
    case 'neg': return -evalNode(n.a, ctx);
    case 'add': return evalNode(n.a, ctx) + evalNode(n.b, ctx);
    case 'sub': return evalNode(n.a, ctx) - evalNode(n.b, ctx);
    case 'mul': return evalNode(n.a, ctx) * evalNode(n.b, ctx);
    case 'div': { const d = evalNode(n.b, ctx); if (d === 0) throw new Error('Division by zero'); return evalNode(n.a, ctx) / d; }
    case 'pow': return Math.pow(evalNode(n.a, ctx), evalNode(n.b, ctx));
    case 'fact': return factorial(evalNode(n.a, ctx));
    case 'pct': return evalNode(n.a, ctx) / 100;
    default: throw new Error('Bad expression');
  }
}

function evaluateExpression(raw, ctx) {
  const value = evalNode(parseToAst(raw), ctx);
  if (typeof value !== 'number' || Number.isNaN(value)) throw new Error('Result is not a number');
  return value;
}

function formatNumber(x) {
  if (x === Infinity) return '∞';
  if (x === -Infinity) return '−∞';
  if (typeof x !== 'number' || !isFinite(x)) return 'Error';
  let r = parseFloat(x.toPrecision(12));
  if (Object.is(r, -0)) r = 0;
  const abs = Math.abs(r);
  let str;
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-9)) str = r.toExponential(6).replace(/e([+-])/, ' ×10^$1');
  else str = r.toString();
  return str.replace(/-/g, '−');
}

function toFraction(x) {
  if (!isFinite(x) || Number.isInteger(x)) return null;
  const sign = x < 0 ? '−' : '';
  const value = Math.abs(x);
  let h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = value;
  do {
    const a = Math.floor(b);
    [h1, h0] = [a * h1 + h0, h1];
    [k1, k0] = [a * k1 + k0, k1];
    if (b - a < 1e-12) break;
    b = 1 / (b - a);
  } while (Math.abs(value - h1 / k1) > value * 1e-10 && k1 < 100000);
  if (k1 === 0 || k1 > 100000 || Math.abs(value - h1 / k1) > 1e-9) return null;
  return sign + h1 + '⁄' + k1;
}

// ── LaTeX rendering (via KaTeX) — turns an AST into typeset math ─────────────
function symLatex(name) {
  const low = name.toLowerCase();
  if (name === 'PI' || low === 'pi') return '\\pi';
  if (low === 'e') return 'e';
  if (low === 'ans') return '\\mathrm{Ans}';
  if (/^[a-z]$/.test(low)) return low;
  return '\\mathrm{' + name + '}';
}
function callLatex(n, go) {
  const fn = n.name.toLowerCase();
  const a = n.args.map((x) => go(x, 0));
  const trig = { sin: '\\sin', cos: '\\cos', tan: '\\tan', sec: '\\sec', csc: '\\csc', cot: '\\cot', sinh: '\\sinh', cosh: '\\cosh', tanh: '\\tanh' };
  const inv = { asin: '\\sin^{-1}', acos: '\\cos^{-1}', atan: '\\tan^{-1}' };
  if (fn in trig) return trig[fn] + '\\!\\left(' + a[0] + '\\right)';
  if (fn in inv) return inv[fn] + '\\!\\left(' + a[0] + '\\right)';
  if (fn === 'sqrt') return '\\sqrt{' + a[0] + '}';
  if (fn === 'cbrt') return '\\sqrt[3]{' + a[0] + '}';
  if (fn === 'nthroot') return '\\sqrt[' + a[0] + ']{' + (a[1] || '') + '}';
  if (fn === 'abs') return '\\left|' + a[0] + '\\right|';
  if (fn === 'exp') return 'e^{' + a[0] + '}';
  if (fn === 'ln') return '\\ln\\!\\left(' + a[0] + '\\right)';
  if (fn === 'log') return '\\log\\!\\left(' + a[0] + '\\right)';
  if (fn === 'logb') return '\\log_{' + a[0] + '}\\!\\left(' + (a[1] || '') + '\\right)';
  if (fn === 'floor') return '\\left\\lfloor ' + a[0] + '\\right\\rfloor';
  if (fn === 'ceil') return '\\left\\lceil ' + a[0] + '\\right\\rceil';
  if (fn === 'ncr') return '\\binom{' + a[0] + '}{' + (a[1] || '') + '}';
  if (fn === 'npr') return '{}^{' + a[0] + '}\\mathrm{P}_{' + (a[1] || '') + '}';
  return '\\operatorname{' + fn + '}\\!\\left(' + a.join(',\\,') + '\\right)';
}
function astToLatex(node) {
  function go(n, parentPrec) {
    const [s, prec] = render(n);
    return prec < parentPrec ? '\\left(' + s + '\\right)' : s;
  }
  function render(n) {
    switch (n.k) {
      case 'num': return [String(n.v), 9];
      case 'sym': return [symLatex(n.name), 9];
      case 'add': return [go(n.a, 1) + ' + ' + go(n.b, 1), 1];
      case 'sub': return [go(n.a, 1) + ' - ' + go(n.b, 2), 1];
      case 'mul': return [go(n.a, 2) + ' \\times ' + go(n.b, 2), 2];
      case 'div': return ['\\frac{' + go(n.a, 0) + '}{' + go(n.b, 0) + '}', 9];
      case 'neg': return ['-' + go(n.a, 2), 2];
      case 'pow': return [go(n.a, 5) + '^{' + go(n.b, 0) + '}', 4];
      case 'fact': return [go(n.a, 5) + '!', 5];
      case 'pct': return [go(n.a, 5) + '\\%', 5];
      case 'call': return [callLatex(n, go), 9];
      default: return ['', 9];
    }
  }
  return go(node, 0);
}
/** Expression string → LaTeX, or null if it can't be parsed (e.g. mid-typing). */
function exprToLatex(text) {
  try { return astToLatex(parseToAst(text)); } catch (e) { return null; }
}
/** Formatted result string → LaTeX (fractions, ×10^ exponents, ∞). */
function resultToLatex(text) {
  if (text == null) return '';
  let s = String(text);
  const frac = s.match(/^(−?)(\d+)⁄(\d+)$/);
  if (frac) return (frac[1] ? '-' : '') + '\\frac{' + frac[2] + '}{' + frac[3] + '}';
  s = s.replace(/∞/g, '\\infty').replace(/−/g, '-');
  const exp = s.match(/^(-?[\d.]+)\s*×10\^([+-]?\d+)$/);
  if (exp) return exp[1] + ' \\times 10^{' + exp[2] + '}';
  return s;
}

// ── Graph engine ────────────────────────────────────────────────────────────
const DEFAULT_GRAPH_VIEW = { xmin: -8, xmax: 8, ymin: -5, ymax: 7 };
const GRAPH_PALETTE = ['#a855f7', '#38bdf8', '#f472b6', '#facc15', '#4ade80', '#fb923c'];

function fitGraphViewToAspect(view, width, height) {
  if (width <= 0 || height <= 0) return view;
  const cx = (view.xmin + view.xmax) / 2, cy = (view.ymin + view.ymax) / 2;
  const xSpan = view.xmax - view.xmin, ySpan = view.ymax - view.ymin;
  const va = width / height, vw = xSpan / ySpan;
  if (vw < va) { const hw = (ySpan * va) / 2; return { xmin: cx - hw, xmax: cx + hw, ymin: view.ymin, ymax: view.ymax }; }
  if (vw > va) { const hh = xSpan / va / 2; return { xmin: view.xmin, xmax: view.xmax, ymin: cy - hh, ymax: cy + hh }; }
  return { ...view };
}
function niceStep(range, target) {
  const rough = range / target;
  const p = Math.pow(10, Math.floor(Math.log10(rough)));
  const n = rough / p;
  const s = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return s * p;
}
function formatTick(v, step) {
  if (Math.abs(v) < step / 1000) return '0';
  const decimals = Math.max(0, Math.min(6, -Math.floor(Math.log10(step))));
  return v.toFixed(decimals).replace(/-/g, '−');
}

// Compile a graph row into a typed evaluator (explicit / implicit / points / variable).
function compileGraph(source, base) {
  const evalConst = (s) => {
    const v = evalNode(parseToAst(s), { angleMode: 'rad', ans: base.ans, vars: {} });
    if (typeof v !== 'number' || Number.isNaN(v)) throw new Error('Not a number');
    return v;
  };
  const trimmed = (source || '').trim();
  if (!trimmed) return { kind: 'empty' };
  const pointRe = /\(\s*([^,()]+)\s*,\s*([^,()]+)\s*\)/g;
  const pm = [...trimmed.matchAll(pointRe)];
  if (pm.length) {
    const remainder = trimmed.replace(pointRe, '').replace(/[\s,;]+/g, '');
    if (remainder) return { kind: 'invalid', msg: 'Invalid point list' };
    try { return { kind: 'points', points: pm.map((m) => ({ x: evalConst(m[1]), y: evalConst(m[2]) })) }; }
    catch (e) { return { kind: 'invalid', msg: e.message }; }
  }
  const eq = trimmed.indexOf('=');
  const left = eq >= 0 ? trimmed.slice(0, eq).trim() : 'y';
  const right = eq >= 0 ? trimmed.slice(eq + 1).trim() : trimmed;
  if (!right) return { kind: 'invalid', msg: 'Expression is incomplete' };
  const ll = left.toLowerCase();
  if (/^[a-z]$/.test(ll) && ll !== 'x' && ll !== 'y') {
    try { return { kind: 'variable', name: ll, value: evalConst(right) }; }
    catch (e) { return { kind: 'invalid', msg: e.message }; }
  }
  const lr = right.toLowerCase();
  const hasY = /(^|[^a-z])y([^a-z]|$)/.test(lr);
  const hasX = /(^|[^a-z])x([^a-z]|$)/.test(lr);
  try {
    if (ll === 'y' && !hasY) return { kind: 'explicit', axis: 'y', ast: parseToAst(right) };
    if (ll === 'x' && !hasX && hasY) return { kind: 'explicit', axis: 'x', ast: parseToAst(right) };
    if (eq < 0) return { kind: 'explicit', axis: 'y', ast: parseToAst(trimmed) };
    return { kind: 'implicit', leftAst: parseToAst(left), rightAst: parseToAst(right) };
  } catch (e) { return { kind: 'invalid', msg: e.message }; }
}

// Marching squares for implicit residuals → graph-space line segments.
function interpZero(a, b) {
  if (!isFinite(a.value) || !isFinite(b.value)) return [];
  if (a.value === 0 && b.value === 0) return [a, b];
  if (a.value === 0) return [a];
  if (b.value === 0) return [b];
  if (Math.sign(a.value) === Math.sign(b.value)) return [];
  const t = a.value / (a.value - b.value);
  return [{ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }];
}
function cellSegments(bl, br, tr, tl) {
  const pts = [...interpZero(bl, br), ...interpZero(br, tr), ...interpZero(tr, tl), ...interpZero(tl, bl)];
  const uniq = pts.filter((p, i) => pts.findIndex((q) => Math.abs(q.x - p.x) < 1e-12 && Math.abs(q.y - p.y) < 1e-12) === i);
  if (uniq.length < 2) return [];
  if (uniq.length === 2) return [{ from: uniq[0], to: uniq[1] }];
  let from = uniq[0], to = uniq[1], best = -1;
  for (let i = 0; i < uniq.length; i++) for (let j = i + 1; j < uniq.length; j++) {
    const d = (uniq[i].x - uniq[j].x) ** 2 + (uniq[i].y - uniq[j].y) ** 2;
    if (d > best) { best = d; from = uniq[i]; to = uniq[j]; }
  }
  return [{ from, to }];
}
function sampleImplicit(residual, view, cols, rows) {
  const xs = view.xmax - view.xmin, ys = view.ymax - view.ymin;
  const grid = [];
  for (let r = 0; r <= rows; r++) {
    const y = view.ymin + (r / rows) * ys;
    const line = [];
    for (let c = 0; c <= cols; c++) {
      const x = view.xmin + (c / cols) * xs;
      let v; try { v = residual(x, y); if (!isFinite(v)) v = NaN; } catch (e) { v = NaN; }
      line.push({ x, y, value: v });
    }
    grid.push(line);
  }
  const segs = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cs = cellSegments(grid[r][c], grid[r][c + 1], grid[r + 1][c + 1], grid[r + 1][c]);
    for (const s of cs) segs.push(s);
  }
  return segs;
}

// Numerical analysis: roots, extrema, intersections.
function bisectRoot(fn, l, r) {
  let lo = l, hi = r, lv = fn(lo);
  if (!isFinite(lv)) return null;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2, mv = fn(m);
    if (!isFinite(mv)) return null;
    if (mv === 0) return m;
    if (Math.sign(mv) === Math.sign(lv)) { lo = m; lv = mv; } else hi = m;
  }
  return (lo + hi) / 2;
}
function minimizeAbs(fn, l, r) {
  let lo = l, hi = r;
  for (let i = 0; i < 60; i++) {
    const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3;
    const av = fn(a), bv = fn(b);
    if (!isFinite(av) || !isFinite(bv)) return null;
    if (Math.abs(av) <= Math.abs(bv)) hi = b; else lo = a;
  }
  return (lo + hi) / 2;
}
function dedupe(values, tol) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.filter((v, i) => i === 0 || Math.abs(v - sorted[i - 1]) > tol);
}
function findRoots(fn, xmin, xmax, samples) {
  samples = samples || 400;
  const step = (xmax - xmin) / samples;
  const xs = [], ys = [], roots = [];
  for (let i = 0; i <= samples; i++) {
    const x = xmin + i * step, y = fn(x);
    xs.push(x); ys.push(y);
    if (isFinite(y) && y === 0) roots.push(x);
    if (i > 0 && isFinite(y) && isFinite(ys[i - 1]) && ys[i - 1] !== 0 && Math.sign(y) !== Math.sign(ys[i - 1])) {
      const rt = bisectRoot(fn, xs[i - 1], x);
      if (rt != null) roots.push(rt);
    }
  }
  for (let i = 1; i < samples; i++) {
    const b = ys[i - 1], v = ys[i], a = ys[i + 1];
    if (![b, v, a].every(isFinite) || v === 0) continue;
    if (Math.abs(v) < Math.abs(b) && Math.abs(v) <= Math.abs(a)) {
      const c = minimizeAbs(fn, xs[i - 1], xs[i + 1]);
      if (c == null) continue;
      const cv = fn(c);
      if (isFinite(cv) && Math.abs(cv) <= 1e-7) roots.push(c);
    }
  }
  return dedupe(roots, Math.max(1e-5, step * 1.5));
}
function findExtrema(fn, xmin, xmax, samples) {
  samples = samples || 320;
  const step = (xmax - xmin) / samples;
  const out = [];
  let prevSlope = null;
  for (let i = 1; i < samples; i++) {
    const x = xmin + i * step;
    const before = fn(x - step), value = fn(x), after = fn(x + step);
    if (![before, value, after].every(isFinite)) { prevSlope = null; continue; }
    const slope = after - value;
    if (prevSlope !== null) {
      if (prevSlope > 0 && slope < 0) out.push({ x, y: value, kind: 'max' });
      else if (prevSlope < 0 && slope > 0) out.push({ x, y: value, kind: 'min' });
    }
    prevSlope = slope;
  }
  return out.filter((p, i) => i === 0 || Math.abs(p.x - out[i - 1].x) > step * 3);
}
function findIntersections(left, right, xmin, xmax) {
  let coincident = true, comparable = 0;
  for (let i = 0; i <= 32; i++) {
    const x = xmin + (i / 32) * (xmax - xmin);
    const lv = left(x), rv = right(x);
    if (!isFinite(lv) && !isFinite(rv)) continue;
    if (!isFinite(lv) || !isFinite(rv)) { coincident = false; break; }
    comparable++;
    const scale = Math.max(1, Math.abs(lv), Math.abs(rv));
    if (Math.abs(lv - rv) > scale * 1e-10) { coincident = false; break; }
  }
  if (coincident && comparable >= 3) return [];
  return findRoots((x) => left(x) - right(x), xmin, xmax).map((x) => ({ x, y: left(x) })).filter((p) => isFinite(p.y));
}
function clusterPoints(points, tol) {
  const clusters = [];
  for (const p of points) {
    let placed = false;
    for (const c of clusters) {
      if (Math.hypot(c.x - p.x, c.y - p.y) <= tol) {
        c.pts.push(p);
        c.x = c.pts.reduce((s, q) => s + q.x, 0) / c.pts.length;
        c.y = c.pts.reduce((s, q) => s + q.y, 0) / c.pts.length;
        placed = true; break;
      }
    }
    if (!placed) clusters.push({ x: p.x, y: p.y, pts: [p] });
  }
  return clusters.map((c) => ({
    x: c.x, y: c.y,
    label: [...new Set(c.pts.map((q) => q.label))].join(' · '),
    color: c.pts[c.pts.length - 1].color,
  }));
}

// ── Scientific keypad layouts (mirrors mirai's SCIENTIFIC_KEY_SETS) ─────────
const CALC_KEY_SETS = {
  basic: [
    { label: '(', token: '(' }, { label: ')', token: ')' }, { label: '%', token: '%' },
    { label: '÷', token: '÷', tone: 'operator' }, { label: '⌫', action: 'backspace' }, { label: 'C', action: 'clear' },
    { label: '7' }, { label: '8' }, { label: '9' },
    { label: '×', token: '×', tone: 'operator' }, { label: 'x²', token: '²' }, { label: '√', token: '√(' },
    { label: '4' }, { label: '5' }, { label: '6' },
    { label: '−', token: '−', tone: 'operator' }, { label: 'xʸ', token: '^' }, { label: 'π', token: 'π' },
    { label: '1' }, { label: '2' }, { label: '3' },
    { label: '+', token: '+', tone: 'operator' }, { label: '|x|', token: 'abs(' }, { label: 'e', token: 'e' },
    { label: '±', token: '−' }, { label: '0' }, { label: '.' },
    { label: 'a⁄b', token: '÷' }, { label: '=', action: 'evaluate', tone: 'primary', span: 2 },
  ],
  functions: [
    { label: 'x²', token: '²' }, { label: 'x³', token: '³' }, { label: 'xʸ', token: '^' }, { label: '√', token: '√(' },
    { label: '∛', token: '∛(' }, { label: '1/x', token: '1÷(' }, { label: '|x|', token: 'abs(' }, { label: '10ˣ', token: '10^(' },
    { label: 'eˣ', token: 'exp(' }, { label: 'log', token: 'log(' }, { label: 'ln', token: 'ln(' }, { label: 'logᵦ', token: 'logb(' },
    { label: 'ⁿ√x', token: 'nthroot(' }, { label: 'x!', token: '!' }, { label: '%', token: '%' }, { label: 'abs', token: 'abs(' },
    { label: 'floor', token: 'floor(' }, { label: 'ceil', token: 'ceil(' }, { label: 'round', token: 'round(' }, { label: 'mod', token: 'mod(' },
  ],
  trig: [
    { label: 'sin', token: 'sin(' }, { label: 'cos', token: 'cos(' }, { label: 'tan', token: 'tan(' }, { label: 'sec', token: 'sec(' },
    { label: 'csc', token: 'csc(' }, { label: 'cot', token: 'cot(' }, { label: 'sin⁻¹', token: 'asin(' }, { label: 'cos⁻¹', token: 'acos(' },
    { label: 'tan⁻¹', token: 'atan(' }, { label: 'sinh', token: 'sinh(' }, { label: 'cosh', token: 'cosh(' }, { label: 'tanh', token: 'tanh(' },
    { label: 'π/2', token: 'π÷2' }, { label: 'π/3', token: 'π÷3' }, { label: 'π/4', token: 'π÷4' }, { label: 'π/6', token: 'π÷6' },
    { label: 'deg→rad', token: '×π÷180' }, { label: 'rad→deg', token: '×180÷π' }, { label: '(', token: '(' }, { label: ')', token: ')' },
  ],
};

// ── Vue component ───────────────────────────────────────────────────────────
const Planetarium = {
  name: 'Planetarium',
  template: `
    <div class="section calc-wrap" :class="{ 'calc-graphing': mode === 'graphing' }">
      <div class="section-eyebrow-row">
        <span class="section-label">{{ mode === 'graphing' ? 'Graphing' : 'Scientific' }} Calculator</span>
        <div class="section-rule"></div>
        <div class="calc-seg calc-mode-switch">
          <button :class="{ active: mode === 'scientific' }" @click="mode = 'scientific'">Scientific</button>
          <button :class="{ active: mode === 'graphing' }" @click="mode = 'graphing'">Graphing</button>
        </div>
      </div>

      <!-- ── Scientific mode ── -->
      <div v-show="mode === 'scientific'" class="calc-sci">
        <div class="calc-main">
          <div class="calc-display" @click="focusInput">
            <div class="calc-line" :class="{ dim: !expression.trim() }" aria-live="polite"><span ref="lineRender"></span></div>
            <input ref="expr" class="calc-input-overlay" v-model="expression" type="text" inputmode="none" autocomplete="off" spellcheck="false" @keydown.enter.prevent="evaluate" aria-label="Calculator expression" />
          </div>
          <div class="calc-controls">
            <div class="calc-seg" role="group" aria-label="Angle unit">
              <button :class="{ active: angleMode === 'deg' }" @click="angleMode = 'deg'">DEG</button>
              <button :class="{ active: angleMode === 'rad' }" @click="angleMode = 'rad'">RAD</button>
            </div>
            <div class="calc-util">
              <button class="calc-util-btn" :class="{ active: fractionView }" @click="fractionView = !fractionView">{{ fractionView ? 'Decimal' : 'Fraction' }}</button>
              <button class="calc-util-btn" @click="insertAns">Ans</button>
            </div>
          </div>
          <div class="calc-tabs">
            <button v-for="tab in tabs" :key="tab.id" :class="{ active: activeSet === tab.id }" @click="activeSet = tab.id">{{ tab.label }}</button>
          </div>
          <div class="calc-grid" :class="'cols-' + (activeSet === 'basic' ? 6 : 4)">
            <button v-for="(k, i) in keys" :key="activeSet + '-' + i" class="calc-key" :class="keyClass(k)" @click="press(k)">{{ k.label }}</button>
          </div>
        </div>

        <aside class="calc-sidebar">
          <div class="calc-side-block">
            <div class="calc-side-head">
              <span class="section-label">History</span><div class="section-rule"></div>
              <span class="section-link" v-if="history.length" @click="history = []">Clear</span>
            </div>
            <div class="calc-history" v-if="history.length">
              <button class="calc-history-item" v-for="h in history" :key="h.id" @click="reuse(h)">
                <span class="calc-history-expr">{{ h.expression }}</span>
                <span class="calc-history-res" :class="{ err: h.error }">{{ h.error ? h.result : '= ' + h.result }}</span>
              </button>
            </div>
            <p class="calc-side-empty" v-else>Your calculations appear here. Tap one to reuse it.</p>
          </div>
        </aside>
      </div>

      <!-- ── Graphing mode ── -->
      <div v-show="mode === 'graphing'" class="calc-graph">
        <div class="graph-side">
          <div class="graph-rows">
            <div class="graph-row-wrap" v-for="row in graph.rows" :key="row.id">
              <div class="graph-row" :class="{ invalid: row.error }">
                <button class="graph-dot" :style="{ background: row.visible ? row.color : 'transparent', borderColor: row.color }" @click="toggleRow(row)" :title="row.visible ? 'Hide' : 'Show'"></button>
                <input class="graph-input" v-model="row.text" @input="onRowInput(row)" placeholder="y=x^2 · x^2+y^2=25 · a=2 · (1,2)" spellcheck="false" autocomplete="off" />
                <button class="graph-remove" @click="removeRow(row.id)" aria-label="Remove">×</button>
              </div>
              <div class="graph-slider" v-if="row.slider">
                <button class="graph-play" @click="togglePlay(row)">{{ row.slider.playing ? '❚❚' : '▶' }}</button>
                <input type="range" class="graph-range" :min="row.slider.min" :max="row.slider.max" :step="row.slider.step" v-model.number="row.slider.value" @input="onSlider(row)" />
                <span class="graph-slider-val">{{ row.name }} = {{ fmtCoord(row.slider.value) }}</span>
              </div>
              <div class="graph-row-msg" v-if="row.error && row.msg">{{ row.msg }}</div>
            </div>
          </div>
          <button class="graph-add" @click="addRow">+ Add expression</button>
        </div>

        <div class="graph-canvas-host" ref="graphHost">
          <canvas ref="graphCanvas" @pointerdown="onGraphDown" @pointermove="onGraphMove" @pointerup="onGraphUp" @pointercancel="onGraphUp" @pointerleave="onGraphLeave"></canvas>
          <div class="graph-controls">
            <button @click="zoomBy(0.8)" aria-label="Zoom in">+</button>
            <button @click="zoomBy(1.25)" aria-label="Zoom out">−</button>
            <button @click="resetView" aria-label="Reset view">⌂</button>
            <button :class="{ active: graph.gridVisible }" @click="toggleGrid" aria-label="Toggle grid">▦</button>
          </div>
          <button class="graph-analysis-toggle" v-if="!graph.analysisOpen" @click="graph.analysisOpen = true">✛ Analysis</button>
          <div class="graph-analysis" v-else>
            <div class="graph-analysis-head">
              <span>Analysis</span>
              <button @click="graph.analysisOpen = false" aria-label="Hide analysis">×</button>
            </div>
            <div class="graph-analysis-trace" v-if="graph.trace">({{ fmtCoord(graph.trace.x) }}, {{ fmtCoord(graph.trace.y) }})</div>
            <div class="graph-marks">
              <button class="graph-mark" v-for="(m, i) in graph.marks" :key="i" @click="pickMark(m)">
                <span class="graph-mark-label">{{ m.label }}</span>
                <span class="graph-mark-coord">({{ fmtCoord(m.x) }}, {{ fmtCoord(m.y) }})</span>
              </button>
              <p class="graph-analysis-empty" v-if="!graph.marks.length">Touch a curve to trace. Zeros, extrema and intersections appear here.</p>
            </div>
          </div>
          <div class="graph-trace-chip" v-if="graph.trace">
            <span class="graph-trace-dot" :style="{ background: graph.trace.color }"></span>
            ({{ fmtCoord(graph.trace.x) }}, {{ fmtCoord(graph.trace.y) }})
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      mode: 'scientific',
      expression: '',
      angleMode: 'deg',
      activeSet: 'basic',
      fractionView: false,
      history: [],
      ans: 0,
      justEvaluated: false,
      _histId: 0,
      tabs: [{ id: 'basic', label: 'Basic' }, { id: 'functions', label: 'Functions' }, { id: 'trig', label: 'Trig' }],
      graph: {
        view: { ...DEFAULT_GRAPH_VIEW },
        gridVisible: true,
        analysisOpen: false,
        trace: null,
        marks: [],
        nextId: 2,
        rows: [
          { id: 1, text: 'y = x', color: GRAPH_PALETTE[0], visible: true, error: false, msg: '', slider: null, name: null },
        ],
      },
    };
  },
  computed: {
    keys() { return CALC_KEY_SETS[this.activeSet]; },
    live() {
      const expr = this.expression.trim();
      if (!expr) return { text: '', note: '', error: false, empty: true };
      try {
        const value = evaluateExpression(this.expression, { angleMode: this.angleMode, ans: this.ans });
        const frac = this.fractionView ? toFraction(value) : null;
        return { text: frac || formatNumber(value), note: frac ? 'exact fraction' : '=', error: false, empty: false };
      } catch (e) {
        return { text: (e && e.message) || 'Invalid expression', note: '', error: true, empty: false };
      }
    },
    // Any change here re-renders the KaTeX display line.
    mathState() {
      return [this.mode, this.expression, this.fractionView, this.angleMode, this.ans, this.justEvaluated].join('|');
    },
  },
  watch: {
    mode(value) { if (value === 'graphing') this.$nextTick(() => { this.setupGraph(); this.resizeGraph(); }); },
    mathState() { this.$nextTick(() => this.renderMath()); },
  },
  methods: {
    // ── Scientific ──
    keyClass(k) {
      const len = Array.from(k.label).length;
      const size = len === 1 ? 'k-single' : len <= 3 ? 'k-short' : len <= 5 ? 'k-medium' : 'k-long';
      return [k.tone ? 'tone-' + k.tone : '', k.span === 2 ? 'span-2' : '', size];
    },
    press(k) {
      if (k.action === 'backspace') { this.justEvaluated = false; return this.backspace(); }
      if (k.action === 'clear') { this.justEvaluated = false; return this.clearAll(); }
      if (k.action === 'evaluate') return this.evaluate();
      if (this.justEvaluated) {
        this.justEvaluated = false;
        // Tapping +, −, ×, ÷ continues from the result (e.g. 18 → 18+); anything
        // else (a digit, a function, a constant...) starts a brand new expression.
        if (k.tone !== 'operator') this.expression = '';
      }
      this.insertToken(k.token != null ? k.token : k.label);
    },
    selection() {
      const el = this.$refs.expr;
      if (el && typeof el.selectionStart === 'number') return { el, start: el.selectionStart, end: el.selectionEnd };
      const n = this.expression.length;
      return { el, start: n, end: n };
    },
    setCaret(el, caret) { this.$nextTick(() => { if (el) { el.focus(); try { el.setSelectionRange(caret, caret); } catch (e) {} } }); },
    focusInput() { const el = this.$refs.expr; if (el) el.focus(); },
    insertAns() {
      if (this.justEvaluated) { this.justEvaluated = false; this.expression = ''; }
      this.insertToken('Ans');
    },
    insertToken(token) {
      const { el, start, end } = this.selection();
      this.expression = this.expression.slice(0, start) + token + this.expression.slice(end);
      this.setCaret(el, start + token.length);
    },
    backspace() {
      const { el, start, end } = this.selection();
      if (start === 0 && end === 0) return;
      if (start === end) { this.expression = this.expression.slice(0, start - 1) + this.expression.slice(end); this.setCaret(el, start - 1); }
      else { this.expression = this.expression.slice(0, start) + this.expression.slice(end); this.setCaret(el, start); }
    },
    clearAll() { this.expression = ''; this.setCaret(this.$refs.expr, 0); },
    evaluate() {
      if (this.justEvaluated) return; // already resting on a result — nothing new to compute
      if (!this.expression.trim()) return;
      let result, error = false, value;
      try {
        value = evaluateExpression(this.expression, { angleMode: this.angleMode, ans: this.ans });
        const frac = this.fractionView ? toFraction(value) : null;
        result = frac || formatNumber(value);
        this.ans = value;
      } catch (e) { result = (e && e.message) || 'Invalid expression'; error = true; }
      const committed = this.expression;
      const top = this.history[0];
      if (!(top && top.expression === committed && top.result === result && top.error === error)) {
        this.history.unshift({ id: ++this._histId, expression: committed, result, error });
        if (this.history.length > 20) this.history.pop();
      }
      if (!error) {
        // Collapse "9+9" down to just "18" so the next operator tap continues from it (18+9...).
        this.expression = formatNumber(value);
        this.justEvaluated = true;
      }
      this.focusInput();
    },
    reuse(h) { this.justEvaluated = false; this.expression = h.expression; this.setCaret(this.$refs.expr, this.expression.length); },
    renderKatex(el, latex, fallback) {
      if (!el) return;
      const K = window.katex;
      if (K) { try { K.render(latex, el, { throwOnError: false }); return; } catch (e) {} }
      el.textContent = fallback;
    },
    // The whole display is one live line: "expression = result", typeset.
    renderMath() {
      const el = this.$refs.lineRender;
      if (!el) return;
      if (!this.expression.trim()) { this.renderKatex(el, '0', '0'); return; }
      const exprL = exprToLatex(this.expression);
      if (!this.justEvaluated && !this.live.empty && !this.live.error) {
        const resL = '\\textcolor{#c084fc}{' + resultToLatex(this.live.text) + '}';
        const latex = (exprL != null ? exprL : this.expression) + '\\;=\\;' + resL;
        this.renderKatex(el, latex, this.expression + ' = ' + this.live.text);
      } else if (exprL != null) {
        this.renderKatex(el, exprL, this.expression);   // mid-typing / error: just the expression
      } else {
        el.textContent = this.expression;
      }
    },

    // ── Graphing: setup & lifecycle ──
    setupGraph() {
      if (this._graphReady) return;
      const host = this.$refs.graphHost, canvas = this.$refs.graphCanvas;
      if (!host || !canvas) return;
      this._graphReady = true;
      this._compiled = {};
      this.graph.rows.forEach((r) => this.compileRow(r));
      this._ro = new ResizeObserver(() => this.resizeGraph());
      this._ro.observe(host);
      this._wheel = (e) => this.onGraphWheel(e);
      canvas.addEventListener('wheel', this._wheel, { passive: false });
      this.resizeGraph();
      this.scheduleAnalysis();
    },
    resizeGraph() {
      const host = this.$refs.graphHost, canvas = this.$refs.graphCanvas;
      if (!host || !canvas) return;
      const w = host.clientWidth, h = host.clientHeight;
      if (w <= 0 || h <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.gw = w; this.gh = h; this.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      this.graph.view = fitGraphViewToAspect(this.graph.view, w, h);
      this.drawGraph();
    },
    scheduleDraw() { if (this._raf) return; this._raf = requestAnimationFrame(() => { this._raf = null; this.drawGraph(); }); },
    scheduleAnalysis() { clearTimeout(this._analysisT); this._analysisT = setTimeout(() => { this.computeMarks(); this.drawGraph(); }, 180); },

    // ── Graphing: rows & variables ──
    buildVars() {
      const vars = {};
      for (const row of this.graph.rows) {
        const c = this._compiled && this._compiled[row.id];
        if (c && c.kind === 'variable') vars[row.name || c.name] = row.slider ? row.slider.value : c.value;
      }
      return vars;
    },
    compileRow(row) {
      if (!this._compiled) this._compiled = {};
      const c = compileGraph(row.text, { ans: this.ans });
      this._compiled[row.id] = c;
      row.error = c.kind === 'invalid';
      row.msg = c.kind === 'invalid' ? c.msg : '';
      if (c.kind === 'variable') {
        row.name = c.name;
        const bound = Math.max(10, Math.abs(c.value) * 2);
        if (!row.slider) row.slider = { min: -bound, max: bound, step: bound / 100, value: c.value, playing: false, _dir: 1 };
        else {
          row.slider.value = c.value;
          // Keep the thumb in sync: if the typed value no longer fits the current
          // range, re-center the range around it instead of letting it clamp.
          if (c.value < row.slider.min || c.value > row.slider.max) {
            row.slider.min = -bound; row.slider.max = bound; row.slider.step = bound / 100;
          }
        }
      } else { row.slider = null; row.name = null; }
    },
    onRowInput(row) { this.compileRow(row); this.scheduleDraw(); this.scheduleAnalysis(); },
    addRow() {
      const color = GRAPH_PALETTE[this.graph.rows.length % GRAPH_PALETTE.length];
      const row = { id: this.graph.nextId++, text: '', color, visible: true, error: false, msg: '', slider: null, name: null };
      this.graph.rows.push(row);
      this.compileRow(row);
      this.scheduleDraw();
    },
    removeRow(id) {
      this.graph.rows = this.graph.rows.filter((r) => r.id !== id);
      if (this._compiled) delete this._compiled[id];
      this.scheduleDraw(); this.scheduleAnalysis();
    },
    toggleRow(row) { row.visible = !row.visible; this.scheduleDraw(); this.scheduleAnalysis(); },
    onSlider(row) { this.scheduleDraw(); this.scheduleAnalysis(); },
    togglePlay(row) {
      if (!row.slider) return;
      row.slider.playing = !row.slider.playing;
      if (row.slider.playing) { row.slider._dir = row.slider._dir || 1; this.startSliderLoop(); }
    },
    startSliderLoop() {
      if (this._sliderRAF) return;
      const tick = () => {
        let any = false;
        for (const row of this.graph.rows) {
          const s = row.slider;
          if (s && s.playing) {
            any = true;
            const inc = (s.max - s.min) / 300;
            let v = s.value + (s._dir || 1) * inc;
            if (v >= s.max) { v = s.max; s._dir = -1; } else if (v <= s.min) { v = s.min; s._dir = 1; }
            s.value = parseFloat(v.toFixed(6));
          }
        }
        if (!any) { this._sliderRAF = null; return; }
        this.drawGraph();
        this._sliderRAF = requestAnimationFrame(tick);
      };
      this._sliderRAF = requestAnimationFrame(tick);
    },

    // ── Graphing: view control ──
    zoomBy(factor) {
      const v = this.graph.view;
      const cx = (v.xmin + v.xmax) / 2, cy = (v.ymin + v.ymax) / 2;
      this.graph.view = { xmin: cx + (v.xmin - cx) * factor, xmax: cx + (v.xmax - cx) * factor, ymin: cy + (v.ymin - cy) * factor, ymax: cy + (v.ymax - cy) * factor };
      this.scheduleDraw(); this.scheduleAnalysis();
    },
    resetView() {
      this.graph.view = fitGraphViewToAspect({ ...DEFAULT_GRAPH_VIEW }, this.gw || 1, this.gh || 1);
      this.scheduleDraw(); this.scheduleAnalysis();
    },
    toggleGrid() { this.graph.gridVisible = !this.graph.gridVisible; this.scheduleDraw(); },
    pickMark(m) { this.graph.trace = { x: m.x, y: m.y, color: m.color }; this.scheduleDraw(); },

    // ── Graphing: pointer interaction ──
    onGraphDown(e) {
      const c = this.$refs.graphCanvas;
      try { c.setPointerCapture(e.pointerId); } catch (err) {}
      this._panning = true; this._panMoved = false;
      this._panStart = { x: e.clientX, y: e.clientY, view: { ...this.graph.view } };
    },
    onGraphMove(e) {
      if (this._panning) {
        const dx = e.clientX - this._panStart.x, dy = e.clientY - this._panStart.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) this._panMoved = true;
        const s = this._panStart.view;
        const xShift = (dx / this.gw) * (s.xmax - s.xmin);
        const yShift = (dy / this.gh) * (s.ymax - s.ymin);
        this.graph.view = { xmin: s.xmin - xShift, xmax: s.xmax - xShift, ymin: s.ymin + yShift, ymax: s.ymax + yShift };
        this.scheduleDraw();
      } else {
        const rect = this.$refs.graphCanvas.getBoundingClientRect();
        this.updateTrace(e.clientX - rect.left, e.clientY - rect.top);
      }
    },
    onGraphUp(e) {
      if (this._panning && !this._panMoved) {
        const rect = this.$refs.graphCanvas.getBoundingClientRect();
        this.updateTrace(e.clientX - rect.left, e.clientY - rect.top);
      }
      if (this._panning && this._panMoved) this.scheduleAnalysis();
      this._panning = false;
    },
    onGraphLeave() { if (!this._panning && this.graph.trace) { this.graph.trace = null; this.scheduleDraw(); } },
    onGraphWheel(e) {
      e.preventDefault();
      const rect = this.$refs.graphCanvas.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const v = this.graph.view;
      const gx = v.xmin + (cx / this.gw) * (v.xmax - v.xmin);
      const gy = v.ymax - (cy / this.gh) * (v.ymax - v.ymin);
      const factor = e.deltaY > 0 ? 1 / 0.85 : 0.85;
      this.graph.view = { xmin: gx + (v.xmin - gx) * factor, xmax: gx + (v.xmax - gx) * factor, ymin: gy + (v.ymin - gy) * factor, ymax: gy + (v.ymax - gy) * factor };
      this.scheduleDraw(); this.scheduleAnalysis();
    },
    updateTrace(cx, cy) {
      const v = this.graph.view, gw = this.gw, gh = this.gh;
      if (!gw || !gh) return;
      const gx = v.xmin + (cx / gw) * (v.xmax - v.xmin);
      const baseVars = this.buildVars();
      const vars = Object.assign({}, baseVars);
      let best = null;
      for (const row of this.graph.rows) {
        if (!row.visible) continue;
        const comp = this._compiled && this._compiled[row.id];
        if (!comp || comp.kind !== 'explicit' || comp.axis !== 'y') continue;
        vars.x = gx;
        let gy;
        try { gy = evalNode(comp.ast, { angleMode: 'rad', ans: this.ans, vars }); } catch (err) { continue; }
        if (typeof gy !== 'number' || !isFinite(gy)) continue;
        const sy = gh - ((gy - v.ymin) / (v.ymax - v.ymin)) * gh;
        const d = Math.abs(sy - cy);
        if (d < 16 && (!best || d < best.d)) best = { d, x: gx, y: gy, color: row.color };
      }
      this.graph.trace = best ? { x: best.x, y: best.y, color: best.color } : null;
      this.scheduleDraw();
    },
    fmtCoord(v) {
      if (!isFinite(v)) return '∞';
      const r = Math.abs(v) < 1e-9 ? 0 : parseFloat(v.toPrecision(5));
      return String(r).replace(/-/g, '−');
    },

    // ── Graphing: analysis ──
    computeMarks() {
      if (!this.gw) { this.graph.marks = []; return; }
      const v = this.graph.view;
      const baseVars = this.buildVars();
      const explicit = [];
      for (const row of this.graph.rows) {
        if (!row.visible) continue;
        const comp = this._compiled && this._compiled[row.id];
        if (!comp || comp.kind !== 'explicit' || comp.axis !== 'y') continue;
        const vars = Object.assign({}, baseVars);
        const fn = (x) => { vars.x = x; try { const r = evalNode(comp.ast, { angleMode: 'rad', ans: this.ans, vars }); return typeof r === 'number' ? r : NaN; } catch (e) { return NaN; } };
        explicit.push({ fn, color: row.color });
      }
      const pts = [];
      for (const f of explicit) {
        for (const x of findRoots(f.fn, v.xmin, v.xmax)) pts.push({ x, y: 0, label: 'zero', color: f.color });
        for (const ex of findExtrema(f.fn, v.xmin, v.xmax)) if (ex.y >= v.ymin && ex.y <= v.ymax) pts.push({ x: ex.x, y: ex.y, label: ex.kind, color: f.color });
      }
      for (let i = 0; i < explicit.length; i++) for (let j = i + 1; j < explicit.length; j++) {
        for (const p of findIntersections(explicit[i].fn, explicit[j].fn, v.xmin, v.xmax)) {
          if (p.y >= v.ymin && p.y <= v.ymax) pts.push({ x: p.x, y: p.y, label: 'intersection', color: explicit[j].color });
        }
      }
      const finite = pts.filter((p) => isFinite(p.x) && isFinite(p.y));
      const tol = ((v.xmax - v.xmin) / this.gw) * 10;
      this.graph.marks = clusterPoints(finite, tol).slice(0, 16);
    },

    // ── Graphing: render ──
    drawGraph() {
      const canvas = this.$refs.graphCanvas;
      if (!canvas || !this.gw || !this.gh) return;
      const ctx = canvas.getContext('2d');
      const gw = this.gw, gh = this.gh, v = this.graph.view;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, gw, gh);
      ctx.fillStyle = 'rgba(8,6,22,0.55)';
      ctx.fillRect(0, 0, gw, gh);

      const sx = (gx) => ((gx - v.xmin) / (v.xmax - v.xmin)) * gw;
      const sy = (gy) => gh - ((gy - v.ymin) / (v.ymax - v.ymin)) * gh;
      const xstep = niceStep(v.xmax - v.xmin, 10);
      const ystep = niceStep(v.ymax - v.ymin, 8);

      if (this.graph.gridVisible) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(150,120,230,0.10)';
        ctx.beginPath();
        for (let gx = Math.ceil(v.xmin / xstep) * xstep; gx <= v.xmax; gx += xstep) { const x = sx(gx); ctx.moveTo(x, 0); ctx.lineTo(x, gh); }
        for (let gy = Math.ceil(v.ymin / ystep) * ystep; gy <= v.ymax; gy += ystep) { const y = sy(gy); ctx.moveTo(0, y); ctx.lineTo(gw, y); }
        ctx.stroke();
      }

      const originX = sx(0), originY = sy(0);
      const axisX = Math.max(0, Math.min(gw, originX));
      const axisY = Math.max(0, Math.min(gh, originY));
      ctx.strokeStyle = 'rgba(200,180,255,0.42)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      if (0 >= v.ymin && 0 <= v.ymax) { ctx.moveTo(0, originY); ctx.lineTo(gw, originY); }
      if (0 >= v.xmin && 0 <= v.xmax) { ctx.moveTo(originX, 0); ctx.lineTo(originX, gh); }
      ctx.stroke();

      ctx.fillStyle = 'rgba(170,158,200,0.85)';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.textBaseline = 'top'; ctx.textAlign = 'center';
      for (let gx = Math.ceil(v.xmin / xstep) * xstep; gx <= v.xmax; gx += xstep) {
        if (Math.abs(gx) < xstep / 1000) continue;
        ctx.fillText(formatTick(gx, xstep), sx(gx), Math.min(gh - 14, axisY + 4));
      }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let gy = Math.ceil(v.ymin / ystep) * ystep; gy <= v.ymax; gy += ystep) {
        if (Math.abs(gy) < ystep / 1000) continue;
        ctx.fillText(formatTick(gy, ystep), Math.max(30, axisX - 6), sy(gy));
      }

      const baseVars = this.buildVars();
      const yspan = v.ymax - v.ymin, xspan = v.xmax - v.xmin;
      const gridDiv = this._panning ? 10 : 6.5;

      for (const row of this.graph.rows) {
        if (!row.visible) continue;
        const comp = this._compiled && this._compiled[row.id];
        if (!comp) continue;
        ctx.strokeStyle = row.color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        const vars = Object.assign({}, baseVars);

        if (comp.kind === 'explicit' && comp.axis === 'y') {
          ctx.beginPath();
          let pen = false, prevY = null;
          for (let px = 0; px <= gw; px += 1.5) {
            const gx = v.xmin + (px / gw) * xspan;
            vars.x = gx;
            let gy; try { gy = evalNode(comp.ast, { angleMode: 'rad', ans: this.ans, vars }); } catch (e) { gy = NaN; }
            if (typeof gy !== 'number' || !isFinite(gy)) { pen = false; prevY = null; continue; }
            const py = sy(gy);
            if (!pen) { ctx.moveTo(px, py); pen = true; }
            else if (prevY != null && Math.abs(gy - prevY) > yspan * 4) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            prevY = gy;
          }
          ctx.stroke();
        } else if (comp.kind === 'explicit' && comp.axis === 'x') {
          ctx.beginPath();
          let pen = false, prevX = null;
          for (let py = 0; py <= gh; py += 1.5) {
            const gy = v.ymax - (py / gh) * yspan;
            vars.y = gy;
            let gx; try { gx = evalNode(comp.ast, { angleMode: 'rad', ans: this.ans, vars }); } catch (e) { gx = NaN; }
            if (typeof gx !== 'number' || !isFinite(gx)) { pen = false; prevX = null; continue; }
            const px = sx(gx);
            if (!pen) { ctx.moveTo(px, py); pen = true; }
            else if (prevX != null && Math.abs(gx - prevX) > xspan * 4) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            prevX = gx;
          }
          ctx.stroke();
        } else if (comp.kind === 'implicit') {
          const cols = Math.max(20, Math.min(140, Math.round(gw / gridDiv)));
          const rows = Math.max(20, Math.min(140, Math.round(gh / gridDiv)));
          const residual = (x, y) => { vars.x = x; vars.y = y; return evalNode(comp.leftAst, { angleMode: 'rad', ans: this.ans, vars }) - evalNode(comp.rightAst, { angleMode: 'rad', ans: this.ans, vars }); };
          const segs = sampleImplicit(residual, v, cols, rows);
          ctx.beginPath();
          for (const s of segs) { ctx.moveTo(sx(s.from.x), sy(s.from.y)); ctx.lineTo(sx(s.to.x), sy(s.to.y)); }
          ctx.stroke();
        } else if (comp.kind === 'points') {
          ctx.fillStyle = row.color;
          for (const p of comp.points) {
            const px = sx(p.x), py = sy(p.y);
            ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      // analysis markers
      for (const m of this.graph.marks) {
        const px = sx(m.x), py = sy(m.y);
        if (px < -4 || px > gw + 4 || py < -4 || py > gh + 4) continue;
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(13,11,30,0.9)'; ctx.fill();
        ctx.lineWidth = 1.6; ctx.strokeStyle = m.color; ctx.stroke();
      }

      const t = this.graph.trace;
      if (t && isFinite(t.x) && isFinite(t.y)) {
        const px = sx(t.x), py = sy(t.y);
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = t.color; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
      }
    },

    injectStyles() {
      if (document.getElementById('mirai-calc-styles')) return;
      const style = document.createElement('style');
      style.id = 'mirai-calc-styles';
      style.textContent = `
        .calc-wrap { max-width: 920px; margin: 0 auto; }
        .calc-wrap.calc-graphing { max-width: none; }
        .calc-mode-switch { flex-shrink: 0; }
        .calc-sci { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 20px; align-items: start; }
        .calc-main { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        .calc-sidebar { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
        .calc-side-block { display: flex; flex-direction: column; gap: 8px; }
        .calc-side-head { display: flex; align-items: center; gap: 10px; }
        .calc-side-empty { font-size: 12px; color: var(--muted); line-height: 1.6; padding: 2px 2px 4px; }
        .calc-display { position: relative; cursor: text; display: flex; align-items: center; justify-content: flex-end; min-height: 96px; background: linear-gradient(160deg, rgba(14,42,74,0.28), rgba(42,15,61,0.32)), rgba(8,6,24,0.6); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
        .calc-line { width: 100%; text-align: right; color: var(--stardust); font-weight: 700; font-size: clamp(1.6rem, 7vw, 2.6rem); line-height: 1.15; overflow-x: auto; overflow-y: hidden; white-space: nowrap; }
        .calc-line.dim { color: var(--muted); font-weight: 600; }
        .calc-line .katex { font-size: 1em; color: inherit; }
        .calc-line::-webkit-scrollbar { height: 3px; }
        .calc-line::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .calc-input-overlay { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; padding: 0 20px; border: none; background: transparent; color: transparent; caret-color: transparent; font-size: 16px; text-align: right; outline: none; cursor: text; }
        .calc-controls { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .calc-seg { display: inline-flex; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 999px; padding: 3px; }
        .calc-seg button { border: none; background: none; cursor: pointer; color: var(--muted); font-family: var(--font); font-size: 11px; font-weight: 800; letter-spacing: 0.06em; padding: 6px 16px; border-radius: 999px; transition: color var(--tr), background var(--tr); }
        .calc-seg button.active { color: #fff; background: linear-gradient(135deg, var(--purple), var(--violet)); box-shadow: 0 2px 12px rgba(124,58,237,0.4); }
        .calc-util { display: flex; gap: 8px; }
        .calc-util-btn { background: #1d1736; border: 1px solid var(--border); color: var(--stardust); font-family: var(--font); font-size: 12px; font-weight: 600; letter-spacing: 0.02em; padding: 7px 14px; border-radius: 999px; cursor: pointer; transition: all var(--tr); }
        .calc-util-btn:hover { border-color: var(--violet); background: #2c2154; transform: translateY(-1px); }
        .calc-util-btn.active { color: #d8b4fe; background: #4a2d80; border-color: rgba(168,85,247,0.5); }
        .calc-tabs { display: flex; gap: 24px; border-bottom: 1px solid var(--border); }
        .calc-tabs button { position: relative; background: none; border: none; cursor: pointer; font-family: var(--font); font-size: 13px; font-weight: 600; color: var(--muted); padding: 8px 2px 10px; transition: color var(--tr); }
        .calc-tabs button:hover { color: var(--stardust); }
        .calc-tabs button.active { color: var(--stardust); font-weight: 700; }
        .calc-tabs button.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, var(--purple), var(--violet)); box-shadow: 0 0 12px rgba(168,85,247,0.55); }
        .calc-grid { display: grid; gap: 8px; }
        .calc-grid.cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
        .calc-grid.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .calc-key { display: flex; align-items: center; justify-content: center; min-height: 46px; padding: 4px; border-radius: 12px; background: #191430; border: 1px solid rgba(124,58,237,0.18); color: var(--stardust); font-family: var(--font); font-weight: 600; cursor: pointer; user-select: none; transition: transform var(--tr), background var(--tr), border-color var(--tr), box-shadow var(--tr); }
        .calc-key:hover { background: #241b45; border-color: rgba(168,85,247,0.5); transform: translateY(-1px); }
        .calc-key:active { transform: translateY(0); box-shadow: inset 0 2px 8px rgba(0,0,0,0.35); }
        .calc-key.k-single { font-size: 1.15rem; } .calc-key.k-short { font-size: 1rem; } .calc-key.k-medium { font-size: 0.82rem; } .calc-key.k-long { font-size: 0.68rem; }
        .calc-key.tone-operator { background: #2a1f52; border-color: rgba(168,85,247,0.32); color: var(--glow); }
        .calc-key.tone-operator:hover { background: #352762; }
        .calc-key.tone-primary { background: linear-gradient(135deg, var(--purple), var(--violet)); border-color: transparent; color: #fff; font-size: 1.3rem; box-shadow: 0 4px 18px rgba(124,58,237,0.4); }
        .calc-key.tone-primary:hover { box-shadow: 0 6px 22px rgba(124,58,237,0.55); }
        .calc-key.span-2 { grid-column: span 2; }
        .calc-history { display: flex; flex-direction: column; gap: 6px; max-height: 300px; overflow-y: auto; }
        .calc-history-head { display: flex; align-items: center; gap: 12px; }
        .calc-history-item { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; padding: 8px 12px; cursor: pointer; text-align: left; transition: border-color var(--tr), background var(--tr); }
        .calc-history-item:hover { border-color: rgba(168,85,247,0.4); background: rgba(124,58,237,0.1); }
        .calc-history-expr { font-family: var(--font); font-size: 12.5px; color: var(--muted); word-break: break-all; }
        .calc-history-res { font-family: var(--font); font-size: 13px; font-weight: 700; color: var(--glow); white-space: nowrap; }
        .calc-history-res.err { color: #fca5a5; font-weight: 600; font-size: 11.5px; white-space: normal; }

        /* Graphing */
        .calc-graph { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 16px; align-items: start; }
        .graph-side { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .graph-rows { display: flex; flex-direction: column; gap: 8px; }
        .graph-row-wrap { display: flex; flex-direction: column; gap: 5px; }
        .graph-row { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; padding: 6px 8px; }
        .graph-row.invalid { border-color: rgba(239,68,68,0.5); }
        .graph-dot { width: 16px; height: 16px; flex-shrink: 0; border-radius: 50%; border: 2px solid; cursor: pointer; padding: 0; transition: transform var(--tr); }
        .graph-dot:hover { transform: scale(1.15); }
        .graph-input { flex: 1; min-width: 0; background: none; border: none; outline: none; color: var(--stardust); font-family: var(--font); font-size: 14px; padding: 4px 0; }
        .graph-input::placeholder { color: var(--muted); opacity: 0.6; font-size: 12px; }
        .graph-remove { background: none; border: none; color: var(--muted); font-size: 18px; line-height: 1; cursor: pointer; flex-shrink: 0; padding: 0 4px; transition: color var(--tr); }
        .graph-remove:hover { color: #fca5a5; }
        .graph-slider { display: flex; align-items: center; gap: 8px; padding: 2px 4px 2px 8px; }
        .graph-play { width: 24px; height: 24px; flex-shrink: 0; border-radius: 6px; border: 1px solid var(--border); background: #1d1736; color: var(--glow); font-size: 10px; cursor: pointer; transition: all var(--tr); }
        .graph-play:hover { border-color: var(--violet); background: #2c2154; }
        .graph-range { flex: 1; min-width: 0; accent-color: var(--violet); cursor: pointer; }
        .graph-slider-val { font-size: 11.5px; color: var(--glow); font-weight: 600; white-space: nowrap; flex-shrink: 0; }
        .graph-row-msg { font-size: 11px; color: #fca5a5; padding-left: 8px; }
        .graph-add { align-self: flex-start; background: #1d1736; border: 1px solid var(--border); color: var(--glow); font-family: var(--font); font-size: 12.5px; font-weight: 600; padding: 7px 14px; border-radius: 999px; cursor: pointer; transition: all var(--tr); }
        .graph-add:hover { border-color: var(--violet); background: #2c2154; transform: translateY(-1px); }
        .graph-canvas-host { position: relative; height: clamp(420px, 78vh, 1100px); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: rgba(8,6,22,0.55); }
        .graph-canvas-host canvas { display: block; width: 100%; height: 100%; touch-action: none; cursor: crosshair; }
        .graph-controls { position: absolute; top: 10px; left: 10px; display: flex; gap: 4px; padding: 4px; background: rgba(13,11,30,0.85); border: 1px solid var(--border); border-radius: 10px; backdrop-filter: blur(6px); }
        .graph-controls button { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: none; border: none; border-radius: 7px; color: var(--stardust); font-size: 16px; line-height: 1; cursor: pointer; transition: background var(--tr), color var(--tr); }
        .graph-controls button:hover { background: #2c2154; color: var(--glow); }
        .graph-controls button.active { background: #4a2d80; color: #d8b4fe; }
        .graph-analysis-toggle { position: absolute; right: 10px; bottom: 10px; background: rgba(13,11,30,0.9); border: 1px solid var(--border); color: var(--stardust); font-family: var(--font); font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 8px; cursor: pointer; backdrop-filter: blur(6px); transition: border-color var(--tr); }
        .graph-analysis-toggle:hover { border-color: var(--violet); color: var(--glow); }
        .graph-analysis { position: absolute; right: 10px; bottom: 10px; width: min(280px, calc(100% - 20px)); max-height: 60%; overflow: auto; background: rgba(13,11,30,0.94); border: 1px solid var(--border); border-radius: 10px; padding: 10px; backdrop-filter: blur(8px); box-shadow: 0 12px 32px rgba(0,0,0,0.5); }
        .graph-analysis-head { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--violet); margin-bottom: 8px; }
        .graph-analysis-head button { background: none; border: none; color: var(--muted); font-size: 16px; line-height: 1; cursor: pointer; }
        .graph-analysis-head button:hover { color: var(--stardust); }
        .graph-analysis-trace { font-family: var(--font); font-size: 12px; color: var(--stardust); background: rgba(255,255,255,0.05); border-radius: 6px; padding: 5px 8px; margin-bottom: 6px; }
        .graph-marks { display: flex; flex-direction: column; gap: 3px; }
        .graph-mark { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; background: none; border: none; border-radius: 6px; padding: 5px 7px; cursor: pointer; text-align: left; transition: background var(--tr); }
        .graph-mark:hover { background: rgba(124,58,237,0.16); }
        .graph-mark-label { font-size: 11.5px; color: var(--stardust); text-transform: capitalize; }
        .graph-mark-coord { font-size: 11px; color: var(--muted); white-space: nowrap; }
        .graph-analysis-empty { font-size: 11.5px; color: var(--muted); line-height: 1.5; padding: 4px 2px; }
        .graph-trace-chip { position: absolute; bottom: 10px; left: 10px; display: flex; align-items: center; gap: 7px; background: rgba(13,11,30,0.9); border: 1px solid var(--border); border-radius: 8px; padding: 5px 10px; font-family: var(--font); font-size: 12.5px; font-weight: 600; color: var(--stardust); backdrop-filter: blur(6px); }
        .graph-trace-dot { width: 9px; height: 9px; border-radius: 50%; }
        @media (max-width: 760px) { .calc-graph { grid-template-columns: 1fr; gap: 12px; } }
        @media (max-width: 720px) { .calc-sci { grid-template-columns: 1fr; } }
        @media (max-width: 520px) {
          .calc-key { min-height: 42px; border-radius: 10px; }
          .calc-grid { gap: 6px; }
          .calc-tabs { gap: 16px; }
          .calc-display { padding: 14px; }
          .calc-controls { gap: 8px; }
          .graph-slider-val { font-size: 11px; }
        }
        @media (max-width: 380px) {
          .calc-key { min-height: 38px; }
          .calc-key.k-single { font-size: 1.02rem; }
          .calc-key.tone-primary { font-size: 1.1rem; }
          .calc-grid { gap: 5px; }
          .calc-seg button { padding: 6px 12px; }
        }
      `;
      document.head.appendChild(style);
    },
  },
  mounted() {
    this.injectStyles();
    this.$nextTick(() => { this.setupGraph(); this.renderMath(); });
    // KaTeX is loaded with `defer`; if it isn't ready yet, re-render once it is.
    if (!window.katex) {
      this._katexTimer = setInterval(() => {
        if (window.katex) { clearInterval(this._katexTimer); this._katexTimer = null; this.renderMath(); }
      }, 200);
      setTimeout(() => { if (this._katexTimer) { clearInterval(this._katexTimer); this._katexTimer = null; } }, 5000);
    }
  },
  beforeUnmount() {
    if (this._ro) this._ro.disconnect();
    const c = this.$refs.graphCanvas;
    if (c && this._wheel) c.removeEventListener('wheel', this._wheel);
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._sliderRAF) cancelAnimationFrame(this._sliderRAF);
    clearTimeout(this._analysisT);
    if (this._katexTimer) clearInterval(this._katexTimer);
  },
};
