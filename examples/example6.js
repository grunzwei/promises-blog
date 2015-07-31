function promisedSum(augend, addend) {
  var deferred = Q.defer();

  setTimeout(function () {
    deferred.resolve(augend + addend);
  },0)

  return deferred.promise;
}