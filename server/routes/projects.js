//const IncomingForm = require('formidable').IncomingForm;
const express = require('express');
var cloudinary = require('cloudinary').v2;
const config = require('../config').cloudinary;
var mysql = require('mysql');
const request = require('request');
const bodyParser = require('body-parser');

const router = express.Router();

cloudinary.config({ 
    cloud_name: config.cloud_name,
    api_key: config.api_key, 
    api_secret: config.api_secret
});

var db = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
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
 */
function getProject(prjId){
    var key = prjId;
    // Will need a link table between files and projects
    var queryString = "SELECT * FROM portfolio WHERE projectId = ?";
    db.query(queryString, [key], function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            var prj = {
                'id':result[0].projectId,
                'name':result[0].projectName
            }
            return prj;
        }
    });
}

/** 
 * Create a new project.
 * This should redirect to a page that allows editing of the project.
 */
function createProject(name, blurb){
    var queryString = "INSERT INTO portfolio (projectName, projectBlurb) VALUES (?)";
    con.query(queryString, [name, blurb], function (err, result) {
        if (err) throw err;
        return result;
    });
}

/** 
 * Update an existing project.
 * Currently only allows for changing the name.
 */
function updateProject(name, blurb, prjId){
    var queryString = "UPDATE project SET projectName = ?, projectBlurb = ?, WHERE projectId = ?";
    con.query(queryString, [name, blurb, prjId], function (err, result) {
        if (err) throw err;
        return result;
    });    
}

/** 
 * Delete a project.
 */
function deleteProject(prjId){
    var key = prjId;
    var queryString = "DELETE FROM portfolio WHERE projectId = ?";
    con.query(queryString, [key], function (err, result) {
        if (err) throw err;
        return result;
    });    
}

/**
 * Upload files
 * SOURCE: https://cloudinary.com/documentation/image_upload_api_reference#upload_method
 */
function uploadFiles(prjId){
    // Need to updt query:
    // >> fileId will be the auto-gen public_id from result JSON
    // >> fileUrl is part of the result JSON
    var queryString = "INSERT INTO project (file) VALUES (?)"; 
    cloudinary.openUploadWidget({
        cloudName: config.cloud_name, 
        uploadPreset: config.cloud_name,
        folder: prjId
    }, (error, result) => {
            if (result && result.event === "success") {
                // send the public_id of the image(s) to the DB
                var i;
                var key;
                for (i = 0; i < result.length; i++) {
                    key = result.info.publicid;
                    con.query(querystring, [key], function (err, res) {
                        if (err) throw err;
                        return res;
                    })
                }
            }
    });    
}

/**
 * Get files
 * Returns JSON object
 * RESOURCES: https://cloudinary.com/documentation/admin_api
 */
function getAllFiles(prjId){
   cloudinary.v2.api.resources({ type: 'upload', prefix: prjId }, 
        function(error, result) { 
            return result;
        }
    );
}

/**
 * Get a specific file
 * Returns JSON object
 * RESOURCE:
 */
function getFile(fileId){
    cloudinary.v2.api.resources_by_ids(fileId, function(error, result) {
        return result;
    });
}

/**
 * Delete all files associated with a project
 * RESOURCE: https://cloudinary.com/documentation/admin_api#delete_resources
 */
function deleteAllFiles(projectId){
    cloudinary.v2.api.delete_resources_by_prefix(projectId, function(error, result) {
        return result;
    });
}

/**
 * Delete a specific file
 * RESOURCE: https://cloudinary.com/documentation/admin_api#delete_resources
 */
function deleteFile(fileId){
    cloudinary.v2.api.delete_resources([fileId], function(error, result){
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
        res.render('project', {"prj": prj});
        res.status(200).json(prj);
    })
});

/** 
 * Create a new project.
 * This should redirect to a page that allows editing of the project (i.e. uploading photos).
 */
router.post('/', function(req, res){
    // SOURCE: http://classes.engr.oregonstate.edu/eecs/perpetual/cs493-400/modules/5-advanced-rest-api/3-nodejs-implementation/
    if(req.get('Content-Type') !== 'application/json'){
        res.status(415).send('Please resend with application/json data.');
    }    
    // Create the project
    const prjId = createProject(req.body.name)
    // Redirect to the edit page
    .then( (prjId) => {
        var options = {
            method: 'GET',
            url: req.protocol + "://" + req.get("host") + req.baseUrl + "/" + prjId
        }
        request(options, (error, response) => {
            if (error) {
                res.render("error");
            } else {
                res.status(201);
            }
        })
    })
});


/** 
 * Update an existing project.
 * Currently only allows for changing the name and description.
 */
router.put('/:projectId', function(req, res){
    // SOURCE: http://classes.engr.oregonstate.edu/eecs/perpetual/cs493-400/modules/5-advanced-rest-api/3-nodejs-implementation/
    if(req.get('Content-Type') !== 'application/json'){
        res.status(415).send('Please resend with application/json data.');
    } 
    updateProject(req.body.name, req.body.blurb, req.params.projectId)
    // Return a 303 code with the location of the updated project ID in the appropriate header field
    .then( res.location(req.protocol + "://" + req.get("host") + req.baseUrl + "/" + req.params.projectId).status(303).end() );
});

/** 
 * Delete a project.
 */
router.delete('/:projectId', function(req, res){
    deleteProject(req.params.projectId)
    .then(res.status(204).end());
});

/** 
 * Upload Images to project
 * SOURCE: https://cloudinary.com/documentation/image_upload_api_reference#upload_method
 */
router.post('/:projectId/files', function(req, res) {
    uploadFiles(req.params.projectId)
    .then(res.status(200));
});

/**
 * Retrieve all images uploaded to a project
 * SOURCE: https://cloudinary.com/documentation/admin_api#browse_resources
 */
router.get(':/projectId/files', function(req, res) {
    const prjFiles = getAllFiles(req.params.projectId)
    .then( (prjFiles) => {
        console.log(prjFiles);
        res.status(200).json(prjFiles);
    });
});

/**
 * Retrieve a specific image uploaded to a project
 * SOURCE: https://cloudinary.com/documentation/admin_api#browse_resources
 */
router.get(':/projectId/files/:fileId', function(req, res) {
    const prjFile = getFile(req.params.fileId)
    .then( (prjFile) => {
        console.log(prjFile);
        res.status(200).json(prjFile);
    });
});

/**
 * Delete all files associated with a project
 * 
 */
router.delete(':/projectId/files', function(req, res) {
    deleteAllFiles(req.params.projectId)
    .then(res.status(204).end());
});

/**
 * Delete a specific file associated with a project
 * 
 */ 
router.delete(':/projectId/files/:fileId', function(req, res) {
    deleteFile(req.params.fileId)
    .then(res.status(204).end());
});
/*-------- END CONTROLLER FUNCTIONS --------*/

module.exports = router;
