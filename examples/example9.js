

var sum = require('./example1');
var Q 	= require('q');

//instead of our implementation of example6, we just use Q with nfcall to invoke the node-standard function and wrap it with a promise
Q.nfcall(sum, 1, 2)
  .then(function (res) {
    return Q.nfcall(sum, res, 3);
  })
  .done(function (res) {
  	console.log('1+2+3=' + res);
  });

//but if we don't want to do it each time, and we also don't want to implement it like we did in example6, we can just use Q.nbind
var promisedSum = Q.nbind(sum, null);

promisedSum(1,2)
  .then(function (res) {
    return promisedSum (res, 3);
  })
  .done(function (res) {
  	console.log('1+2+3=' + res);
  });
