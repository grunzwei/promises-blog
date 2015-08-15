var _ = require('lodash');

//bad implementation of div doesn't check division by zero error, 
//throws exception although it's an async function 
//that should report errors in callback
var div = function(dividend, divisor, callback) {
	if (_.isNumber(dividend) && _.isNumber(divisor)) {
		var quotient = dividend / divisor;	
		setTimeout(function () {
			callback(null, quotient);
		},0);
	}
	else {
		callback(new Error('both div input params must be numbers'));
	}	
};

module.exports = div;