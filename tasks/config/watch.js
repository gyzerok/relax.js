'use strict';

module.exports = function (grunt) {

    grunt.config.set('watch', {
        files: ['src/**/*'],
        tasks: ['default']
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};