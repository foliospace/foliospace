//const IncomingForm = require('formidable').IncomingForm;
const express = require('express');
const cors = require('cors');
var cloudinary = require('cloudinary').v2;
const config = require('../config').cloudinary;
var mysql = require('mysql');

const router = express.Router();

router.use(cors(corsOptions));

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

cloudinary.config({ 
    cloud_name: config.cloud_name,
    api_key: config.api_key, 
    api_secret: config.api_secret
});

var db = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: "mydb"
});

/*-------- BEGIN MODEL FUNCTIONS --------*/

/** 
 * Get all of the user's projects.
 * Use this to list out projects.
 */
function getAllProjects(){
    var queryString = "SELECT * FROM portfolio";
    db.query(queryString, function (err, result, fields) {
        if (err) throw err;
        return result;
    });
}

/** 
 * Get a specific project.
 * This should redirect to a page that allows editing of the project.
 */
function getProject(prjId){
    var key = prjId;
    var queryString = "SELECT * FROM portfolio WHERE ProjectId = ?";
    db.query(queryString, [key], function (err, result, fields) {
        if (err) throw err;
        return result;
    });
}

/** 
 * Create a new project.
 * This should redirect to a page that allows editing of the project.
 */
function createProject(name){
    var key = name;
    var queryString = "INSERT INTO portfolio (ProjectName) VALUES (?)";
    con.query(queryString, [key], function (err, result) {
        if (err) throw err;
        return result;
    });
}

/** 
 * Update an existing project.
 * Currently only allows for changing the name.
 */
function updateProject(name, prjId){
    var nameKey = name;
    var idKey = prjId;
    var queryString = "UPDATE project SET ProjectName = ? WHERE ProjectId = ?";
    con.query(queryString, [nameKey, idKey], function (err, result) {
        if (err) throw err;
        return result;
    });    
}

/** 
 * Delete a project.
 */
function deleteProject(prjId){
    var key = prjId;
    var queryString = "DELETE FROM portfolio WHERE ProjectId = ?";
    con.query(queryString, [key], function (err, result) {
        if (err) throw err;
        return result;
    });    
}

/*-------- END MODEL FUNCTIONS --------*/

/*-------- BEGIN CONTROLLER FUNCTIONS --------*/

/** 
 * Get all of the user's projects.
 * Use this to list out projects.
 */
router.get('/', function(req, res){
    const projects = getAllProjects(req)
    .then ( (projects) => {
        res.status(200).json(projects);
    });
});

/** 
 * Get a specific project.
 * This should redirect to a page that allows editing of the project.
 */
router.get('/:projectId', function(req, res){
    const prj = getProject(req.params.projectId)
    .then( (prj) => {
        res.status(200).json(prj);
    })
});

/** 
 * Create a new project.
 * This should redirect to a page that allows editing of the project.
 */
router.post('/', function(req, res){
    // SOURCE: http://classes.engr.oregonstate.edu/eecs/perpetual/cs493-400/modules/5-advanced-rest-api/3-nodejs-implementation/
    if(req.get('Content-Type') !== 'application/json'){
        res.status(415).send('Please resend with application/json data.');
    }    
    createProject(req.body.name) // what other items needed?
    .then(
        // What to do...?
    );
});

/** 
 * Update an existing project.
 * Currently only allows for changing the name.
 */
router.patch('/:projectId', function(req, res){
    // SOURCE: http://classes.engr.oregonstate.edu/eecs/perpetual/cs493-400/modules/5-advanced-rest-api/3-nodejs-implementation/
    if(req.get('Content-Type') !== 'application/json'){
        res.status(415).send('Please resend with application/json data.');
    } 
    updateProject(req.body.name, req.params.projectId)
    .then(
        // What to do...?
    );
});

/** 
 * Delete a project.
 */
router.delete('/:projectId', function(req, res){
    deleteProject(req.params.projectId)
    .then(res.status(204).end());
});

/**** CLOUDINARY UPLOAD ****/

/** 
 * SOURCE: https://cloudinary.com/documentation/image_upload_api_reference#upload_method
 */

router.post('/files', function(req,res) {
  var widget = cloudinary.createUploadWidget({ 
    cloudName: "demo", uploadPreset: "preset1" }, (error, result) => { });
  widget.open();
})


/****** FILE UPLOAD v1 ******/
// SOURCES for File Upload: 
// https://malcoded.com/posts/react-file-upload/
// https://shiya.io/simple-file-upload-with-express-js-and-formidable-in-node-js/

/*
router.get('/files', function (req, res){
    res.sendFile(__dirname + '/index.html');
});

router.post('/files', function (req, res){
  var form = new IncomingForm();

  form.parse(req);

  form.on('file', (field, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
    console.log('Uploaded ' + file.name);
  });

  form.on('end', () => {
    res.json()
  });

});
*/

/*-------- END CONTROLLER FUNCTIONS --------*/

module.exports = router;