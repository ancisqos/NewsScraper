// require mongoose
const mongoose = require('mongoose');

// create schema class
const Schema = mongoose.Schema;

// create comment class
const CommentSchema = new Schema ({

	// name of author
	author: {
		type: String
	},
	// content of comment
	content: {
		type: String
	}

});

// create comment model with mongoose
const Comment = mongoose.model('Comment', CommentSchema);

// exports model
module.exports = Comment;