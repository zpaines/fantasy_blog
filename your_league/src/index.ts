import * as Chart from 'chart.js';
import { ComparisonChart } from './comparison_chart'
import { HeadToHeadChart } from './head_to_head'


const playerData = require('../stats.json');
const playerFile = require('../players.json');
Object.keys(playerFile).map(p => {playerFile[p] = playerFile[p].team});
history.replaceState({}, '', `${window.location}?${new URLSearchParams(playerFile)}`);
let urlParams = new URLSearchParams(window.location.search);
let playerTeams: Record<string, string> = {}
//@ts-ignore
for (let value of urlParams) {
  playerTeams[value[0]] = value[1];
}
let teams = new Set(Object.keys(playerTeams).map((p) => playerTeams[p]))
const parentDiv = document.getElementById('production-graph');

let comparison_chart = new ComparisonChart(playerData, parentDiv, playerTeams, 'FG%');
let head_to_head = new HeadToHeadChart(playerData, parentDiv, playerTeams);