const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const port = 80;
const { username, password, timetableURL } = require('./config.json');

async function fetchData() {
    let browser = await puppeteer.launch({ devtools:false, userDataDir: './cache', args: ['--no-sandbox', '--disable-setuid-sandbox'], });

    const page = await browser.newPage();
    await page.authenticate({'username': username, 'password': password});
    
    page.goto(timetableURL);
    await page.waitForSelector('#Content_Content_Content_MainContent_timetable1_tbltimetable tr');

    const data = await page.evaluate(() => {
        const rows = document.querySelectorAll('#Content_Content_Content_MainContent_timetable1_tbltimetable tr');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    setTimeout(() => {
        browser.close();
    }, 60 * 1000);
    
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify({data: data.slice(0)}, null, 4));
    console.log('Fetched Data');
    setTimeout(fetchData, 6 * 60 * 60 * 1000);
}

app.listen(port, () => console.log(`App listening on port ${port}...`));

fetchData();