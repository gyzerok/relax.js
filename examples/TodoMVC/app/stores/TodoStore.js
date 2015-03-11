'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');

var todos = Immutable.OrderedMap();

function add(data) {
    var id = Date.now();
    todos = todos.set(id, {
        id: id,
        text: data.text
    });

    return true;
}

function remove(data) {
    todos = todos.delete(data.id);

    return true;
}

class TodoStore extends Relax.Store {
    getAll() {
        return todos;
    }
}
var todoStore = new TodoStore;

AppDispatcher.subscribe(todoStore, {
    'add-todo': add,
    'remove-todo': remove
});

module.exports = todoStore;