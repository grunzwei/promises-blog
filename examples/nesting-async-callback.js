var sum = require('./async-sum-callback')

describe('node standard async callback functions', function () {
	it ('can be combined by nesting an invocation of an async function in the result callback of an async function, allowing the new callback closure to access the result', function (done) {
		sum(1, 2, function(err, sumResult) {
			if (err) {
				done(err);
			}
			else {
			  	sum(sumResult, 3, function(err, sumResult) {
				    if (err) {
				    	done(err);
				    }
				    else {
						sum(sumResult, 4, function (err, sumResult) {
					      if (err) {
					      	done(err);
					      }
					      else {
					      	sum(sumResult, 5, function (err, sumResult) {
						        if (err) {
						        	done(err);
						        }
						        else if (sumResult === 15) {
						        	done();
						        }
						        else {
						        	done(new Error('result was expected to be 15, but was ' + sumResult));
						        }
						    });			    
					      }
				  		});
				    }				    
			  	});
			}
		});
	});
});


