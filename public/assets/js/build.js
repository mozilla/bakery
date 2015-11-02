'use strict';

$(document).ready(function() { 
	var access = require('./access')
	var OptimizelyClient = require('optimizely-node-client');
	//Get and set API token
	var API_TOKEN = access.token;
	var oc = new OptimizelyClient(API_TOKEN);

		//for some reason, the above code stops all execution
	alert(API_TOKEN);
});
