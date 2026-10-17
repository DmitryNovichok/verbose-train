/* Общие макросы KaTeX: используются и на сайте, и при проверке формул сборщиком. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TEX_MACROS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return {
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
