'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

var asyncDone = require('../');

function twoArg(cb) {
  cb(null, 1, 2);
}

describe('arguments', function() {

  it('passes all arguments to the completion callback', function(done) {
    asyncDone(twoArg, function(err, arg1, arg2) {
      expect(arg1).to.equal(1);
      expect(arg2).to.equal(2);
      done(err);
    });
  });
});
