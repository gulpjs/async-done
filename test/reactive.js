'use strict';

var test = require('tap').test;
var rx = require('rx');

var asyncDone = require('../');

function success(){
  return rx.Observable.create(function(observer){
    observer.onNext('success');
    observer.onCompleted();
  });
}

function failure(){
  return rx.Observable.create(function(observer){
    throw Error('error');
  });
}

test('handle a successful RxJS observable', function(t){
  asyncDone(success, function(err, result){
    t.ok(result == 'success', 'result should be "success"')
    t.ok(err == null, 'error should be null or undefined');
    t.end();
  });
});

test('handle an errored RxJS observable', function(t){
  asyncDone(failure, function(err){
    t.ok(err instanceof Error, 'error should be instance of Error');
    t.ok(err.message == 'error', 'error message should be "error"');
    t.end();
  });
});
