'use strict';

var express = require('express');
var router = express.Router();
require('../../process.js')(function (projectsJSON) {
  // This code runs once the passwords have been loaded.

	//console.log(projectsJSON);

	

	router.get('/', function(request, response) {
		var allOptions = "";
	    /*for(var i=0; i<projectsJSON.length; i++)
	    {
	    	//loop through all projects and add an option, then return string with all of that html in it
	    	allOptions += "<option value=\"" + projectsJSON[i].id + "\">"+projectsJSON[i].name+"</option>";
	    }*/
	    console.log(projectsJSON);

	    //pass our array of JSON objects to the client
	    response.render('index.html', projectsJSON);
	});
});
	
module.exports = router;
