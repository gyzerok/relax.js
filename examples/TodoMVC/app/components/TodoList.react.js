'use strict';

var TodoItem = require('./TodoItem.react');

var TodoList = React.createClass({

    render() {
        var todos = this.props.todos.map(function (todo) {
            return (
                <TodoItem
                    key={todo.id}
                    id={todo.id}
                    text={todo.text}
                    onRemove={this.props.onRemove}
                />
            )
        }, this);

        return (
            <ul>{todos.toArray()}</ul>
        );
    }
});

module.exports = TodoList;