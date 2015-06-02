
'use strict';

var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;
var expect = require('lab').expect;
var asyncDone = require('../index');

describe('generators', function(){
  it('should handle generator success', function(done){
    var cnt = 10;

    asyncDone(function * success() {
      yield [cnt++]
      yield [cnt++]
      return cnt
    }, function(err, res){
      expect(err).to.equal(null);
      expect(res).to.equal(12);
      expect(cnt).to.equal(12);
      done(err);
    });
  });

  it('should handle generator failure', function(done){
    var cnt = 10;

    asyncDone(function * failure() {
      yield [cnt++];
      throw new Error('boom');
      yield [cnt++];
      return cnt;
    }, function(err, res){
      expect(err).to.be.instanceof(Error);
      expect(res).to.be.undefined();
      expect(cnt).to.equal(11)
      done();
    });
  });
});
