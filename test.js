    //requires
var access = require('./access');
var OptimizelyClient = require('optimizely-node-client');
var prompt = require('prompt');

    //initialize experiment vars
var projectID = 3637670143;
var expDescription;
var expStatus = "Not started";
var expUrlConditions;
var expURL;
var expActiveMode = "immediate";
var expAudienceIDs = [];
var expVariations = [""];
var expType = "ab";
var goalExpIDs;

    //Get and set API token
var API_TOKEN = access.token;
var oc = new OptimizelyClient(API_TOKEN);

    //get goals
var goals = oc.getGoals({
    id: projectID
});

    //create JSON schema for first prompt (experiment, goal, audience)
var expSchema = {
    properties: {
        Title: {
            message: "Experiment Title",
            requred: true,
        },
        Goal: {
            /*pattern: ALL GOAL TITLES,*/
            message: "Goal ID",
            required: false
        },
        Audience: {
            /*pattern: ALL GOAL TITLES,*/
            message: "Audience ID",
            required: false
        },
        Optimizely_Test_URL: {
            message: "Editor URL",
            required: true
        },
        ExperimentURL: {
            message: "Url Target",
            required: true
        },
        Regex: {
            message: "Regex (Y/N)",
            required: true,
            pattern: /(Y|N|y|n)/
        },
        Number_Of_Variations: {
            message: "Number of Variations",
            required: true
        },
        Segment: {
            message: "Percentage of Visitors Included (0-100)",
            required: true
        }
    }
}

    //create JSON schema for 2-n variation prompt
var varSchema = {
    properties: {
        Weight: {

        },
        Description: {

        },
        JS: {

        }
    }
}

    //create JSON schema for schedule prompt
var schedSchema = {

}

    //get response from goals
goals.then(function(goalsList) {

        //print every goal title
    console.log("PROJECT GOALS:");
    goalsList.forEach(function(goal) {
        console.log("     " + goal.title + " ID: " + goal.id);
    });

        //get audiences
    var audienceList = oc.getAudiences({
        id: projectID
    });

        //get response from audiences
    audienceList.then(function(audienceList) {
            //print each audience name and ID
        console.log("PROJECT AUDIENCES:");
        audienceList.forEach(function(audience) {
            console.log("     " + audience.name + " ID: " + audience.id);
        });

        console.log("\n");

           //prompt user for experiment info
        console.log("TEST PARAMETERS:");
        prompt.start();
        prompt.get(expSchema, function (err,result) {
            goal = result.Goal;
            expDescription = result.Title;
            expURL = result.Optimizely_Test_URL;
            expAudienceIDs[expAudienceIDs.length] = parseInt(result.Audience);
            chosenGoalID = parseInt(result.Goal);
            percentageIncluded = result.Segment*100;

            if(result.Regex == "Y" || result.Regex == "y")
            {
                expUrlConditions = [{
                    "match_type": "regex",
                    "value": result.ExperimentURL
                }];
            }
            else
            {
                expUrlConditions = [{
                    "match_type": "simple",
                    "value": result.ExperimentURL
                }];
            }

            console.log("\n");
        
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
                console.log("Created experiment...");

                    //get id for experiment just created
                var experimentID = experimentDetails.id;
                    //prompt user for the percentage they want to include

                    //update our created experiment with these details
                var update = oc.updateExperiment({
                    id: experimentID,
                    audience_ids: expAudienceIDs,
                    percentage_included: percentageIncluded
                });

                update.done(function(result) { console.log("Updated experiment..."); });

                    //Create schedule for experiment w/ experiment ID
                var createSchedule = oc.createSchedule({
                    "stop_time": "2015-12-20T08:00:00Z",
                    "experiment_id": experimentID
                });

                createSchedule.done(function(result) { console.log("Added schedule..."); });


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
                    console.log("Retrieved default variations...");

                    variations.forEach(function(variation) {
                        var deleted = oc.deleteVariation({
                            id: variation.id
                        });
                    });

                    console.log("Deleted default variation...");

                        //create variation one
                    var createVar = oc.createVariation({
                        experiment_id: experimentID,
                        description: varOneDescription,
                        weight: varOneWeight,
                        js_component: varOneJS
                    });

                    createVar.done(function(result) { console.log("Created first variation..."); });

                        //create variation two
                    var createVar2 = oc.createVariation({
                        experiment_id: experimentID,
                        description: varTwoDescription,
                        weight: varTwoWeight,
                        js_component: varTwoJS
                    });

                    createVar2.done(function(result) { console.log("Created second variation..."); });

                        //get the array of experiments for the goal we would like
                    goalsList.forEach(function(goal) {
                        if(goal.id = chosenGoalID)
                        {
                            goalExpIDs = goal.experiment_ids;
                        }
                    });

                        //append our experiment ID to the end of that array of experiments
                    goalExpIDs[goalExpIDs.length] = experimentID;

                        //post that info to optimizely
                    var addGoal = oc.putGoal({
                        id: chosenGoalID,
                        experiment_ids: goalExpIDs
                    });

                    addGoal.done(function(result) { console.log("Added goal..."); });
                });
            });
        });
    });
});