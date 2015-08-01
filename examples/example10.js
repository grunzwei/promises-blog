var mongoose = require('mongoose');

//this env variable is injected bye the codefresh mongo template
mongoose.connect(process.env.MONGO_URI);

var Entry = mongoose.model('Entry', {
	field1 : String,
	field2 : String
});

Entry.find(function(err, contacts) {

			// send an error
			if (err)
				res.send(err)

			res.json(contacts); // return all contacts
		});
		
		
// insert new contact			
Entry.create({
	field1 : field1,
	field2 : field2,
}, function(err, contact) {
	if (err)
		res.send(err);

	Entry.find(function(err, contacts) {
		if (err)
			res.send(err);

		var congrats = "Congrats "+req.body.form_data.name+"! ";
		res.send({status:congrats + " Your form has been sent!"});
	});
});

//delete
Entry.remove({
	_id : id
}, function(err, contact) {
	if (err)
		res.send(err);

	res.send({status:"ok"});
});
