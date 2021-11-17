'use strict';

var expect = require('expect');

var asyncDone = require('../');

var rxjs = require('rxjs');

function success() {
  return rxjs.empty();
}

function successValue() {
  // This corresponds to `Observable.return(42);` in RxJS 4
  return rxjs.of(42);
}

function failure() {
  return rxjs.throw(new Error('Observable error'));
}

describe('observables', function() {

  it('should handle a finished observable', function(done) {
    asyncDone(success, function(err, result) {
      expect(result).toBeUndefined();
      done(err);
    });
  });

  it('should handle a finished observable with value', function(done) {
    asyncDone(successValue, function(err, result) {
      expect(result).toEqual(42);
      done(err);
    });
  });

  it('should handle an errored observable', function(done) {
    asyncDone(failure, function(err) {
      expect(err).toBeInstanceOf(Error);
      done();
    });
  });
});
