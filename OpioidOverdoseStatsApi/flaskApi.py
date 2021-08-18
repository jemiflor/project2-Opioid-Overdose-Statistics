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
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

#################################################
# Define database and collection
#################################################
mongo_Db = client.opioid_crisis_db
opioid_stats_collection = mongo_Db["opioidstats"]

#################################################
# Flask Routes
#################################################

@app.route("/api/v1.0/opioidstats/deathcounts/", defaults={'year':None, 'month':None, 'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>", defaults={'month':None, 'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>", defaults={'indicator':"Number of Drug Overdose Deaths"})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>/<indicator>")
def get_death_counts(year, month, indicator):
    
    match = {
        "$match" : {
            "Indicator" : indicator
        }
    }

    if year != None and year.isdigit():
        match["$match"]["Year"] = int(year)

    if month != None:
        match["$match"]["Month"] = month

    group_by_state = [
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
    
    pipeline = group_by_state
    
    cursor = opioid_stats_collection.aggregate(pipeline)

    results = []
    for record in cursor:
        results.append({
            "State": record["_id"]["State"], 
            "Indicator": record["_id"]["Indicator"], 
            "OverdoseDeathCount" : record["Death Count"]
        })

    return jsonify(results)

############################################################    

if __name__ == '__main__':
    app.run(debug=True)