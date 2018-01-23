import asyncDone from "async-done";
import { Readable, Stream } from "stream";

function readableSuccess(): Readable {
  return undefined as any;
}

function readableFail(): Readable {
  return undefined as any;
}

function streamSuccess(): Stream {
  return undefined as any;
}

function streamFail(): Stream {
  return undefined as any;
}

asyncDone(readableSuccess, function (err: Error | null): void {
  console.log("Done");
});

asyncDone(readableFail, function (err: Error | null): void {
  console.log("Done");
});

asyncDone(streamSuccess, function (err: Error | null): void {
  console.log("Done");
});

asyncDone(streamFail, function (err: Error | null): void {
  console.log("Done");
});
