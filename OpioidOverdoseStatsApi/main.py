# -*- coding: utf-8 -*-
"""
@author: Bootcamp - Project2-Opioid-Overdose-statistics-team
@module: opioid crisis flask api
"""

from flask import Flask, jsonify, render_template, redirect
import pymongo

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['EXPLAIN_TEMPLATE_LOADING'] = True

#################################################
# Initialize PyMongo to work with MongoDBs
#################################################

# Local MongoDb Connection
#conn = 'mongodb://localhost:27017'

# Google cloud MongoDb Connection
conn = 'mongodb+srv://bcproject2user:bcpw123@bcproject2.c8koh.mongodb.net/opioid_crisis_db?retryWrites=true&w=majority'
client = pymongo.MongoClient(conn)

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

#################################################
#                   deathcount routes with optional parameters
@app.route("/api/v1.0/opioidstats/deathcounts/", defaults={'year':None, 'month':None, 'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>", defaults={'month':None, 'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>", defaults={'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>/<indicator>")
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

############################################################    

if __name__ == '__main__':
    app.run(debug=True)