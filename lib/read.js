var fs = require('fs');

/***
 * read() : read(files, fn)
 * Reads from files. If no files are given, read from stdin.
 * The `err` argument will always be null: errors will be part of `res`.
 *
 *   fnames = ['readme.txt']
 *   read(fnames, function (err, res) {
 *     res.data    //=> '...'
 *
 *     res.files.forEach(f) {
 *       f.data    //=> ...
 *       f.stdin   //=> true | false
 *       f.name    //=> 'readme.txt'
 *       f.error   //=> undefined | Error(...)
 *     }
 *   });
 */

function read (files, fn) {
  // from stdin
  if (!files || files.length === 0) {
    read.stdin(function (err, data) {
      if (err)
        fn(null, new Result([{ stdin: true, error: err }]));
      else
        fn(null, new Result([{ stdin: true, data: data }]));
    });
  }
  // from files
  else {
    var out = files.map(function (fname) {
      try {
        var data = fs.readFileSync(fname, 'utf-8');
        return { name: fname, data: data };
      } catch (err) {
        return { name: fname, error: err };
      }
    });

    out = new Result(out);
    fn(null, out);
  }
}

/**
 * read.stdin() : read.stdin(fn)
 * Read data from standard input. The `err` argument will always be null.
 *
 *   read.stdin(function (err, data) {
 *     console.log(data); // string
 *   });
 */

read.stdin = function (fn) {
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

/***
 * res:
 */

function Result(files) {
  this.files = files;
}

/**
 * res.data:
 * Returns a concatenation of all data.
 */

getter(Result.prototype, 'data', function () {
  return this.files.map(function (f) { return f.data || ""; }).join("");
});

/**
 * res.error:
 * returns the first error.
 */

getter(Result.prototype, 'error', function () {
  return this.files.reduce(function (acc, f) { return acc || f.error; });
});

/**
 * res.files:
 * list of files.
 */

/**
 * getter() : getter(prototype, prop, fn)
 * (private) Defines a get property `prop` in the given `prototype` object.
 */

function getter (proto, prop, fn) {
  Object.defineProperty(proto, prop, { get: fn });
}

module.exports = read;
