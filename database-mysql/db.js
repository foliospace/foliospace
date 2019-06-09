var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'wiad5ra41q8129zn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'wxxl4ykpjxita1zv',
  password : 'ntyxgfb9x2dpyr4x',
  database : 'nn63dg6ksfqti6ih'
});

// var selectAll = function(callback) {
//   connection.query('SELECT * FROM users', function(err, results, fields) {
//     if(err) {
//       callback(err, null);
//     } else {
//       callback(null, results);
//     }
//   });
// };

// module.exports.selectAll = selectAll;
module.exports.connection = connection;
