//please note that this example is yet incomplete, and has some methodological errors.
//it's simplified in order to explain promises, but is not production-ready.
//please see the following examples for improvement.

var promisedSum = require('./example6');

promisedSum(1,2)
  .then(function (res) {
    return promisedSum (res, 3);
  })
  .then(function (res) {
    return promisedSum (res, 4);
  })
  .then(function (res) {
    return promisedSum (res, 5);
  })
  .then(function (res) {
  	console.log('sum is: ' + res);
  },
  function (err) {
    console.error(err);
  })


promisedSum(1,2)
  .then(function (res) {
    return promisedSum (res, 3);
  })
  .then(function (res) {
  	throw new Error('example of one error handler catching an exception from a much older failure')
    return promisedSum (res, 4);
  })
  .then(function (res) {
    return promisedSum (res, 5);
  })
  .then(function (res) {
  	console.log('sum is: ' + res);
  },
  function (err) {
    console.error('delibrate error caught as expected: ' + err);
  })
  
promisedSum(1,2)
  .then(function (res) {
    return promisedSum (res, 3);
  })
  .then(function (res) {
  	throw new Error('example of one error recovery')
    return promisedSum (res, 4);
  })
  .catch(function (err) {
  	console.log('recovering from error: ' + err);
  	return 10;
  })
  .then(function (res) {
    return promisedSum (res, 5);
  })
  .then(function (res) {
  	console.log('sum is: ' + res);
  },
  function (err) {
    console.error('no error should be caught here: ' + err);
  })