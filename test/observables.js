'use strict';

var expect = require('expect');

var asyncDone = require('../');

var Observable = require('rxjs').Observable;

function success() {
  return Observable.empty();
}

function successValue() {
  // This corresponds to `Observable.return(42);` in RxJS 4
  return Observable.of(42);
}

function failure() {
  return Observable.throw(new Error('Observable error'));
}

describe('observables', function() {

  it('should handle a finished observable', function(done) {
    asyncDone(success, function(err, result) {
      expect(result).toEqual(undefined);
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
      expect(err).toBeAn(Error);
      done();
    });
  });
});
