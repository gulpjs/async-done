'use strict';

var fs = require('fs');
var path = require('path');

var test = require('tap').test;
var through = require('through2');

var asyncDone = require('../');

var exists = path.join(__dirname, '../.gitignore');
var notExists = path.join(__dirname, '../not_exists');

var EndStream = through.ctor(function(chunk, enc, cb){
  this.push(chunk);
  cb();
}, function(cb){
  this.emit('end', 2);
  cb();
});

function success(){
  var read = fs.createReadStream(exists);
  return read.pipe(new EndStream());
}

function failure(){
  var read = fs.createReadStream(notExists);
  return read.pipe(new EndStream());
}

test('handle a successful stream', function(t){
  asyncDone(success, function(err, result){
    t.ok(err == null, 'error should be null or undefined');
    t.equal(result, 2, 'result should be 2');
    t.end();
  });
});

test('handle an errored stream', function(t){
  asyncDone(failure, function(err){
    t.ok(err instanceof Error, 'error should be instance of Error');
    t.ok(err.domainEmitter, 'error should be caught by domain');
    t.end();
  });
});
