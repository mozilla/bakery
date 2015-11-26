'use strict';

var path = require('path');

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');

var config = require('./lib/config');

// Routes
var index = require('./routes/index');

var app = express();
var env;

// Set up Nunjucks
env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Global template variables
env.addGlobal('brand', config.brand);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

module.exports = app;
