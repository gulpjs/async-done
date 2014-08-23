'use strict';

var lab = require('lab');
var describe = lab.experiment;
var it = lab.test;
var expect = lab.expect;

var when = require('when');

var asyncDone = require('../');

function success() {
  return when.resolve(2);
}

function failure() {
  return when.reject(new Error('Promise Error'));
}

describe('promises', function () {

  it('should handle a resolved promise', function (done) {
    asyncDone(success, function (err, result) {
      expect(result).to.equal(2);
      done(err);
    });
  });

  it('should handle a rejected promise', function (done) {
    asyncDone(failure, function (err, result) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

});