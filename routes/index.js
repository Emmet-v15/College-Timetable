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


let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
let today = new Date().getDay()-1;

while (!lessons[today].length) {
    today++;
    today = today >= 5? 0 : today;
}
    
!lessons[today].map(lesson => {
    let date = new Date();
    date.setHours(lesson.endTime.split(":")[0]);
    return date < new Date();
}).includes(false)? today++ : null;

router.get('/', (req, res, next) => {

    res.render('index', {
        lessons: lessons[today],
        day: days[today],
        refreshTimestamp: data.timestamp
    });
});

module.exports = router;