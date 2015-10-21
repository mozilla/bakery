var access = require('./access')
var OptimizelyClient = require('optimizely-node-client');


console.log(access.token);

    //Get and set API token
var API_TOKEN = access.token;
var oc = new OptimizelyClient(API_TOKEN);


oc.createExperiment({
  project_id:"3637670143",
  description:"[bug 1200276] Electrolysis Funnelcake Build",
  status: "Not started",
  url_conditions: [
    {
      "match_type": "regex",
      "value": "^https:\/\/www\.mozilla\.org\/en-US/firefox\/developer\/.*$"
    }
  ],
  edit_url: "https://www.mozilla.org/en-US/firefox/developer/",
  activation_mode: "immediate",
  experiment_type: "ab"
  })