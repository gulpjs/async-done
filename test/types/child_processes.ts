import asyncDone from "async-done";
import cp from "child_process";


function success(): cp.ChildProcess {
  return cp.exec("echo hello world");
}

function failure(): cp.ChildProcess {
  return cp.exec("foo-bar-baz hello world");
}

asyncDone(success, function (err: Error | null): void {
  console.log("Done");
});

asyncDone(failure, function (err: Error | null): void {
  console.log("Done");
});
