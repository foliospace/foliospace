/***
 * Display the Dashboard page.
 * Adds the user by email into the database is not already present
 */

const express = require("express");
const router = express.Router();
const db = require('../../database-mysql/db');

router.get("/", (req, res) => {
  // console.log("Dashboard Request", req.user.profile.email);
  let queryString = "SELECT * FROM users WHERE userEmail = '" + req.user.profile.email + "'";
  db.connection.query(queryString, function (err, rows, fields) {
    if (err) {
      res.status(500).json({
        "status_code": 500,
        "status_message": "internal server error: user not found"
      });
    } else {
      if (rows.length == 1) {
        let person = {
          'id': rows[0].id,
          'userName': rows[0].userName,
          'userEmail': rows[0].userEmail,
          'userUrl': rows[0].userUrl,
          'displayName': rows[0].displayName,
          'linkedinURL': rows[0].linkedinURL,
          'githubURL': rows[0].githubURL,
          'schoolName': rows[0].schoolName,
          'degree': rows[0].degree,
          'gradDate': rows[0].gradDate
        }
        console.log("Dashboard: Person Info", person)
      } else {
          let queryString = "INSERT INTO users (userEmail) VALUES ('" + req.user.profile.email + "')";
          db.connection.query(queryString, function (err, rows, fields) {
            if(err) {
              res.status(500).json({
                "status_code": 500,
                "status_message": "internal server error: user not created"
              });
            } else {
              console.log("New User Added", req.user.profile.email, queryString);
            }
          });
      }
    }
  });
  res.render("dashboard");
});

module.exports = router;
