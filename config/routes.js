// routes for Server

var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(app) {
	// renders homepage
	app.get('/', function(req, res){
		res.render('home');
	});

	// renders saved handlebars page
	app.get('/saved', function(req, res) {
		res.render('saved');
	});

	// handles scraping articles to add to database
	app.get('/api/fetch', function(req, res) {
		console.log("We are scraping")
		// method inside headlinesController will scrap new articles, save unique to db
		headlinesController.fetch(function(err, docs){
			//console.log(docs);
			// if no articles, send this message
			if (!docs || docs.insertedCount === 0) {
				res.json({
					message: "No new articles."
				});
			}
			else {
				// send back count of how many new articles
				res.json({
					message: "Added " + docs.insertedCount + " new articles to database."
				});
			}
		});
	});

	// route that gets all headlines from database
	app.get('/api/headlines', function(req, res){
		// run headlinesController method, pass in
		headlinesController.get(req.query, function(data){
			// send article data back in JSON format
			res.json(data);
		});
	});

	// route for deleting specified headline
	app.delete('/api/headlines/:id', function (req, res){
		// set _id property of query object to id in req.params
		var query = { _id: req.params.id};

		// run headlinesController delete method, pass query object
		headlinesController.delete(query, function(err, data){
			//send result in JSON format for client-side handling
			res.json(data);
		});
	});

	// route for updating headline and saving
	app.put('/api/headlines', function (req, res){
		
		// contructs query object to send to headlinesController
		headlinesController.update(req.body, function(err, data){
			// send result back to user as json
			res.json(data);
		});
	});

	// route for getting notes for particular headline id
	app.get('/api/notes/', function(req, res){
		// gets all notes
		notesController.get({}, function(err, data){
			// send note data back as json
			res.json(data);
		});
	});

	// route for handling getting notes
	app.get('/api/notes/:headline_id', function(req, res){
    var query = { _id: req.params.headline_id };

    	// get notes that match query using notesController get method
    	notesController.get(query, function(err, data){
    		// send note data back to user as JSON
    		res.json(data);
    	});
	});

	// route for deleting note of particular note id
	app.delete('/api/notes/:id', function (req, res){
		var query = {_id: req.params.id };

		// checks articles, sort by id 
		notesController.delete(query, function(err, data){
			// send article data as json
			res.json(data);
		});
	});

	// route for saving new note
	app.post('/api/notes', function(req, res){
		notesController.save(req.body, function(data){
			// send note to browser as json
			res.json(data);
		});
	});
};