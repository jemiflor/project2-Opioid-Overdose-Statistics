# -*- coding: utf-8 -*-
"""
@author: Bootcamp - Project2-Opioid-Overdose-statistics-team
@module: opioid crisis flask api
"""

from flask import Flask, jsonify, render_template, redirect
from flask_cors import CORS
import pymongo
from mongodb_cloud_atlas_connection import mongo_cloud_atlas_connection_string, mongo_local_connection_string

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['EXPLAIN_TEMPLATE_LOADING'] = True

#################################################
# Initialize PyMongo to work with MongoDBs
#################################################
client = pymongo.MongoClient(mongo_cloud_atlas_connection_string)

#################################################
# Define database and collection
#################################################
mongo_Db = client.opioid_crisis_db
opioid_stats_collection = mongo_Db["opioidstats"]

#################################################
# Flask Routes
#################################################
#                   default route
@app.route("/")
def welcome():
    return (
        f"Welcome to UNW Bootcamp Project 2 - Opioid Crisis Statistical Visualizations Flask Api"
    )

#############################################################################################
# CHART 4: deathcounts grouped by state and indicator (optional|default to number of drug deaths)
# and optionally filtered by year, month and indicator
@app.route("/api/v1.0/opioidstats/deathcounts/", defaults={'year':None, 'month':None, 'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>", defaults={'month':None, 'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/month/<month>", defaults={'year':None, 'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/indicator/<indicator>", defaults={'month':None, 'year':None})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>", defaults={'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/indicator/<indicator>", defaults={'month':None})
@app.route("/api/v1.0/opioidstats/deathcounts/month/<month>indicator/<indicator>", defaults={'year':None})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>/indicator/<indicator>")
def get_death_counts(year, month, indicator):
    
    # mongoDbQuery - Building query pipeline
    # Reference: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
    # match by indicator - default to overdose death count indicator
    match = {
        "$match" : {
            "Indicator" : indicator
        }
    }

    # if year is provided in the route, check if it is a digit and convert to integer
    # and match year - Year column in our collection is integer
    if year != None and year.isdigit():
        match["$match"]["Year"] = int(year)

    # if month is provided match month 
    # month column in our collection is the name of the month
    if month != None:
        match["$match"]["Month"] = month

    # build the query pipline. 
    # include the match clause to 
    # the group by state, indicator, and statename clause
    # to build the aggregation pipeline and get the indicator count
    group_by_state_pipline = [
        match,
        { 
            "$group": {
                "_id": {
                    "State": "$State",
                    "Indicator": "$Indicator" 
                },
                "Death Count": { "$sum": "$Data Value" }
            }
        },
        { "$sort" : { "State" : 1, "_id": 1 } }                                      
    ]
    
    # call the aggregate method with the above pipeline 
    # and get the aggreageted documents (records)    
    cursor = opioid_stats_collection.aggregate(group_by_state_pipline)

    # loop through the aggregated documents (records) 
    # and build the results json list
    results = []
    for record in cursor:
        results.append({
            "State": record["_id"]["State"], 
            "Indicator": record["_id"]["Indicator"], 
            "OverdoseDeathCount" : record["Death Count"]
        })

    # jsonify the results list and return the response
    return jsonify(results)                                                  


#############################################################################################
# CHART 1: deathcount grouped by opioids - Optionally filtered by year, month, state (State Abbr Code)
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/", defaults={'year':None, 'month':None, 'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/year/<year>", defaults={'month':None, 'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/month/<month>", defaults={'year':None, 'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/state/<state>", defaults={'month':None, 'year': None})
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/year/<year>/state/<state>", defaults={'month': None})
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/year/<year>/month/<month>", defaults={'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/month/<month>/state/<state>", defaults={'year': None})
@app.route("/api/v1.0/opioidstats/deathCountsByDrugs/year/<year>/month/<month>/state/<state>")
def get_death_counts_by_Drugs(year, month, state):
    
    match = {
        "$match" : {
            "Indicator" : {
                "$nin": [
                    "Number of Deaths",
                    "Number of Drug Overdose Deaths",
                    "Population",
                    "Overdose Death Per 1000 Population",
                    "Death Per 1000 Population",
                    "Percent with drugs specified",
                    "Overdose Death Per 1000 Total Death"
                ]
            }
        }
    }

    # mongoDbQuery - Building query pipeline
    # Reference: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
    # match by indicator - default to overdose death count indicator
    if state != None:
        match["$match"]["State"] = state.upper()

    # if year is provided in the route, check if it is a digit and convert to integer
    # and match year - Year column in our collection is integer
    if year != None and year.isdigit():
        match["$match"]["Year"] = int(year)

    # if month is provided match month 
    # month column in our collection is the name of the month
    if month != None:
        match["$match"]["Month"] = month.capitalize()

    # build the query pipline. 
    # include the match clause to 
    # the group by state, indicator, and statename clause
    # to build the aggregation pipeline and get the indicator count
    group_by_state_pipline = [       
        match,
        { 
            "$group": {
                "_id": {
                    "Indicator": "$Indicator"
                },
                "Death Count": { "$sum": "$Data Value" }
            }
        }                                          
    ]
    
    # call the aggregate method with the above pipeline 
    # and get the aggreageted documents (records)    
    cursor = opioid_stats_collection.aggregate(group_by_state_pipline)

    # loop through the aggregated documents (records) 
    # and build the results json list
    results = []
    for record in cursor:
        results.append({
            "Indicator": record["_id"]["Indicator"], 
            "OverdoseDeathCount" : record["Death Count"]
        })

    # jsonify the results list and return the response
    return jsonify(results)                                             

############################################################################################# 
# CHART 2: deathcount grouped by year - Optionally filtered by state & month
@app.route("/api/v1.0/opioidstats/deathCountsByYear/", defaults={'month':None, 'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsByYear/state/<state>", defaults={'month':None})
@app.route("/api/v1.0/opioidstats/deathCountsByYear/month/<month>", defaults={'state':None})
@app.route("/api/v1.0/opioidstats/deathCountsByYear/state/<state>/month/<month>")
def get_death_counts_by_year(month, state):
    
    match = {
        "$match" : {
            "Indicator" : {
                "$in": [
                    "Number of Deaths",
                    "Number of Drug Overdose Deaths"
                ]
            }
        }
    }

    # mongoDbQuery - Building query pipeline
    # Reference: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
    # match by indicator - default to overdose death count indicator
    if state != None:
        match["$match"]["State"] = state.upper()

    # if month is provided match month 
    # month column in our collection is the name of the month
    if month != None:
        match["$match"]["Month"] = month.capitalize()

    # build the query pipline. 
    # include the match clause to 
    # the group by state, indicator, and statename clause
    # to build the aggregation pipeline and get the indicator count
    group_by_state_pipline = [       
        match,
        { 
            "$group": {
                "_id": {
                    "Year": "$Year",
                    "Indicator": "$Indicator"
                },
                "Death Count": { "$sum": "$Data Value" }
            }
        },
        { "$sort" : { "Year" : 1, "_id": 1 } }                                              
    ]
    
    # call the aggregate method with the above pipeline 
    # and get the aggreageted documents (records)    
    cursor = opioid_stats_collection.aggregate(group_by_state_pipline)

    # loop through the aggregated documents (records) 
    # and build the results json list
    results = []
    for record in cursor:
        results.append({
            "Year": record["_id"]["Year"], 
            "Indicator":  record["_id"]["Indicator"], 
            "OverdoseDeathCount" : record["Death Count"]
        })

    # jsonify the results list and return the response
    return jsonify(results)                                             

############################################################################################# 

# CHART 3: deathcounts grouped by state - Optionally filtered by year & month
@app.route("/api/v1.0/opioidstats/deathCountsByState/", defaults={'month':None, 'year': None})
@app.route("/api/v1.0/opioidstats/deathCountsByState/year/<year>", defaults={'month':None})
@app.route("/api/v1.0/opioidstats/deathCountsByState/month/<month>", defaults={'year':None})
@app.route("/api/v1.0/opioidstats/deathCountsByState/year/<year>/month/<month>")
def get_death_counts_by_State(month, year):
    
    match = {
        "$match" : {
            "Indicator" : {
                "$in": [
                    "Number of Deaths",
                    "Number of Drug Overdose Deaths",
                    "Death Per 1000 Population",
                    "Overdose Death Per 1000 Total Death"
                ]
            }
        }
    }

    # mongoDbQuery - Building query pipeline
    # Reference: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
    # match by indicator - default to overdose death count indicator
    if year != None:
        match["$match"]["Year"] = int(year)

    # if month is provided match month 
    # month column in our collection is the name of the month
    if month != None:
        match["$match"]["Month"] = month.capitalize()

    # build the query pipline. 
    # include the match clause to 
    # the group by state, indicator, and statename clause
    # to build the aggregation pipeline and get the indicator count
    group_by_state_pipline = [       
        match,
        { 
            "$group": {
                "_id": {
                    "State": "$State",
                    "Indicator": "$Indicator"
                },
                "Death Count": { "$sum": "$Data Value"}
            }
        },
        { "$sort" : { "State" : 1, "_id": 1 } }                                              
    ]
    
    # call the aggregate method with the above pipeline 
    # and get the aggreageted documents (records)    
    cursor = opioid_stats_collection.aggregate(group_by_state_pipline)

    # loop through the aggregated documents (records) 
    # and build the results json list
    # if statement to divide sum of the "per 1000" indicators
    results = []
    for record in cursor:
        if record['_id']["Indicator"] == "Death Per 1000 Population":
            results.append({
                "State": record["_id"]["State"], 
                "Indicator":  record["_id"]["Indicator"], 
                "OverdoseDeathCount" : record["Death Count"] / 72
            })
        elif record['_id']["Indicator"] == "Overdose Death Per 1000 Total Death":
            results.append({
                "State": record["_id"]["State"], 
                "Indicator":  record["_id"]["Indicator"], 
                "OverdoseDeathCount" : record["Death Count"] / 72
            })
        else:
            results.append({
            "State": record["_id"]["State"], 
            "Indicator":  record["_id"]["Indicator"], 
            "OverdoseDeathCount" : record["Death Count"]})
        

    # jsonify the results list and return the response
    return jsonify(results)                                             

############################################################################################# 
#############################################################################################

# CHART 5: deathcount summary table - Optionally filtered by year, month, state (State Abbr Code)
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/", defaults={'year':None, 'month':None, 'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/year/<year>", defaults={'month':None, 'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/month/<month>", defaults={'year':None, 'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/state/<state>", defaults={'month':None, 'year': None})
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/year/<year>/state/<state>", defaults={'month': None})
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/year/<year>/month/<month>", defaults={'state': None})
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/month/<month>/state/<state>", defaults={'year': None})
@app.route("/api/v1.0/opioidstats/deathCountsBySummary/year/<year>/month/<month>/state/<state>")
def get_death_counts_by_Summary(year, month, state):
    
    match = {
        "$match" : {
            "Indicator" : {
                "$in": [
                    "Number of Deaths",
                    "Number of Drug Overdose Deaths",
                    "Population"
                ]
            }
        }
    }

    # mongoDbQuery - Building query pipeline
    # Reference: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
    # match by indicator - default to overdose death count indicator
    if state != None:
        match["$match"]["State"] = state.upper()

    # if year is provided in the route, check if it is a digit and convert to integer
    # and match year - Year column in our collection is integer
    if year != None and year.isdigit():
        match["$match"]["Year"] = int(year)

    # if month is provided match month 
    # month column in our collection is the name of the month
    if month != None:
        match["$match"]["Month"] = month.capitalize()

    # build the query pipline. 
    # include the match clause to 
    # the group by state, indicator, and statename clause
    # to build the aggregation pipeline and get the indicator count
    group_by_state_pipline = [       
        match,
        { 
            "$group": {
                "_id": {
                    "Indicator": "$Indicator"
                },
                "Death Count": { "$sum": "$Data Value" }
            }
        }                                          
    ]
    
    # call the aggregate method with the above pipeline 
    # and get the aggreageted documents (records)    
    cursor = opioid_stats_collection.aggregate(group_by_state_pipline)

    # loop through the aggregated documents (records) 
    # and build the results json list
    results = []
    for record in cursor:
        results.append({
            "Indicator": record["_id"]["Indicator"], 
            "OverdoseDeathCount" : record["Death Count"]
        })

    # jsonify the results list and return the response
    return jsonify(results)    

if __name__ == '__main__':
    app.run(debug=True)
