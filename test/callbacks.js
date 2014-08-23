'use strict';

var lab = require('lab');
var describe = lab.experiment;
var it = lab.test;
var expect = lab.expect;

var asyncDone = require('../');

function success(cb) {
  cb(null, 2);
}

function failure(cb) {
  cb(new Error('Callback Error'));
}

function neverDone(someArg) {
  return 2;
}

describe('callbacks', function () {

  it('should handle a successful callback', function (done) {
    asyncDone(success, function (err, result) {
      expect(result).to.equal(2);
      done(err);
    });
  });

  it('should handle an errored callback', function (done) {
    asyncDone(failure, function (err, result) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  /*it('a function that takes an argument but never calls callback', function () {
   asyncDone(neverDone, function(err){
   t.plan(0);
   t.notOk(err);
   });

   setTimeout(function(){
   t.ok(true, 'done callback never called');
   t.end();
   }, 1000);
   });*/

  it('should not handle error if something throws inside the callback', function (done) {

    var d = require('domain').create();
    d.on('error', function (err) {
      expect(err).to.be.instanceof(Error);
      done();
    });

    d.run(function () {
      asyncDone(success, function () {
        throw new Error('Thrown Error');
      });
    });
  });

});
