'use strict';

module.exports = function (grunt) {

    grunt.registerTask('build', [
        'clean',
        //'browserify',
        'babel',
        'uglify',
        'watch'
    ]);
};