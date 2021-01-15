import * as test from 'utils.js'
var Chart = require('chart.js');

var color = Chart.helpers.color;
		function generateData() {
			var data = [];
			for (var i = 0; i < 7; i++) {
				data.push({
					x: randomScalingFactor(),
                    y: randomScalingFactor(),
                    label: 'test'
				});
			}
			return data;
		}

		var scatterChartData = {
			datasets: [{
				label: 'My First dataset',
				borderColor: '#FFF0FF',
				backgroundColor: '#FF00FF',
				data: generateData()
			}, {
				label: 'My Second dataset',
				borderColor: '#0F00FF',
				backgroundColor: '#0FF0FF',
				data: generateData()
			}]
		};

		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myScatter = Chart.Scatter(ctx, {
				data: scatterChartData,
				options: {
					title: {
						display: true,
						text: 'Chart.js Scatter Chart'
                    },
                    tooltips: {
         callbacks: {
            label: function(tooltipItem, data) {
               var label = data.labels[tooltipItem.index];
               return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
            }
         }
      }
				}
			});
		};	