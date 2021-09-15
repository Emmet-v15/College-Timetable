var express = require('express');
var router = express.Router();

const { data } = require('../data.json');

const weekdays = [
    [],
    [],
    [],
    [],
    [],
]

data.cells.forEach(( cell ) => {
    if (cell.length) {
        cell = cell.slice(cell.length-5);
        
        for (let i = 0; i < cell.length; i++) {
            const slot = cell[i];
            if (slot.length === 0) continue;
            weekdays[i].push(slot.match(/(?<startTime>\d\d:\d\d) - (?<endTime>\d\d:\d\d) (?<course>.*) A Level .* (?<room>.*)/).groups);
        };
    }
});

let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
let today = new Date().getDay()-1;
today = today >= 5? 0 : today;
while (!weekdays[today].length) {
    today+=1;
}

router.get('/', (req, res, next) => {
    res.render('index', {
        lessons: weekdays[today],
        day: days[today],
        refreshTime: data.time
    });
});

module.exports = router;