'use strict';

var lab = require('lab');
var describe = lab.experiment;
var it = lab.test;
var expect = lab.expect;

var asyncDone = require('../');

var Observable = require('rx').Observable;

function success() {
  return Observable.empty();
}

function successValue() {
  return Observable.return(42);
}

function failure() {
  return Observable.throw(new Error('Observable error'));
}

describe('observables', function () {

  it('should handle a finished observable', function (done) {
    asyncDone(success, function (err, result) {
      expect(result).to.be.undefined;
      done(err);
    });
  });

  /*
   Currently, we don't support values returned from observables.
   This keeps the code simpler.
  it('should handle a finished observable with value', function (done) {
    asyncDone(successValue, function (err, result) {
      expect(result).to.equal(42);
      done(err);
    });
  });
   */

  it('should handle an errored observable', function (done) {
    asyncDone(failure, function (err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

});
