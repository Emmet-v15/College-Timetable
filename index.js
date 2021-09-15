const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const port = 80;
const { username, password, timetableURL } = require('./config.json');
var app = false;
var data = {};

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

async function fetchData() {
    let browser = await puppeteer.launch({ devtools:false, userDataDir: './cache', args: ['--no-sandbox', '--disable-setuid-sandbox'], });

    const page = await browser.newPage();
    await page.authenticate({'username': username, 'password': password});
    
    await page.goto(timetableURL, {waitUntil : 'networkidle2' }).catch(e => void 0);

    const cells = await page.evaluate(() => {
        const rows = document.querySelectorAll('#Content_Content_Content_MainContent_timetable1_tbltimetable tr');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    setTimeout(() => {
        browser.close();
    }, 60 * 1000);
    data = {
        timestamp: Date.now(),
        cells: cells.slice(0)
    }
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify({data: data}, null, 4));
    console.log(`Fetched Data at ${new Date().getHours()}:${new Date().getMinutes()}`);
    if (!app) runApp();
    setTimeout(fetchData, 60 * 60 * 1000);
}

function runApp() {
    app = true;
    require('./app').listen(port, () => console.log(`App listening on port ${port}...`));
}


fetchData();