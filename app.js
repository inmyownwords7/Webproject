const dotenv = require('dotenv').config();
// const URL = require('url')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
//TODO
// const logger = require('morgan');
// const LocalStrategy = require('passport-local').Strategy;

//TODO
// const mongoose = require('mongoose');
// const session = require('express-session')
// const passport = require('passport');
// const winston = require('winston');

//paths
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const logger = require('./routes/logger')
const User = require('./models/users');
const morgan = require("morgan");

//directories
const dirname = require('path').basename('./');
const accessLogStream = fs.createWriteStream(path.join(dirname, 'access.log'), {flags: 'a'});

logger.on('pipe', (accessLogStream) => {
console.log(accessLogStream)
})

//env
let username = process.env.USERNAME;
let password = process.env.PASSWORD;
let cluster = process.env.CLUSTER;
let db = process.env.DB;

//TODO
// const nodeEnv = process.env.NODE_ENV || 'development';
// const sessionSecret = process.env.SESSION_SECRET || 'secret';
// const fileURLToPath = require('url').fileURLToPath('./')

// Connect to MongoDB
//TODO

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connect(`mongodb+srv//${username}:${password}@usersivsjmrs.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));

const app = express();
app.use(morgan('combined', {stream: accessLogStream}))

// error handler
//TODO
// passport.use("app", LocalStrategy);
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
//         if (!user.validPassword(password)) { return done(null, false, { message: 'Incorrect password.' }); }
//         return done(null, user);
//       });
//     }
// ));
//TODO
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//TODO
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
//TODO
// app.use(passport.initialize());
// app.use(passport.session());
//TODO
// app.use(logger('combined', {stream: accessLogStream}));
// app.use(session({
//   secret: process.env.SECRET_KEY,
//   resave: false,
//   saveUninitialized: false
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//TODO
// app.engine('handlebars')
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/submit', (req, res) => {
    // console.log(req.body)

    logger.info("inputs keys: " + req.body.username + " "+ req.body.password);
    const {username, password} = req.body;
    console.log(username + ` ${password} `)
    if (username === process.env.LOCAL_USERNAME && password === process.env.LOCAL_PASSWORD) {
        //res.send('Login successful!');
        res.render('success', {message: 'Success', username})
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    logger.error(err)
    res.render('error');
});

function returnMongoDbUrl(username, password, cluster, db, collections) {
    mongoose.connect(`mongodb+srv//${username}:${password}@${cluster}.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
            useUnifiedTopology: true
    });
}
module.exports = app;
