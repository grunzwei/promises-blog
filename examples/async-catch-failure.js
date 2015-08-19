
var div = require('./async-bad-div-callback');

var _done;

describe('node standard async callback functions', function () {
	it ('that throw exceptions can\'t be handled via try catch', function (done) {
		_done = done;
		try {
			div(3,0, function (err, res) {
				if (err) {
					done(new Error('good behavior would be to reach here, but impl of div is faulty... ' + 
					'so exception is expected to be thrown, instead of proper function callback invocation with error parameter'));
				}
				else {
					done(new Error('division by error should have triggered error'));
				}
			})
		}
		catch(err) {
			done(new Error('you would hope, think and wish for us to be able to catch this here... but we wont!!'));
		}
	})
});



process.on('uncaughtException', function(err) {
	//only here, or by using domains (not in the scope of this blog) can we catch the error, and it's far far too late...
  _done();
});
