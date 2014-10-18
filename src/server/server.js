var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var fs = require('fs');

// config
var config = require('./config');

// mysql
app.use(myConnection(mysql, config.mysql, 'pool'));

// router
var router = express.Router();
app.use(router);

// static files
router.use(express.static(path.join(__dirname, '../client')));

// route: mysql test
router.use('/users', function(req, res, next) {
    req.getConnection(function(err, connection) {
        connection.query('SELECT * FROM users', function(err, results) {
            if (err) {
                return next(err);
            }
            return res.json(results);
        });
    });
});

// route: data provider
router.get('/form/:id', function(req, res, next) {
    fs.readFile(config.dataPath + 'form' + req.params.id + '.json', {encoding: 'utf8'}, function(err, data) {
        return res.json(JSON.parse(data));
    });
});

// route: form handler

// route: landing page
router.use(function(req, res, next) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// launch server
var server = app.listen(config.port, function() {
    console.log('Listening on port %d', server.address().port);
});
