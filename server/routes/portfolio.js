const express = require('express');
const router = express.Router();
const db = require('../../database-mysql/db');

router.get('/:userUrl', function(req, res){
    // console.log("Portfolio Attempted")
    var person;
    var projectsList = [];
    let queryString = "SELECT * FROM users WHERE userUrl = '" + req.params.userUrl + "'";
    db.connection.query(queryString, function (err, rows, fields) {
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
                // START
                let queryString = "SELECT * FROM project WHERE login = '" + person.userEmail + "'";
                db.connection.query(queryString, function (err, rows, fields) {
                    if (err) {
                        res.status(500).json({
                            "status_code": 500,
                            "status_message": "internal server error: projects not found"
                        });
                    } else {
                        for (var i = 0; i < rows.length; i++) {
                            let project = {
                                'id': rows[i].id,
                                'projectName': rows[i].projectName,
                                'projectBlurb': rows[i].projectBlurb,
                                'login': rows[i].login,
                            }
                            projectsList.push(project);
                        }
                        res.render('portfolio', {
                            "person": person,
                            "projects": projectsList
                        });
                    } //If no projects
                });
                console.log(person, projectsList)
                // End Projects Query                        
                // res.render('portfolio', {
                //     "person": person
                // });
            } else {
                res.status(404).json({
                    "status_code": 404,
                    "status_message": "Portfolio Not Found"
                });
            }
        }
    });
});

module.exports = router;