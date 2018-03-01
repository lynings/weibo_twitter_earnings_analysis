#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__author__ = '李金燕'

from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'