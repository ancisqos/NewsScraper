// include momentJS library
const moment = require('moment');

// require mongoose
const mongoose = require('mongoose');

// creates Schema class
const Schema = mongoose.Schema

// creates Article class
const ArticleSchema = new Schema ({

	// article title
		title: {
			type: String,
			required: true
		},

	// article link
		link: {
			type: String,
			required: true
		},

	// date of article scrape
		updated: {
			type: String,
			default: moment().format('MMMM Do YYYY, h:mm A')
		},

	// create a relation with Comment model
		comments: [{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}]

});

// create Article model with mongoose
const Article = mongoose.model('Article', ArticleSchema);

// export model
module.exports = Article;