var fs = require('fs');

/**
 * from() : from(files, fn)
 * Reads from files. If no files are given, read from stdin.
 */

exports.from = function (files, fn) {
  // from stdin
  if (!files || files.length === 0) {
    exports.stdin(function (err, data) {
      fn(err, { '-': data });
    });
  }
  // from files
  else {
    var out = {};
    try {
      files.forEach(function (fname) {
        out[fname] = fs.readFileSync(fname, 'utf-8');
      });
    } catch (err) {
      return fn(err);
    }
    fn(null, out);
  }
};

/**
 * stdin() : stdin(fn)
 * Read data from standard input.
 *
 *   stdin(function (err, data) {
 *     console.log(data);
 *   });
 */

exports.stdin = function (fn) {
  var data = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) data += chunk;
  });

  process.stdin.on('end', function() {
    fn(null, data);
  });
};
