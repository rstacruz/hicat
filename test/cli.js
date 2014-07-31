var exec = require('child_process').exec;
var cout, cerr, exit;

function run (args) {
  beforeEach(function (next) {
    exec('./bin/hicat ' + args, function (_exit, _cout, _cerr) {
      exit = _exit;
      cout = _cout;
      cerr = _cerr;
      next();
    });
  });
}

function success () {
  it('is successful', function () {
    expect(exit).eql(null);
  });
}

describe('--help', function () {
  run('--help');
  success();

  it('shows --help', function () {
    expect(cout).include('-h, --help');
    expect(cout).include('print usage information');
  });
});

describe('--version', function () {
  run('--version');
  success();

  it('shows version info', function () {
    expect(cout).include(require('../package.json').version);
  });
});

describe('-v', function () {
  run('-v');
  success();

  it('shows version info', function () {
    expect(cout).include(require('../package.json').version);
  });
});

describe('a ruby example', function () {
  run('samples/ruby.rb --no-pager');
  success();

  it('highlights', function () {
    expect(cout).match(/method/);
    expect(cout).match(/string/);
  });
});

describe('not found', function () {
  run('xxx yyy zzz --no-pager');

  it('fails', function () {
    expect(exit.code).eql(8);
  });

  it('does no output', function () {
    expect(cout).eql('');
  });

  it('reports errors', function () {
    expect(cerr).match(/xxx/);
    expect(cerr).match(/yyy/);
    expect(cerr).match(/zzz/);
    expect(cerr).match(/no such file or directory/);
  });
});
