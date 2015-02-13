'use strict';

module.exports = function (grunt) {

    grunt.registerTask('build', [
        'clean',
        'browserify',
        'uglify',
        'watch'
    ]);
};