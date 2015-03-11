'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
    add(data) {
        AppDispatcher.handleViewAction({
            actionType: 'add-todo',
            data: data
        });
    },

    remove(data) {
        AppDispatcher.handleViewAction({
            actionType: 'remove-todo',
            data: data
        });
    }
};