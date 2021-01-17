import * as Chart from 'chart.js'

export class CorrelationChart {
    data: Record<string, string | number>[]
    chart: Chart
    constructor(
        data: Record<string, string | number>[],
        canvas: HTMLCanvasElement
    ) {
        Chart.defaults.global.defaultFontSize = 20;
        Chart.defaults.global.defaultFontFamily = 'Courier New'
        //eslint-disable-next-line
        //@ts-ignore
        const ctx = canvas.getContext('2d');
        this.data = data;
        this.chart = new Chart(ctx, {
            type: 'scatter',
            options: {
                title: {
                    display: true,
                },
                legend: {
                    display: false
                },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                      label(tooltipItem, data) {
                        const { label } = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as any;
                        return `${label}`;
                      },
                    },
                  },
            }
        });
    }

    renderData(xAxis: string, yAxis: string): void {
        this.chart.data = {
            datasets: 
                [{
                backgroundColor: '#de6600',
                data: this.data.map((d) => {
                    return {
                        x: d[xAxis],
                        y: d[yAxis],
                        label: d.Name
                    }
                }),
                pointRadius: 7,
                pointHitRadius: 12,
                label: 'Current Season',
            }]
        }
        this.chart.options.title.text = `${yAxis} vs ${xAxis}`
        this.chart.options.scales.xAxes = 
            [{scaleLabel: {
                display: true,
                labelString: xAxis,
            }}]
        this.chart.options.scales.yAxes = 
            [{scaleLabel: {
                display: true,
                labelString: yAxis,
            }}]
        this.chart.update();
    }
}