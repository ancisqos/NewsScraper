// Node dependencies
const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

// article and comment models
const article = require('../models/article.js');
const comment = require('../models/comment.js');

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
	
})