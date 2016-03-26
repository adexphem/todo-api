var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': 'basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

sequelize.sync({
	//force: true
}).then(function () {

	Todo.findById(200).then(function (todo){
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Not found');
		}
	})

	/*Todo.create({
		description: 'Its good friday'
	}).then(function (todo) {
		return Todo.create({
			description: 'Reall easter time'
		});
	}).then(function (){
		//return Todo.findById(1)

		return Todo.findAll({
			where: {
				description: {
					$like: '%friday%'
				}
			}
		});
	}).then(function (todos){
		if (todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			})
		} else {
			consoe.log('no todo found');
		}
	}).catch(function (e) {
		console.log(e);
	})*/
});