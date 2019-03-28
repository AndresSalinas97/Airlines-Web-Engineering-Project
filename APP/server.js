const express = require('express')
var path = require('path'); 

const app = express()
const port = 3000

//media
app.get('/media/plane.png', function (req, res) {
    res.sendFile(path.join(__dirname + '/media/plane.png'));
});

//scripts
app.get('/scripts/airports.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/scripts/airports.js'));
});
app.get('/scripts/carriers.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/scripts/carriers.js'));
});
app.get('/scripts/rankings.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/scripts/rankings.js'));
});
app.get('/scripts/statistics.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/scripts/statistics.js'));
});

//style
app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/style.css'));
});

//index
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//pages
app.get('/pages/airports.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/airports.html'));
});

app.get('/pages/carriers.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/carriers.html'));
});

app.get('/pages/rankings.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/rankings.html'));
});
app.get('/pages/statistics.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/statistics.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`))

