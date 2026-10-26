"use strict";

var assert = require("node:assert");
var { describe, it } = require("node:test");

var streamx = require("streamx");

var asyncDone = require("../");

function success() {
  return streamx.Readable.from("Foo Bar Baz").pipe(new streamx.Writable());
}

function failure() {
  return streamx.Readable.from("Foo Bar Baz").pipe(
    new streamx.Writable({
      write: function (data, cb) {
        cb(new Error("Fail"));
      },
    }),
  );
}

function pipelineError() {
  return streamx.pipeline(
    streamx.Readable.from("Foo Bar Baz"),
    new streamx.Transform(),
    new streamx.Transform({
      transform: function (data, cb) {
        cb(new Error("Fail"));
      },
    }),
    new streamx.Writable(),
  );
}

function unpiped() {
  return streamx.Readable.from("Foo Bar Baz");
}

describe("streamx streams", function () {
  it("should handle a successful stream", function (t, done) {
    asyncDone(success, function (err) {
      assert.strictEqual(err instanceof Error, false);
      done();
    });
  });

  it("should handle an errored stream", function (t, done) {
    asyncDone(failure, function (err) {
      assert.ok(err instanceof Error);
      assert.notStrictEqual(err.message, "premature close");
      done();
    });
  });

  it("should handle an errored pipeline", function (t, done) {
    asyncDone(pipelineError, function (err) {
      assert.ok(err instanceof Error);
      assert.notStrictEqual(err.message, "premature close");
      done();
    });
  });

  it("handle a returned stream and cb by only calling callback once", function (t, done) {
    asyncDone(
      function (cb) {
        return success().on("finish", function () {
          cb(null, 3);
        });
      },
      function (err, result) {
        assert.strictEqual(err instanceof Error, false);
        assert.strictEqual(result, 3); // To know we called the callback
        done();
      },
    );
  });

  it("consumes an unpiped readable stream", function (t, done) {
    asyncDone(unpiped, function (err) {
      assert.strictEqual(err instanceof Error, false);
      done();
    });
  });
});
