var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3100;
var todoNextId = 1;

app.use(bodyParser.json());

var todos = [];

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
	var todoMatchCase = _.findWhere(todos, {id: todoId});

	if (todoMatchCase) {
		res.json(todoMatchCase);
	} else {
		res.status(404).send();
	}
})

/* POST to add todos*/
app.post('/todos', function(req, res) {
	var body = req.body;

	body = _.pick(body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(404).send();
	} else {
		body.id = todoNextId;
		body.description = body.description.trim();
		todoNextId++;
		todos.push(body);
	}
	res.json(body);
});

app.listen(PORT, function() {
	console.log('Express Server Started on '+ PORT);
});













