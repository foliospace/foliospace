/*
=== User Schema ===
UserId: Number
Username: String,
Password: String,
FirstName: String,
LastName: String,
EmailAddress: String
Role: ??

== Admin Schema ==
UserId: Number

=== Portfolio Schema ===
UserId: Number,
ProjectId: Number

=== Project Schema ===
UserId: ProjectId,
ProjectName: String
*/

// REFERENCE SOURCE:
// Passport Authentication tutorial by Traversy Media 
// https://www.youtube.com/watch?v=6FOq4cUdH8k

const express = require('express');
const router = express.Router();

//var passport = require('passport');
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions

module.exports = router;

// Homepage (public)
router.get('/', (req, res) => {
    console.log("Hello World! This is the homepage.");
    res.status(200).send("Hello World! This is the homepage.");
}); 

/* --- LOGIN --- */
router.get('/login', (req, res) => {
    console.log("Login");
    res.status(200).send("GET /login");
});

router.post('/login', (req, res) => {
    console.log("Login post");
    res.status(200).send("POST /login");
});

/* --- REGISTRATION --- */
router.get('/registration', (req, res) => {
    console.log("registration");
    res.status(200).send("GET /registration");
})

// BASED ON CODE FROM: https://www.youtube.com/watch?v=6FOq4cUdH8k
/*
router.post('/registration', (req, res) => {
    console.log("registration post");
    res.status(200).send("POST /registration");


    const { firstName, lastName, email, username, password, passwordVerify } = req.body;

    // Required fields: firstName, lastName, email, password, passwordVerify

    if(!firstName || !lastName || !email || !username || !password || !passwordVerify) {
        // Do something
    }
    
    // Username is unique 
    // Gonna have to think on this one...

    // Username is at least 6 characters 
    if(username.length < 6) {
        // Do something
    }

    // Password is at least 8 characters 
    if(password.length < 8) {
        // Do something
    }

    // Passwords must match 
    if(password !== passwordVerify) {
        // Do something
    }
  
})
*/

module.exports = router;