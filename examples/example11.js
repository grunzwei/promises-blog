var Q 	= require('q');
var _ 	= require('lodash');
var sum = require('./example1');


//let's implement a naive nfcall function like in Q, with chaining, and we'll see that we have to bind a deferred to a promise
function nfcall() {
	var func = arguments[0];
	var args = _.rest(_.toArray(arguments));
	var deferred = Q.defer();
	
	function nodeResolver() {
		
	}
	args.push(nodeResolver);
	func.apply(null, args);
	
	return deferred.promise;
}