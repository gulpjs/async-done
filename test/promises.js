'use strict';

var test = require('tap').test;
var when = require('when');

var asyncDone = require('../');

function success(){
  return when.resolve();
}

function failure(){
  return when.reject(new Error('Promise Error'));
}

test('handle a resolved promise', function(t){
  asyncDone(success, function(err){
    t.type(err, 'undefined', 'error should be undefined');
    t.end();
  });
});

test('handle a rejected promise', function(t){
  asyncDone(failure, function(err){
    t.ok(err instanceof Error, 'error should be instance of Error');
    t.end();
  });
});
