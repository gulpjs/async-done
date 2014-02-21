'use strict';

var test = require('tap').test;

var asyncDone = require('../');

function success(cb){
  cb();
}

function failure(cb){
  cb(new Error('Callback Error'));
}

function neverDone(someArg){
  return 2;
}

test('handle a successful callback', function(t){
  asyncDone(success, function(err){
    t.type(err, 'undefined', 'error should be undefined');
    t.end();
  });
});

test('handle an errored callback', function(t){
  asyncDone(failure, function(err){
    t.ok(err instanceof Error, 'error should be instance of Error');
    t.end();
  });
});

test('a function that takes an argument but never calls callback', function(t){
  asyncDone(neverDone, function(err){
    t.plan(0);
    t.notOk(err);
  });

  setTimeout(function(){
    t.ok(true, 'done callback never called');
    t.end();
  }, 1000);
});
