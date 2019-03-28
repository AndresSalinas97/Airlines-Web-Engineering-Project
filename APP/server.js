const express = require('express')
var path = require('path'); 

const app = express()
const port = 3000

app.get('/media/plane.png', function (req, res) {
    res.sendFile(path.join(__dirname + '/media/plane.png'));
});

app.get('/app.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/app.js'));
});

app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/style.css'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/pages/airports.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/airports.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

