#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__author__ = '李金燕'

import json
import re
import sys

import scrapy


class FinancialReportSpider(scrapy.Spider):
    name = 'financial_report'

    financial_report_url_file_path = sys.path[-1] + '/financial_report_url.json'

    def start_requests(self):
        with open(self.financial_report_url_file_path, 'r') as load_f:
            financial_reposts = json.load(load_f, object_hook=handle_json_object)

        sina_bolg_reports = list(
            map(lambda report: report, filter(lambda o: o.company == '微博', financial_reposts)))

        twitter_reports = list(filter(lambda o: o.company == 'Twitter', financial_reposts))

        for report in sina_bolg_reports:
            yield scrapy.Request(url=report.url, callback=self.parse, meta={'report': report})

        for report in twitter_reports:
            yield scrapy.Request(url=report.url, callback=self.parse_twitter_financial_report, meta={'report': report})

    def parse(self, response):
        report = response.meta['report']
        print(report.company + report.year + report.quarter)

        html = response.css('#artibody').extract_first()

        net_revenue = re.search('(季度净营收|季度净营收总计)(\d.*?)美元', html).group(2)
        if net_revenue.find('亿') > -1:
            net_revenue = round(float(net_revenue.replace('亿', '')) * 100000000)
        else:
            net_revenue = round(float(net_revenue.replace('万', '')) * 10000)
        print('季度净营收：' + str(net_revenue))

        adv_revenue = re.search('(季度广告和营销营收|季度广告和营销营收总计)(\d.*?)美元', html).group(2)
        if adv_revenue.find('亿') > -1:
            adv_revenue = round(float(adv_revenue.replace('亿', '')) * 100000000)
        else:
            adv_revenue = round(float(adv_revenue.replace('万', '')) * 10000)
        print('季度广告收入：' + str(adv_revenue))

        other_service_revenue = re.search('(季度其他营收为|季度增值服务营收为|季度微博增值服务营收为)(.*?)美元', html).group(2)
        if other_service_revenue.find('亿') > -1:
            other_service_revenue = round(float(other_service_revenue.replace('亿', '')) * 100000000)
        else:
            other_service_revenue = round(float(other_service_revenue.replace('万', '')) * 10000)
        print('季度其它营收入：' + str(other_service_revenue))

        net_profit_match_result = re.search('(季度净利润为|季度归属于微博的净利润为|季度归属于微博普通股股东的净利润为|季度归属于微博普通股股东的净亏损为)(.*?)美元', html)
        net_profit = net_profit_match_result.group(2)
        if net_profit_match_result.group(1).find('净亏损') > -1:
            if net_profit.find('亿') > -1:
                net_profit = -round(float(net_profit.replace('亿', '')) * 100000000)
            else:
                net_profit = -round(float(net_profit.replace('万', '')) * 10000)
            print('季度净亏损：' + str(net_profit))
        else:
            if net_profit.find('亿') > -1:
                net_profit = round(float(net_profit.replace('亿', '')) * 100000000)
            else:
                net_profit = round(float(net_profit.replace('万', '')) * 10000)
            print('季度净利润：' + str(net_profit))

        mua_match_result = re.search('(月活跃用户数.*?达到|月活跃用户数\(MAU\)为|月活跃用户数.*?至|月活跃用户数.*?为|月活跃用户数.*?)(.+?)(亿|万)', html)
        mua = -1
        if mua_match_result is not None:
            mua = mua_match_result.group(2)
            if mua_match_result.group(3).find('亿') > -1:
                mua = round(float(mua.replace('亿', '')) * 100000000)
            else:
                mua = round(float(mua.replace('万', '')) * 10000)
        print('月活跃用户：' + str(mua))

        dua_match_result = re.search('(日均活跃用户数.*?至|日均活跃用户数.*?为|日活跃用户数.*?达到)(.*?)(亿|万)', html)
        dua = -1
        if dua_match_result is not None:
            dua = dua_match_result.group(2)
            if dua_match_result.group(3).find('亿') > -1:
                dua = round(float(dua.replace('亿', '')) * 100000000)
            else:
                dua = round(float(dua.replace('万', '')) * 10000)
        print('日活跃用户：' + str(dua))

        result = {
            'company': report.company,
            'year': report.year,
            'quarter': report.quarter,
            'url': report.url,
            'net_revenue': net_revenue,
            'adv_revenue': adv_revenue,
            'other_service_revenue': other_service_revenue,
            'net_profit': net_profit,
            'mua': mua,
            'dua': dua
        }

        yield result

    def parse_twitter_financial_report(self, response):
        report = response.meta['report']

        html = response.css('#artibody').extract_first()

        net_revenue = re.search('(营收为)(\d.*?)美元', html).group(2)
        if net_revenue.find('亿') > -1:
            net_revenue = round(float(net_revenue.replace('亿', '')) * 100000000)
        else:
            net_revenue = round(float(net_revenue.replace('万', '')) * 10000)
        print('季度净营收：' + str(net_revenue))

        # adv_revenue = re.search('(季度广告和营销营收|季度广告和营销营收总计)(\d.*?)美元', html).group(2)
        # print('季度广告收入：' + adv_revenue)

        # other_service_revenue = re.search('(季度其他营收为|季度增值服务营收为|季度微博增值服务营收为)(.*?)美元', html).group(2)
        # print('季度其它营收入：' + other_service_revenue)
        #
        net_profit_match_result = re.search('(季净利润|季度净.*?为|净利润|净亏损为|净亏损)(.*?)美元', html)
        net_profit = net_profit_match_result.group(2)
        if net_profit_match_result.group(1).find('亏损') > -1:
            if net_profit.find('亿') > -1:
                net_profit = -round(float(net_profit.replace('亿', '')) * 100000000)
            else:
                net_profit = -round(float(net_profit.replace('万', '')) * 10000)
            print('季度净亏损：' + str(net_profit))
        else:
            if net_profit.find('亿') > -1:
                net_profit = round(float(net_profit.replace('亿', '')) * 100000000)
            else:
                net_profit = round(float(net_profit.replace('万', '')) * 10000)

        mua_match_result = re.search('(月活跃用户数.*?为|月.*?平均活跃用户人数为)(.+?)(亿|万)', html)
        mua = -1
        if mua_match_result is not None:
            mua = mua_match_result.group(2)
            if mua_match_result.group(3).find('亿') > -1:
                mua = round(float(mua.replace('亿', '')) * 100000000)
            else:
                mua = round(float(mua.replace('万', '')) * 10000)
            print('月活跃用户：' + str(mua))

        # dua_match_result = re.search('(日均活跃用户数.*?至|日均活跃用户数.*?为|日活跃用户数.*?达到)(.*?)(亿|万)', html)
        # print('日活跃用户：' + dua_match_result.group(2) + dua_match_result.group(3))

        result = {
            'company': report.company,
            'year': report.year,
            'quarter': report.quarter,
            'url': report.url,
            'net_revenue': net_revenue,
            'adv_revenue': -1,
            'other_service_revenue': -1,
            'net_profit': net_profit,
            'mua': mua,
            'dua': -1
        }

        yield result


def handle_json_object(d):
    return FinancialReportProperties(d['company'], d['year'], d['quarter'], d['url'])


class FinancialReportProperties(object):
    def __init__(self, company, year, quarter, url):
        self.company = company
        self.year = year
        self.quarter = quarter
        self.url = url
