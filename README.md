Relax.js
========

This is a tiny, framework agnostic implementation of the Flux pattern inspired by the [DeLorean](https://github.com/deloreanjs/delorean), but closer to the original Facebook approach with a data incapsulation.

It is highly recommended to use it with the Facebook [Immutable](https://github.com/facebook/immutable-js) library.

## Installation

    npm install relax.js --save

## Usage

First of all let's create a simple Dispatcher.
```javascript
// AppDispatcher.js

module.exports = Relax.createDispatcher();
```

Then, make a simple Store with just one action.

**Note:** The return value for the data modification function have to be a boolean value which indicates whether Store changes event or not.
```javascript
// SomeStore.js

var AppDispatcher = require('./AppDispatcher');

var collection = [];

function appendData(data) {
    collection.push(data);

    return true;
}

var SomeStore = Relax.createStore({
    getAll: function () {
        return data;
    }
});
AppDispatcher.subscribe(SomeStore, {
    'appendData': appendData
});

module.exports = SomeStore;
```

If you don't want to create Actions module, you don't have to. Just use ```handleViewAction``` and ```handleServerAction``` Dispatcher methods.
```javascript
// SomeActions.js

var AppDispatcher = require('./AppDispatcher');

module.exports = {
    append: function (data) {
        // An actionType have to be same as a key of the object
        // passed to Dispatcher.subscribe()
        AppDispatcher.handleViewAction(
            actionType: 'appendData',
            data: data
        );
    }
};
```

Now we can create a simple view to close the Flux cycle.
```javascript
// SomeView.js

var SomeStore = require('./SomeStore');
var SomeActions = require('./SomeActions');

function storeDidChange() {
    var collection = SomeStore.getAll();

    // Any rendering process here
}

function onAnyElementClick(e) {
    var data;

    // extract data from the view

    SomeActions.append(data);
}

SomeStore.onChange(storeDidChange);

// Some more logic...

SomeStore.offChange(storeDidChange);
```

## Tests

    npm test

**Note:** Tests for now are under development.

## Release history

* **0.1.1**: First working release
* **0.1.0**: Initial release