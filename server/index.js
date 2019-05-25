// REFERENCE SOURCE: https://www.youtube.com/watch?v=6FOq4cUdH8k
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('../database-mysql');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({extended: false})); // Get data using req.body
app.use(bodyParser.json());  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter); 

// Routes
app.use('/admin', require('./routes/admin.js'));
app.use('/portfolio', require('./routes/portfolio.js'));
app.use('/projects', require('./routes/projects.js'));
app.use('/account', require('./routes/account.js'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

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
