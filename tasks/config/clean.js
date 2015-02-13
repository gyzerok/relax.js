'use strict';

module.exports = function (grunt) {

    grunt.config.set('clean', {
        dist: ['dist', 'lib']
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
};