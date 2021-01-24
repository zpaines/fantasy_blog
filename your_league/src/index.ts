import * as Chart from 'chart.js';

const leagueData = require('../stats.json');
let playerData: Record<string, Record<string, number>> = {}
leagueData.map((datum: any) => {
  playerData[datum.Name] = datum
})
console.log(playerData)
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

const searchDiv = document.createElement('div');
searchDiv.setAttribute('style', 'width:100%; text-align:center;');
parentDiv.appendChild(searchDiv);
const searchLabel = document.createElement('label');
searchLabel.setAttribute('for', 'search-bar');
searchLabel.textContent = 'Filter: ';
searchLabel.setAttribute('style', 'font-size: 20px;');
const searchBar = document.createElement('input');
searchLabel.setAttribute('id', 'search-bar');
searchDiv.appendChild(searchLabel);
searchDiv.appendChild(searchBar);
const buttonDiv = document.createElement('div');
buttonDiv.setAttribute('style', 'width:100%; text-align:center;');
const showAll = document.createElement('button');
showAll.textContent= "Show All Teams";
buttonDiv.appendChild(showAll);
const hideAll = document.createElement('button');
hideAll.textContent= "Hide All Teams";
buttonDiv.appendChild(hideAll);
parentDiv.appendChild(buttonDiv);

const canvas = document.createElement('canvas');

canvas.id = 'chart';
canvas.height = 120;
canvas.width = 300;

parentDiv.appendChild(canvas);

const barChartCanvas = document.createElement('canvas');

barChartCanvas.id = 'barchart';
barChartCanvas.height = 60;
barChartCanvas.width = 300;

parentDiv.appendChild(barChartCanvas);

function computeTeamData(team: string, stat: string) {
  let players = Object.keys(playerData);
  console.log(playerData);
  return players.filter(p => playerTeams[p] == team).reduce((total, current_player: any) => {
    return total += playerData[current_player][stat];
  }, 0)
}
let teamData: Record<string, number> = {}
Array.from(teams).map((team) => {
  teamData[team] = computeTeamData(team, 'FG%')
});
let avg = Object.values(teamData).reduce((total, val) => total+val, 0) / Object.values(teamData).length
Object.keys(teamData).map(team => {
  teamData[team] = teamData[team]-avg
})
console.log(teamData)

// function generateData(team:string, filter?: string, team_filter?: string) {
//   if (team_filter && team != team_filter) {
//     return [];
//   }
//   let players = Object.keys(playerData);
//   if (filter) players = players.filter((p) => p.toLowerCase().includes(filter.toLowerCase()));
//   return players.filter(p => playerTeams[p] == team).map((player: string) => ({
//     x: playerData[player].zach_points,
//     y: playerData[player].cost,
//     label: player,
//   }));
// }

// function generateHiddenData(filter?: string, team_filter?: string) {
//   let data: {}[] | [] = [];
//   if (!filter && !team_filter) return data;
//   if (filter) {
//     let players = Object.keys(playerData);
//     players = players.filter((p) => !p.toLowerCase().includes(filter.toLowerCase()));
//     return players.map((player: string) => ({
//       x: playerData[player].zach_points,
//       y: playerData[player].cost,
//       label: player,
//     }));
//   }
//   if (team_filter) {
//     let players = Object.keys(playerData);
//     players = players.filter((p) => playerTeams[p] != team_filter);
//     return players.map((player: string) => ({
//       x: playerData[player].zach_points,
//       y: playerData[player].cost,
//       label: player,
//     }));
//   }
// }

// let Colors:any = {};
// Colors.names = {
//     black: "#000000",
//     darkblue: "#00008b",
//     darkcyan: "#008b8b",
//     darkgreen: "#006400",
//     darkkhaki: "#bdb76b",
//     darkmagenta: "#8b008b",
//     darkolivegreen: "#556b2f",
//     darkorange: "#ff8c00",
//     darkorchid: "#9932cc",
//     darkred: "#8b0000",
//     darksalmon: "#e9967a",
//     darkviolet: "#9400d3",
//     fuchsia: "#ff00ff",
//     indigo: "#4b0082",
//     khaki: "#f0e68c",
//     maroon: "#800000",
// };


// function scatterChartData(filter?: string, team_filter?: string) {
//   return {
//     datasets: [
//     ...([...teams].map((team, index) => {
//       return {
//         backgroundColor: Colors.names[Object.keys(Colors.names)[index]],
//         data: generateData(team, filter, team_filter),
//         pointRadius: 7,
//         pointHitRadius: 12,
//         label: team,
//       }
//     })),
//     {
//       backgroundColor: '#d4d2d1',
//       data: generateHiddenData(filter, team_filter),
//       pointRadius: 5,
//       pointHitRadius: 1,
//       label: 'hidden',
//     },
//     ],
//   };
// }
// Chart.defaults.global.defaultFontSize = 20;

// const scatterChart = new Chart(canvas, {
//   data: scatterChartData(),
//   type: 'scatter',
//   options: {
//     title: {
//       display: true,
//       text: 'Price vs Overall Production',
//     },
//     animation: {
//       duration: 0,
//     },
//     legend: {
//       labels: {
//         filter(item) {
//           return !item.text.includes('hidden');
//         },
//       },
//     },
//     scales: {
//       yAxes: [{
//         scaleLabel: {
//           display: true,
//           labelString: 'Price',
//         },
//         ticks: {
//           min: 0,
//           max: 120,
//         },
//       }],
//       xAxes: [{
//         scaleLabel: {
//           display: true,
//           labelString: 'Total Production',
//         },
//         ticks: {
//           min: -10000,
//           max: 15000,
//         },
//       }],
//     },
//     tooltips: {
//       displayColors: false,
//       callbacks: {
//         label(tooltipItem, data) {
//           const { label } = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as any;
//           const team = playerData[label].team
//           return `${label}, ${team}`;
//         },
//       },
//     },
//   },
// });
// scatterChart.data.datasets.forEach(function(ds) {
//   ds.hidden = true;
// });
// scatterChart.update();

// showAll.onclick = () => {
//   scatterChart.data.datasets.forEach(function(ds) {
//     ds.hidden = false;
//   });
//   scatterChart.update();

// }
// hideAll.onclick = () => {
//   scatterChart.data.datasets.forEach(function(ds) {
//     ds.hidden = true;
//   });
//   scatterChart.update();

// }
// function filterScatterData(filter?: string, team?: string) {
//   scatterChart.data = scatterChartData(filter, team);
//   scatterChart.update();
// }

// let selectedTeam: string | null = null;
// const onClick = (evt: any) => {
//   const activeElement:any = scatterChart.getElementAtEvent(evt);
//   if (activeElement == null || activeElement.length === 0) {
//     if (selectedTeam != null) {
//       filterScatterData(searchBar.value);
//       selectedTeam = null;
//     }
//     return;
//   }
//   let { label: playerName } = scatterChart.data.datasets[activeElement[0]._datasetIndex].data[activeElement[0]._index] as any; //eslint-disable-line
//   selectedTeam = playerData[playerName].team;
//   if (selectedTeam != null) {
//     filterScatterData(null, selectedTeam);
//   }
// };

// scatterChart.options.onClick = onClick;

// // Search Bar
// function valueChanged() {
//   filterScatterData(searchBar.value);
// }
// searchBar.addEventListener('input', valueChanged);
