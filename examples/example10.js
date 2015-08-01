var mongoose 	= require('mongoose');
var Q 			= require('q');

Q.longStackSupport = true;

function createAndVerify() {
	
	//declare vars
	var Entry;
	
	//return promise
	return Q()
		//init block
		.then(function () {
			//this env variable is injected bye the codefresh mongo template
			mongoose.connect(process.env.MONGO_URI);
			
			Entry = mongoose.model('Entry', {
				field1 : String,
				field2 : String
			});
		})
		//now an asyc sequence
		.then(function () {
			return Q.ninvoke(Entry, 'create', { field1: 'example1f1' , field2: 'examplef2'}));
		})
		.then(function (createdEntry) {
			return Q.ninvoke(Entry, 'find', { _id: createdEntry._id});
		})
		.then(function (foundEntries) {
			if (foundEntries.length === 0) {
				throw new Error('created entry not found');
			}
			else if (foundEntries.length > 1) {
				throw new Error('too many entries found');
			}
			//note, this is automatically wrapped with a promise via the chaining
			else return foundEntries[0]
		})
		//finish with a then because we return the promise
		.then(function (verifiedEntry) {
			return Q.ninvoke(Entry, 'remove', { _id : verifiedEntry._id });
		});

}

//if this wasn't the main, and we returned a promise value, we'd create a Q() and do a .then clause to run createVerifyAndDelete, like in the example
createVerifyAndDelete()
	//we don't return the promise, so we use done
	.done(function () {
		console.log('example finished');
	});