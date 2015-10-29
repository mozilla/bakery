var access = require('./access')
var OptimizelyClient = require('optimizely-node-client');


console.log(access.token);

    //Get and set API token
var API_TOKEN = access.token;
var oc = new OptimizelyClient(API_TOKEN);

    //get input line
  var stdin = process.openStdin();
  var input;

    //add listener for input line
  stdin.addListener("data", function(d) {
    input = d.toString().trim();
  });

    //get goals
var goals = oc.getGoals({ 
  id:246059135
});

  //get experiment id
//var experiment = oc.getExperiment({ options });

goals.then(function(goalsList) {

    goalsList.forEach(function(goal){
      console.log(goal.title);
    });

      //get audiences w/ ids
    var audienceList = oc.getAudiences({
      id:246059135
    });

    audienceList.then(function(audienceList) {

        //I'm pretty sure with .then() calls, I'll have to do everything embedded within the previous 
        //.then() due to the way that these calls work

          //print each audience name
        audienceList.forEach(function(audience) {
            console.log(audience.name);
        });

          //prompt user to enter in information for experiment
        console.log("Audience?");
        var userAudience = input;

        console.log("Goal?");
        var userGoal = input;

        console.log("Your audience = " + userAudience);
        console.log("Your goal = " + userGoal);

        /*
            //Create experiment
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
          experiment_type: "ab",
          primary_goal_id: 3636631712,
          audience_ids: [3701458920]
        });/*

            //get ID for experiment just created somehow

            //Create variations for experiment w/ experiment ID

            //Create schedule for experiment w/ experiment ID
        /*oc.createSchedule({
            "stop_time": "2015-12-20T08:00:00Z",
            //"experiment_id": INSERT EXPERIMENT ID HERE
        })
        */
    });
});
