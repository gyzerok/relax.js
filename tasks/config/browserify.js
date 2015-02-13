'use strict';

module.exports = function (grunt) {

    grunt.config.set('browserify', {
        app: {
            options: {
                debug: false
            },
            src: 'src/Relax.js',
            dest: 'dist/Relax.js'
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
};