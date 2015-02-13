'use strict';

var zlib = require('zlib');

module.exports = function (grunt) {

    grunt.config.set('browserify', {
        app: {
            options: {
                debug: false,
                watch: true,
                keepAlive: true,
                transform: [
                    '6to5ify',
                    ['uglifyify', { global: true }]
                ]/*,
                postBundleCB: function (err, src, next) {
                    if (err) return next(err);

                    zlib.gzip(src, next);
                }*/
            },
            src: 'src/index.js',
            dest: 'dist/Relax.js'
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
};