async-done
==========

Manage callback, promise, and stream completion

Will run call the executor function on `nextTick`. This will cause all functions to be async.

## Usage

### Successful completion

```js
var asyncDone = require('async-done');

asyncDone(function(done){
  // do async things
  done(null, 2);
}, function(error, result){
  // `error` will be undefined on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

### Failed completion

```js
var asyncDone = require('async-done');

asyncDone(function(done){
  // do async things
  done(new Error('Some Error Occurred'));
}, function(error, result){
  // `error` will be an error from the first function.
  // `result` will be undefined on failed execution of the first function.
});
```

## API

### `asyncDone(executor, onComplete)` : Function

Takes a function to execute (`executor`) and a function to call on completion (`onComplete`).

#### `executor([done])` : Function

Optionally takes a callback to call when async tasks are complete.

If a `Stream` (or any instance of `EventEmitter`) or `Promise` is returned from the `executor` function, they will be used to wire up the async resolution.

`Streams` (or any instance of `EventEmitter`) will be wrapped in a domain for error management. The `end` and `close` events will be used to resolve successfully.

`Promises` will be listened for on the `then` method. They will use the `onFulfilled` to resolve successfully or the `onRejected` methods to resolve with an error.

If you want to write a sync function, it will be executed on `process.nextTick` and the return value will be passed into `onComplete`. If you plan to use a sync function, don't specify any parameters in your function declaration, as we need to rely on function arity to determine the function isn't async.

#### `onComplete(error, result)` : Function

If an error doesn't occur in the execution of the `executor` function, the `onComplete` method will receive the results as its second argument.

If an error occurred in the execution of the `executor` function, The `onComplete` method will receive an error as its first argument.

Errors can be caused by:

* A thrown error
* An error passed to a `done` callback
* An `error` event emitted on a returned `Stream` or `EventEmitter`
* A rejection of a returned `Promise`


## License

MIT
