

var sum = require('./example1');
var Q 	= require('q');

//instead of our implementation of example6, we just use Q
var promisedSum = Q.nbind(sum, null);

promisedSum(1,2)
  .then(function (res) {
    return promisedSum (res, 3);
  })
  .done(function (res) {
  	console.log('1+2+3=' + res);
  });
