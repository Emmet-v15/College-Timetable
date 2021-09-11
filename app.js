const express = require('express');
const path = require('path');

var routes = require('./routes/index');

var app = express();

app.set('view engine', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;