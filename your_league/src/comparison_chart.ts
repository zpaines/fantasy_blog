import * as Chart from 'chart.js'
import * as chroma from 'chroma-js'

export class ComparisonChart {
    playerData: Record<string, Record<string, number>>
    playerTeams: Record<string, string>
    chart: Chart
    displayedTeams: string[]
    stat: string
    statDisplay: string
    teams: string[]
    fantasyStats = ['FT%', 'FG%', 'PTS', 'AST', 'TOV', 'TRB', '3P', 'BLK', 'STL']

    constructor(data: Record<string, Record<string, number>>, parentDiv: HTMLElement, playerTeams: Record<string, string>, stat: string) {
        Chart.defaults.global.defaultFontSize = 20;
        Chart.defaults.global.defaultFontFamily = 'Courier New'
        this.createSelect(parentDiv);
        const canvas = document.createElement('canvas')
        canvas.height = 20;
        canvas.width = 100;
        parentDiv.appendChild(canvas);
        //eslint-disable-next-line
        //@ts-ignore
        const ctx = canvas.getContext('2d');
        this.playerData = data;
        this.playerTeams = playerTeams;
        this.stat = stat;
        this.teams = Array.from(new Set(Object.keys(playerTeams).map((p) => playerTeams[p])))
        this.chart = new Chart(ctx, {
            type: 'bar',
            options: {
                title: {
                    display: true,
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: false,
                      },
                    }],
                  },
                  tooltips: {
                    enabled: false,
                  }
            }
        });
        this.renderBarChart();
    }

    private computeTeamData(team: string, stat: string) {
        let players = Object.keys(this.playerData);
        return players.filter(p => this.playerTeams[p] == team).reduce((total, current_player: any) => {
            return total += this.playerData[current_player][stat];
        }, 0)
    }

    private computeData() {
        let teamData: Record<string, number> = {}
        this.teams.map((team) => {
          if (this.stat == 'FT%') {
            teamData[team] = this.computeTeamData(team, 'FT') / this.computeTeamData(team, 'FTA')
          }
          else if (this.stat == 'FG%') {
            teamData[team] = this.computeTeamData(team, 'FG') * 100 / this.computeTeamData(team, 'FGA')
          }
          else {
            teamData[team] = this.computeTeamData(team, this.stat)
          }
        });
        return teamData;  
    }

    renderBarChart() {
        const datasets: any = [];
        let teamData = this.computeData();

        datasets.push({
          backgroundColor: "#de6600",
          data: Object.values(teamData),
          pointRadius: 7,
          pointHitRadius: 12,
        });
        const barChartData = {
          labels: Object.keys(teamData),
          datasets,
        };
        this.chart.data = barChartData;
        this.chart.update();
    }

    private createSelect(parentDiv: HTMLElement) {
      let div = document.createElement('div')
      div.setAttribute('style', 'margin-bottom:20px; text-align: center;')
      parentDiv.appendChild(div)
      let select = document.createElement('select');
      select.setAttribute('style', "background-color: white; border: none; height: 3vw; line-height: 3vw; font-size: 30px; font-family:'Courier New', Courier, monospace;")
      for (let stat of this.fantasyStats) {
          let option = document.createElement('option')
          option.setAttribute('value', `${stat}`)
          option.textContent = stat
          select.appendChild(option)
      }
      select.value = 'FG%';
      select.onchange = (ev) => {
        this.stat = select.value 
        this.renderBarChart()
      }
      div.appendChild(select)
  }
}
