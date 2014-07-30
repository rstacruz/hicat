/**
 * print() : print(str)
 * Prints the given string `str` to the terminal. If it is too long, it is ran
 * through a pager.
 */

exports.print = function (str) {
  var count = str.split("\n").length;
  exports.lines(function (err, max) {
    if (max && count > max)
      exports.page(str);
    else
      process.stdout.write(str);
  });
};

/**
 * lines() : lines(fn)
 * (private) Returns the number of lines in the terminal.
 *
 *   lines(function (err, n) {
 *     n == 24
 *   });
 */

exports.lines = function (fn) {
  require('child_process').exec('tput lines', function (err, cin, cout) {
    if (err) fn();
    else fn(null, +cin);
  });
};

/**
 * page() : page(str)
 * (private) Prints the `str` through a pager.
 */

exports.page = function (str) {
  var spawn = require('child_process').spawn;
  var child = spawn('less', ['-R'], { stdio: [ 'pipe', 1, 2 ] });
  child.stdin.write(str);
  child.stdin.end();
};
