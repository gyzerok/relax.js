'use strict';

module.exports = function (grunt) {

    grunt.config.set('browserify', {
        app: {
            options: {
                debug: false,
                transform: [
                    'babelify'
                ]
            },
            src: 'src/Relax.js',
            dest: 'dist/Relax.js'
        },

        todomvc: {
            options: {
                debug: false,
                transform: [
                    'babelify'
                ],
            },
            src: 'examples/TodoMVC/app/index.js',
            dest: 'examples/TodoMVC/assets/js/bundle.js'
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
};