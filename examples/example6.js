
var Q = require('q');

/**
 * @param: {number} augend - first operand to sum operation
 * @param: {number} addend - second operand to sum operation
 * @returns: {Promise} resolves with sum of augend and addend
 */
function promisedSum(augend, addend) {
  var deferred = Q.defer();

  setTimeout(function () {
    deferred.resolve(augend + addend);
  }, 0);

  return deferred.promise;
}

module.exports = promisedSum;