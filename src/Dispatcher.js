'use strict';

var constants = require('./constants');
var FBDispatcher = require('flux').Dispatcher;

class Dispatcher extends FBDispatcher {

    /**
     * Dispatches action as a view action.
     *
     * @param {object} action
     */
    handleViewAction(action) {
        this.dispatch({
            source: constants.VIEW_ACTION,
            action: action
        });
    }

    /**
     * Dispatches action as a server action.
     *
     * @param {object} action
     */
    handleServerAction(action) {
        this.dispatch({
            source: constants.SERVER_ACTION,
            action: action
        });
    }

    /**
     * Dispatches action as a platform action.
     *
     * @param {object} action
     */
    handlePlatformAction(action) {
        this.dispatch({
            source: constants.PLATFORM_ACTION,
            action: action
        });
    }

    /**
     * Registers a Store to be notified about all the actions.
     *
     * @param {Store} store
     * @param {map<string, function>} actions
     */
    subscribe(store, actions) {
        if (actions === {}) throw 'You have to provide store for subscription';

        store.__dispatcherIndex = this.register(function (payload) {
            var action = payload.action;

            for (var actionType in actions) {
                if (actionType !== action.actionType) continue;
                var isDataChanged = actions[actionType](action.data, payload.source);
                if (isDataChanged) store.emitChange();
            }
        });
    }

    /**
     * Removes a callback based on its token.
     *
     * @param {Store} store
     */
    unsubscribe(store) {
        this.unregister(store.__dispatcherIndex);
    }

    /**
     * Waits for the callbacks specified to be invoked before continuing execution
     * of the current callback. This method should only be used by a callback in
     * response to a dispatched payload.
     *
     * @param {array<Store>} stores
     */
    await(stores) {
        var ids = stores.map(function (store) {
            return store.__dispatcherIndex;
        });
        this.waitFor(ids);
    }
}

module.exports = Dispatcher;