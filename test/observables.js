"use strict";

var assert = require("node:assert");
var { describe, it } = require("node:test");

var asyncDone = require("../");

var rxjs = require("rxjs");

function success() {
  return rxjs.empty();
}

function successValue() {
  // This corresponds to `Observable.return(42);` in RxJS 4
  return rxjs.of(42);
}

function failure() {
  return rxjs.throwError(function () {
    return new Error("Observable error");
  });
}

describe("observables", function () {
  it("should handle a finished observable", function (t, done) {
    asyncDone(success, function (err, result) {
      assert.strictEqual(result, undefined);
      done(err);
    });
  });

  it("should handle a finished observable with value", function (t, done) {
    asyncDone(successValue, function (err, result) {
      assert.strictEqual(result, 42);
      done(err);
    });
  });

  it("should handle an errored observable", function (t, done) {
    asyncDone(failure, function (err) {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, "Observable error");
      done();
    });
  });
});
