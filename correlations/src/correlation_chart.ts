import * as Chart from 'chart.js'

export class CorrelationChart {
    data: Record<string, string | number>[]
    chart: Chart
    filter: string | null
    xAxis: string | null
    yAxis: string | null
    searchBar: HTMLInputElement
    constructor(
        data: Record<string, string | number>[],
        parentDiv: HTMLElement
    ) {
        Chart.defaults.global.defaultFontSize = 20;
        Chart.defaults.global.defaultFontFamily = 'Courier New'
        const searchDiv = document.createElement('div');
        searchDiv.setAttribute('style', 'width:100%; text-align:center;');
        parentDiv.appendChild(searchDiv);
        const searchLabel = document.createElement('label');
        searchLabel.setAttribute('for', 'search-bar');
        searchLabel.textContent = 'Filter: ';
        searchLabel.setAttribute('style', 'font-size: 20px;');
        this.searchBar = document.createElement('input');
        this.searchBar.addEventListener('input', () => this.updateFilter());          
        searchLabel.setAttribute('id', 'search-bar');
        searchDiv.appendChild(searchLabel);
        searchDiv.appendChild(this.searchBar);
        const canvas = document.createElement('canvas')
        canvas.height = 100;
        canvas.width = 100;
        parentDiv.appendChild(canvas);
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

    updateFilter(): void {
        console.log("test")
        this.filter = this.searchBar.value;
        if (this.xAxis && this.yAxis) {
            this.renderData(this.xAxis, this.yAxis, false)
        }
    }

    renderData(xAxis: string, yAxis: string, transition=true): void {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        const filter = this.searchBar.value || ''
        const filterFunc = (d: Record<string, string | number>) => {
            return (d.Name as string).toLowerCase().includes(filter.toLowerCase());
        }
        this.chart.data = {
            datasets: 
                [{
                backgroundColor: '#de6600',
                data: this.data.filter(filterFunc).map((d) => {
                    return {
                        x: d[xAxis],
                        y: d[yAxis],
                        label: d.Name
                    }
                }),
                pointRadius: 7,
                pointHitRadius: 12,
                label: 'Current Season',
            },
            {
                backgroundColor: '#d4d2d1',
                data: this.data.filter((d) => !filterFunc(d)).map((d) => {
                    return {
                        x: d[xAxis],
                        y: d[yAxis],
                        label: d.Name
                    }
                }),
                pointRadius: 5,
                pointHitRadius: 1,
                label: 'hidden',
              },
        ]
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
        if (transition) this.chart.options.animation.duration = 1000
        else this.chart.options.animation.duration = 0
        this.chart.update();
    }
}