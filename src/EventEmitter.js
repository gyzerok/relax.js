/* @flow */

/* Polyfill indexOf. */
function indexOf(haystack: ?Array<Function>, needle: Function): number {
    if (!haystack) return -1;
    var i = 0;
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

class EventEmitter {
    __events: Object<string, Array<Function>>;

    constructor() {
        this.__events = {};
    }

    /**
     * Registers listener for the event.
     *
     * @param {string} event
     * @param {function} listener
     */
    on(event: string, listener: Function): void {
        if (typeof this.__events[event] !== 'object') {
            this.__events[event] = [];
        }

        this.__events[event].push(listener);
    }

    /**
     * Removes listener for the event.
     *
     * @param {string} event
     * @param {function} listener
     */
    removeListener(event: string, listener: Function) {
        var idx;

        if (typeof this.__events[event] === 'object') {
            idx = indexOf(this.__events[event], listener);

            if (idx > -1) {
                this.__events[event].splice(idx, 1);
            }
        }
    }

    /**
     * Emits the event.
     *
     * @param {string} event
     */
    emit(event: string) {
        var i, listeners, length, args = [].slice.call(arguments, 1);

        if (typeof this.__events[event] === 'object') {
            listeners = this.__events[event].slice();
            length = listeners.length;

            for (i = 0; i < length; i++) {
                listeners[i].apply(this, args);
            }
        }
    }
}

module.exports = EventEmitter;
