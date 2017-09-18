// Web Scraper

// dependencies
var express = require('express');
var mongoose = require('mongoose');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');

// set up port to be either host's designated port or 3000
var PORT = process.env.PORT || 3000;

// instantiate express app
var app = express();

// set up express router
var router = express.Router();

// require routes file pass router object
require('./config/routes')(router);

// designate public folder as static directory
app.use(express.static(__dirname + '/public'));

// connect handlebars to express app
app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// use bodyParser in app
app.use(bodyParser.urlencoded({
	extended: false
}));

// have all requests go through router middle ware
app.use(router);

// if deployed, use deployed database. otherwise use local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// connect mongoose to database
mongoose.connect(db, function(error){
	//log errors connecting with mongoose
	if (error) {
		console.log(error);
	}
	// or log success message
	else {
		console.log('mongoose connection successful');
	}
});

// listen on port
app.listen(PORT, function(){
	console.log('listening on port:' + PORT);
});