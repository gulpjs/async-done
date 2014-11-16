'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;
var expect = require('lab').expect;

var fs = require('fs');
var cp = require('child_process');
var path = require('path');
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

function unpiped(){
  return fs.createReadStream(exists);
}

function exec(){
  return cp.exec('echo hello world');
}

function spawn(){
  return cp.spawn('echo', ['hello world']);
}

describe('streams', function(){

  it('should handle a successful stream', function(done){
    asyncDone(success, function(err){
      expect(err).to.equal(null);
      done();
    });
  });

  it('should handle an errored stream', function(done){
    asyncDone(failure, function(err){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('handle a returned stream and cb by only calling callback once', function(done){
    asyncDone(function(cb){
      return success().on('end', function(){ cb(null, 3); });
    }, function(err, result){
      expect(err).to.equal(null);
      expect(result).to.equal(3); // to know we called the callback
      done();
    });
  });

  it('consumes an unpiped readable stream', function(done){
    asyncDone(unpiped, function(err){
      expect(err).to.equal(null);
      done();
    });
  });

  it('should handle exec', function(done){
    asyncDone(exec, function(err){
      expect(err).to.equal(null);
      done();
    });
  });

  it('should handle spawn', function(done){
    asyncDone(spawn, function(err){
      expect(err).to.equal(null);
      done();
    });
  });
});
