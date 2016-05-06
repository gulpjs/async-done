'use strict';

var expect = require('expect');

var when = require('when');

var asyncDone = require('../');

function success() {
  return when.resolve(2);
}

function failure() {
  return when.reject(new Error('Promise Error'));
}

describe('promises', function() {

  it('should handle a resolved promise', function(done) {
    asyncDone(success, function(err, result) {
      expect(result).toEqual(2);
      done(err);
    });
  });

  it('should handle a rejected promise', function(done) {
    asyncDone(failure, function(err) {
      expect(err).toBeAn(Error);
      done();
    });
  });
});
