var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

// Set up handlebars view engine
var handlebars = require('express3-handlebars').create({
	defaultLayout:'main', 
	helpers:{
		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
			}
		}
	}
);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set the listening port to 3000
app.set('port', process.env.PORT || 3000);

// Express will pull all public files from /public
app.use(express.static(__dirname+ '/public'));

// Allow testing when a certin condition is met
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test ==='1';
	next();
});

function getWeatherData(){
	return {
		locations: [
			{
				name: 'Portland',
				forecastURL: 'http://www.wunderground.com/US/OR/Portland.html',
				iconURL: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)',
			},
			{
				name: 'Bend',
				forecastURL: 'http://www.wunderground.com/US/OR/Bend.html',
				iconURL: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)',			
			},
			{
				name: 'Manzanita',
				forecastURL: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconURL: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)'
			},
		],
	};
}

app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weather = getWeatherData();
	next();
});

// Homepage
app.get('/', function(req, res){
	res.render('home');
});

// JqueryTest
app.get('/JqueryTest', function(req,res){
	res.render('jquery-test');
});

// About Page
app.get('/about', function(req, res){
	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

// Newsletter sign up
app.use(require('body-parser')());

app.get('/newsletter', function(req, res){
	res.render('newsletter', {csrf: 'CRSF token goes here'});
});

app.post('/process', function(req, res){
	if(req.xhr || req.accepts('json,html')==='json'){
		// if there were an error, we would send {error: 'error description'}
		res.send({success: true});
	}
	else {
		// if there were an error, we would redirect to an error page
		res.redirect(303, '/thank-you');
	}
});

// Hood River Page
app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});

// Request group rate page
app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});

// Nursery rhyme
app.get('/nursery-rhyme', function(req, res){
	res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
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
