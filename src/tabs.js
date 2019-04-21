'use strict';

module.exports.setup = function(app) {
    var path = require('path');
    var express = require('express')
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({ extended: false }));
    // Configure the view engine, views folder and the statics path
    app.use('/static', express.static(path.join(__dirname, 'static')));
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(cookieParser('ajkdjan'));
    
    // Setup home page
    app.get('/', function(req, res) {
        res.redirect('/auth/redirect');
    });
    
    app.use('/auth', require('./routes/auth'));
    app.use('/teacher', require('./routes/teacher')); 
    app.use('/student', require('./routes/student'));

    app.use(function(err, req, res, next){
        console.log(err);

        res.send('Ups, Internal Server Error');
    })
};
