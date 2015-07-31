var sum = require('./example1')

sum(3,7,function (err, sumResult) {
  if (err) {
    throw err;
  }
  else {
    console.log('sum is: ' + sumResult);
  }
})
