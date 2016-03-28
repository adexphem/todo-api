var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3100;
var todoNextId = 1;

app.use(bodyParser.json());

var todos = [];

app.get('/', function (req, res) {
	res.send('To Do API root');
});

/* GET /todos?completed=true */
app.get('/todos', function(req, res) {
	var query = req.query;
	var conditions = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		conditions.completed = JSON.parse(query.completed);
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		conditions.completed = JSON.parse(query.completed);
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		conditions.description = {
			$like: '%' +  query.q.trim() + '%'
		};
	};

	db.todo.findAll({
		where: conditions
	}).then(function (todos) {
		if (todos) {
			res.json(todos);
		} else {
			res.status(200).send('No Data found');
		}
	}, function (e) {
		res.status(505).send(e);
	})

	//res.json(filteredTodos);
})

/* GET /todos/:id */
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var todoMatchCase = _.findWhere(todos, {id: todoId});

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
})

/* POST to add todos*/
app.post('/todos', function(req, res) {
	var body = req.body;
	var response = {
		error: 'Failure'
	}

	body = _.pick(body, 'description', 'completed');

	db.todo.create({
		description: body.description.trim(),
		completed: body.completed 
	}).then(function (todos){
		console.log('saved!');
		res.status(202).json(todos.toJSON());
	}).catch(function (e) {
		console.log(e);
		res.status(404).json(e.TypeError);
	});
});

/* DELETE /todos/:id */
app.delete('/todos/:id', function(req, res) {
	var todoIdToDelete = parseInt(req.params.id);
	var todoArrayMatch = _.findWhere(todos, {id: todoIdToDelete});

	var errorMessage = {
		error: 'No todo Id: ' + todoIdToDelete + ' found'
	};

	if (!todoArrayMatch) {
		res.status(404).json(errorMessage);
	} else {
		todos = _.without(todos, todoArrayMatch);
		res.json(todoArrayMatch);
	}
});

/* PUT /todos/:id */
app.put('/todos/:id', function(req, res) {
	var body = req.body;
	var validAttributes = {};

	var todoId = parseInt(req.params.id);
	var todoArrayMatch = _.findWhere(todos, {id: todoId});

	if (!todoArrayMatch) {
		return res.status(404).send();
	} 

	body = _.pick(body, 'description', 'completed');
	
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')) {
		return res.status(404).send();
	}

	_.extend(todoArrayMatch, validAttributes); 
	res.json(todoArrayMatch);
})

db.sequelize.sync().then(function (){
	app.listen(PORT, function() {
		console.log('Express Server Started on '+ PORT);
	});
})















