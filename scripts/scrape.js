// scrape script

// require request and cheerio for scraping
var request = require('request');
var cheerio = require('cheerio');

// function scrapes reddit website. cb is callback.
var scrape = function(cb) {
	// use request package to take body of page's html
	request ("https://www.allaboutthejersey.com/", function(err, res, html) {
		// body is actual HTML on page. load into cheerio

		// saving to $ creates virtual HTML page
		var $ = cheerio.load(html);

		// make empty array to save article info
		var articles = [];

		// find and loop through each element with theme-summary class
		$('.c-entry-box--compact__body').each(function(i, element){

			var head = $(this).children('.c-entry-box--compact__title').text().trim();

			 // Grab the URL of the article
      		var url = $(this).children(".c-entry-box--compact__title").children("a").attr("href");

		      // Then we grab any children with the class of summary and then grab it's inner text
		      // We store this to the sum variable. This is the article summary
		      var sum = $(this).children(".p-dek c-entry-box--compact__dek").text().trim();

		      // So long as our headline and sum and url aren't empty or undefined, do the following
		      if (head && sum && url) {
		        // This section uses regular expressions and the trim function to tidy our headlines and summaries
		        // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
		        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
		        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
		
		     // initialize object to be pushed to articles array

		     var dataToAdd = {
		     	headline: headNeat,
		     	summary: sumNeat,
		     	url: url
		     };

		     articles.push(dataToAdd);
			}
		});
		// after loop, send back array of articles to callback function
		cb(articles);
	});
};

module.exports = scrape;
