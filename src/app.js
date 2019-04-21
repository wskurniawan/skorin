'use strict';

var express = require('express');
const config = require('./config');
const mongoose = require('mongoose');


var app = express();

//db setup
mongoose.connect(config.DB_URI, { useNewUrlParser: true },function(err){
    if(err){
        return console.log(err);
    }

    console.log('db connected');
});

// Adding tabs to our app. This will setup routes to various views
var tabs = require('./tabs');
tabs.setup(app);

// Adding a bot to our app
// var bot = require('./bot');
// bot.setup(app);

// Adding a messaging extension to our app
// var messagingExtension = require('./messaging-extension');
// messagingExtension.setup();

// Deciding which port to use
var port = process.env.PORT || 3333;

// Start our nodejs app
app.listen(port, function() {
    console.log(`App started listening on port ${port}`);
});
