import asyncDone, {AsyncTask, VoidCallback} from "async-done";

// Do not error if the return value is not `void`.
const fn: AsyncTask = (cb: VoidCallback): NodeJS.Timer => setTimeout(cb, 1000);
asyncDone(fn, () => {});
