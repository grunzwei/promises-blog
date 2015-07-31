var sum = require('./example1')

sum(1, 2, function(err, sumResult) {
  if (err) throw err;
  sum(sumResult, 3, function(err, sumResult) {
    if (err) throw err;
    sum(sumResult, 4, function (err, sumResult) {
      if (err) throw err;
      sum(sumResult, 5, function (err, sumResult) {
        if (err) throw err;
        console.log('the sum is ' + sumResult);
      })
    })
  })
})
