
var div = require('./async-bad-div-callback');

function divideALot = function (num, diva, divb, divc, divd, res, done) {
	try {
	  div(num, diva, function(err, quotient) {
	    if (err) {
	    	done(err);
	    } 
	    else {
	    	try {
		      div(quotient, divb, function(err, quotient) {
		        if (err) {
		        	done(err);
		        } 
		        else {
		        	try {
			          div(quotient, divc, function (err, quotient) {
			            if (err) {
			            	done(err);
			            } 
			            else {
			            	try {
								div(quotient, divd, function (err, quotient) {
					                if (err) {
					                	done(err);	
					                } 
					                else if (quotient === res) {
					                	done();
					                }
					                else {
					                	done(new Error('expected quotient to be ' + res + ' but was ' + quotient))
					                }
					            });
				            }
				            catch (err) {
				              done(err);
				            }
			            }					            
			          });
			        }
			        catch (err) {
						done(err);
			        }
		        }				        
		      })
		    }
		    catch (err) {
				done(err);
		    }
	    }	    
	  })
	}
	catch (err) {
	  done(err);
	}
}

describe('node standard async callback functions', function () {
	describe ('should always be tested that they might throw exceptions, even though that\'s not their proper API', function () {
		
		it ('sometimes they appear to work', function (done) {
			divideALot(50000, 10, 10, 10, 10, 5, done);
		});
		
		it ('but then sometimes they don\'t and if we haven\'t prepared, we\'ll never figure it out...', function (done) {
			divideALot(50000, 10, 10, 0, 10, 5, function (err) {
				if (err) {
					done();
				}
				else {
					done(new Error('should have failed on division by zero'));
				}
			});
		})
	})
});
