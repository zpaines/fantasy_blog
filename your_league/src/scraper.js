let teamTables = document.getElementsByClassName('ResponsiveTable')
let playerTeams = {}
for (let teamTable of teamTables) {
    let teamName = teamTable.firstElementChild.firstElementChild.firstElementChild.children[1].textContent
    let playerTable = teamTable.children[1].firstElementChild.children[1].firstElementChild.children[4]
    for (let player of playerTable.children) {
        if (player.children[1].firstElementChild.firstElementChild.children.length < 2) continue;
        let playerName = player.children[1].firstElementChild.firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.textContent
        playerTeams[playerName] = teamName
    }
}
let zachSite = 'file:///home/zach/fantasy_blog/your_league/dist/index.html'
let linkUrl = `${zachSite}?${new URLSearchParams(playerTeams)}`

let body = document.getElementsByTagName('body')[0]
body.removeChild(body.firstChild)
let link = document.createElement('a')
link.setAttribute('href', linkUrl)
link.textContent = 'CLICK HERE'
body.appendChild(link)