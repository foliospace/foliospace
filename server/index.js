// REFERENCE SOURCE: https://www.youtube.com/watch?v=6FOq4cUdH8k

const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mysql');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
//const passport = require('passport'); // For authentication

const app = express();

// Connect to database
/*
db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('Database connected...');
});
*/

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.urlencoded({ extended: false })); // Get data using req.body

app.use(morgan('short'));

//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions   

// Routes
app.use('/', require('./routes/general.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/portfolio', require('./routes/portfolio.js'));
app.use('/projects', require('./routes/projects.js'));
app.use('/account', require('./routes/account.js'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});