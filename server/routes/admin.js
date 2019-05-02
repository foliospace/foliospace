/* The route /admin will display:
 *  -> List of all users, portfolio URL, and a delete button
 * Is viewable only to admin users
 */

const express = require('express');
const router = express.Router();

module.exports = router;

// Display all users
router.get('/', (req, res) => {
    // Get all users and portfolio sites
    const users = getAllUsers() // Model not yet written
	.then( (users) => {
        console.log("Success getting all users");
        res.status(200).json(users);
    });
});

// Delete user
router.delete('/:userId', (req, res) => {
    console.log("Successfully deleted user");
    res.status(204);
});