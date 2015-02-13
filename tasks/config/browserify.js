'use strict';

module.exports = function (grunt) {

    grunt.config.set('browserify', {
        app: {
            options: {
                debug: false,
                watch: true,
                keepAlive: true,
                transform: [
                    ['uglifyify', { global: true }]
                ]
            },
            src: 'src/index.js',
            dest: 'dist/Relax.js'
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
};