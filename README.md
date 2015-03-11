Relax.js
========

This is a tiny, framework agnostic implementation of the [Flux](https://github.com/facebook/flux) pattern inspired by the [DeLorean](https://github.com/deloreanjs/delorean), but closer to the original Facebook approach with data incapsulation.

Relax doesn't force you to use any additional conventions. It just gives you an ability to move on without writing too much boilerplate code. Since Relax Dispatcher uses Facebook Dispatcher you can access original methods though Relax provide you bunch of more convenient wrappers for them.

It is highly recommended to use it with the Facebook [Immutable](https://github.com/facebook/immutable-js) library for more Store data privacy.

## Installation

Using Node Package Manager:

    npm install relax.js --save

Using Bower:

    bower install relax.js --save

## Examples

You can check the [TodoMVC](https://github.com/gyzerok/relax.js/tree/master/examples/TodoMVC) example on http://127.0.0.1:1337 after executing

    grunt todomvc
    
**Note:** Example uses ECMAScript 2015 syntax.

## Usage

First of all let's create a simple Dispatcher.
```javascript
// AppDispatcher.js

module.exports = Relax.createDispatcher();
```

If you don't want to create Actions module, you don't have to. Just use ```handleViewAction``` and ```handleServerAction``` Dispatcher methods.
```javascript
// SomeActions.js

var AppDispatcher = require('./AppDispatcher');

module.exports = {
    append: function (data) {
        /**
        * An actionType have to be same as a key of the object
        * passed to Dispatcher.subscribe() method.
        */
        AppDispatcher.handleViewAction(
            actionType: 'appendData',
            data: data
        );
    }
};
```

Then, make a simple Store with just one action.

**Note:** The return value for the data modification function have to be a boolean value which indicates whether Store emits change event or not.
```javascript
// SomeStore.js

var AppDispatcher = require('./AppDispatcher');

var collection = [];

function appendData(data, source) {
    /** 
    * Source parameter corresponds to Relax.VIEW_ACTION or Relax.SERVER_ACTION
    * it depends on usage of Dispatcher.handleViewAction() or Dispatcher.handleServerAction()
    */
    switch (source) {
        case Relax.VIEW_ACTION:
            // code
            break;
        case Relax.SERVER_ACTION:
            //code
            break;
    }
    
    /**
    * Data parameter corresponds to the data of an action
    * passed to Dispatcher.handleViewAction() or Dispatcher.handleServerAction()
    */
    collection.push(data);

    return true; // Return value here indicates whether Store emits change event or not
}

var SomeStore = Relax.createStore({
    getAll: function () {
        return collection;
    }
});

/**
* Keys for second parameter are actionTypes of the actions
* passed to Dispatcher.handleViewAction() aor Dispatcher.hnadleServerAction()
*/
AppDispatcher.subscribe(SomeStore, {
    'appendData': appendData
});

module.exports = SomeStore;
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

## License

[Relax.js](https://github.com/gyzerok/relax.js) is MIT-licensed.
