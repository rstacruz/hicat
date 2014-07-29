var hljs = require('highlight.js');

function Hicat (data, fname) {
  var ext = extname(fname);
  if (ext) {
    try {
      data = hljs.highlight(ext, data).value;
    } catch (e) {
      data = hljs.highlightAuto(data).value;
    }
  } else {
    data = hljs.highlightAuto(data).value;
  }

  if (!data) throw new Error("failed to highlight");
  data = html2ansi(data);
  return data;
}

Hicat.colors = {
  title: '4',

  comment: '32',

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
