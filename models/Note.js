// note model

// require mongoose
var mongoose = require('mongoose');
// create schema class using mongoose's schema method
var Schema = mongoose.Schema;

// create noteSchema with schema object
var noteSchema = new Schema({
	// headline is article associated with the note
	_headlineId: {
		type: Schema.Types.ObjectId,
		ref: 'Headline'
	},
	// date is a string
	date: String,
	// noteText is string
	noteText: String
});

// create Note model using noteSchema

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;