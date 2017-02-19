var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

// Set up handlebars view engine
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname+ '/public'));

// Homepage
app.get('/', function(req, res){
	res.render('home');
});

// About Page
app.get('/about', function(req, res){
	res.render('about', {fortune: fortune.getFortune()});
});

// Custom 404 catch-all handler (middleware)
app.use(function(req, res){
		res.status(404);
		res.render('404');
});

// Custom 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

// Start the server and listen in on port 3000
app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
