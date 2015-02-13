/*
 * Copyright (c) 2014, Fedor Nezhivoy
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var FBDispatcher = require('flux').Dispatcher;
var EventEmitter = require('./EventEmitter');
var assign = require('object-assign');

var CHANGE_EVENT = 'relax:change';

var Relax = {

    /**
     * Creates new singleton store.
     *
     * @param {object} opts
     * @returns {object}
     */
    createStore: function (opts) {
        opts = opts || {};

        var Store = assign(new EventEmitter, {

            /**
             * Triggers change event for the store.
             */
            emitChange: function () {
                this.emit(CHANGE_EVENT);
            },

            /**
             * Registers callback to be invoked on store changes.
             *
             * @param {function} callback
             */
            onChange: function (callback) {
                this.on(CHANGE_EVENT, callback);
            },

            /**
             * Unregisters particular callback.
             *
             * @param {function} callback
             */
            offChange: function (callback) {
                this.removeListener(CHANGE_EVENT, callback);
            }
        }, opts);

        return Store;
    },

    /**
     * Creates new singleton dispatcher
     *
     * @param {object} opts
     * @returns {object}
     */
    createDispatcher: function (opts) {
        opts = opts || {};

        var Dispatcher = assign(new FBDispatcher(), {

            /**
             * Dispatches action as a view action.
             *
             * @param {object} action
             */
            handleViewAction: function(action) {
                this.dispatch({
                    source: 'VIEW_ACTION',
                    action: action
                });
            },

            /**
             * Dispatches action as a server action.
             *
             * @param {object} action
             */
            handleServerAction: function (action) {
                this.dispatch({
                    source: 'SERVER_ACTION',
                    action: action
                });
            },

            /**
             * Registers a Store to be notified about all the actions.
             *
             * @param {object} Store
             * @param {map<string, function>} actions
             */
            subscribe: function (Store, actions) {
                if (actions === {}) throw new Error('You have to provide store for subscription');

                Store.__dispatcherIndex = this.register(function (payload) {
                    var action = payload.action;

                    for (var actionType in actions) {
                        if (actionType !== action.actionType) continue;
                        var isDataChanged = actions[actionType](action.data, payload.source);
                        if (isDataChanged) Store.emitChange();
                    }
                });
            },

            /**
             * Removes a callback based on its token.
             *
             * @param {object} Store
             */
            unsubscribe: function(Store) {
                this.unregister(Store.__dispatcherIndex);
            },

            /**
             * Waits for the callbacks specified to be invoked before continuing execution
             * of the current callback. This method should only be used by a callback in
             * response to a dispatched payload.
             *
             * @param {array<object>} stores
             */
            await: function (stores) {
                var ids = stores.map(function (Store) {
                    return Store.__dispatcherIndex;
                });
                this.waitFor(ids);
            }
        }, opts);

        return Dispatcher;
    }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Relax;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        return Relax;
    });
}
else {
    window.Relax = Relax;
}