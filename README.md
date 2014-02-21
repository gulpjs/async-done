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
  done();
}, function(err){
  // err will be undefined if done callback wasn't passed an error
});
```

### Failed completion

```js
var asyncDone = require('async-done');

asyncDone(function(done){
  // do async things
  done(new Error('Some Error Occurred'));
}, function(err){
  // err will be the error passed to done callback
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

#### `onComplete(err)` : Function

The `onComplete` method will receive an error as its only argument if an error occurred in the execution of the `executor` function.  This includes:

* A thrown error
* An error passed to a `done` callback
* An `error` event emitted on a returned `Stream` or `EventEmitter`
* A rejection of a returned `Promise`

## License

MIT
