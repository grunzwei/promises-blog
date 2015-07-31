
/**
 * @callback sumCallback
 * @param: {Error} err - error object in case of failure to perform sum
 * @param: {number} sum - the result of the sum operation
 */

/**
 * @param: {number} augend - first operand to sum operation
 * @param: {number} addend - second operand to sum operation
 * @param: {sumCallback} callback - callback invoked with result of sum operation on augend and addend
 */
function sum(augend, addend, callback) {

  //in this mock function we use the javascript built-in setTimeout function which accepts a callback
  //and milliseconds and registers the callback to be invoked in (*at least) <milliseconds> in the future
  //when the nodejs event loop becomes available and processes remaining events.
  //we say at least because of node's single-threaded nature, which means that the event loop may not be availble
  //at all if the node interpreter is running some blocking function.
  setTimeout(function () {
    callback(null, augend + addend)
  }, 0);
}
