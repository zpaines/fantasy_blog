import * as Chart from 'chart.js'
import * as chroma from 'chroma-js'

export class HeadToHeadChart {
    playerData: Record<string, Record<string, number>>
    playerTeams: Record<string, string> 
    absoluteTeamData: Record<string, Record<string, number>>
    normalizedTeamData: Record<string, Record<string, number>>
    chart: Chart
    displayedTeams: string[]
    fantasyStats = ['FT%', 'FG%', 'PTS', 'AST', 'TOV', 'TRB', '3P', 'BLK', 'STL']
    displayedStats = ['FT%', 'FG%', 'PTS', 'AST', 'TOV', 'TRB', '3P', 'BLK', 'STL']
    teams: string[]

    constructor(data: Record<string, Record<string, number>>, parentDiv: HTMLElement, playerTeams: Record<string, string>) {
        Chart.defaults.global.defaultFontSize = 20;
        Chart.defaults.global.defaultFontFamily = 'Courier New'
        const selectContainer = document.createElement('div')
        parentDiv.appendChild(selectContainer);
        const canvas = document.createElement('canvas')
        canvas.height = 20;
        canvas.width = 100;
        parentDiv.appendChild(canvas);
        //eslint-disable-next-line
        //@ts-ignore
        const ctx = canvas.getContext('2d');
        this.playerData = data;
        this.playerTeams = playerTeams;
        this.teams = Array.from(new Set(Object.keys(playerTeams).map((p) => playerTeams[p])))
        this.displayedTeams = [this.teams[2], this.teams[7]]
        this.createSelects(selectContainer);
        this.generateTeamData();
        this.chart = new Chart(ctx, {
            type: 'bar',
            options: {
                title: {
                    display: false,
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: false,
                      },
                      ticks: {
                          display: false
                      }
                    }],
                  },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: (tooltipItems, data) => {
                            // @ts-ignore
                            return data.datasets[tooltipItems.datasetIndex].labels[tooltipItems.index].toFixed(2)
                        }
                    }
                },
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

    private computeData(team: string): Record<string, number> {
        let statValues: Record<string, number> = {}
        this.fantasyStats.map((stat) => {
            statValues[stat] = this.computeTeamData(team, stat)
        });
        statValues['FT%'] = this.computeTeamData(team, 'FT') * 100 / this.computeTeamData(team, 'FTA')
        statValues['FG%'] = this.computeTeamData(team, 'FG') * 100 / this.computeTeamData(team, 'FGA')
        return statValues;  
    }

    private generateDataSet(team: string, index: number) {
        const c = chroma.scale(["#87ac00", "#007a7a"])
            .domain([0,this.displayedTeams.length-1]);
        return {
            backgroundColor: c(index).hex(),
            data: Object.values(this.normalizedTeamData[team]),
            labels: Object.values(this.absoluteTeamData[team]),
            pointRadius: 7,
            pointHitRadius: 12,
            label: team
            }
    }

    renderBarChart() {
        const results: number[][] = [];
        const datasets: any = [];
        const barChartData = {
          labels: this.displayedStats,
          datasets: this.displayedTeams.map((team, i) => this.generateDataSet(team, i)),
        };
        this.chart.data = barChartData;
        this.chart.update();
    }

    private generateTeamData() {
        let results: Record<string, Record<string, number>> = {}
        for (let team of this.teams) {
            results[team] = this.computeData(team);
        }
        this.absoluteTeamData = results;
        this.normalizedTeamData = {}
        this.teams.map(team => this.normalizedTeamData[team] = {})
        for (let stat of this.displayedStats) {
            let max = Math.max(...this.teams.map(team => results[team][stat]));
            this.teams.map(team => {
                this.normalizedTeamData[team][stat] = results[team][stat]/max
            })
        }
        return results;
    }

    private createSelects(parentDiv: HTMLElement) {
        let div = document.createElement('div')
        div.setAttribute('style', 'margin-bottom:20px; text-align: center;')
        this.createSelect(div, '#87ac00', this.displayedTeams[0], (team:any) => {
            this.displayedTeams[0] = team;
            this.chart.data.datasets[0] = this.generateDataSet(team, 0);
            this.chart.update();
        });
        this.createSelect(div, '#007a7a', this.displayedTeams[1], (team:any) => {
            this.displayedTeams[1] = team;
            this.chart.data.datasets[1] = this.generateDataSet(team, 1);
            this.chart.update();
        });
        parentDiv.appendChild(div)
    }

    private createSelect(parentDiv: HTMLElement, color: string, startingValue: string, onSelect: (newTeam: string) => void) {
        let div = document.createElement('div');
        div.setAttribute('style', 'display: inline-flex; align-items: center; justify-content: center; text-align: center;')
        parentDiv.appendChild(div);
        let label = document.createElement('div');
        div.appendChild(label);
        label.setAttribute('style', `width: 3vw; height: 3vw; background-color: ${color}; display: inline-block;`);
        let select = document.createElement('select');
        select.setAttribute('style', 'background-color: white; border: none; height: 3vw; line-height: 3vw;')
        for (let team of this.teams) {
            let option = document.createElement('option')
            option.setAttribute('value', `${team}`)
            option.textContent = team
            select.appendChild(option)
        }
        select.value = startingValue;
        select.onchange = (ev) => onSelect(select.value);
        div.appendChild(select)
    }
}