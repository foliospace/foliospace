var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// SOURCE: https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database
// DATE ACCESSED: April 22, 2019

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// UNCOMMENT FOR REACT
// app.use(express.static(__dirname + '/../react-client/dist'));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

// SOURCE: https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database
// DATE ACCESSED: April 22, 2019
.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

