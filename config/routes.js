// routes for Server

const headlinesController = require('../controllers/headlines');
const notesController = require('../controllers/notes');

module.exports = function(router) {
	// renders homepage
	router.get('/', function(req, res){
		res.render('home');
	});

	// renders saved handlebars page
	router.get('/saved', function(req, res) {
		res.render('saved');
	});

	// handles scraping articles to add to database
	router.get('/api/fetch', function(req, res) {
		// method inside headlinesController will scrap new articles, save unique to db
		headlinesController.fetch(function(err, docs){
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
	router.get('/api/headlines', function(req, res){
		// run headlinesController method, pass in
		headlinesController.get(req.query, function(data){
			// send article data back in JSON format
			res.json(data);
		});
	});

	// route for deleting specified headline
	router.delete('/api/headlines/:id', function (req, res){
		// set _id property of query object to id in req.params
		const query = { _id: req.params.id};

		// run headlinesController delete method, pass query object
		headlinesController.delete(query, function(err, data){
			//send result in JSON format for client-side handling
			res.json(data);
		});
	});

	// route for updating headline and saving
	router.put('/api/headlines', function (req, res){
		
		// contructs query object to send to headlinesController
		headlinesController.update(req.body, function(err, data){
			// send result back to user as json
			res.json(data);
		});
	});

	// route for getting notes for particular headline id
	router.get('/api/notes/', function(req, res){
		// gets all notes
		notesController.get({}. function(err, data){
			// send note data back as json
			res.json(data);
		});
	});

}