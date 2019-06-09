/* The route /admin will display:
 * List of all users, portfolio URL, and a delete button
 * Is viewable only to admin users
 */

const express = require('express');
const router = express.Router();
const db = require('../../database-mysql/db');

// Display all users and their portfolio sites
router.get('/', (req, res) => {
    var personList = [];
    db.connection.query('SELECT * FROM users', function (err, rows, fields) {
        if (err) {
            res.status(500).json({
                "status_code": 500,
                "status_message": "internal server error"
            });
        } else {
            for (var i = 0; i < rows.length; i++) {
                let person = {
                    'id': rows[i].id,
                    'userName': rows[i].userName,
                    'userEmail': rows[i].userEmail,
                    'userUrl': rows[i].userUrl,
                    'displayName': rows[i].displayName,
                    'linkedinURL': rows[i].linkedinURL,
                    'githubURL': rows[i].githubURL,
                    'schoolName': rows[i].schoolName,
                    'degree': rows[i].degree,
                    'gradDate': rows[i].gradDate
                }
                personList.push(person);
            }
            // console.log("All Users: ", personList);
            res.render('admin', {
                "personList": personList
            });
        }
    });
});

// Delete user
router.get('/delete/:userId', (req, res) => {
    console.log("Incoming User ID:", req.params.userId)
    let queryString = 'DELETE FROM users WHERE id = ' + req.params.userId;
    console.log(queryString);
    db.connection.query(queryString, function (err, rows, fields) {
        var person;

        if (err) {
            res.status(500).json({
                "status_code": 500,
                "status_message": "internal server error"
            });
        } else {
            console.log("Success Deleting User", req.params.userId);
            res.redirect('/admin');
        }
    });
});

module.exports = router;
