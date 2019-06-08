//const IncomingForm = require('formidable').IncomingForm;
const express = require('express');
var cloudinary = require('cloudinary').v2;
const c_config = require('../config').cloudinary;
const m_config = require('../config').mysql;
var mysql = require('mysql');
const request = require('request');
const bodyParser = require('body-parser');

const router = express.Router();

cloudinary.config({ 
    cloud_name: c_config.cloud_name,
    api_key: c_config.api_key, 
    api_secret: c_config.api_secret
});

var con = mysql.createConnection({
    host: m_config.host,
    user: m_config.user,
    password: m_config.password,
    database: m_config.database
});

/*-------- BEGIN MODEL FUNCTIONS --------*/

/** 
 * Get all of the user's projects.
 * Use this to list out projects.
 */
function getAllProjects(){
    var queryString = "SELECT * FROM portfolio";
    con.query(queryString, function (err, result, fields) {
        if (err) throw err;
        return result;
    });
}

/** 
 * Get a specific project.
 */
var getProject = function (prjId, callback){
    var key = prjId;
    // Will need a link table between files and projects
    var queryString = "SELECT * FROM project WHERE projectId = ?";
    con.query(queryString, [key], function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/** 
 * Create a new project.
 * This should redirect to a page that allows editing of the project.
 */
var createProject = async function (name, blurb, callback){
    var queryString = "INSERT INTO project (`projectName`, `projectBlurb`) VALUES (?, ?)";
    await con.query(queryString, [name, blurb], function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            //console.log('createProject: Inside query result: ' + result.insertId);
            callback(null, result.insertId);
        }
    });
}

/** 
 * Update an existing project.
 */
var updateProject = async function (name, blurb, prjId, callback){
    var queryString = "UPDATE project SET `projectName` = ?, `projectBlurb` = ? WHERE `projectId` = ?";
    await con.query(queryString, [name, blurb, prjId], function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log('updateProject result: ' + result);
            callback(null, result);
        }
    });    
}

/** 
 * Delete a project.
 */
var deleteProject = async function (prjId, callback){
    var queryString = "DELETE FROM project WHERE `projectId` = ?";
    await con.query(queryString, [prjId], function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(result);
            callback(null, result);
        }
    });    
}

/**
 * Upload files
 * SOURCE: https://cloudinary.com/documentation/image_upload_api_reference#upload_method
 */
function uploadFiles (prjId){
    // fileId is the auto-gen public_id from result JSON
    // fileUrl is part of the result JSON
    var queryString = "INSERT INTO files (`fileId`, `projectId`, `fileUrl`) VALUES (?, ?, ?)"; 
    cloudinary.openUploadWidget({
        cloudName: config.cloud_name, 
        uploadPreset: config.cloud_name,
        folder: prjId
    }, (error, result) => {
            if (result && result.event === "success") {
                // send the public_id of the image(s) to the database
                var i;
                for (i = 0; i < result.length; i++) {
                    var fileId = result.info.publicid;
                    var fileUrl = result.info.url;
                    con.query(querystring, [fileId, prjid, fileUrl], function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log(res);
                            return res;
                        }
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
router.get('/', async function(req, res){
    await getAllProjects(req, function(err, data) {
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            res.status(200).json(projects);
        }
    })
});

/** 
 * Get a specific project.
 * This should redirect to a page that allows editing of the project.
 */
router.get('/:projectId', async function(req, res){
    await getProject(req.params.projectId, function(err, data) {
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            console.log(data);
            const accepts = req.accepts(['application/json']);
            if(!accepts){
                res.status(406).send('Oh snap. Content-Type must be application/json.');
            } else if (accepts) {
                res.status(200);
                res.render('project', {"prj":data});
            } else { 
                res.status(500).send('Dang. Content-Type got messed up!'); 
            }  
        }
    });
});

/** 
 * Create a new project.
 * This should redirect to a page that allows editing of the project (i.e. uploading photos).
 */
router.post('/', async function(req, res){
    // SOURCE: http://classes.engr.oregonstate.edu/eecs/perpetual/cs493-400/modules/5-advanced-rest-api/3-nodejs-implementation/
    if(req.get('Content-Type') !== 'application/json'){
        res.status(415).send('Please resend with application/json data.');
    }    
    // Create the project
    await createProject(req.body.name, req.body.blurb, function(err, data) {
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            console.log('Project created. ID: ' + data);
            res.status(201).send('Success! Project created. ID: ' + data);
            // Redirect to the project edit page
            var options = {
                method: 'GET',
                url: req.protocol + "://" + req.get("host") + req.baseUrl + "/" + data
            }
            request(options, (error, response) => {
                if (error) {
                    res.render("error");
                } else {
                    res.status(200);
                }
            });
        }
    });
});

/** 
 * Update an existing project.
 * Currently only allows for changing the name and description.
 */
router.put('/:projectId', async function(req, res){
    // SOURCE: http://classes.engr.oregonstate.edu/eecs/perpetual/cs493-400/modules/5-advanced-rest-api/3-nodejs-implementation/
    if(req.get('Content-Type') !== 'application/json'){
        res.status(415).send('Please resend with application/json data.').end();
    } else {
        await updateProject(req.body.name, req.body.blurb, req.params.projectId, function(err, data) {
            // Return a 303 code with the location of the updated project ID in the appropriate header field
            res.location(req.protocol + "://" + req.get("host") + req.baseUrl + "/" + req.params.projectId).status(303).end();
        });
    }
});

/** 
 * Delete a project.
 */
router.delete('/:projectId', async function(req, res){
    await deleteProject(req.params.projectId, function(err, data) {
        if (err) {
            console.log('ERROR: ' + err);
        } else {
            res.status(204).end();
        }      
    });
    
});

/** 
 * Upload Images to project
 * SOURCE: https://cloudinary.com/documentation/image_upload_api_reference#upload_method
 */
router.post('/:projectId/files', function(req, res) {
    uploadFiles(req.params.projectId); 
    res.status(201);
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