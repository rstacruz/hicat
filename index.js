var hljs = require('highlight.js');
var colorize;

/***
 * hicat() : hicat(str, options)
 * Highlights a given `str` string.
 *
 *   var hicat = require('hicat');
 *   hicat("echo 'hi'", { filename: 'script.sh' })
 *   => "echo \033[32m'hi'\033[0m"
 *
 * Options available:
 *
 * ~ filename (String): filename
 * ~ lang (String): language to use
 * ~ debug (Boolean): set to `true` for extra info
 */

function hicat (str, options) {
  if (!options) options = {};

  var lang = options.lang || (options.filename && extname(options.filename));
  var debug = options.debug;
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
  out.ansi = html2ansi(out.value, { lang: out.language, debug: debug });

  if (debug) {
    var info = "/* hicat language: " + out.language + " */";
    info = colorize(info, color('tag', 'debug'));
    out.ansi += "\n\n" + info + "\n";
  }

  return {
    ansi: out.ansi,
    language: out.language,
    html: out.value,
    raw: str
  };
}

/**
 * colors : hicat.colors
 * The color scheme. This is a key-value object that `hicat.color()` refers to.
 */

hicat.colors = require('./lib/colors');

/**
 * listLanguages() : hicat.listLanguages()
 * Returns a list of supported languages.
 *
 *   listLanguages()
 *   => ['javascript', 'python', 'c', ...]
 */

hicat.listLanguages = hljs.listLanguages;

/**
 * extname() : extname(filename)
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
 * color() : hicat.color(token)
 * Returns the color for a given token.
 *
 *     color('string')
 *     => '32'
 *     color('attribute', 'json')
 *     => '32'
 */

var color = hicat.color = function (token, lang) {
  if (lang)
    return getColor(lang + ':' + token) || getColor(token);
  else
    return getColor(token);

  function getColor (token) {
    var code = token, newcode;
    while (true) {
      newcode = hicat.colors[code];
      if (newcode) code = newcode;
      else if (token !== code) return code;
      else return;
    }
  }
};

/**
 * html2ansi() : html2ansi(str, options)
 * (private) Converts hljs-style spans from a given HTML `str` into ANSI
 * color codes. Available options:
 *
 * ~ lang (String): language
 * ~ debug (Boolean): true or false
 *
 *   html2ansi('<span class="hljs-string">"hi"</span>")
 *   => "\033[31m"hi"\033[0m"
 */

function html2ansi (str, options) {
  // do multiple passes as spans can be multiple
  while (~str.indexOf('<span class="hljs-')) {
    str = replaceSpan(str, options);
  }

  return str
    .replace(/<span class="([^"]*)">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * replaceSpan() : replaceSpan(html, options)
 * (private) Replaces span tags with ANSI codes in the given `html` string.
 * A delegate of `html2ansi`.
 *
 *   html = '<span class="hljs-tag">hi</span>'
 *   replaceSpan(html, 'java')
 *   => "\033[0;32mhi\033[0m"
 */

function replaceSpan (str, options) {
  return str
    .replace(/<span class="hljs-([^"]*)">([^<]*)<\/span>/g, function (_, token, s) {
      var code = color(token, options && options.lang);
      if (options.debug) {
        return "" +
          colorize("[" + token + "]", color('tag', 'debug')) +
          colorize(s, code) +
          colorize("[/" + token + "]", color('tag', 'debug'));
      }
      return colorize(s, code);
    });
}

/**
 * colorize() : hicat.colorize(str, color)
 * Applies the color `color` to the string `str`.
 *
 *   colorize("hello", 32)
 *   => "\033[32mhello\033[0m"
 */

colorize = hicat.colorize = function (s, color) {
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
};

module.exports = hicat;
