import asyncDone from "async-done";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

function success(): Observable<undefined> {
  return Observable.empty();
}

function successValue(): Observable<number> {
  return Observable.of(42);
}

function failure(): Observable<number> {
  return Observable.throw(new Error("Observable error"));
}

// `success` callback
asyncDone(success, function (err: Error | null): void {
  console.log("Done");
});

// The following code fails to compile as expected (`undefined` is not assignable to `number`):
// asyncDone(success, function (err: Error | null, result: number): void {
//   console.log("Done");
// });

// `successValue` and stricter callback
asyncDone(successValue, function (err: Error | null, result?: number): void {
  console.log("Done");
});

// `successValue` and unsound callback
asyncDone(successValue, function (err: Error | null, result: number): void {
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
