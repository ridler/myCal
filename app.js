// Express  App Setup
// -----------------------------------------------------------------------
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// -----------------------------------------------------------------------

// MongoDB Setup
// -----------------------------------------------------------------------
mongoose.connect('mongodb://localhost/myCal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected to mongo');
});

var userSchema = mongoose.Schema({
	username: String,
});

var calendarSchema = mongoose.Schema({
	user: String
});

var eventSchema = mongoose.Schema({
	calendar: String,
	date: String,
	start: String,
	end: String,
	location: String,
});

var User = mongoose.model('User', userSchema);
var Calendar = mongoose.model('Calendar', calendarSchema);
var Event = mongoose.model('Event', eventSchema);
// -----------------------------------------------------------------------

// POST Request Implementation
// -----------------------------------------------------------------------
app.post('/api/1.0/users/new', function(req, res) {
	if(req.body.username.length > 1) {
		User.find({username: req.body.username}, function(error, result) {
			var dead = false;
			if(error) { res.send('{"status":"error"}'); }
			else if(result.length > 0) { res.send('{"status":"tryAgain"}'); }
			else {
				var user = new User({ username: req.body.username });
				var calendar = new Calendar({ user: user._id });
				user.save(function(error) { if(error) { dead = true; } });
				calendar.save(function(error) { if(error) { dead = true; } });
				if(dead) { res.send('{"status":"error"}'); }
				else { res.send('{"status":"success"}'); }
			}
		});
	} else { res.send('{"status":"badRequest"}'); }
});

app.post('/api/1.0/:user/event', function(req, res) {
	var dateFormat = /[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]/;
	var timeFormat = /[0-9][0-9]:[0-9][0-9]/;
	var dateCheck = req.body.date.match(dateFormat);
	var startCheck = req.body.start.match(timeFormat);
	var endCheck = req.body.end.match(timeFormat);
	if(!dateCheck) { res.send('{"status":"badDateFormat"}'); }
	else if(!startCheck || !endCheck) { res.send('{"status":"badTimeFormat"}'); }
	else if(req.body.location.length > 100) { res.send('{"status":"badLocationFormat"}'); }
	else {
		User.find({username: req.body.user}, function(error, calResult) {
			var dead = false;
			if(error) { dead = true; }
			else if(calResult.length > 1) { res.send('{"status":"badUsername"}'); }
			else {
				Calendar.find({_id: calResult.calendar}, function(error, result) {
					if(error) { dead = true; }
					else {
						var newEvent = new Event({
							calendar: calResult._id,
							date: req.body.date,
							start: req.body.start,
							end: req.body.end,
							location: req.body.location
						});
						newEvent.save(function(error) { if(error) { dead = true; } });
						if(dead) { res.send('{"status":"error"}'); }
						else { res.send('{"status":"success"}'); }
					}
				});
			}
		});
	}
});
// -----------------------------------------------------------------------

// GET Request Implementation
// -----------------------------------------------------------------------
app.get('/api/1.0/users', function(req, res) {
	User.find({}, function(error, result) {
		if(error) { res.send('{"status":"error"}'); }
		else { res.send(JSON.stringify(result)); }
	});
});

app.get('/api/1.0/:user/events', function(req, res) {
	User.find({username: req.params.user}, function(error, userResult) {
		if(error) { res.send('{"status":"error"}'); }
		else {
			Calendar.find({user: userResult._id}, function(error, calResult) {
				if(error) { res.send('{"status":"error"}'); }
				else {
					Event.find({calendar: calResult._id}, function(error, result) {
						if(error) { res.send('{"status":"error"}'); }
						else { res.send(JSON.stringify(result)); }
					})
				}
			});
		}
	});
});
// -----------------------------------------------------------------------

// Express Error Handling and Logging
// -----------------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
// -----------------------------------------------------------------------

module.exports = app;
