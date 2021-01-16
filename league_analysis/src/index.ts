import * as Chart from 'chart.js';

const playerData = require('../stats.json');
let teams = new Set(Object.keys(playerData).map((p) => playerData[p].team))
console.log(teams)

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

function generateData(team:string, filter?: string, team_filter?: string) {
  if (team_filter && team != team_filter) {
    return [];
  }
  let players = Object.keys(playerData);
  if (filter) players = players.filter((p) => p.toLowerCase().includes(filter.toLowerCase()));
  return players.filter(p => playerData[p].team == team).map((player: string) => ({
    x: playerData[player].zach_points,
    y: playerData[player].cost,
    label: player,
  }));
}

function generateHiddenData(filter?: string, team_filter?: string) {
  let data: {}[] | [] = [];
  if (!filter && !team_filter) return data;
  if (filter) {
    let players = Object.keys(playerData);
    players = players.filter((p) => !p.toLowerCase().includes(filter.toLowerCase()));
    return players.map((player: string) => ({
      x: playerData[player].zach_points,
      y: playerData[player].cost,
      label: player,
    }));
  }
  if (team_filter) {
    let players = Object.keys(playerData);
    players = players.filter((p) => playerData[p].team != team_filter);
    return players.map((player: string) => ({
      x: playerData[player].zach_points,
      y: playerData[player].cost,
      label: player,
    }));
  }
}

let Colors:any = {};
Colors.names = {
    // aqua: "#00ffff",
    // azure: "#f0ffff",
    // beige: "#f5f5dc",
    black: "#000000",
    // blue: "#0000ff",
    // brown: "#a52a2a",
    // cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    // darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    // gold: "#ffd700",
    // green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    // lightblue: "#add8e6",
    // lightcyan: "#e0ffff",
    // lightgreen: "#90ee90",
    // lightgrey: "#d3d3d3",
    // lightpink: "#ffb6c1",
    // lightyellow: "#ffffe0",
    // lime: "#00ff00",
    // magenta: "#ff00ff",
    maroon: "#800000",
    // navy: "#000080",
    // olive: "#808000",
    // orange: "#ffa500",
    // pink: "#ffc0cb",
    // purple: "#800080",
    // violet: "#800080",
    // red: "#ff0000",
    // silver: "#c0c0c0",
    // white: "#ffffff",
    // yellow: "#ffff00"
};


function scatterChartData(filter?: string, team_filter?: string) {
  return {
    datasets: [
    ...([...teams].map((team, index) => {
      return {
        backgroundColor: Colors.names[Object.keys(Colors.names)[index]],
        data: generateData(team, filter, team_filter),
        pointRadius: 7,
        pointHitRadius: 12,
        label: team,
      }
    })),
    {
      backgroundColor: '#d4d2d1',
      data: generateHiddenData(filter, team_filter),
      pointRadius: 5,
      pointHitRadius: 1,
      label: 'hidden',
    },
    ],
  };
}
Chart.defaults.global.defaultFontSize = 20;

const scatterChart = new Chart(canvas, {
  data: scatterChartData(),
  type: 'scatter',
  options: {
    title: {
      display: true,
      text: 'Price vs Overall Production',
    },
    animation: {
      duration: 0,
    },
    legend: {
      labels: {
        filter(item) {
          return !item.text.includes('hidden');
        },
      },
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Price',
        },
        ticks: {
          min: 0,
          max: 120,
        },
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total Production',
        },
        ticks: {
          min: -10000,
          max: 15000,
        },
      }],
    },
    tooltips: {
      displayColors: false,
      callbacks: {
        label(tooltipItem, data) {
          const { label } = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as any;
          const team = playerData[label].team
          return `${label}, ${team}`;
        },
      },
    },
  },
});
scatterChart.data.datasets.forEach(function(ds) {
  ds.hidden = true;
});
scatterChart.update();

showAll.onclick = () => {
  scatterChart.data.datasets.forEach(function(ds) {
    ds.hidden = false;
  });
  scatterChart.update();

}
hideAll.onclick = () => {
  scatterChart.data.datasets.forEach(function(ds) {
    ds.hidden = true;
  });
  scatterChart.update();

}
function filterScatterData(filter?: string, team?: string) {
  scatterChart.data = scatterChartData(filter, team);
  scatterChart.update();
}

let selectedTeam: string | null = null;
const onClick = (evt: any) => {
  const activeElement:any = scatterChart.getElementAtEvent(evt);
  if (activeElement == null || activeElement.length === 0) {
    if (selectedTeam != null) {
      filterScatterData(searchBar.value);
      selectedTeam = null;
    }
    return;
  }
  let { label: playerName } = scatterChart.data.datasets[activeElement[0]._datasetIndex].data[activeElement[0]._index] as any; //eslint-disable-line
  selectedTeam = playerData[playerName].team;
  if (selectedTeam != null) {
    filterScatterData(null, selectedTeam);
  }
};

scatterChart.options.onClick = onClick;

// Search Bar
function valueChanged() {
  filterScatterData(searchBar.value);
}
searchBar.addEventListener('input', valueChanged);
