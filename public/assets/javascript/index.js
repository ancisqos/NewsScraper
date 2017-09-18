$(document).ready(function() {
	// set reference to article-container div where all dynamic content will go
	// add event listener
	const articleContainer = $('.article-container');
	$(document).on('click', '.btn.save', handleArticleSave);
	$(document).on('click', '.scrape-new', handleArticleScrape);

	// run initPage function once page is ready
	initPage();

	function initPage() {
		// empty article container, run AJAX request
		articleContainer.empty();
		$.get('/api/headlines?saved=false').then(function(data){
			// render headlines to page if we have them
			if (data && data.length) {
				renderArticles(data);
			}
			else {
				// render a message that we have no articles
				renderEmpty();
			}
		});
	}

	function renderArticles(articles){
		// function that appends HTML containing article data to page
		// passes array of JSON which contains articles in database
		const articlePanels = [];
		// pass each article JSON object to createPanel function
		// returns bootstrap panel with article data inside
		for (var i=0; i<articles.length; i++) {
			articlePanels.push(createPanel(articles[i]));
		}
		// once HTML for aticles is stored in articlePanels array, append to articlePanels container
		articleContainer.append(articlePanels);
	}

	function createPanel(article) {
		// function takes in single JSON object for aticle
		// constructs jQuery element with all formatted HTML for article panel
		const panel = $(
			[
		       	"<div class='panel panel-default'>",
		        "<div class='panel-heading'>",
		        "<h3>",
		        "<a class='article-link' target='_blank' href='" + article.url + "'>",
		        article.headline,
		        "</a>",
		        "<a class='btn btn-success save'>",
		        "Save Article",
		        "</a>",
		        "</h3>",
		        "</div>",
		        "<div class='panel-body'>",
		        article.summary,
		        "</div>",
		        "</div>"
      ].join("")
	);
		// attach article id to jQuery element
		panel.data('_id', article._id);
		return panel;
	}

	function renderEmpty(){
		// function renders HTML to page explaining no articles to view
		const emptyAlert = $(
			[
				"<div class='alert alert-warning text-center'>",
		        "<h4>There are no new articles.</h4>",
		        "</div>",
		        "<div class='panel panel-default'>",
		        "<div class='panel-heading text-center'>",
		        "<h3>What Would You Like To Do?</h3>",
		        "</div>",
		        "<div class='panel-body text-center'>",
		        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
		        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
		        "</div>",
		        "</div>"
      ].join("")
	);
		// append data to page
		articleContainer.append(emptyAlert);
	}

	function handleArticleSave() {
		// function is triggered when user wants to save article
		const articleToSave = $(this).parents('.panel').data();
		articleToSave.saved = true;

		$.ajax({
			method: "PUT",
			url: "/api/headlines",
			data: articleToSave
		}).then(function(data){
			if(data.ok){
				// reload list of articles
				initPage();
			}
		});
	}

	function handleArticleScrape(){
		// funtion handles user clicking "scrape new article" button
		$.get('/api/fetch').then(function(data){
			initPage();
			bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
		});
	}
});