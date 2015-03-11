'use strict';

var constants = require('./constants');
var EventEmitter = require('./EventEmitter');

class Store extends EventEmitter {

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
    onChange(cb) {
        this.on(constants.CHANGE_EVENT, cb);
    }

    /**
     * Unregisters particular callback.
     *
     * @param {function} callback
     */
    offChange(cb) {
        this.removeListener(constants.CHANGE_EVENT, cb);
    }
}

module.exports = Store;