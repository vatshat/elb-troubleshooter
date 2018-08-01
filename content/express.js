var express = require('express');
var url = require('url');
var path = require('path');

// https://stackoverflow.com/questions/26203725/how-to-allow-for-webpack-dev-server-to-allow-entry-points-from-react-router

var app = express();



app.use('/img', express.static(path.join(__dirname, '../assets/img')));
app.use('/js', express.static(path.join(__dirname, '../assets/js')));
app.use('/css', express.static(path.join(__dirname, '../assets/css')));
app.use('/', express.static(path.join(__dirname, '../assets/')));

app.all('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname, '../assets/index.html'));
});

app.listen(5000);