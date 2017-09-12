// ===========================================================
// Node dependencies
const express = require('express');
const router = express.Router();
const path = require('path');

// make http request for html page
const request = require('request');

// parses html and helps find elements
const cheerio = require('cheerio');

// article and comment models
const article = require('../models/article.js');
const comment = require('../models/comment.js');

// ===========================================================

// renders index page
router.get('/', function (req, res){

	// for scraping data
	res.redirect('/scrape');

});

// renders articles page
router.get('/articles', function (req, res){

	// query mongo database for articles
		article.find().sort({_id: -1})

		// populate the comments on articles
		.populate('comments')

		// render on handlebars template
		.exec(function(err, doc){

			// error handling
			if (err){
				console.log(err);
			}
			// if no errors, send json to browser
			else {
				const jsonObject = {articles: doc}
				res.render('index', jsonObject);
			}
		});

});

// route for web scraping
router.get('/scrape', function (req, res){

	// grabs body of html using request
	request('http://www.reddit.com/', function (err, res, html) {

		// loads html to cheerio. save to $ as shorthand selector
		const $ = cheerio.load(html);

		// grabs whatever has a class of "inner" with each article tag
		$('article .inner').each(function(i, element){

			// empty array for storing results
			const results = [];

			// collect article title in "h2" of header
			result.title = $(this).children('header').children('h2').text().trim() + ""; 

			// collect article link
			result.link = 'http://www.reddit.com/' + $(this).children('header').children('h2').children('a').attr('href').trim();

			// collect article summary
			result.summary = $(this).children('div').text().trim() + "";

			// add entry to db if doesn't already exist
			article.count({ title: result.title}, function (err, test){

				// if count is 0, it means the entry is unique
				if (test == 0){

					// create new entry
					const entry = new article (result)

					// save to mongoDB
					entry.save(function(err, doc){

						// error handling
						if (err){
							console.log(err);
						} else {
							console.log(doc);
						}
					});
				} 
						// logs successful scrape, but content already in database
						else {
							console.log('Content already in database, will not be saved.')
				}
			})
		})

		// redirect to articles page
		res.redirect('/articles');

	});

});

// route for adding a comment (API)
router.post('/add/comment/:id'), function (req,res){

	// article id
	const articleId = req.params.id;

	// author name
	const commentAuthor = req.body.name;

	// store comment
	const commentContent = req.body.comment;

	const result = {
		author: commentAuthor,
		content: commentContent
	};

	const entry = new Comment (result);

	// save to database
	entry.save(function(err, doc){
		if (err) {
			console.log(err);
		} else {
			article.
		}
	})
}