// scrape script

// require request and cheerio for scraping
var request = require('request');
var cheerio = require('cheerio');

// function scrapes zergnet website. cb is callback.
var scrape = function(cb) {
	// use request package to take body of page's html
	request ("https://www.nytimes.com", function(err, res, body) {
		//console.log(res)
		//console.log(body)
		// body is actual HTML on page. load into cheerio

		// saving to $ creates virtual HTML page
		var $ = cheerio.load(body);

		// make empty array to save article info
		var articles = [];

		// find and loop through each element with theme-summary class
		// THIS IS THE CONTAINER
		$('.theme-summary').each(function(i, element){
			// console.log(element);
			console.log(i)


			// THIS IS THE HEADLINE INSIDE OF THE CONTAINER 
			// WE WANT TO SEE THE DATA PASS THROUGH BEFORE ACTUALLY LOOKING FOR THE URL AND HEADLINE
			var head = $(this).children(".story-heading").text().trim();
			console.log(head)
			// THIS IS THE LINK INSIDE OF THE CONTAINER
			 // Grab the URL of the article
      		var url = $(this).children(".story-heading").children("a").attr("href");
      		console.log(url)
		      // grab any children with span and grab its inner text
		      // store this to the sum variable. This is the article summary
		      var sum = $(this).children(".summary").text().trim();
		      console.log(sum)

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
