/* The route /account will display:
 *  -> username field w/ username populated
 *  -> email field w/ current email populated
 *  -> password field w/ "mask"
 *      -> Ability to edit / save all fields??
 */

const express = require('express');
const router = express.Router();

module.exports = router;

// Get current account information
router.get('/', (req, res) => {
    console.log("GET /account");
    res.status(200).send("GET /account");
});

// Update current account information
router.patch('/', (req, res) => {
    console.log("PATCH /account");
    res.status(200).send("PATCH /account");
});