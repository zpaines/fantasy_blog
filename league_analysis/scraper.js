document.getElementsByClassName('ResponsiveTable')[0].children[0].firstElementChild.lastElementChild.title

let name = document.getElementsByClassName('ResponsiveTable')[0].children[1].firstElementChild.children[1].firstElementChild.lastElementChild.children[0].children[1].firstElementChild.firstElementChild.firstElementChild.firstElementChild.text

let cost = 
document.getElementsByClassName('ResponsiveTable')[0].children[1].firstElementChild.children[1].firstElementChild.lastElementChild.children[0].children[2].firstElementChild.firstElementChild.textContent.replace(/\$/g, '')