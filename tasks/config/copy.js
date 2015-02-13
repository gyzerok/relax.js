'use strict';

module.exports = function (grunt) {

    grunt.config.set('copy', {
        lib: {
            files: [
                { expand: true, cwd: 'src', src: ['*.js'], dest: 'lib' }
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};