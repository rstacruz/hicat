var expect = require('chai').expect,
    hicat = require('../index'),
    extend = require('util')._extend;

var str;

describe('Hicat the module', function() {
  it('is a function', function () {
    expect(hicat).be.a('function');
  });
  it('has colors', function () {
    expect(hicat.colors).be.a('object');
    expect(hicat.colors.string).be.a('string');
  });
});

describe('A simple example', function() {
  beforeEach(function () {
    str = hicat('var x = 2 + "hi"; /*yo*/');
  });

  it('produces ansi codes', function () {
    var code = str.replace(/\033[^m]+m/g, '');
    expect(code).eql('var x = 2 + "hi"; /*yo*/');
  });

  it('highlights numbers', function () {
    expect(str).include('\033[33m2\033[0m');
  });

  it('highlights comments', function () {
    expect(str).include('\033[33m/*yo*/\033[0m');
  });
});

describe('Hicat.color', function () {
  var oldcolors;

  beforeEach(function () {
    oldcolors = extend({}, hicat.colors);
  });

  afterEach(function () {
    hicat.colors = oldcolors;
  });

  it('works for simple cases', function () {
    hicat.colors = { string: '80' };
    expect(hicat.color('string')).eql('80');
  });

  it('resolves references', function () {
    hicat.colors = { string: '70', str: 'string', s: 'str' };
    expect(hicat.color('s')).eql('70');
  });
});
