var hljs = require('highlight.js');

/**
 * Hicat() : Hicat(str, options)
 * Highlights a given `str` string.
 *
 *   Hicat("echo 'hi'", { filename: 'script.sh' })
 *
 * Options available:
 *
 * ~ filename (string): Filename
 * ~ lang (string): Language to use
 */

function Hicat (str, options) {
  if (!options) options = {};
  var lang = options.lang || (options.filename && extname(options.filename));
  var out;
  if (lang) {
    try {
      out = hljs.highlight(lang, str);
    } catch (e) {
      out = hljs.highlightAuto(str);
    }
  } else {
    out = hljs.highlightAuto(str);
  }

  if (!out || !out.value) throw new Error("failed to highlight");
  out.ansi = html2ansi(out.value);
  return {
    ansi: out.ansi,
    language: out.language,
    html: out.value,
    raw: str
  };
}

/**
 * Hicat.colors:
 * The color scheme. You can modify the color scheme if you wish.
 */

Hicat.colors = {
  keyword: '1',
  built_in: 'keyword',
  tag: 'keyword', /* css tag */
  class: 'keyword', /* css class */

  title: '4', /* tags, function names */

  comment: '33',
  doctype: 'comment',
  pi: 'comment', /* xml declaration */
  preprocessor: 'comment', /* C/C++ preprocessor directives */
  horizontal_rule: 'comment',  /* markdown HR --- */

  string: '32',
  value: 'string', /* html/json values */
  code: 'string', /* markdown code */
  link_reference: 'string', /* markdown link reference */

  number: '33',
  symbol: 'number', /* ruby :symbols */
  hexcolor: 'number', /* css hex holor */
  link_url: 'number', /* markdown link url */

  function: '1', /* css function, like rgba() */
  strong: 'function', /* markdown strong */
  link_label: 'strong', /* markdown links */
  header: '1;37', /* markdown header */

  attribute: '34', /* html/json attributes */
  literal: 'attribute', /* true, false, etc */
  variable: 'attribute', /* xml variable */

  pseudo: '30', /* css pseudoclass :before */
  attr_selector: 'pseudo', /* css attr [type='number'] */
  blockquote: 'pseudo', /* markdown blockquote */

  params: '0', /* function parameters () */
  regexp: '35'
};

/**
 * Hicat.listLanguages():
 * Returns a list of supported languages.
 */

Hicat.listLanguages = hljs.listLanguages;

/**
 * extname : extname(filename)
 * (private) Extracts the extension from a given `filename`.
 *
 *   extname('hi.json')
 *   => 'json'
 */

function extname (fname) {
  var m = fname.match(/\.([^\.]+)$/);
  if (m) return m[1];
}

/**
 * color : color(token)
 * (private) returns the color for a given token.
 *
 *     color('string')
 *     => '32'
 */

var color = Hicat.color = function (token) {
  var code = token, newcode;
  while (true) {
    newcode = Hicat.colors[code];
    if (newcode) code = newcode;
    else if (token !== code) return code;
    else return;
  }
};

/**
 * html2ansi : html2ansi(str)
 * (private) Converts hljs-style spans from a given HTML `str` into ANSI
 * color codes.
 *
 *   html2ansi('<span class="hljs-string">"hi"</span>")
 *   => "\033[31m"hi"\033[0m"
 */

function html2ansi (str) {
  return str
    .replace(/<span class="hljs-([^"]*)">([^<]*)<\/span>/g, function (_, token, s) {
      var code = color(token);
      if (process.env.HICAT_DEBUG) s = s + "\033[30m[" + token + "]\033[0m";
      return code ? ("\033[" + code + "m" + s + "\033[0m") : s;
    })
    .replace(/<span class="([^"]*)">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

module.exports = Hicat;
