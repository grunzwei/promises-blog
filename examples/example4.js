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
              console.log('error summing 5: ' + err);
            }
          })
        }
        catch (err) {
			console.log('error summing 4: ' + err);
        }
      })
    }
    catch (err) {
		console.log('error summing 3: ' + err);
    }
  })
}
catch (err) {
  console.log('error summing 1,2: ' + err);
}

try {
  sum(1, 2, function(err, sumResult) {
    if (err) throw err;
    try {
      sum(sumResult, 3, function(err, sumResult) {
        if (err) throw err;
        try {
          throw new Error('this is an example of a possible failure');
          sum(sumResult, 4, function (err, sumResult) {
            if (err) throw err;
            try {
              sum(sumResult, 5, function (err, sumResult) {
                if (err) throw err;
                console.log('the sum is ' + sumResult);
              })
            }
            catch (err) {
              console.log('error summing 5: ' + err);
            }
          })
        }
        catch (err) {
			console.log('as expected - deliberate error summing 4: ' + err);
        }
      })
    }
    catch (err) {
		console.log('error summing 3: ' + err);
    }
  })
}
catch (err) {
  console.log('error summing 1,2: ' + err);
}