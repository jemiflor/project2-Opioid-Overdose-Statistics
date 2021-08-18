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

@app.route("/")
def get_death_counts()