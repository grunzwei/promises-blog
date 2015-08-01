var Q 	= require('q');
var _ 	= require('lodash');
var sum = require('./example1');

//let's implement a **VERY** naive deferred promise mechanism and see how we need to bind a deferred to a promise to support chaining
function Deferred() {
	
	function Promise() {
		
		var self = this;
		
		self.successHandlers = [];
		self.errorHandlers = [];
		
		self.invokeSuccessHandler = function (res) {
			_.each(self.successHandlers, function (successHandler) {
				successHandler(res);
			});
		}		
		
		self.invokeErrorHandler = function (res) {
			_.each(self.errorHandlers, function (errorHandler) {
				errorHandler(err);
			});
		};
		
		this.then = function (successHandler, errorHandler) {
			
			var deferred = new Deferred();
			
			function successHandlerWrapper(res) {
				
				var successRes;
				
				try {
					successRes = successHandler(res);
				}
				catch (err) {
					deferred.reject(err);
				}
				
				if (successRes !== undefined) {					
					if (successRes instanceof Promise) {
						
						//bind promise to deferred
						successRes.then(function (res) {
							deferred.resolve(res);
						},
						function (err) {
							deferred.reject(err);
						})
					}
					else {
						deferred.resolve(successRes);
					}
				}				
			}
			
			function errorHandlerWrapper(err) {
				
				var errorRes
				
				try {
					errorRes = errorHandler(err);
				}
				catch (err) {
					deferred.reject(err);
				}
				
				if (errorRes !== undefined) {
					if (errorRes instanceof Promise) {
						
						//bind promise to deferred
						errorRes.then(function (res) {
							deferred.resolve(res);
						},
						function (err) {
							deferred.reject(err);
						})
					}
					else {
						deferred.reject(errorRes);					
					}
				}			
			}
			
			self.successHandlers.push(successHandlerWrapper);
			self.errorHandlers.push(errorHandler);
			
			return deferred.promise;
		};
	}
	
	var self 		= this;
	self.promises 	= [];
	
	this.resolve = function (res) {
		console.log('resolving with res: ' + JSON.stringify(res));
		self.promise.invokeSuccessHandler(res);
	};
	
	this.reject = function (err) {
		console.log('rejecting with err: ' + JSON.stringify(err));
		self.promise.invokeErrorHandler(err);		
	};
	
	this.promise = new Promise();
}

//let's implement a **VERY** naive nfcall function like in Q, with chaining, and we'll see that we have to bind a deferred to a promise
function nfcall(/*func, arg...*/) {
	
	var func = arguments[0];
	var args = _.rest(_.toArray(arguments));
	
	var deferred = new Deferred();
	
	function nodeResolver() {
		var err 	= arguments[0];
		var results = _.rest(_.toArray(arguments));
		if (err) {
			deferred.reject(err)
		}
		else {
			deferred.resolve(results);
		}
	}
	args.push(nodeResolver);
	func.apply(null, args);
	
	return deferred.promise;
}

nfcall(sum, 1, 2)
	.then(function (three) {
		console.log('should be three' + JSON.stringify(three));
		return nfcall(sum, three, 3);
	})
	.then(function (six) {
		console.log('should be six' + JSON.stringify(six));
		return nfcall (sum, six, 4);
	})
	.then(function (ten) {
		console.log('should be ten' + JSON.stringify(ten));
	});