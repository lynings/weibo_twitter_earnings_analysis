#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__author__ = '李金燕'

import re

import scrapy
from scrapy.selector import Selector


class FinancialReportUrlSpider(scrapy.Spider):
    name = "financial_report_url"

    target_company_list = ['微博', 'Twitter']
    target_year_list = ['2017', '2016', '2015']
    quarter_list = ['一季', '第一季度', '第二季度', '第三季度', '第四季度']

    def start_requests(self):
        urls = [
            "http://tech.sina.com.cn/focus/finance_report/",
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        return self.parse_url(response)

    def parse_url(self, response):
        china_company_selectors = response.css('#div_zgg table tbody tr')
        us_company_selectors = response.css('#div_us table tbody tr')
        company_selectors = china_company_selectors + us_company_selectors

        for company_selector in company_selectors:
            company_name = company_selector.css('td a::text').extract_first()
            if company_name in self.target_company_list:
                year_selectors = Selector(text=company_selector.css('td').extract()[3]).css('td>a').extract()
                for year_selector in year_selectors:
                    # 提取 year
                    year = Selector(text=year_selector).css("a::text").extract_first()
                    if year in self.target_year_list:
                        # 提取该年对应的季度财报id
                        id_sign = 'div' + re.search('\((.+)\)', str(year_selector)).group(1)
                        url_selectors = company_selector.css('#' + id_sign + '>a')
                        for url_selector in url_selectors:
                            quarter = url_selector.css('a::text').extract_first()
                            if quarter in self.quarter_list:
                                yield {
                                    'company': company_name,
                                    'year': year,
                                    'quarter': quarter,
                                    'url': re.search('href="(.+)"', str(url_selector.css('a').extract_first())).group(1)
                                }
