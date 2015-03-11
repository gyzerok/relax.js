'use strict';

module.exports = function (grunt) {

    grunt.config.set('babel', {
        options: {
            sourceMap: false,
            comments: false
        },
        dist: {
            files: [
                { expand: true, cwd: './src', src: ['**/*.js', '!__tests__/**'], dest: 'lib' }
            ]
        }
    });

    grunt.loadNpmTasks('grunt-babel');
};