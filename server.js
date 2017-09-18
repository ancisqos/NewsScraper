// Web Scraper

// dependencies
const express = require('express');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

// set up port to be either host's designated port or 3000
const PORT = process.env.PORT || 3000;

// instantiate express app
const app = express();

// set up express router
const router = express.Router();

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
const db = process.env,MONGODB_URI || "mongodb://localhost/mongoHeadlines";

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