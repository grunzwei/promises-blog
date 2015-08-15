var sum = require('./async-sum-callback')

describe('node standard async callback functions', function () {
	describe('can be combined by nesting an invocation of an async function in the result callback of an async function', function () {
		it ('allowing the new callback closure to access the result', function (done) {
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
		
		it ('but this can make error handling a bit tricky', function (done) {
			sum(1, 2, function(err, sumResult) {
				if (err) {
					done(err);
				}
				else {
					//we deliberately plant an undefined here to cause an error
				  	sum(sumResult, undefined, function(err, sumResult) {
				  		//and the error is expected, but if this wasn't test code designed for this exception, we could easily miss this
					    if (err) {
					    	done();
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
});


