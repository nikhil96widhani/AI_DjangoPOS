var revenue_profit_chart_options = {
    series: [],
    noData: {
        text: 'Loading...'
    },
    chart: {
        type: 'bar',
        height: 300
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    fill: {
        opacity: 1
    },
    xaxis: {
        type: 'datetime'
    },
};

var revenue_profit_chart = new ApexCharts(document.querySelector("#revenue-profit-chart"), revenue_profit_chart_options);
revenue_profit_chart.render();

function emptyChart(chart_name) {
    chart_name.updateSeries([]);
    chart_name.updateOptions({
        xaxis: {
            labels: {
                show: false
            },
        },
        yaxis: {
            labels: {
                show: false
            },
        },
    })
}

function revenueProfitChartFill(data) {
    revenue_profit_chart.updateSeries([
        {
            name: 'Revenue',
            data: data.revenue
        }, {
            name: 'Net Profit',
            data: data.profit
        },
    ])
    revenue_profit_chart.updateOptions({
        xaxis: {
            labels: {
                show: true,
            },
            categories: data.dates
        },
        // labels: data.dates,
        yaxis: {
            labels: {
                show: true
            },
        },
    })
}

// $(document).ready(function () {
//     revenueProfitChartFill();
// });

function toggleChartCard(start, end) {
    if (start === end) {
        $('#revenue-profit-chart-card').slideUp();
    } else {
        $('#revenue-profit-chart-card').slideDown(200);
        emptyChart(revenue_profit_chart);
        $.ajax('/api/orders-chart-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {'date1': start, 'date2': end},
            success: function (data) {
                console.log(data);
                revenueProfitChartFill(data);
            },
            error: function () {
                console.log('Error');
            },
        });
    }
}