'use strict';

var expect = require('expect');

var asyncDone = require('../');

function success(cb) {
  cb(null, 2);
}

function failure(cb) {
  cb(new Error('Callback Error'));
}

function neverDone() {
  return 2;
}

describe('callbacks', function() {

  it('should handle a successful callback', function(done) {
    asyncDone(success, function(err, result) {
      expect(result).toEqual(2);
      done(err);
    });
  });

  it('should handle an errored callback', function(done) {
    asyncDone(failure, function(err) {
      expect(err).toBeAn(Error);
      done();
    });
  });

  it('a function that takes an argument but never calls callback', function(done) {
    asyncDone(neverDone, function() {
      done(new Error('Callback called'));
    });

    setTimeout(function() {
      done();
    }, 1000);
  });

  it('should not handle error if something throws inside the callback', function(done) {
    var d = require('domain').create();
    d.on('error', function(err) {
      expect(err).toBeAn(Error);
      done();
    });

    d.run(function() {
      asyncDone(success, function() {
        throw new Error('Thrown Error');
      });
    });
  });
});
