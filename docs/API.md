Relax API
=========

## Actions (ActionCreators)

Describe actions here

## Dispatcher API

Dispatcher is used to broadcast actions to registered Stores.
Check out [Relax.js](https://github.com/gyzerok/relax.js/blob/master/src/Relax.js) for source code.

### Dispatcher.handleViewAction(action: Object)
Dispatchers action as a view action (```payload.source == VIEW_ACTION```).

### Dispatcher.handleServerAction(action: Object)
Dispatchers action as a view action (```payload.source == SERVER_ACTION```).

### Dispatcher.subscribe(Store: Store, actions: Object)
Registers Store for a given set of actions. Actions object 

## Store API

Stores are your model layer. You can register Stores to handle any of actions and the notify your views about ones changes.
Check out [Relax.js](https://github.com/gyzerok/relax.js/blob/master/src/Relax.js) for source code.

### Store.onChange(callback: Function)
Registers ```callback``` for the Store change event.
```javascript
function storeDidChange() {
    // Ask FooStore for it's current state and do something with it
}
FooStore.onChange(storeDidChange);
```

### Store.offChange(callback: Function)
Unregisters ```callback``` for the Store change event.
```javascript
function storeDidChange() {
    // Ask FooStore for it's current state and do something with it
}
FooStore.offChange(storeDidChange);
```

### Store.emitChange()
Emits Store change event. All registered callbacks would be invoked after this call.
