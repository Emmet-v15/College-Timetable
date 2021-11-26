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

function addDay() {
    schoolDay++;
    schoolDay = schoolDay >= 7? schoolDay-7 : schoolDay;
}

function lessonsOver() {
    return console.log(lessons[schoolDay] && !lessons[schoolDay].map(lesson => {
        let date = new Date();
        date.setHours(lesson.endTime.split(":")[0]);
        return date < new Date();
    }).includes(false))
}

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let schoolDay = new Date().getDay();

if (!lessons[schoolDay] || lessons[schoolDay] == []) {
    while (!lessons[schoolDay] || lessons[schoolDay].length == 0) {
        addDay();
    }
} else if (lessonsOver()) {
    addDay();
    while (!lessons[schoolDay] || lessons[schoolDay] == []) {
        addDay();
    }
}

router.get('/', (req, res, next) => {
    res.render('index', {
        lessons: lessons[schoolDay],
        day: days[schoolDay],
        refreshTimestamp: data.timestamp
    });
});

module.exports = router;