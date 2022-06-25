'use strict';

var expect = require('expect');

var streamx = require('streamx');

var asyncDone = require('../');

function success() {
  return streamx.Readable.from('Foo Bar Baz').pipe(new streamx.Writable());
}

function failure() {
  return streamx.Readable.from('Foo Bar Baz').pipe(
    new streamx.Writable({
      write: function (data, cb) {
        cb(new Error('Fail'));
      },
    })
  );
}

function pipelineError() {
  return streamx.pipeline(
    streamx.Readable.from('Foo Bar Baz'),
    new streamx.Transform(),
    new streamx.Transform({
      transform: function (data, cb) {
        cb(new Error('Fail'));
      },
    }),
    new streamx.Writable()
  );
}

function unpiped() {
  return streamx.Readable.from('Foo Bar Baz');
}

describe('streamx streams', function () {
  it('should handle a successful stream', function (done) {
    asyncDone(success, function (err) {
      expect(err).not.toBeInstanceOf(Error);
      done();
    });
  });

  it('should handle an errored stream', function (done) {
    asyncDone(failure, function (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).not.toEqual('premature close');
      done();
    });
  });

  it('should handle an errored pipeline', function (done) {
    asyncDone(pipelineError, function (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).not.toEqual('premature close');
      done();
    });
  });

  it('handle a returned stream and cb by only calling callback once', function (done) {
    asyncDone(
      function (cb) {
        return success().on('finish', function () {
          cb(null, 3);
        });
      },
      function (err, result) {
        expect(err).not.toBeInstanceOf(Error);
        expect(result).toEqual(3); // To know we called the callback
        done();
      }
    );
  });

  it('consumes an unpiped readable stream', function (done) {
    asyncDone(unpiped, function (err) {
      expect(err).not.toBeInstanceOf(Error);
      done();
    });
  });
});
