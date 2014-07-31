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
  out.ansi = html2ansi(out.value, out.language);
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

Hicat.colors = require('./lib/colors');

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
 *     color('attribute', 'json')
 *     => '32'
 */

var color = Hicat.color = function (token, lang) {
  if (lang)
    return getColor(lang + ':' + token) || getColor(token);
  else
    return getColor(token);

  function getColor (token) {
    var code = token, newcode;
    while (true) {
      newcode = Hicat.colors[code];
      if (newcode) code = newcode;
      else if (token !== code) return code;
      else return;
    }
  }
};

/**
 * html2ansi() : html2ansi(str, lang)
 * (private) Converts hljs-style spans from a given HTML `str` into ANSI
 * color codes.
 *
 *   html2ansi('<span class="hljs-string">"hi"</span>")
 *   => "\033[31m"hi"\033[0m"
 */

function html2ansi (str, lang) {
  // do multiple passes as spans can be multiple
  while (~str.indexOf('<span class="hljs-')) {
    str = replaceSpan(str, lang);
  }

  return str
    .replace(/<span class="([^"]*)">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function replaceSpan (str, lang) {
  return str
    .replace(/<span class="hljs-([^"]*)">([^<]*)<\/span>/g, function (_, token, s) {
      var code = color(token, lang);
      if (process.env.HICAT_DEBUG) {
        return "" +
          colorize("[" + token + "]", color('tag', 'debug')) +
          colorize(s, code) +
          colorize("[/" + token + "]", color('tag', 'debug'));
      }
      return colorize(s, code);
    });
}

/**
 * colorize() : colorize(str, color)
 * Applies the color `color` to the string `str`.
 *
 *   colorize("hello", 32)
 *   => "\033[32mhello\033[0m"
 */

function colorize (s, color) {
  if (!color) return s;

  var reset = "\033[0m",
      code = "\033[" + color + "m";

  // improved support for less -R, since it automatically resets the colors per line
  if (~s.indexOf("\n")) s = s.replace(/\n/g, "\n"+code);

  // nesting
  if (~s.indexOf(reset)) {
    s = s.replace(/\033\[0m/g, code);
  }

  return code + s + reset;
}

module.exports = Hicat;
