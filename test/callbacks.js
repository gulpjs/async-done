'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;
var expect = require('lab').expect;

var asyncDone = require('../');

function success(cb){
  cb(null, 2);
}

function failure(cb){
  cb(new Error('Callback Error'));
}

function neverDone(someArg){
  return 2;
}

describe('callbacks', function(){

  it('should handle a successful callback', function(done){
    asyncDone(success, function(err, result){
      expect(result).to.equal(2);
      done(err);
    });
  });

  it('should handle an errored callback', function(done){
    asyncDone(failure, function(err, result){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('a function that takes an argument but never calls callback', function(done){
    asyncDone(neverDone, function(err){
      done(new Error('Callback called'));
    });

    setTimeout(function(){
      done();
    }, 1000);
  });

  it('should not handle error if something throws inside the callback', function(done){
    var d = require('domain').create();
    d.on('error', function(err){
      expect(err).to.be.instanceof(Error);
      done();
    });

    d.run(function(){
      asyncDone(success, function(){
        throw new Error('Thrown Error');
      });
    });
  });
});
