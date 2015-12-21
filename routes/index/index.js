'use strict';

var express = require('express');
var router = express.Router();

var stepAPI = 0;
var stepPage = 0;

	router.get('/', function(request, response) {

		switch(stepPage)
		{
			case 0:
			{
					// asynchronously request our projects/project IDs
				require('../../process/process.js').initialize(function (projects) {

					// store projects/project IDs in our session`
					request.session.projects = projects;
					// render our page with those projects
					response.render('index.html', {projects: projects, step: stepAPI});
				}, stepAPI);

				stepPage = 1;
				break;
			}
			case 1:
			{
				// set the step
				stepAPI = 1;

				// store that project in memory
				var ProjID = request.query.projects;
				request.session.projectID = request.query.projects;

				// render our page with projects, chosen project, and step
				require('../../process/process.js').initialize(function (goalAudience) {

					// next step, parse goalAudience into goals and audiences respectively
					// gotta save that info into session and then render the template with it for the user

					stepAPI = 2;

					request.session.goals = parseGoals(goalAudience);
					request.session.audiences = parseAudiences(goalAudience);

					response.render('index.html', {projects: request.session.projects, step: stepAPI, chosenProj: ProjID, audiences: request.session.audiences, goals: request.session.goals});
				
				}, stepAPI, request.session.projectID);

				stepPage = 2;
				break;
			}
		}

	});

// parseGoals function
// Purpose: To parse our goalAudience array for values (our goals) before our sentinal (*)
function parseGoals(goalAudience)
{
	var goals = [];

	for(var x=0; x<goalAudience.length; x++) {
        if(goalAudience[x].name == "*")
        {
        	return goals;
        }
        else
        {
        	goals.push(goalAudience[x]);
        }
    }

	return goals;
}

// parseGoals function
// Purpose: To parse our goalAudience array for values (our audiences) after our sentinal (*)
function parseAudiences(goalAudience)
{
	var audiences = [];
	var isAudiences = false;

	for(var x=0; x<goalAudience.length; x++) {
        if(goalAudience[x].name == "*")
        {
        	isAudiences = true;
        }
        else
        {
        	if(isAudiences) {
        		audiences.push(goalAudience[x]);
        	}
        }
    }

	return audiences;
}

module.exports = router;
