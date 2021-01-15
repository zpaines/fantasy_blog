import * as Chart from 'chart.js';

const playerData = require('./player_data.json');
const lastSeasonPlayerData = require('./last_season_player_data.json');

const searchBar = document.createElement('input');
document.body.appendChild(searchBar);
const canvas = document.createElement('canvas');

canvas.id = 'chart';
canvas.height = 90;
canvas.width = 300;

document.body.appendChild(canvas);

const barChartCanvas = document.createElement('canvas');

barChartCanvas.id = 'barchart';
barChartCanvas.height = 60;
barChartCanvas.width = 300;

document.body.appendChild(barChartCanvas);

function generateData(filter?: string) {
  let players = Object.keys(playerData);
  if (filter) players = players.filter((p) => p.toLowerCase().includes(filter.toLowerCase()));
  return players.map((player: string) => ({
    x: playerData[player].zach_points,
    y: playerData[player].Average,
    label: player,
  }));
}

function generateLastSeasonData(filter?: string) {
  let players = Object.keys(lastSeasonPlayerData);
  if (filter) players = players.filter((p) => p.toLowerCase().includes(filter.toLowerCase()));
  return players.map((player: string) => ({
    x: lastSeasonPlayerData[player].zach_points,
    y: lastSeasonPlayerData[player].Average,
    label: player,
  }));
}

function generateHiddenData(filter?: string) {
  let data: {}[] | [] = [];
  // Last season hidden
  let players = Object.keys(lastSeasonPlayerData);
  if (filter) players = players.filter((p) => !p.toLowerCase().includes(filter.toLowerCase()));
  data = players.map((player: string) => ({
    x: lastSeasonPlayerData[player].zach_points,
    y: lastSeasonPlayerData[player].Average,
    label: player,
  }));

  // Current season
  players = Object.keys(playerData);
  if (filter) players = players.filter((p) => !p.toLowerCase().includes(filter.toLowerCase()));
  data.concat(players.map((player: string) => ({
    x: playerData[player].zach_points,
    y: playerData[player].Average,
    label: player,
  })));

  return data;
}

function scatterChartData(filter?: string) {
  return {
    datasets: [{
      backgroundColor: '#de6600',
      data: generateData(filter),
      pointRadius: 7,
      pointHitRadius: 12,
      label: 'Current Season',
    },
    {
      backgroundColor: '#007a7a',
      data: generateLastSeasonData(filter),
      pointRadius: 7,
      pointHitRadius: 12,
      label: '2019-2020 Season',
    },
    {
      backgroundColor: '#d4d2d1',
      data: generateHiddenData(filter),
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
      text: 'Average Draft Price (2020-2021) vs Overall Production',
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
          labelString: 'Average Draft Price',
        },
        ticks: {
          min: 0,
          max: 80,
        },
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total Production',
        },
        ticks: {
          min: -10000,
          max: 20000,
        },
      }],
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
  },
});

let barChart: Chart = null;
function renderBarChart(playerName: string) {
  const stats = ['derived_fg', 'derived_ft', 'TRB', 'AST', 'STL', 'BLK', 'TOV', '3P', 'PTS'];
  const datasets: any = [];

  if (playerData[playerName] != null) {
    datasets.push({
      backgroundColor: '#de6600',
      data: stats.map((stat) => playerData[playerName][stat]),
      pointRadius: 7,
      pointHitRadius: 12,
      label: 'Current Season',
    });
  }
  if (lastSeasonPlayerData[playerName] != null) {
    datasets.push({
      backgroundColor: '#007a7a',
      data: stats.map((stat) => lastSeasonPlayerData[playerName][stat]),
      pointRadius: 7,
      pointHitRadius: 12,
      label: '2019-2020 Season',
    });
  }
  const barChartData = {
    labels: ['FG%', 'FT%', 'TRB', 'AST', 'STL', 'BLK', 'TOV', '3P', 'PTS'],
    datasets,
  };
  if (barChart == null) {
    barChart = new Chart(barChartCanvas, { type: 'bar' });
  }
  barChart.data = barChartData;
  barChart.options = {
    title: {
      display: true,
      text: `Production By Category For ${playerName}`,
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Production',
        },
      }],
    },
  };
  barChart.update();
}
const onClick = (evt: any) => {
  const activeElement:any = scatterChart.getElementAtEvent(evt);
  if (activeElement == null || activeElement.length === 0) {
    return;
  }
  barChartCanvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  let { label: playerName } = scatterChart.data.datasets[activeElement[0]._datasetIndex].data[activeElement[0]._index] as any; //eslint-disable-line
  if (playerName != null) {
    renderBarChart(playerName);
  }
};
renderBarChart('Stephen Curry');

scatterChart.options.onClick = onClick;

// Search Bar

function valueChanged(e: InputEvent) {
  scatterChart.data = scatterChartData(searchBar.value);
  scatterChart.update();
}
searchBar.addEventListener('input', valueChanged);
