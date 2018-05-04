class CommonCharts {
    constructor() {
    }

    /**
     * 创建 bar option
     * @param legendData    legend data
     * @param xAxisDataArr  x 轴数据
     * @param seriesData    y 轴数据
     * @returns {{xAxis: {type: string, data: *}, yAxis: {type: string}, series: any[]}|*}
     */
    createBarOption(title, legendData, xAxisData, seriesData) {

        let series = seriesData.map(item => {
            item.type = 'bar';
            item.label = {
                normal: {
                    show: true,
                    position: 'top',
                    formatter: '{@score} 亿美元'
                }
            }
            return item;
        });

        let option = {
            title: {
                text: title,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: legendData,
                bottom: 0,
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '亿美元'
                }
            ],
            series: series
        };
        return option;
    }

    createLineOption(title, legendData, xAxisData, seriesData, yAxisName) {

        let option = {
            title: {
                text: title,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData,
                bottom: 0,
            },
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                name: yAxisName
            },
            series: seriesData
        };

        return option;
    }

    createLineAndBarMixOption(title, legendData, xAxisData, seriesData, yAxis) {

        let option = {
            title: {
                text: title,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData,
                bottom: 0,
            },
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: yAxis,
            series: seriesData
        };

        return option;
    }
}