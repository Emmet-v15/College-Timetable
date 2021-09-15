var express = require('express');
var router = express.Router();

const { data } = require('../data.json');

const lessons = [
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
            lessons[i].push(slot.match(/(?<startTime>\d\d:\d\d) - (?<endTime>\d\d:\d\d) (?<course>.*) A Level .* (?<room>.*)/).groups);
        };
    }
});

function render(res, refreshTime) {
    res.render('index', {
        lessons: lessons[today],
        day: days[today],
        refreshTime: refreshTime.join("")
    });
}

let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
let today = new Date().getDay()-1;
today = today >= 5? 0 : today;
while (!lessons[today].length) {
    today++;
}
    
!lessons[today].map(lesson => {
    let date = new Date();
    date.setHours(lesson.endTime.split(":")[0]);
    return date < new Date();
}).includes(false)? today++ : null;

router.get('/', (req, res, next) => {
    let date = new Date();
    date.setTime(date.getTime() - data.timestamp)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let refreshTime = [];

    if (hours) {
        refreshTime.push(hours + " hour");
        if (hours > 1) refreshTime.push("s, ");
        else refreshTime.push(", ");

        if (minutes) {
            refreshTime.push(minutes + " minute");
            if (minutes > 1) refreshTime.push("s ago");
            else refreshTime.push(" ago");
        }
    } else {
        if (minutes) {
            refreshTime.push(minutes + " minute");
            if (minutes > 1) refreshTime.push("s, ");
            else refreshTime.push(", ");
        }
        if (seconds > 30) refreshTime.push(seconds + " seconds ago");
        else refreshTime.push("Just Now");
    }g


    render(res, refreshTime);
});

module.exports = router;