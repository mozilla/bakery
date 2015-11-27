'use strict';

var express = require('express');
var router = express.Router();
require('../../process.js')(function (projectsJSON) {
  // This code runs once the passwords have been loaded.

	console.log(projectsJSON);

	router.get('/', function(request, response) {
	    response.render('index.html', projectsJSON);
	});
});
	
module.exports = router;
