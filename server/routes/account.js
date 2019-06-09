/**
 * The Account Page allows a uwer to update their own account details. Emails cannot be changed
 */

const express = require('express');
const router = express.Router();
const db = require('../../database-mysql/db');

// Get current account information
router.get('/', (req, res) => {
    // console.log("Current User Email", req.user.profile.email)
    let queryString = "SELECT * FROM users WHERE userEmail = '" + req.user.profile.email + "'";
    // console.log(queryString);
    db.connection.query(queryString, function (err, rows, fields) {
        var person;

        if (err) {
            res.status(500).json({
                "status_code": 500,
                "status_message": "internal server error: user not found"
            });
        } else {
            if (rows.length == 1) {
                var person = {
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
                res.render('account', {
                    "person": person
                });
            } else {
                res.status(404).json({
                    "status_code": 404,
                    "status_message": "User Account Not found"
                });
            }
        }
    });
});

// Update current account information
router.post('/:id', (req, res) => {
    let queryParams = [req.body.name, req.body.url, req.body.displayName, req.body.userUrl, req.body.school, req.body.degree, req.body.gradDate, req.body.linkedinURL, req.body.githubURL]
    let queryString = "UPDATE users SET username = ?, userURl = ?, displayName = ?, userUrl = ?, schoolName = ?, degree = ?, gradDate = ?, linkedinURL = ?, githubURL = ?" + "WHERE id = " + req.params.id;
    // console.log(queryParams);
    db.connection.query(queryString, queryParams, function(err, results) {
        if (err) {
            res.status(500).json({
                "status_code": 500,
                "status_message": "internal server error: user not found and account not updated"
            });
        } else {
            let queryString = "SELECT * FROM users WHERE id = " + req.params.id;
            db.connection.query(queryString, function (err, rows, fields) {
                let person;

                if (err) {
                    res.status(500).json({
                        "status_code": 500,
                        "status_message": "internal server error: user not found"
                    });
                } else {
                    if (rows.length == 1) {
                        person = {
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
                        res.render('account', {
                            "person": person
                        });
                    } else {
                        res.status(404).json({
                            "status_code": 404,
                            "status_message": "User Account Not Found"
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;
