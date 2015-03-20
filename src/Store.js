/* @flow */

var constants = require('./constants');
var EventEmitter = require('./EventEmitter');

class Store extends EventEmitter {
    __dispatcherIndex: number;

    constructor() {
        super();
    }

    /**
     * Triggers change event for the store.
     */
    emitChange(): void {
        this.emit(constants.CHANGE_EVENT);
    }

    /**
     * Registers callback to be invoked on store changes.
     */
    onChange(callback: () => void): void {
        this.on(constants.CHANGE_EVENT, callback);
    }

    /**
     * Unregisters particular callback.
     */
    offChange(callback: () => void): void {
        this.removeListener(constants.CHANGE_EVENT, callback);
    }
}

module.exports = Store;
