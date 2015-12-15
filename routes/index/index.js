'use strict';

var express = require('express');
var router = express.Router();

var step = 0;

    // This code runs once the projects have been loaded.
	router.get('/', function(request, response) {

		// If we have posted a selected project
		if(request.query.projects)
		{
			step = 1;
			// store that project in memory
			var projectID = request.query.projects;
			console.log(request.query.projects);

		}
		// If we have not posted a selected project
		else
		{
			// request all projects and project ids
			require('../../process/processProj.js').initialize(function (projectsJSON) {
				// render our page with those projects
				response.render('index.html', {projectsJSON: projectsJSON});
			});
		}
	});

module.exports = router;
