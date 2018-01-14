'use strict';

var expect = require('expect');

var fs = require('fs');
var path = require('path');
var through = require('through2');
var pumpify = require('pumpify');

var asyncDone = require('../');

var exists = path.join(__dirname, '../.gitignore');
var notExists = path.join(__dirname, '../not_exists');

var EndStream = through.ctor(function(chunk, enc, cb) {
  this.push(chunk);
  cb();
}, function(cb) {
  this.emit('end', 2);
  cb();
});

function success() {
  var read = fs.createReadStream(exists);
  return read.pipe(new EndStream());
}

function failure() {
  var read = fs.createReadStream(notExists);
  return read.pipe(new EndStream());
}

function withErr(chunk, _, cb) {
  cb(new Error('Fail'));
}

function pumpifyError() {
  var read = fs.createReadStream(exists);
  var pipeline = pumpify(
    through(),
    through(withErr),
    through()
  );

  return read.pipe(pipeline);
}

function unpiped() {
  return fs.createReadStream(exists);
}

describe('streams', function() {
  it('should handle a successful stream', function(done) {
    asyncDone(success, function(err) {
      expect(err).toNotBeAn(Error);
      done();
    });
  });

  it('should handle an errored stream', function(done) {
    asyncDone(failure, function(err) {
      expect(err).toBeAn(Error);
      done();
    });
  });

  it('should handle an errored pipeline', function(done) {
    asyncDone(pumpifyError, function(err) {
      expect(err).toBeAn(Error);
      expect(err.message).toNotBe('premature close');
      done();
    });
  });

  it('handle a returned stream and cb by only calling callback once', function(done) {
    asyncDone(function(cb) {
      return success().on('end', function() {
        cb(null, 3);
      });
    }, function(err, result) {
      expect(err).toNotBeAn(Error);
      expect(result).toEqual(3); // To know we called the callback
      done();
    });
  });

  it('consumes an unpiped readable stream', function(done) {
    asyncDone(unpiped, function(err) {
      expect(err).toNotBeAn(Error);
      done();
    });
  });
});
