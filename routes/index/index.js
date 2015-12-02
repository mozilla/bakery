'use strict';

var express = require('express');
var router = express.Router();
require('../../process.js')(function (projectsJSON) {
  // This code runs once the projects have been loaded.

	router.get('/', function(request, response) {
		var allOptions = "";

	    //pass our array of JSON objects to the nunjucks template context
	    response.render('index.html', {projectsJSON: projectsJSON});
	});
});
	
module.exports = router;
