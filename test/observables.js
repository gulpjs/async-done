'use strict';

var test = require('tap').test;

var asyncDone = require('../');

var Observable = require('rx').Observable;

function success() {
  return Observable.return(42);
}

function failure() {
  return Observable.throw(new Error('Observable error'));
}

test('handle a finished observable', function(t){
  asyncDone(success, function(err, result){
    t.ok(err == null, 'error should be null or undefined');
    t.equal(result, undefined, 'result should be undefined');
    t.end();
  });
});

test('handle an errored observable', function(t){
  asyncDone(failure, function(err){
    t.ok(err instanceof Error, 'error should be instance of Error');
    t.end();
  });
});