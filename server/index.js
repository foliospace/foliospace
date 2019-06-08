// REFERENCE SOURCE: https://www.youtube.com/watch?v=6FOq4cUdH8k
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require("http-errors");
const db = require('../database-mysql');
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");

const auth = require("./auth");
const middleware = require("./middleware");


const dashboardRouter = require("./routes/dashboard");
const homeRouter = require("./routes/home");
const usersRouter = require("./routes/users");

const oktaConfig = require('./okta.config');

// App initialization
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  extended: false
})); // Get data using req.body

app.use(session({
  secret: oktaConfig.secret,
  resave: true,
  saveUninitialized: false
}));

app.use(auth.oidc.router);
app.use(middleware.addUser);

// Routes
app.use('/admin', require('./routes/admin.js'));
app.use('/portfolio', require('./routes/portfolio.js'));
app.use('/projects', require('./routes/projects.js'));
app.use('/account', require('./routes/account.js'));

app.get('/admin', auth.oidc.ensureAuthenticated(), (req, res) => {

  res.send(JSON.stringify(req.userContext.userinfo));
});

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}...`);
// });

// Error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
