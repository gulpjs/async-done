'use strict';

var domain = require('domain');

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

    if(result && typeof result.pipe === 'function'){
      d.add(result);
      return result
        .once('end', successCallback)
        .once('close', successCallback);
    }

    if(result && typeof result.then === 'function'){
      return result.then(successCallback, errorCallback);
    }

    if(fn.length === 0){
      done(new Error('Sync function was called'));
    }
  }

  process.nextTick(asyncRunner);
}

module.exports = asyncDone;
