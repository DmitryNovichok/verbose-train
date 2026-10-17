/* Общие макросы KaTeX: используются и на сайте, и при проверке формул сборщиком. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { var m = factory(); root.TEX_FIX = m.__fix; delete m.__fix; root.TEX_MACROS = m; }
})(typeof self !== 'undefined' ? self : this, function () {
  // «·» внутри \text{…} KaTeX не понимает: превращаем в \cdot вне текста
  function fix(src) {
    if (src.indexOf('·') < 0) return src;
    var out = '', depth = -1, d = 0;
    for (var i = 0; i < src.length; i++) {
      var c = src[i];
      if (src.slice(i, i + 6) === '\\text{' && depth < 0) { out += '\\text{'; i += 5; d++; depth = d; continue; }
      if (c === '{') d++;
      if (c === '}') { if (d === depth) depth = -1; d--; }
      if (c === '·') { out += depth >= 0 ? '}\\cdot\\text{' : '\\cdot '; continue; }
      out += c;
    }
    return out;
  }
  return {
    __fix: fix,
    '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\Z': '\\mathbb{Z}', '\\Q': '\\mathbb{Q}', '\\Cx': '\\mathbb{C}',
    '\\tg': '\\operatorname{tg}', '\\ctg': '\\operatorname{ctg}', '\\arctg': '\\operatorname{arctg}', '\\arcctg': '\\operatorname{arcctg}',
    '\\sh': '\\operatorname{sh}', '\\ch': '\\operatorname{ch}', '\\th': '\\operatorname{th}', '\\cth': '\\operatorname{cth}',
    '\\grad': '\\operatorname{grad}', '\\Div': '\\operatorname{div}', '\\rot': '\\operatorname{rot}',
    '\\Res': '\\operatorname*{Res}', '\\sign': '\\operatorname{sign}', '\\rank': '\\operatorname{rank}', '\\tr': '\\operatorname{tr}',
    '\\const': '\\text{const}', '\\dd': '\\mathrm{d}', '\\ii': '\\mathrm{i}', '\\ee': '\\mathrm{e}',
    '\\Re': '\\operatorname{Re}', '\\Im': '\\operatorname{Im}', '\\Arg': '\\operatorname{Arg}', '\\Ln': '\\operatorname{Ln}',
    '\\E': '\\mathsf{M}', '\\D': '\\mathsf{D}', '\\Prob': '\\mathsf{P}', '\\cov': '\\operatorname{cov}',
    '\\vv': '\\vec{#1}', '\\abs': '\\left|#1\\right|', '\\norm': '\\left\\|#1\\right\\|',
    '\\pd': '\\dfrac{\\partial #1}{\\partial #2}', '\\od': '\\dfrac{\\mathrm{d} #1}{\\mathrm{d} #2}',
    '\\bra': '\\left\\langle #1\\right|', '\\ket': '\\left|#1\\right\\rangle', '\\braket': '\\left\\langle #1\\middle| #2\\right\\rangle',
    '\\unit': '\\,\\text{#1}'
  };
});
