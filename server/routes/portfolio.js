const express = require('express');
const configObj = require('../config');
const m_config = configObj.mysql;
const mysql = require('mysql');

const router = express.Router();

var con = mysql.createConnection({
    host: m_config.host,
    user: m_config.user,
    password: m_config.password,
    database: m_config.database
});

/* --- MODELS --- */

/* --- CONTROLLERS --- */

router.get('/:userUrl', function(req, res){
    res.render('portfolio');
});

module.exports = router;