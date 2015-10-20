var access = require('./access')
var OptimizelyClient = require('optimizely-node-client');


console.log(access.token);

    //Get and set API token
var API_TOKEN = access.token;
var oc = new OptimizelyClient(API_TOKEN);


oc.createExperiment({
  project_id:"3637670143",
  description:"Hello, Hein!",
  edit_url:"google.com"
  })