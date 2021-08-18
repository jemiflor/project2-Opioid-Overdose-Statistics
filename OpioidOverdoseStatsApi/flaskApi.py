# -*- coding: utf-8 -*-
"""
@author: Bootcamp - Project2-Opioid-Overdose-statistics-team
@module: opioid crisis flask api
"""
from flask import Flask, jsonify, render_template, redirect

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['EXPLAIN_TEMPLATE_LOADING'] = True

#################################################
# Flask Routes
#################################################

@app.route("/api/v1.0/opioidstats/deathcounts/", defaults={'year':None, 'month':None, 'indicator':None})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>", defaults={'month':None, 'indicator':None})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>", defaults={'indicator':None})
@app.route("/api/v1.0/opioidstats/deathcounts/year/<year>/month/<month>/<indicator>")
def get_death_counts(year, month, indicator):
    return jsonify({"year": year, "month": month, "indicator": indicator})

if __name__ == "__main__":
    app.run(debug=True)