var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require("bcryptjs");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var username = "cmps369";
var password = "finalproject";
bcrypt.genSalt(10, function (err, salt) {
	bcrypt.hash(password, salt, function (err, hash) {
		password = hash;
		console.log(`Hashed salt/password = ${password}`);
	});
});


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'cmps369'}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());



// let mailRoutes = ('./routes/mailer');
// let contactRoutes = ('./routes/contacts');
let authRoutes = require('./routes/auth');
let contactRoutes = require('./routes/contacts');
let mailRoutes = require('./routes/mailer');



//  Delete this 
// let mongoHandler = require('./public/javascripts/mongo');






passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
},
	function (user, pswd, done) {
		if (user != username) {
			console.log("Username mismatch");
			return done(null, false);
		}

		bcrypt.compare(pswd, password, function (err, isMatch) {
			if (err) return done(err);
			if (!isMatch) {
				console.log("Password mismatch");
			}
			else {
				console.log("Valid credentials");
			}
			done(null, isMatch);
		});
	}
));

passport.serializeUser(function (username, done) {
	done(null, username);
});

passport.deserializeUser(function (username, done) {
	done(null, username);
});


app.use('/', authRoutes);
app.use('/mailer', mailRoutes);
app.use('/contacts', contactRoutes);

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

  

// mongoHandler.startConnection();

module.exports = app;
