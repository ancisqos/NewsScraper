// controller for headlines

// require scrape and makeDate scripts
var scrape = require('../scripts/scrape');
var makeDate = require('../scripts/date');

// require headline and note mongoose models
var Headline = require('../models/Headline');

module.exports = {
	fetch: function(cb) {

		// run scrape function
		scrape(function(data){
			// data is array of article objects with headlines and summaries
			var articles = data;
			// makes sure each article object has date and not saved by default
			for (var i=0; i<articles.length; i++) {
				articles[i].date = makeDate();
				articles[i].saved = false;
			}
			Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
				cb(err, docs);
			});
		});
	},
	delete: function(query, cb){
		Headline.remove(query, cb);
	},
	get: function(query, cb) {
		// prepare query to get scraped data
		Headline.find(query)
		.sort({
			_id: -1
		})
		.exec(function(err, doc){
			cb(doc);
		});
	},
	update: function(query, cb){
		Headline.update({_id: query._id}, {
			$set: query
		}, {}, cb);
	}
};