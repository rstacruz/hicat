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
 * ~ type (string): File type
 */

function Hicat (str, options) {
  if (!options) options = {};
  var ext = options.type || (options.filename && extname(options.filename));
  if (ext) {
    try {
      str = hljs.highlight(ext, str).value;
    } catch (e) {
      str = hljs.highlightAuto(str).value;
    }
  } else {
    str = hljs.highlightAuto(str).value;
  }

  if (!str) throw new Error("failed to highlight");
  str = html2ansi(str);
  return str;
}

Hicat.colors = {
  title: '4',

  comment: '33',

  string: '32',
  number: '33',

  built_in: '1',
  keyword: '1',

  params: '0',
  literal: '34',
  value: '32',
  attribute: '34',
  regexp: '35',
};

function extname (fname) {
  var m = fname.match(/\.([^\.]+)$/);
  if (m) return m[1];
}

function html2ansi (str) {
  return str
    .replace(/<span class="hljs-([^"]*)">([^<]*)<\/span>/g, function (_, token, s) {
      var code = Hicat.colors[token];
      if (process.env.HICAT_DEBUG) s = s + "\033[30m[" + token + "]\033[0m";
      return code ? ("\033[" + code + "m" + s + "\033[0m") : s;
    })
    .replace(/<span class="hljs-([^"]*)">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

module.exports = Hicat;
