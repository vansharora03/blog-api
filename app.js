// Import packages and dependencies
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

// Connect to mongodb
mongoose.connect(process.env.MONGODB);

// Require routes
var indexRouter = require('./routes/index');
const blogsRouter = require('./routes/blogs');
const usersRouter = require('./routes/users'); 
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

// Use express
var app = express();

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    
    // invalid username
    if (!user) {
      return done(null, false, {message: 'Invalid username or password'});
    }

    // check password
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // passwords match, log in
        return done(null, user)
      } else {
        return done(null, false, {message: 'Invalid username or password'});
      }
    });

  } catch (err) {
    return done(err);
  }
}))

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/blogs', blogsRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
