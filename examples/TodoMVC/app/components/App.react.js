'use strict';

var TodoActions = require('../actions/TodoActions');
var TodoStore = require('../stores/TodoStore');
var InputText = require('./InputText.react');
var TodoList = require('./TodoList.react');

var TodoApp = React.createClass({

    getInitialState() {
        return { todos: TodoStore.getAll() };
    },

    componentDidMount() {
        TodoStore.onChange(this.storeDidChanged);
    },

    componentWillUnmount() {
        TodoStore.offChange(this.storeDidChanged);
    },

    storeDidChanged() {
        this.replaceState({
            todos: TodoStore.getAll()
        })
    },

    render() {
        return (
            <div id="application">
                <InputText
                    id="new-todo"
                    value=""
                    onSave={this.onSave}
                />
                <TodoList
                    todos={this.state.todos}
                    onRemove={this.onRemove}
                />
            </div>
        )
    },

    onSave(text) {
        TodoActions.add({ text: text });
    },

    onRemove(id) {
        TodoActions.remove({ id: id });
    }
});

module.exports = TodoApp;