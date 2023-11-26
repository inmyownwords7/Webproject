const __dirname = require('path').dirname;

const dotenv = require('dotenv').config({path: path.join(__dirname, '')});
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const winston = require('winston');

// const exphbs = require('express-handlebars')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const {configDotenv} = require("dotenv");
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// let username = "admin"
// let password = ""
// let cluster-name = ""
// let dbname = ""

let username = process.env.USERNAME;
let password = process.env.PASSWDORD;

const nodeEnv = process.env.NODE_ENV || 'development';
// const sessionSecret = process.env.SESSION_SECRET || 'secret';

// mongoose.connect(`mongodb+srv//${username}:${password}@usersivsjmrs.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));

const app = express();
//const userStrategy = new LocalStrategy();

// error handler
passport.use("app", LocalStrategy);

app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

passport.serializeUser((user, done) => {
done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
})

app.use(logger('combined', {stream: accessLogStream}));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.engine('handlebars')
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
