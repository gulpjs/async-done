'use strict';

var test = require('tap').test;

var asyncDone = require('../');

function success(){
  return 2;
}

function failure(){
  throw new Error('Sync Error');
}

test('handle a successful sync function', function(t){
  asyncDone(success, function(err){
    t.type(err, 'undefined', 'error should be undefined');
    t.end();
  });
});

test('handle a sync function that throws', function(t){
  asyncDone(failure, function(err){
    t.ok(err instanceof Error, 'error should be instance of Error');
    t.end();
  });
});
