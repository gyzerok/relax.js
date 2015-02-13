Relax.js
========

This is an implementation of Flux pattern with strongly point on incapsulation.

## Instalation

    npm install relax.js --save

## Usage

```javascript
// AppDispatcher.js

module.exports = Relax.createDispatcher();
```

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

```javascript
// SomeActions.js

var AppDispatcher = require('./AppDispatcher');

module.exports = {
    append: function (data) {
        AppDispatcher.handleViewAction(
            actionType: 'appendData', // This type have to be same as a key of the object passed to Dispatcher.subscribe
            data: data
        );
    }
};
```

## Tests

    npm test

## Release history

* 0.1.0 - Initial release