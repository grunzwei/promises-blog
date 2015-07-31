var sum = require('./example1');

try {
  sum(1, 2, function(err, sumResult) {
    if (err) throw err;
    try {
      sum(sumResult, 3, function(err, sumResult) {
        if (err) throw err;
        try {
          sum(sumResult, 4, function (err, sumResult) {
            if (err) throw err;
            try {
              sum(sumResult, 5, function (err, sumResult) {
                if (err) throw err;
                console.log('the sum is ' + sumResult);
              })
            }
            catch (err) {
              throw err;
            }
          })
        }
        catch (err) {
          throw err;
        }
      })
    }
    catch (err) {
      throw err;
    }
  })
}
catch (err) {
  throw err;
}