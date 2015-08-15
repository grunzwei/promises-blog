var sum = require('./async-sum-callback.js');
var _ 	= require('lodash');

describe('node standard async callback functions', function () {
	describe('should be invoked with a function that accepts an error and then result values', function () {		
		it ('when successful error should be falsy and computation result should be given', function (done) {
			sum(3, 7, function (err, sumResult) {
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
		
		it ('when erronous error should be contain error object', function (done) {
			sum(undefined, 7, function (err, sumResult) {
			  if (err && _.isError(err)) {
			  	done();
			  }
			  else {
			  	done(new Error('expected operation to fail but err parameter was ' + 
			  		JSON.stringify(err) + ' and sumResult was ' + 
			  		JSON.stringify(sumResult)));
			  }
			});
		});
	});	
});


