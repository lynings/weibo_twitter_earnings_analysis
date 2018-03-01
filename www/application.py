#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__author__ = '李金燕'

from flask import Flask
from flask import json
from flask import render_template

app = Flask(__name__)

twitter_financial = []
sina_blog_financial = []

with open('financial_report.json', 'r') as f:
    data = json.load(f)
    for obj in data:
        if obj['company'] == 'Twitter':
            twitter_financial.append(obj)
        else:
            sina_blog_financial.append(obj)


@app.route('/')
def index():
    return render_template('index.html', **{'twitter': twitter_financial, 'sina_blog': sina_blog_financial})
