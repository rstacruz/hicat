var fs = require('fs');

/**
 * from() : from(files, fn)
 * Reads from files. If no files are given, read from stdin.
 *
 *   files = ['readme.txt']
 *   read.from(files, function (err, files) {
 *     files.forEach(f) {
 *       f.data    //=> ...
 *       f.stdin   //=> true | false
 *       f.file    //=> 'readme.txt'
 *       f.error   //=> undefined | Error(...)
 *     }
 *   });
 */

exports.from = function (files, fn) {
  // from stdin
  if (!files || files.length === 0) {
    exports.stdin(function (err, data) {
      if (err)
        fn(null, [{ file: '-', stdin: true, error: err }]);
      else
        fn(null, [{ file: '-', stdin: true, data: data }]);
    });
  }
  // from files
  else {
    var out = files.map(function (fname) {
      try {
        var data = fs.readFileSync(fname, 'utf-8');
        return { file: fname, data: data };
      } catch (err) {
        return { file: fname, error: err };
      }
    });

    fn(null, out);
  }
};

/**
 * stdin() : stdin(fn)
 * Read data from standard input.
 *
 *   read.stdin(function (err, data) {
 *     console.log(data); // string
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
