import * as Chart from 'chart.js';
import { ComparisonChart } from './comparison_chart'
import { HeadToHeadChart } from './head_to_head'


const playerData = require('../stats.json');
let urlParams = new URLSearchParams(window.location.search);
let playerTeams: Record<string, string> = {}
//@ts-ignore
for (let value of urlParams) {
  playerTeams[value[0]] = value[1];
}
console.log(Object.keys(playerTeams).length);
if (Object.keys(playerTeams).length < 1) {
  console.log(Object.keys(playerTeams))
  playerTeams = require('../players.json');
  document.getElementById('instructions').style.removeProperty('display')
}
let comparison_chart = new ComparisonChart(playerData, document.getElementById('stat-comparison'), playerTeams, 'FG%');
let head_to_head = new HeadToHeadChart(playerData, document.getElementById('head-to-head'), playerTeams);