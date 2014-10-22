var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var fs = require('fs');
var multiparty = require('multiparty');
var nodemailer = require('nodemailer');

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
router.post('/answer', function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(error, fields, files) {
        var body = '';
        for (var key in fields) {
            body += key.toUpperCase() + ': ' + fields[key] + "\n";
        }

        var filesArr = typeof files.file !== 'undefined' ? files.file : [];
        sendEmail(body, filesArr, function(info) {
            if (filesArr && filesArr[0] && typeof filesArr[0].path !== 'undefined') {
                fs.unlink(filesArr[0].path);
            }
        });
        res.end();
    });
});

var sendEmail = function(body, files, next) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.gmail.username,
            pass: config.gmail.password
        }
    });

    var attachments = [];
    for (var i = 0; i < files.length; i++) {
        attachments.push({
            filename: files[i].originalFilename,
            path: files[i].path
        });
    }

    var emailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: config.email.to,
        subject: config.email.subject,
        text: body,
        attachments: attachments
    };

    transporter.sendMail(emailOptions, function(error, info){
        if (error) {
            console.log(error, info);
            next(info, error);
        } else {
            console.log('Message sent: ' + info.response);
            next(info);
        }
    });
};

// route: landing page
router.use(function(req, res, next) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// launch server
var server = app.listen(config.port, function() {
    console.log('Listening on port %d', server.address().port);
});
