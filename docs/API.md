Relax API
=========

## Dispatcher API

###hadleViewAction(action: Object)
Dispatchers action as a view action (```payload.source == VIEW_ACTION```)

###hadleServerAction(action: Object)
Dispatchers action as a view action (```payload.source == SERVER_ACTION```)

###subscribe(Store: Store, actions: Object)
Registers Store for a given set of actions

## Store API

* Store.emitChange() - emits Store change event
* Store.onChange(callback) - registers ```callback``` for the Store change event.
* Store.offChange(callback) - unregisteres ```callback``` for the Store change event