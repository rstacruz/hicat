var run = require('./cli_helpers').run,
    pipe = require('./cli_helpers').pipe;
    success = require('./cli_helpers').success;

describe('pipe', function () {

  var input = 'var x = 2';
  pipe(input);
  success();

  it('has no stderr', function () {
    expect(result.stderr).eql('');
  });

  it('has results', function () {
    expect(result.out).eql(hicat(input).ansi);
  });
});

describe('--help', function () {
  run('--help');
  success();

  it('shows --help', function () {
    expect(result.out).include('-h, --help');
    expect(result.out).include('print usage information');
  });
});

describe('--version', function () {
  run('--version');
  success();

  it('shows version info', function () {
    expect(result.out).include(require('../package.json').version);
  });
});

describe('-v', function () {
  run('-v');
  success();

  it('shows version info', function () {
    expect(result.out).include(require('../package.json').version);
  });
});

describe('--list-colors', function () {
  run('--list-colors');
  success();

  it('has color constants', function () {
    expect(result.out).match(/RED=[0-9;]+/);
    expect(result.out).match(/GREEN=[0-9;]+/);
    expect(result.out).match(/BLUE=[0-9;]+/);
    expect(result.out).match(/CYAN=[0-9;]+/);
    expect(result.out).match(/YELLOW=[0-9;]+/);
  });

  it('has "value"', function () {
    expect(result.out).match(/value=.*/);
  });
});

describe('a ruby example', function () {
  run('samples/ruby.rb --no-pager');
  success();

  it('highlights', function () {
    expect(result.out).match(/method/);
    expect(result.out).match(/string/);
  });
});

describe('not found', function () {
  run('xxx yyy zzz --no-pager');

  it('fails', function () {
    expect(result.code).eql(8);
  });

  it('does no output', function () {
    expect(result.out).eql('');
  });

  it('reports errors', function () {
    expect(result.stderr).match(/xxx/);
    expect(result.stderr).match(/yyy/);
    expect(result.stderr).match(/zzz/);
    expect(result.stderr).match(/no such file or directory/);
  });
});
