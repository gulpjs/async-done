"use strict";

var assert = require("node:assert");
var { describe, it } = require("node:test");

var fs = require("node:fs");
var path = require("node:path");
var through = require("through2");
var pumpify = require("pumpify");

var asyncDone = require("../");

var exists = path.join(__dirname, "../.gitignore");
var notExists = path.join(__dirname, "../not_exists");

var EndStream = through.ctor(
  function (chunk, enc, cb) {
    this.push(chunk);
    cb();
  },
  function (cb) {
    this.emit("end", 2);
    cb();
  },
);

function success() {
  var read = fs.createReadStream(exists);
  return read.pipe(new EndStream());
}

function failure() {
  var read = fs.createReadStream(notExists);
  return read.pipe(new EndStream());
}

function withErr(chunk, _, cb) {
  cb(new Error("Fail"));
}

function pumpifyError() {
  var read = fs.createReadStream(exists);
  var pipeline = pumpify(through(), through(withErr), through());

  return read.pipe(pipeline);
}

function unpiped() {
  return fs.createReadStream(exists);
}

describe("streams", function () {
  it("should handle a successful stream", function (t, done) {
    asyncDone(success, function (err) {
      assert.strictEqual(err instanceof Error, false);
      done();
    });
  });

  it("should handle an errored stream", function (t, done) {
    asyncDone(failure, function (err) {
      assert.ok(err instanceof Error);
      done();
    });
  });

  it("should handle an errored pipeline", function (t, done) {
    asyncDone(pumpifyError, function (err) {
      assert.ok(err instanceof Error);
      assert.notStrictEqual(err.message, "premature close");
      done();
    });
  });

  it("handle a returned stream and cb by only calling callback once", function (t, done) {
    asyncDone(
      function (cb) {
        return success().on("end", function () {
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
