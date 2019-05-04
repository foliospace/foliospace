/* The route /portfolio will display user dashboard:
 *  -> Title
 *  -> About / Bio
 *  -> Social links
 *  -> Text box
 *  -> Contact
 *  -> Projects
 *      -> Clicking edit, delete, or create button directs to /projects route
 */

const express = require('express');
const router = express.Router();

module.exports = router;

/* --- MODELS --- */
function getPortfolio() {

}

/* --- CONTROLLERS --- */

router.get('/', (req, res) => {
    console.log("GET /portfolio");
    res.status(200).send("GET /portfolio");
});

router.post('/', (req, res) => {
    // New user will need a new instance of portfolio
    console.log("POST /portfolio");
    res.status(200).send("POST /portfolio");
})