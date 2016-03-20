var express = require('express');
var app = express();
var PORT = process.env.PORT || 3100;

app.get('/', function (req, res) {
	res.send('To Do API root');
});

app.listen(PORT, function() {
	console.log('Express Server Started on '+ PORT);
});