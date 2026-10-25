"use strict";

var assert = require("node:assert");
var { describe, it } = require("node:test");

var cp = require("child_process");
var asyncDone = require("../");

function execSuccess() {
  return cp.exec("echo hello world");
}

function execFail() {
  return cp.exec("foo-bar-baz hello world");
}

function spawnSuccess() {
  return cp.spawn("echo", ["hello world"]);
}

function spawnFail() {
  return cp.spawn("foo-bar-baz", ["hello world"]);
}

describe("child processes", function () {
  it("should handle successful exec", function (t, done) {
    asyncDone(execSuccess, function (err) {
      assert.strictEqual(err instanceof Error, false);
      done();
    });
  });

  it("should handle failing exec", function (t, done) {
    asyncDone(execFail, function (err) {
      assert.ok(err instanceof Error);
      done();
    });
  });

  it("should handle successful spawn", function (t, done) {
    asyncDone(spawnSuccess, function (err) {
      assert.strictEqual(err instanceof Error, false);
      done();
    });
  });

  it("should handle failing spawn", function (t, done) {
    asyncDone(spawnFail, function (err) {
      assert.ok(err instanceof Error);
      done();
    });
  });
});
