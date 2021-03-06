/* @flow */

type Action = {
    actionType: string;
    data: mixed;
};

var constants = require('./constants');
var FBDispatcher = require('flux').Dispatcher;
var Store = require('./Store');

class Dispatcher extends FBDispatcher {

    /**
     * Dispatches action as a view action.
     */
    handleViewAction(action: Action): void {
        this.dispatch({
            source: constants.VIEW_ACTION,
            action: action
        });
    }

    /**
     * Dispatches action as a server action.
     */
    handleServerAction(action: Action): void {
        this.dispatch({
            source: constants.SERVER_ACTION,
            action: action
        });
    }

    /**
     * Dispatches action as a platform action.
     */
    handlePlatformAction(action: Action): void {
        this.dispatch({
            source: constants.PLATFORM_ACTION,
            action: action
        });
    }

    /**
     * Dispatches action as a service action.
     */
    handleServiceAction(action: Action): void {
        this.dispatch({
            source: constants.SERVICE_ACTION,
            action: action
        });
    }

    /**
     * Registers a Store to be notified about all the actions.
     */
    subscribe(store: Store, actions: Object<string, Function>): void {
        if (Object.keys(actions).length === 0) throw 'You have to provide store for subscription';

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
     */
    unsubscribe(store: Store) {
        this.unregister(store.__dispatcherIndex);
    }

    /**
     * Waits for the callbacks specified to be invoked before continuing execution
     * of the current callback. This method should only be used by a callback in
     * response to a dispatched payload.
     */
    await(stores: Array<Store>): void {
        var ids = stores.map(store => store.__dispatcherIndex);
        this.waitFor(ids);
    }
}

module.exports = Dispatcher;
