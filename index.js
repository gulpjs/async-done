'use strict';

var domain = require('domain');
var EE = require('events').EventEmitter;

var eos = require('end-of-stream');

function asyncDone(fn, done){
  function onSuccess(result){
    return done(undefined, result);
  }

  function onError(error){
    return done(error);
  }

  var d = domain.create();
  d.once('error', onError);
  var domainBoundFn = d.bind(fn);

  function asyncRunner(){
    var result = domainBoundFn(done);

    if(result && result instanceof EE){
      d.add(result);
      eos(result, { error: false }, onSuccess);
      return;
    }

    if(result && typeof result.then === 'function'){
      result.then(onSuccess, onError);
      return;
    }

    if(fn.length === 0){
      done(undefined, result);
    }
  }

  process.nextTick(asyncRunner);
}

module.exports = asyncDone;
