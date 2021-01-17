import * as d3 from 'd3';
import * as chroma from 'chroma-js'
import { Table } from './table'
import * as Chart from 'chart.js'
import { CorrelationChart } from './correlation_chart';

const gridDiv = document.createElement("div");
gridDiv.setAttribute("id", "grid");
document.getElementById('flex-container').appendChild(gridDiv);
const graphDiv = document.createElement("div");
graphDiv.setAttribute("id", "graph");
graphDiv.style.width = '50%';
gridDiv.style.width = '50%';
document.getElementById('flex-container').appendChild(graphDiv);
const correlations = require('./correlations.json') //eslint-disable-line
const canvas = document.createElement('canvas')
canvas.height = 100;
canvas.width = 100;
graphDiv.appendChild(canvas);
const rows = Object.keys(correlations);
const columns = Object.keys(correlations['AST']);
interface Correlation {
    rowStat: string,
    columnStat: string,
    row: number,
    column: number,
    value: number
}
const data: Correlation[] = []
for (let row=0; row<rows.length; row++) {
    for (let column=0; column<columns.length; column++) {
        data.push({
            columnStat: columns[column],
            rowStat: rows[row],
            row,
            column,
            value: correlations[rows[row]][columns[column]] as number
        })
    }
}

const playerStats = require('./player_stats.json') //eslint-disable-line
const chart = new CorrelationChart(playerStats, canvas);
chart.renderData('FG%', '3P')

const table = new Table<Correlation>(
    data,
    (d: Correlation) => { chart.renderData(d.columnStat, d.rowStat) },
    gridDiv,
    rows,
    columns
)