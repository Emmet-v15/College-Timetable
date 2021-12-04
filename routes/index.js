var express = require('express');
var router = express.Router();
var fs = require('fs');
const { parse } = require('path');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

getLessons = () => {
    let { data } = JSON.parse(fs.readFileSync('./data.json'))
    let lessons = [
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
    return lessons
}

getDay = () => {
    let lessons = getLessons();
    function addDay() {
        schoolDay++;
        schoolDay = schoolDay >= 5? schoolDay-5 : schoolDay;
    }
    
    function lessonsOver() {
        return lessons[schoolDay] && !lessons[schoolDay].map(lesson => {
            let date = new Date();
            date.setHours(lesson.endTime.split(":")[0]);
            return date < new Date();
        }).includes(false)
    }
    
    function checkLessons() {
        while (!lessons[schoolDay] || lessons[schoolDay].length == 0) {
            addDay();
        }
    }
    let schoolDay = new Date().getUTCDay();
    schoolDay = schoolDay >= 7? schoolDay-7 : schoolDay;
    
    if (schoolDay >= 6 || schoolDay == 0) {
        schoolDay = 0
    } else schoolDay--
    
    if (!lessons[schoolDay] || lessons[schoolDay].length == 0) {
        checkLessons()
    } else if (lessonsOver()) {
        addDay();
        checkLessons()
    }

    return schoolDay
}

router.get('/', (req, res, next) => {
    res.render('index', {
        lessons: getLessons()[getDay()],
        day: days[getDay()],
        refreshTimestamp: JSON.parse(fs.readFileSync('./data.json')).data.timestamp
    });
});

module.exports = router;