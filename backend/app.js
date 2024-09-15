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
// database.js
// Connect to MongoDB
//const uri = 'mongodb+srv://zedomanwithjesu1994:122331ETH%21%40%23@cluster0.a8dxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const localDB = "mongodb://127.0.0.1:27017/blogDB"
mongoose.connect(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})  
.then(() => {console.log('Connected to MongoDB');
}).catch((error) => {
console.log('Connection error', error);
});
// Data base connection ended

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(cors()); this is used to connect the frontend and backend
app.use(cors(
  {
    origin: 'http://localhost:4000',
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

//let's use the routes
app.use('/users', usersRoute);
app.use('/posts', postRoute);

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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//module.exports = app;
