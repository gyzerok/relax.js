'use strict';


module.exports = function (grunt) {

    grunt.config.set('connect', {
        server: {
            options: {
                port: 1337,
                keepalive: true,
                base: {
                    path: 'examples/TodoMVC',
                    options: {
                        index: 'index.html'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
};