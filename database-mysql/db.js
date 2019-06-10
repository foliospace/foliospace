var mysql = require('mysql');
const configObj = require('../server/config');
const dbConfig = configObj.mysql;

var connection = mysql.createConnection({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});

module.exports.connection = connection;
