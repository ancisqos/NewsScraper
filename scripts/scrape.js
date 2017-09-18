// scrape script

// require request and cheerio for scraping
const request = ('request');
const cheerio = ('cheerio');

// function scrapes reddit website. cb is callback.
const scrape = function(cb) {
	// use request package to take body of page's html
	request('https://www.reddit.com', function(err, res, body) {
		// body is actual HTML on page. load into cheerio

		// saving to $ creates virtual HTML page
		const $ = cheerio.load(body);

		// make empty array to save article info
		const articles = [];

		// find and loop through each element with theme-summary class
		$('.theme-summary').each(function(i, element){

			const head = $(this).children('.story-heading').text().trim();

			 // Grab the URL of the article
      		var url = $(this).children(".story-heading").children("a").attr("href");

		      // Then we grab any children with the class of summary and then grab it's inner text
		      // We store this to the sum variable. This is the article summary
		      var sum = $(this).children(".summary").text().trim();

		      // So long as our headline and sum and url aren't empty or undefined, do the following
		      if (head && sum && url) {
		        // This section uses regular expressions and the trim function to tidy our headlines and summaries
		        // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
		        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
		        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
		
		     // initialize object to be pushed to articles array

		     const dataToAdd = {
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