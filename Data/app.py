# -*- coding: utf-8 -*-
"""
@author: Bootcamp - Project2-Opioid-Overdose-statistics-team
@module: etl-import excel to mongodb
"""

import pandas as pd
import pymongo
import json

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
# Import data file to mongodb
#################################################
filename = "opioid_crisis_stats.csv"
opioidCrisisData = pd.read_csv(filename, usecols=['State', 'Year', 'Month', 'Indicator', 'Data Value', 'State Name']);
opioidCrisisJson = json.loads(opioidCrisisData.to_json(orient='records'));

# Remove any old collection
opioid_stats_collection.remove()
opioid_stats_collection.insert(opioidCrisisJson)