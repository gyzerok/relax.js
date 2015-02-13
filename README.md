Relax.js
========

This is an implementation of Flux pattern with strongly point on incapsulation.

## Instalation

    npm install relax.js --save

## Usage

For the first we creates a simple Dispatcher.
```javascript
// AppDispatcher.js

module.exports = Relax.createDispatcher();
```

Then simple Store with just one action.
**Note:** The return value for an action must be a boolean value which indicates should the Store emits change event or not.
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

If you dont want to create Actions module, you not have to. Just you ```handleViewAction``` and ```handleServerAction``` Dispatcher methods.
```javascript
// SomeActions.js

var AppDispatcher = require('./AppDispatcher');

module.exports = {
    append: function (data) {
        // An actionType have to be same as a key of the object passed to Dispatcher.subscribe
        AppDispatcher.handleViewAction(
            actionType: 'appendData',
            data: data
        );
    }
};
```

## Tests

    npm test

## Release history

* 0.1.0 - Initial release