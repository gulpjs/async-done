var asyncDone = require('../');

function fnToError(cb){
  cb(new Error('Boom'));
}

function fnToSucceed(cb){
  cb();
}

function fnToThrow(cb){
  throw new Error('Thrown');
}

function fnSync(){
  return 2;
}

function fnErrorStream(){
  return require('fs').createReadStream('no_exist');
}

function fnSuccessStream(){
  var fs = require('fs');
  return fs.createReadStream('.gitignore')
    .pipe(fs.createWriteStream('.huhignore'));
}

function done(err){
  console.error('Captured Error', err);
}

asyncDone(fnToError, done);

asyncDone(fnToSucceed, done);

asyncDone(fnToThrow, done);

asyncDone(fnSync, done);
asyncDone(fnErrorStream, done);
asyncDone(fnSuccessStream, done);
