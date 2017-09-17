// headline model

// require mongoose
const mongoose = require('mongoose');

// create schema class using mongoose's schema method
const Schema = mongoose.Schema;

// create headlineSchema with schema class
const headlineSchema = new Schema({
	// headline must be entered as string
	headline: {
		type: String,
		required: true,
		unique: true
	},
	// summary must be entered as a string
	summary: {
		type: String,
		required: true
	},
	// url must be entered as string
	url: {
		type: String,
		required: true
	},
	// date is a string
	date: String,
	saved: {
		type: Boolean,
		default: false
	}
});

// create Headline model using headlineSchema
const Headline = mongoose.model('Headline', headlineSchema);

// export Headline model
module.exports = Headline;