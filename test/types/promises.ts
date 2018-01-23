import asyncDone from "async-done";

function success(): Promise<number> {
  return Promise.resolve(2);
}

function failure(): Promise<number> {
  return Promise.reject(new Error("Promise Error"));
}

// `successValue` and stricter callback
asyncDone(success, function (err: Error | null, result?: number): void {
  console.log("Done");
});

// The following code fails to compile as expected:
// asyncDone(success, function (err: Error | null, result?: string): void {
//   console.log("Done");
// });

// `successValue` and unsound callback
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
