'use strict';

var domain = require('domain');

var expect = require('expect');

var when = require('when');

var asyncDone = require('../');

function success() {
  return when.resolve(2);
}

function failure() {
  return when.reject(new Error('Promise Error'));
}

function rejectNoError() {
  return when.reject();
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

  it('properly errors when rejected without an error', function(done) {
    asyncDone(rejectNoError, function(err) {
      expect(err).toExist();
      expect(err).toBeAn(Error);
      done();
    });
  });

  it('does not swallow thrown errors in callback', function(done) {
    var d = domain.create();
    d.once('error', function(err) {
      expect(err).toExist();
      expect(err.message).toContain('Boom');
      done();
    });
    d.run(function() {
      asyncDone(success, function() {
        throw new Error('Boom');
      });
    });
  });
});
