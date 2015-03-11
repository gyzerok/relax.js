'use strict';

// React and Immutable are globals since them were added on the page
//global.React = require('react');
//global.Immutable = require('immutable');
global.Relax = require('../../../lib/Relax');
var App = require('./components/App.react.js');

React.render(
    <App />,
    document.getElementById('root')
);