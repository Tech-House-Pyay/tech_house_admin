var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/teacher');
var course = require('./routes/course');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/cropperjs/dist'));
app.use('/css', express.static(__dirname + '/node_modules/cropper/dist'));

mongoose.connect('mongodb://yethuaung:zikimi95@ds163013.mlab.com:63013/techhousedb'); // studydb is anyname can insert
var db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));

app.use(session({
  secret: 'T@Ch H0u$@ $TUD!0',
  resave: false,
  saveUninitialized: true
}))


app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});
app.use('/', indexRouter);
app.use(function (req, res, next) {
  // res.locals.active = req.path;
  console.log('user path', req.path);
  if(req.session.user){
    next();
  }else{
    // req.flash("warning", "Authorization failed! Please login");
    // req.flash('forward', req.path);
    res.redirect('/signin');
  }

});
app.use('/teacher', usersRouter);
app.use('/course', course);

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
