var access = require('./access');
var OptimizelyClient = require('optimizely-node-client');


console.log(access.token);

//Get and set API token
var API_TOKEN = access.token;
var oc = new OptimizelyClient(API_TOKEN);

//get goals
var goals = oc.getGoals({
    id: 3637670143
});

//get response from goals
goals.then(function(goalsList) {

    //print every goal title and ID
    goalsList.forEach(function(goal) {
        console.log(goal.title + " ID: " + goal.id);
    });

    //get audiences
    var audienceList = oc.getAudiences({
        id: 3637670143
    });

    //get response from audiences
    audienceList.then(function(audienceList) {

        //I'm pretty sure with .then() calls, I'll have to do everything embedded within the previous 
        //.then() due to the way that these calls work
        //Check with John about this code layout later

        //print each audience name and ID
        audienceList.forEach(function(audience) {
            console.log(audience.name + " ID: " + audience.id);
        });


        ///////SKIPPING THE USER PROMPTING PART/////////////////////
        /////////////////////////////////////////////////////////////

        //we are explicitly stating our variable values here, but in all reality, this 
        //will need to be pulled from the user
        var projectID = 3637670143;
        var expDescription = "[bug 1200276] Electrolysis Funnelcake Build";
        var expStatus = "Not started";
        var expUrlConditions = [{
            "match_type": "regex",
            "value": "^https:\/\/www\.mozilla\.org\/en-US/firefox\/developer\/.*$"
        }];
        var expURL = "https://www.mozilla.org/en-US/firefox/developer/";
        var expActiveMode = "immediate";
        var exp_primary_goal_id = 3634801770;
        var expAudienceIDs = [3701458920];
        var expVariations = [""];

        //Create experiment
        experimentPosted = oc.createExperiment({
            project_id: projectID,
            description: expDescription,
            status: expStatus,
            url_conditions: expUrlConditions,
            edit_url: expURL,
            activation_mode: expActiveMode,
            experiment_type: "ab",
            variation_ids: expVariations
        });

        //get info for experiment just created
        experimentPosted.then(function(experimentDetails) {
            //get id for experiment just created
            var experimentID = experimentDetails.id;
            //prompt user for the percentage they want to include
            var percentageIncluded = 5100;

            console.log(experimentID);

            //update our created experiment with these details
            oc.updateExperiment({
                id: experimentID,
                audience_ids: expAudienceIDs,
                percentage_included: percentageIncluded
            });

            //prompt user for the variation information
            var varOneWeight = 5100;
            var varOneDescription = "FC56 (control)";
            var varOneJS = "$(\".os_win > .download-link\").attr({\"href\":\"FC56 BUILD LINK HERE\"});";
            var varTwoWeight = 4900;
            var varTwoDescription = "FC57 (e10s Disabled)";
            var varTwoJS = "$(\".os_win > .download-link\").attr({\"href\":\"FC57 BUILD LINK HERE\"});";

            variationsList = oc.getVariations({
                id: experimentID
            });

            variationsList.then(function(variations) {
                variations.forEach(function(variation) {
                    oc.deleteVariation({
                        id: variation.id
                    });
                });

                //create variation one
                oc.createVariation({
                    experiment_id: experimentID,
                    description: varOneDescription,
                    weight: varOneWeight,
                    js_component: varOneJS
                });

                //create variation two
                oc.createVariation({
                    experiment_id: experimentID,
                    description: varTwoDescription,
                    weight: varTwoWeight,
                    js_component: varTwoJS
                });

                //Create schedule for experiment w/ experiment ID
                oc.createSchedule({
                    "stop_time": "2015-12-20T08:00:00Z",
                    "experiment_id": experimentID
                });

                var chosenGoalID = 3686390575;
                var goalExpIDs = [experimentID];

                oc.putGoal({
                    id: 3686390575,
                    experiment_ids: goalExpIDs
                });
            });

        });
    });
});
