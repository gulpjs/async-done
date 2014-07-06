'use strict';

var domain = require('domain');

var eos = require('end-of-stream');
var tick = require('next-tick');
var once = require('once');

function noop(){}

function asyncDone(fn, cb){
  var done = once(cb);

  function onSuccess(result){
    return done(null, result);
  }

  function onError(error){
    return done(error);
  }

  var d = domain.create();
  d.once('error', onError);
  var domainBoundFn = d.bind(fn);

  function asyncRunner(){
    var result = domainBoundFn(done);

    if(result && typeof result.on === 'function'){
      // assume node stream
      d.add(result);
      eos(result, { error: false }, onSuccess);
      return;
    }

    if(result && typeof result.then === 'function'){
      // assume promise
      result.then(onSuccess, onError);
      return;
    }

    if(result && typeof result.subscribe === 'function'){
      // assume RxJS observable
      result.subscribe(noop, onError, onSuccess);
      return;
    }
  }

  tick(asyncRunner);
}

module.exports = asyncDone;
