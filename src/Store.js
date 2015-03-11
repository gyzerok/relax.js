'use strict';

var constants = require('./constants');
var EventEmitter = require('./EventEmitter');

class Store extends EventEmitter {

    constructor() {
        super();
        this.__dispatcherIndex = null;
    }

    /**
     * Triggers change event for the store.
     */
    emitChange() {
        this.emit(constants.CHANGE_EVENT);
    }

    /**
     * Registers callback to be invoked on store changes.
     *
     * @param {function} callback
     */
    onChange(callback) {
        this.on(constants.CHANGE_EVENT, callback);
    }

    /**
     * Unregisters particular callback.
     *
     * @param {function} callback
     */
    offChange(callback) {
        this.removeListener(constants.CHANGE_EVENT, callback);
    }
}

module.exports = Store;