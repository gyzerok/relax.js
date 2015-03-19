'use strict';

module.exports = function (grunt) {

    grunt.registerTask('build', [
        'clean',
        'browserify:lib',
        'babel',
        'uglify',
        'watch'
    ]);
};
