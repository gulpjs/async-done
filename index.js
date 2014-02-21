'use strict';

var domain = require('domain');
var EE = require('events').EventEmitter;

function asyncDone(fn, done){
  function successCallback(){
    return done();
  }

  function errorCallback(err){
    return done(err);
  }

  var d = domain.create();
  d.on('error', errorCallback);
  var domainBoundFn = d.bind(fn);

  function asyncRunner(){
    var result = domainBoundFn(errorCallback);

    if(result && result instanceof EE){
      d.add(result);
      result.once('end', successCallback).once('close', successCallback);
      return;
    }

    if(result && typeof result.then === 'function'){
      result.then(successCallback, errorCallback);
      return;
    }

    if(fn.length === 0){
      done();
    }
  }

  process.nextTick(asyncRunner);
}

module.exports = asyncDone;
