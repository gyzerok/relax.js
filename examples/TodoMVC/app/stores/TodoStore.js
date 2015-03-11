'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');

var todos = Immutable.OrderedMap();;

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

var TodoStore = Relax.createStore({

    getAll: function () {
        return todos;
    }
});

AppDispatcher.subscribe(TodoStore, {
    'add-todo': add,
    'remove-todo': remove
});

module.exports = TodoStore;