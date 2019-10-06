var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');
var session =require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors({
  origin:['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
}));

const db = require('./config/keys').MongoURI;

require('./config/passport.js');

mongoose.connect(db, {useNewUrlParser:true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
mongoose.set({useFindAndModify: false});

const MongoStore = require('connect-mongo')(session);

app.use(session({
  name:'Praveen.sid',
  resave: false,
  saveUninitialized: false,
  secret: 'Praveen',
  cookie: {
    maxAge: 36000000,
    httpOnly: false,
    secure: false
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
