/* jshint expr: true */

var exec = require('child_process').exec;

exports.run = function (args) {
  before(function (next) {
    exec('./bin/hicat ' + args, function (_exit, _cout, _cerr) {
      global.result = {
        code: _exit && _exit.code || 0,
        error: _exit,
        out: _cout,
        stderr: _cerr
      };
      next();
    });
  });

  after(function () {
    delete global.result;
  });
};

exports.success = function () {
  it('is successful', function () {
    expect(global.result.error).falsy;
  });
};

exports.pipe = function (input, args) {
  before(function (next) {
    var spawn = require('child_process').spawn;
    var child = spawn('./bin/hicat', args || [], { stdio: 'pipe' });
    var result = global.result = { out: '', stderr: '' };

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    child.stdout.on('data', function (data) { result.out += data; });
    child.stderr.on('data', function (data) { result.stderr += data; });
    child.on('close', function (code) {
      result.code = code;
      next();
    });
  });

  after(function () {
    delete global.result;
  });
};
