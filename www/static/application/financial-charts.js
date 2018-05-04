const helper = new Helper();

/**
 * 财报图片
 */
class FinancialCharts {

    constructor() {
        this.commonCharts = new CommonCharts();
    }

    drawMultipleBarRevenues(element, quarterFinancial, title) {
        let years = helper.duplicate(quarterFinancial.map(o => o.year)).sort();
        let legends = ['净营收', '广告营收', '增值服务营收', '净利润'];

        let netRevenues = [];
        let advRevenues = [];
        let otherServiceRevenues = [];
        let netPofits = [];
        years.forEach(value => {
            let netRevenue = quarterFinancial
                .filter(o => o.year == value)
                .map(o => o.net_revenue)
                .reduce((n1, n2) => n1 + n2);
            netRevenues.push(netRevenue / 100000000);

            let advRevenue = quarterFinancial
                .filter(o => o.year == value)
                .map(o => o.adv_revenue)
                .reduce((n1, n2) => n1 + n2);
            advRevenues.push(advRevenue / 100000000);

            let otherServiceRevenue = quarterFinancial
                .filter(o => o.year == value)
                .map(o => o.other_service_revenue)
                .reduce((n1, n2) => n1 + n2);
            otherServiceRevenues.push(otherServiceRevenue / 100000000);

            let netPofit = quarterFinancial
                .filter(o => o.year == value)
                .map(o => o.net_profit)
                .reduce((n1, n2) => n1 + n2);
            netPofits.push(netPofit / 100000000);
        });


        let seriesDatas = [
            { name: legends[0], data: netRevenues },
            { name: legends[1], data: advRevenues },
            { name: legends[2], data: otherServiceRevenues },
            { name: legends[3], data: netPofits }
        ]
        echarts.init(element).setOption(this.commonCharts.createBarOption(title, legends, years, seriesDatas));
    }

    drawMultipleLineOfNetProfit(element, quarterFinancial) {
        const legendData = ['微博', 'Twitter'];
        const quarterMap = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4' };

        function sortByYearAndQuarter(a, b) {
            if (a.year === b.year) {
                return (a.quarter < b.quarter) ? -1 : (a.quarter > b.quarter) ? 1 : 0;
            } else {
                return (a.year < b.year) ? -1 : 1;
            }
        }

        const sinaBlogQuarterFinancial = quarterFinancial
            .filter(o => helper.isEquals(o.company, legendData[0]))
            .sort(sortByYearAndQuarter);

        const twitterQuarterFinancial = quarterFinancial
            .filter(o => helper.isEquals(o.company, legendData[1]))
            .sort(sortByYearAndQuarter);

        const xAxisData = twitterQuarterFinancial.map(o => o.year + '年' + quarterMap[o.quarter]);

        let sinaBlogSeriesData = { name: legendData[0], data: [] };
        let twitterSeriesData = { name: legendData[1], data: [] };
        sinaBlogQuarterFinancial.forEach(o => sinaBlogSeriesData.data.push(o.net_profit / 100000000));
        twitterQuarterFinancial.forEach(o => twitterSeriesData.data.push(o.net_profit / 100000000));

        let seriesData = [sinaBlogSeriesData, twitterSeriesData];

        seriesData = seriesData.map(o => {
            o.markPoint = {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                ],
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params) => {
                        if (params.data.value < 0) {
                            return '净亏损 ' + Math.abs(params.data.value) + ' 亿美元';
                        } else {
                            return '净利润 ' + params.data.value + ' 亿美元';
                        }
                    }
                }
            };
            o.type = 'line';
            return o;
        });

        echarts.init(element).setOption(this.commonCharts.createLineOption('近三年新浪微博和 Twitter 各季度净利润对比', legendData, xAxisData, seriesData, '亿美元'))
    }

    /**
     * 画越活跃对比图
     * @param element
     * @param quarterFinancial
     */
    drawMultipleLineOfMUA(element, quarterFinancial) {
        const legendData = ['微博', 'Twitter'];
        const quarterMap = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4' };

        function sortByYearAndQuarter(a, b) {
            if (a.year === b.year) {
                return (a.quarter < b.quarter) ? -1 : (a.quarter > b.quarter) ? 1 : 0;
            } else {
                return (a.year < b.year) ? -1 : 1;
            }
        }

        const sinaBlogQuarterFinancial = quarterFinancial
            .filter(o => helper.isEquals(o.company, legendData[0]))
            .sort(sortByYearAndQuarter);

        const twitterQuarterFinancial = quarterFinancial
            .filter(o => helper.isEquals(o.company, legendData[1]))
            .sort(sortByYearAndQuarter);

        const xAxisData = twitterQuarterFinancial.map(o => o.year + '年' + quarterMap[o.quarter]);

        let sinaBlogSeriesData = { name: legendData[0], data: [] };
        let twitterSeriesData = { name: legendData[1], data: [] };
        sinaBlogQuarterFinancial.forEach(o => sinaBlogSeriesData.data.push(o.mua / 100000000));
        twitterQuarterFinancial.forEach(o => twitterSeriesData.data.push(o.mua / 100000000));

        let seriesData = [sinaBlogSeriesData, twitterSeriesData];

        seriesData = seriesData.map(o => {
            o.markPoint = {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                ],
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params) => {
                        return '月活' + Math.abs(params.data.value) + ' 亿';
                    }
                }
            };
            o.type = 'line';
            return o;
        });

        echarts.init(element).setOption(this.commonCharts.createLineOption('近三年新浪微博和 Twitter 月度活跃用户数对比', legendData, xAxisData, seriesData, '亿'))
    }

    drawLineAndBarMixOfMUAAndNetRevenue(element, quarterFinancial, blog) {
        const legendData = [blog + 'MUA', blog + '净营收'];
        const quarterMap = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4' };

        function sortByYearAndQuarter(a, b) {
            if (a.year === b.year) {
                return (a.quarter < b.quarter) ? -1 : (a.quarter > b.quarter) ? 1 : 0;
            } else {
                return (a.year < b.year) ? -1 : 1;
            }
        }

        const blogQuarterFinancial = quarterFinancial
            .filter(o => helper.isEquals(o.company, blog))
            .sort(sortByYearAndQuarter);

        const xAxisData = blogQuarterFinancial.map(o => o.year + '年' + quarterMap[o.quarter]);

        let seriesMUAData = { name: legendData[0], data: [], type: 'line' };
        let seriesNetRevenueData = { name: legendData[1], data: [], type: 'bar' };
        blogQuarterFinancial.forEach(o => seriesMUAData.data.push(o.mua / 100000000));
        blogQuarterFinancial.forEach(o => seriesNetRevenueData.data.push(o.net_revenue / 100000000));
        // twitterQuarterFinancial.forEach(o => twitterSeriesMUAData.data.push(o.mua / 100000000));
        // twitterQuarterFinancial.forEach(o => twitterSeriesNetRevenueData.data.push(o.net_revenue / 100000000));

        let seriesData = [seriesMUAData, seriesNetRevenueData];

        seriesData.forEach((item, index) => {

            if (index % 2 == 0) {
                item.label = {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '月活 {@score} 亿'
                    }
                }
            } else {
                item.label = {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '{@score} 亿美元'
                    }
                }
            }
        });

        var yAxis = [
            {
                type: 'value',
                name: '亿美元',
                min: 0,
                max: 8,
                interval: 50,
                axisLabel: {
                    formatter: '{value} 亿美元'
                }
            },
            {
                type: 'value',
                name: '亿',
                min: 0,
                max: 4,
                interval: 5,
                axisLabel: {
                    formatter: '{value} 亿'
                }
            }
        ];

        echarts.init(element).setOption(this.commonCharts.createLineAndBarMixOption('近三年' + blog + '月度活跃用户数和净营收对比', legendData, xAxisData, seriesData, yAxis))
    }
}

