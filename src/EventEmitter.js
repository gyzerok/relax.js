'use strict';

/* Polyfill indexOf. */
var indexOf;

if (typeof Array.prototype.indexOf === 'function') {
    indexOf = function (haystack, needle) {
        return haystack.indexOf(needle);
    };
} else {
    indexOf = function (haystack, needle) {
        var i = 0, length = haystack.length, idx = -1, found = false;

        while (i < length && !found) {
            if (haystack[i] === needle) {
                idx = i;
                found = true;
            }

            i++;
        }

        return idx;
    };
};


/* Polyfill EventEmitter. */
var EventEmitter = function () {
    this.__events = {};
};

EventEmitter.prototype.on = function (event, listener) {
    if (typeof this.__events[event] !== 'object') {
        this.__events[event] = [];
    }

    this.__events[event].push(listener);
};

EventEmitter.prototype.removeListener = function (event, listener) {
    var idx;

    if (typeof this.__events[event] === 'object') {
        idx = indexOf(this.__events[event], listener);

        if (idx > -1) {
            this.__events[event].splice(idx, 1);
        }
    }
};

EventEmitter.prototype.emit = function (event) {
    var i, listeners, length, args = [].slice.call(arguments, 1);

    if (typeof this.__events[event] === 'object') {
        listeners = this.__events[event].slice();
        length = listeners.length;

        for (i = 0; i < length; i++) {
            listeners[i].apply(this, args);
        }
    }
};