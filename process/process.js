'use strict';

var access = require('../access.js');
var OptimizelyClient = require('optimizely-node-client');

//Get and set API token
var API_TOKEN = access.token;
var oc = new OptimizelyClient(API_TOKEN);

//initialize JSON object
var data = [{}];

var projects = oc.getProjects();


module.exports = {	
	initialize: function (callback, step, projectID) { 
		switch(step)
		{
			case 0:
			{
				projects.done(function(projectsList) {
					var x=0;
				    projectsList.forEach(function(project) {
				    	var projectObj = {name : project.project_name, id : project.id };
				    	data[x] = projectObj;
				    	x++;
				    });
				    callback(data);
				});
				break;
			}
			case 1:
			{
				// get goals
		        var goals = oc.getGoals({
		            id: projectID
		        });

		        // get response from goals
		        goals.then(function(goalsList) {
		        	var x=0;
		        	goalsList.forEach(function(goal) {
		                var goalObj = {name : goal.title, id : goal.id};
		                data[x] = goalObj;
		                x++
		            });

			        data[x] = {name : "*", id : "*"};
			        x++;

			        // get audiences
		            var audienceList = oc.getAudiences({
		                id: projectID
		            });

		            // get response from audiences
		            audienceList.then(function(audienceList) {
			        	audienceList.forEach(function(audience) {
			                var audienceObj = {name : audience.name, id : audience.id};
			                data[x] = audienceObj;
			                x++
			            });
			            // return goals + audiences
			            callback(data);
			        });
		        });
		        break;
			}

		}
	}
};
