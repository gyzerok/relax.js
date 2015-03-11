'use strict';

module.exports = function (grunt) {

    grunt.registerTask('todomvc', [
        'browserify:todomvc',
        'connect'
    ]);
};