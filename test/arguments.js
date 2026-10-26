"use strict";

var assert = require("node:assert");
var { describe, it } = require("node:test");

var asyncDone = require("../");

function twoArg(cb) {
  cb(null, 1, 2);
}

describe("arguments", function () {
  it("passes all arguments to the completion callback", function (t, done) {
    asyncDone(twoArg, function (err, arg1, arg2) {
      assert.strictEqual(arg1, 1);
      assert.strictEqual(arg2, 2);
      done(err);
    });
  });
});
