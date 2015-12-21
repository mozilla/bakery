'use strict';

var express = require('express');
var router = express.Router();

var stepAPI = 0;
var stepPage = 0;

	router.get('/', function(request, response) {

		switch(stepPage)
		{
			// if we are trying to render the first page
			case 0:
			{
					// asynchronously request our projects/project IDs
				require('../../process/process.js').initialize(function (projects) {

					// store projects/project IDs in our session`
					request.session.projects = projects;
					// render our page with those projects
					response.render('index.html', {projects: projects, step: stepAPI});
				}, 
				stepAPI);

				// set the page step
				stepPage = 1;
				break;
			}
			// if we are trying to render the second page
			case 1:
			{
				// set the step for the API process
				stepAPI = 1;

				// store that project in memory
				var ProjID = request.query.projects;
				request.session.projectID = request.query.projects;

				// render our page with projects, chosen project, and step
				require('../../process/process.js').initialize(function (goalAudience) {
					// set the step for the API process
					stepAPI = 2;

					// parse goalAudience for our separated goals and audiences
					request.session.goals = parseGoals(goalAudience);
					request.session.audiences = parseAudiences(goalAudience);

					// render the page
					response.render('index.html', {step: stepAPI, audiences: request.session.audiences, goals: request.session.goals});
				
				}, 
				stepAPI, 
				request.session.projectID);

				// set the page step
				stepPage = 2;
				break;
			}
			// if we are trying to render the second page
			case 2:
			{
				stepAPI = 3;
				// get querystring parameters from our form submit and store them in the session
				request.session.expTitle = request.query.exptitle;
				request.session.editorURL = request.query.editorURL;
				request.session.experimentURL = request.query.experimentURL;
				request.session.isRegex = request.query.isRegex;
				request.session.pctVisitors = request.query.pctVisitors;
				// we will default the number of variations to 2 for right now
				// request.session.numVariations = request.query.numVariations;
				request.session.audience = request.query.audience;
				request.session.goal = request.query.goals;

				// render the page
				response.render('index.html', {step: stepAPI});

				stepPage = 3;
				break;
			}
			case 3:
			{
				stepAPI = 4;
				// get querystring parameters from our form submit and store them in the session
				request.session.varTitle = request.query.vartitle;
				request.session.varPercent = request.query.varPercent;
				request.session.customJS = request.query.customJS;
				request.session.startTime = request.query.startTime;
				request.session.stopTime = request.query.stopTime;

				require('../../process/process.js').initialize(function (data) {

				}, 
				stepAPI, 
				request.session.projectID, 
				request.session.goal, 
				request.session.audience, 
				request.session.expTitle, 
				request.session.editorURL, 
				request.session.experimentURL,
				request.session.isRegex, 
				request.session.pctVisitors,
				request.session.varTitle,
				request.session.varPercent,
				request.session.customJS,
				request.session.startTime,
				request.session.stopTime);


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
