var sum = require('./example1');

describe('node standard async callback functions', function () {
	
	it ('should be invoked with a function that accepts an error and then result values', function (done) {
		sum(3,7,function (err, sumResult) {
		  if (err) {
		    done(err);
		  }
		  else if (sumResult === 10) {
		  	done();		    
		  }
		  else {
			done(new Error('result of 3+7 was not 10'));
		  }
		});
	});
});


