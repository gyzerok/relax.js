(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":2}],2:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":3}],3:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],4:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var constants = require("./constants");
var FBDispatcher = require("flux").Dispatcher;
var Store = require("./Store");

var Dispatcher = (function (_FBDispatcher) {
    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        if (_FBDispatcher != null) {
            _FBDispatcher.apply(this, arguments);
        }
    }

    _inherits(Dispatcher, _FBDispatcher);

    _createClass(Dispatcher, {
        handleViewAction: {

            /**
             * Dispatches action as a view action.
             *
             * @param {object} action
             */

            value: function handleViewAction(action) {
                this.dispatch({
                    source: constants.VIEW_ACTION,
                    action: action
                });
            }
        },
        handleServerAction: {

            /**
             * Dispatches action as a server action.
             *
             * @param {object} action
             */

            value: function handleServerAction(action) {
                this.dispatch({
                    source: constants.SERVER_ACTION,
                    action: action
                });
            }
        },
        handlePlatformAction: {

            /**
             * Dispatches action as a platform action.
             *
             * @param {object} action
             */

            value: function handlePlatformAction(action) {
                this.dispatch({
                    source: constants.PLATFORM_ACTION,
                    action: action
                });
            }
        },
        handleServiceAction: {

            /**
             * Dispatches action as a service action.
             *
             * @param {object} action
             */

            value: function handleServiceAction(action) {
                this.dispatch({
                    source: constants.SERVICE_ACTION,
                    action: action
                });
            }
        },
        subscribe: {

            /**
             * Registers a Store to be notified about all the actions.
             *
             * @param {Store} store
             * @param {Map<string, function>} actions
             */

            value: function subscribe(store, actions) {
                if (Object.keys(actions).length === 0) throw "You have to provide store for subscription";

                store.__dispatcherIndex = this.register(function (payload) {
                    var action = payload.action;

                    for (var actionType in actions) {
                        if (actionType !== action.actionType) continue;
                        var isDataChanged = actions[actionType](action.data, payload.source);
                        if (isDataChanged) store.emitChange();
                    }
                });
            }
        },
        unsubscribe: {

            /**
             * Removes a callback based on its token.
             *
             * @param {Store} store
             */

            value: function unsubscribe(store) {
                this.unregister(store.__dispatcherIndex);
            }
        },
        await: {

            /**
             * Waits for the callbacks specified to be invoked before continuing execution
             * of the current callback. This method should only be used by a callback in
             * response to a dispatched payload.
             *
             * @param {array<Store>} stores
             */

            value: function await(stores) {
                var ids = stores.map(function (store) {
                    return store.__dispatcherIndex;
                });
                this.waitFor(ids);
            }
        }
    });

    return Dispatcher;
})(FBDispatcher);

module.exports = Dispatcher;
/* @flow */

},{"./Store":8,"./constants":9,"flux":1}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/* @flow */

/* Polyfill indexOf. */
function indexOf(haystack, needle) {
    if (!haystack) {
        return -1;
    }var i = 0;
    var length = haystack.length;
    var idx = -1;
    var found = false;

    while (i < length && !found) {
        if (haystack[i] === needle) {
            idx = i;
            found = true;
        }

        i++;
    }

    return idx;
};

var EventEmitter = (function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        this.__events = {};
    }

    _createClass(EventEmitter, {
        on: {

            /**
             * Registers listener for the event.
             *
             * @param {string} event
             * @param {function} listener
             */

            value: function on(event, listener) {
                if (typeof this.__events[event] !== "object") {
                    this.__events[event] = [];
                }

                this.__events[event].push(listener);
            }
        },
        removeListener: {

            /**
             * Removes listener for the event.
             *
             * @param {string} event
             * @param {function} listener
             */

            value: function removeListener(event, listener) {
                var idx;

                if (typeof this.__events[event] === "object") {
                    idx = indexOf(this.__events[event], listener);

                    if (idx > -1) {
                        this.__events[event].splice(idx, 1);
                    }
                }
            }
        },
        emit: {

            /**
             * Emits the event.
             *
             * @param {string} event
             */

            value: function emit(event) {
                var i,
                    listeners,
                    length,
                    args = [].slice.call(arguments, 1);

                if (typeof this.__events[event] === "object") {
                    listeners = this.__events[event].slice();
                    length = listeners.length;

                    for (i = 0; i < length; i++) {
                        listeners[i].apply(this, args);
                    }
                }
            }
        }
    });

    return EventEmitter;
})();

module.exports = EventEmitter;

},{}],7:[function(require,module,exports){
"use strict";

/*
 * Copyright (c) 2015, Fedor Nezhivoy
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */

var constants = require("./constants");
var assign = require("object-assign");
var Dispatcher = require("./Dispatcher");
var Store = require("./Store");

var Relax = {

    VIEW_ACTION: constants.VIEW_ACTION,
    SERVER_ACTION: constants.SERVER_ACTION,
    PLATFORM_ACTION: constants.PLATFORM_ACTION,
    SERVICE_ACTION: constants.SERVICE_ACTION,

    Dispatcher: Dispatcher,
    Store: Store,

    /**
     * Creates new singleton store.
     *
     * @param {object} opts
     * @returns {Store}
     */
    createStore: function createStore(opts) {
        opts = opts || {};
        return assign(new Store(), opts);
    },

    /**
     * Creates new singleton dispatcher
     *
     * @param {object} opts
     * @returns {Dispatcher}
     */
    createDispatcher: function createDispatcher(opts) {
        opts = opts || {};
        return assign(new Dispatcher(), opts);
    }
};

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Relax;
} else if (typeof define === "function" && define.amd) {
    define([], function () {
        return Relax;
    });
} else {
    window.Relax = Relax;
}

},{"./Dispatcher":5,"./Store":8,"./constants":9,"object-assign":4}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/* @flow */

var constants = require("./constants");
var EventEmitter = require("./EventEmitter");

var Store = (function (_EventEmitter) {
    function Store() {
        _classCallCheck(this, Store);

        _get(Object.getPrototypeOf(Store.prototype), "constructor", this).call(this);
    }

    _inherits(Store, _EventEmitter);

    _createClass(Store, {
        emitChange: {

            /**
             * Triggers change event for the store.
             */

            value: function emitChange() {
                this.emit(constants.CHANGE_EVENT);
            }
        },
        onChange: {

            /**
             * Registers callback to be invoked on store changes.
             *
             * @param {function} callback
             */

            value: function onChange(callback) {
                this.on(constants.CHANGE_EVENT, callback);
            }
        },
        offChange: {

            /**
             * Unregisters particular callback.
             *
             * @param {function} callback
             */

            value: function offChange(callback) {
                this.removeListener(constants.CHANGE_EVENT, callback);
            }
        }
    });

    return Store;
})(EventEmitter);

module.exports = Store;

},{"./EventEmitter":6,"./constants":9}],9:[function(require,module,exports){
"use strict";

module.exports = {
    CHANGE_EVENT: "relax:change",
    VIEW_ACTION: "VIEW_ACTION",
    SERVER_ACTION: "SERVER_ACTION",
    PLATFORM_ACTION: "PLATFORM_ACTION",
    SERVICE_ACTION: "SERVICE_ACTION"
};

},{}]},{},[7]);
