
var Q = require('q');

/**
 * @param: {number} augend - first operand to sum operation
 * @param: {number} addend - second operand to sum operation
 * @returns: {Promise} resolves with sum of augend and addend
 */
function promisedSum(augend, addend) {
	
	
  //we create a deferred object
  var deferred = Q.defer();

  setTimeout(function () {
  	//our asynchronous function invokes the deferred resolve method with the computation result, eventually triggering the promise success handler with the result of the computation
    deferred.resolve(augend + addend);
  }, 0);

  //we return the promise controller by the deferred object, with its public then function, without resolve/reject functions
  return deferred.promise;
}

module.exports = promisedSum;