require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var cors = require('cors');
var port = process.env.PORT || '5000'
//let's import the routes

var usersRoute = require('./Routes/usersRoute');
var postRoute = require('./Routes/postRoute')
const vercelUI = 'https://zera-blog.vercel.app'
const localUI = 'http://localhost:4000'
// database.js
// Connect to MongoDB

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(cors()); this is used to connect the frontend and backend
app.use(cors(
  {
    origin: [vercelUI, localUI],
    credentials: true
  }
));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
//let's use the routes
app.get('/', (req, res) => {
  res.send('Welcome to the Blog API');
});
app.use('/api/users', usersRoute);
app.use('/api/posts', postRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    message: `Not Found - ${req.originalUrl}`,
  });
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

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}


//module.exports = app;

// zedomanwithjesu1994
//n0wBmb3UWKm5Bs7N