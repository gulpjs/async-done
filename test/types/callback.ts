import asyncDone, { Callback } from "async-done";

function success(cb: Callback<number>): void {
  cb(null, 2);
}

function failure(cb: Callback<number>): void {
  cb(new Error("Callback Error"));
}

function neverDone(): number {
  return 2;
}

// `success` and stricter callback
asyncDone(success, function (err: Error | null, result?: number): void {
  console.log("Done");
});

// The following code fails to compile as expected:
// asyncDone(success, function (err: Error | null, result?: string): void {
//   console.log("Done");
// });

// `success` and unsound callback
asyncDone(success, function (err: Error | null, result: number): void {
  console.log("Done");
});

// `failure` and stricter callback
asyncDone(failure, function (err: Error | null, result?: number): void {
  console.log("Done");
});

// `failure` and unsound callback
asyncDone(failure, function (err: Error | null, result: number): void {
  console.log("Done");
});

// I don't think TS is currently able to prevent the current code from compiling
// (`neverDone` matches with `(done: VoidCallback) => void` for example)
// asyncDone(neverDone, function(err: Error | null, result?: number): void {
//  console.log("Done");
// });
