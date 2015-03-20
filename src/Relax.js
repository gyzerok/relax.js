/*
 * Copyright (c) 2015, Fedor Nezhivoy
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 /* @flow */

var constants = require('./constants');
var assign = require('object-assign');
var Dispatcher = require('./Dispatcher');
var Store = require('./Store');

Object.assign = Object.assign || assign;

var Relax = {

    VIEW_ACTION: constants.VIEW_ACTION,
    SERVER_ACTION: constants.SERVER_ACTION,
    PLATFORM_ACTION: constants.PLATFORM_ACTION,
    SERVICE_ACTION: constants.SERVICE_ACTION,

    Dispatcher: Dispatcher,
    Store: Store,

    /**
     * Creates new singleton store.
     */
    createStore(opts: Object = {}): Store {
        return Object.assign(new Store, opts);
    },

    /**
     * Creates new singleton dispatcher
     */
    createDispatcher(opts: Object = {}): Dispatcher {
        return Object.assign(new Dispatcher, opts);
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
