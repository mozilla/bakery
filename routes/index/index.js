'use strict';

var express = require('express');
var router = express.Router();

var step = 0;

    // This code runs once the projects have been loaded.
	router.get('/', function(request, response) {

		// If we have posted a selected project
		if(request.query.projects)
		{
			// set the step
			step = 1;

			// store that project in memory
			var ProjID = request.query.projects;
			request.session.projectID = request.query.projects;

			// render our page with projects, chosen project, and step
			console.log(request.session.projectID);
			require('../../process/process.js').initialize(function (goalAudienceJSON) {

				// next step, parse goalAudience JSON into goal and audience JSON respectively
				// gotta save that info into session and then render the template with it for the user

				step = 2;

				console.log("******** PROJECT GOALS: ");
				console.log(goalAudienceJSON);


				response.render('index.html', {projectsJSON: request.session.projectsJSON, step: step, chosenProj: ProjID, audienceJSON: request.session.audienceJSON, goalsJSON: request.session.goalsJSON});
			
			}, step, request.session.projectID);



		}
		// If we have not posted a selected project
		else
		{
			// asynchronously request our projects/project IDs
			require('../../process/process.js').initialize(function (projectsJSON) {

				// store projects/project IDs in our session`
				request.session.projectsJSON = projectsJSON;
				// render our page with those projects
				response.render('index.html', {projectsJSON: projectsJSON, step: step});
			}, step);

		}
	});

module.exports = router;
