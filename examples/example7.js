//please note that this example is yet incomplete, and has some methodological errors.
//it's simplified in order to explain promises, but is not production-ready.
//please see the following examples for improvement.

var promisedSum = require('./example6');

promisedSum(1,2)
  .then(function (res) {
    return promisedSum (res, 3);
  },
  function (err) {
    console.error(err);
  })
