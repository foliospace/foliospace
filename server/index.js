// REFERENCE SOURCE: https://www.youtube.com/watch?v=6FOq4cUdH8k
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const db = require('../database-mysql');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const express = require('express');
//const passport = require('passport'); // For authentication
const path = require('path');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const OktaConfig = require('./lib/oktaClient');

const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({extended: false})); // Get data using req.body
app.use(bodyParser.json());  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions

// session support is required to use ExpressOIDC
app.use(session({
  secret: 'this should be secure',
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  issuer: OktaConfig.config.issuer,
  client_id: OktaConfig.config.client_id,
  client_secret: OktaConfig.config.client_id,
  appBaseUrl: "http://localhost:3000",
  redirect_uri: 'http://localhost:3000/authorization-code/callback',
  scope: 'openid profile'
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter); 

// Routes
app.use('/admin', require('./routes/admin.js'));
app.use('/portfolio', require('./routes/portfolio.js'));
app.use('/projects', require('./routes/projects.js'));
app.use('/account', require('./routes/account.js'));

app.get('/admin', oidc.ensureAuthenticated(), (req, res) => {
  res.send(JSON.stringify(req.userContext.userinfo));
});

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

// oidc.on('ready', () => {
//   app.listen(3000, () => console.log(`OIDC Started!`));
// });

// oidc.on('error', err => {
//   console.log('Unable to configure ExpressOIDC', err);
// });

module.exports = app;
