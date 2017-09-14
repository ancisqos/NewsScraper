// dependencies for Node
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// debugging
const logger = require('morgan');

// web scraping
const request = require('request');
const cheerio = require('cheerio');

// initiliaze express for body parsing and debugging
const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}))

// static content
app.use(express.static(process.cwd() + '/public'));

// express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// database and mongoose
mongoose.connect('mongod://localhost:3000');

const db = mongoose.connection

// errors in mongoose
db.on('error'. function(err){
	console.log('Mongoose Error: ', err);
});

db.once('open', function(){
	console.log('Mongoose connection successful!');
});

// imports Article and Comment models
const Comment = require('./models/comment.js');
const Article = require('./models/Article.js');

// imports routes and controller
const router = require('./controllers/controller.js');
app.use('/', router);

// launches app
const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Running on port: ' + port);
});