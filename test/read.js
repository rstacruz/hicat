/* jshint expr: true */
var expect = require('chai').expect;
var read = require('../lib/read');

describe('read.files', function () {
  var data;

  beforeEach(function (next) {
    read.files(['./test/read.js', './foo'], function (err, _data) {
      expect(err).falsy;
      data = _data;
      next();
    });
  });

  it('returns .files', function () {
    expect(data.files).array;
    expect(data.files).have.length(2);
  });

  it('gives data', function () {
    var file = data.files[0];
    expect(file.data).a('string');
    expect(file.data).match(/Hola mundo/);
    expect(file.file).eql('./test/read.js');
  });

  it('gives errors', function () {
    var file = data.files[1];
    expect(file.error).instanceOf(Error);
    expect(file.error.code).eql('ENOENT');
  });
});

/* Hola mundo */
