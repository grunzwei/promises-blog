var _ = require('lodash');

//bad implementation of div doesn't check division by zero error, 
//throws exception although it's an async function 
//that should report errors in callback
var div = function(dividend, divisor, callback) {
	setTimeout(function () {
		if (_.isNumber(dividend) && _.isNumber(divisor)) {
			if (divisor === 0) {
				throw new Error('division by zero error'); //this can cause division by zero error
			}
			var quotient = dividend / divisor;			
			callback(null, quotient);
	
		}
		else {
			callback(new Error('both div input params must be numbers'));
		}	
	},0);
};

module.exports = div;