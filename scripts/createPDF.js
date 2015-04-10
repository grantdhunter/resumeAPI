var express = require('express');
var renderer = require('../render');
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require('fs');
var path = require('path');

var name = process.argv[2];
var date = new Date();
var dateStr = date.toDateString().replace(/\s/g,'-');

var app = express();

app.use(express.static(path.join(__dirname, '/../public')));

app.get('/', function(req, res) {
    fs.readFile('./resume/' + name + '.json', function(err, data) {
	if(err) return console.error(err);
	res.send(renderer.render(JSON.parse(data)));
    });
});

app.listen(8123);

wkhtmltopdf('http://localhost:8123/', { 
    output: './pdf/grant-hunter-' + dateStr + '-' + name + '.pdf',
    pageSize: 'letter'
}, function(code, signal){
    process.exit(0);
});

