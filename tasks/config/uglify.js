'use strict';

module.exports = function (grunt) {

    grunt.config.set('uglify', {
        dist: {
            options: {
                compress: true
            },
            files: {
                'dist/Relax.min.js': 'dist/Relax.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
};