'use strict';

var expect = require('expect');

var asyncDone = require('../');

function twoArg(cb) {
  cb(null, 1, 2);
}

describe('arguments', function() {

  it('passes all arguments to the completion callback', function(done) {
    asyncDone(twoArg, function(err, arg1, arg2) {
      expect(arg1).toEqual(1);
      expect(arg2).toEqual(2);
      done(err);
    });
  });
});
