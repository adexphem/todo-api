var express = require('express');
var app = express();
var PORT = process.env.PORT || 3100;

var todos = [{
	id: 1,
	decription: 'Through with the tutorial?',
	completed: false
},
{
	id: 2,
	description: 'Get the laravel videos',
	completed: true
},
{
	id: 3,
	description: 'Arrange class for teenagers in church',
	completed: false
}];

app.get('/', function (req, res) {
	res.send('To Do API root');
});

/* GET /todos */
app.get('/todos', function(req, res) {
	res.json(todos);
})

/* GET /todos/:id */
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var todoMatchCase;

	todos.forEach(function(itemObj) {
		console.log(itemObj.id + ' ' + todoId);
		if (itemObj.id === todoId) {
			console.log(itemObj.id + ' ' + todoId);
			todoMatchCase = itemObj;
		}
	});

	if (todoMatchCase) {
		res.json(todoMatchCase);
	} else {
		res.status(404).send();
	}
})

app.listen(PORT, function() {
	console.log('Express Server Started on '+ PORT);
});
