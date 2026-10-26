"use strict";

var domain = require("domain");

var assert = require("node:assert");
var { describe, it } = require("node:test");

var asyncDone = require("../");

function success() {
  return Promise.resolve(2);
}

function failure() {
  return Promise.reject(new Error("Promise Error"));
}

function rejectNoError() {
  return Promise.reject();
}

describe("promises", function () {
  it("should handle a resolved promise", function (t, done) {
    asyncDone(success, function (err, result) {
      assert.strictEqual(result, 2);
      done(err);
    });
  });

  it("should handle a rejected promise", function (t, done) {
    asyncDone(failure, function (err) {
      assert.ok(err instanceof Error);
      done();
    });
  });

  it("properly errors when rejected without an error", function (t, done) {
    asyncDone(rejectNoError, function (err) {
      assert.ok(err);
      assert.ok(err instanceof Error);
      done();
    });
  });

  it("does not swallow thrown errors in callback", function (t, done) {
    var d = domain.create();
    d.once("error", function (err) {
      assert.ok(err);
      assert.strictEqual(err.message.includes("Boom"), true);
      done();
    });
    d.run(function () {
      asyncDone(success, function () {
        throw new Error("Boom");
      });
    });
  });
});
