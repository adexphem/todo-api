var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt')

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

	db.todo.findById(todoIdToDelete).then(function (todo) {
		if (!!todo) {
			db.todo.destroy({
			    where: {
			        id: todoIdToDelete
			    }
			}).then(function (todo) {
				res.status(200).send({
					status: 'success',
					response: 'Todo with ID ' + todoIdToDelete + ' found and removed.'
				});
			})
		} else {
			res.status(404).send({
				status: 'failure',
				response: 'Todo with ID ' + todoIdToDelete + ' not found'
			});
		}
	}, function(e) {
		res.status(500).send();
	});
});

/* PUT /todos/:id */
app.put('/todos/:id', function(req, res) {
	var body = req.body;
	var attributes = {};

	var todoId = parseInt(req.params.id);

	body = _.pick(body, 'description', 'completed');
	
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	} 

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function (todo) {
		if (todo) {
			return todo.update(attributes);
		} else {
			res.json(404).send();
		}
	}, function () {
		res.status(500).send();
	}).then(function (todo){
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});


/* POST to add user accounts*/
app.post('/users', function(req, res) {
	var body = req.body;
	var response = {
		error: 'Failure'
	}

	body = _.pick(body, 'email', 'password');

	db.user.create({
		email: body.email.trim(),
		password: body.password 
	}).then(function (user){
		console.log('User saved!');
		res.status(202).json(user.toPublicJSON());
	}).catch(function (e) {
		res.status(400).json(e);
	});
});

/* User login */
app.post('/users/login', function(req, res) {
	var body = req.body;

	var response = {
		error: 'Failure',
		message: 'Invalid params'
	}

	body = _.pick(body, 'email', 'password');

	db.user.authenticate(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function () {
		res.status(401).send();
	});
});

db.sequelize.sync({force: true}).then(function () {
	app.listen(PORT, function() {
		console.log('Express Server Started on '+ PORT);
	});
});















