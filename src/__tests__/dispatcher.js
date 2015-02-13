/*
 * Copyright (c) 2014, Fedor Nezhivoy
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

jest.autoMockOff();
__DEV__ = true;

describe('Dispatcher', function () {
    var Relax = require('../../dist/Relax');
    var Dispatcher;

    var StoreA;
    var StoreB;
    var callbackA;
    var callbackB;

    beforeEach(function () {
        Dispatcher = Relax.createDispatcher();

        StoreA = { emitChange: jest.genMockFunction() };
        StoreB = { emitChange: jest.genMockFunction() };

        callbackA = jest.genMockFn();
        callbackB = jest.genMockFn();
    });

    it('should invoke all registered stores actions', function () {
        Dispatcher.subscribe(StoreA, { 'callbackA': callbackA });
        Dispatcher.subscribe(StoreB, { 'callbackB': callbackB });

        var actionA = { actionType: 'callbackA', data: {} };
        var actionB = { actionType: 'callbackB', data: {} };

        Dispatcher.handleViewAction(actionA);
        Dispatcher.handleViewAction(actionB);

        expect(callbackA.mock.calls.length).toBe(1);
        expect(callbackB.mock.calls.length).toBe(1);

        expect(callbackA.mock.calls[0][0], actionA.data);
        expect(callbackB.mock.calls[0][0], actionB.data);

        Dispatcher.handleServerAction({ actionType: 'callbackA', data: {} });
        Dispatcher.handleServerAction({ actionType: 'callbackB', data: {} });

        expect(callbackA.mock.calls.length).toBe(2);
        expect(callbackB.mock.calls.length).toBe(2);

        expect(callbackA.mock.calls[0][0], actionA.data);
        expect(callbackB.mock.calls[0][0], actionB.data);
    });
});