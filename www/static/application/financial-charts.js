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
}

