/*
https://github.com/axemclion/IndexedDBShim/blob/master/Gruntfile.js
https://github.com/axemclion/jquery-indexeddb/blob/master/GruntFile.js
*/
/* global module:false */
"use strict";

module.exports = function(grunt) {

    //var request = require('./node_modules/request');

    var sauceuser = 'nfreear';
    var saucekey = null;
	if (typeof process.env.saucekey !== "undefined") {
		saucekey = process.env.SAUCE_ACCESS_KEY;
	}

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    /*grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    */
    grunt.loadNpmTasks('grunt-saucelabs');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: { // Post uglify.
            me: {
                src: [
                    //'src/js/me-header.js',
                    'header.js',
                    'local-build/ajax-storage.min.js'
                ],
                dest: 'local-build/ajax-storage.min.js'
            }
        },
        //jscs: JavaScript Code Style
        jshint: {
            options: {
                expr: true
            },
			all: {
				src: [
					"*.js", "src/**/*.js", "Gruntfile.js",
					//,"test/**/*.js", "build/**/*.js"
				]/*,
				options: {
					jshintrc: true
				}*/
			}/*,
			dist: {
				src: "dist/jquery.js",
				options: srcHintOptions
			}*/
		},
		uglify: {
            me: {
                src    : ['ajax-storage.js'],
                dest   : 'local-build/ajax-storage.min.js'
                //, banner : 'src/js/me-header.js'
            }
        },
        cssmin: {
            build: {
                src  : ['src/css/ajax-storage.css'],
                dest : 'local-build/ajax-storage.min.css'
            }
        },
        copy: {
            build: {
                expand  : true,
                cwd     : 'src/css/',
                src     : ['*.png', '*.svg', '*.gif', '*.css'],
                dest    : 'local-build/',
                flatten : true,
                filter  : 'isFile'
            }
        },
		connect: {
			server: {
				options: {
					base: '.',
					port: 8888
				}
			}
		},
        mocha: {
			all: {
				options: {
					urls: ['http://localhost:8888/~Nick/ajax-storage/test/test_runner.html']
				}
			}
		},

        'saucelabs-mocha': {
          all: {
            options: {
              username: sauceuser, // Defaults to ENV SAUCE_USERNAME (if applicable)
              key: saucekey, // Defaults to ENV SAUCE_ACCESS_KEY (if applicable)
              urls: ['http://127.0.0.1:8888/~Nick/ajax-storage/test/test_runner.html'],
              build: process.env.CI_BUILD_NUMBER,
              testname: 'Sauce Unit Test for ajax-storage',
              browsers: [
                { browserName: 'firefox', version: '31', platform: 'XP' }
              ]
              // optionally, the `browsers` param can be a flattened array:
              // [["XP", "firefox", 19], ["XP", "chrome", 31]]
            }
          }
        }
    });


    //grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('default', ['jshint', 'uglify', 'concat']);

    //grunt.registerTask('test', ['server', 'qunit', 'saucelabs-qunit']);
    grunt.registerTask('test', [ 'saucelabs-mocha' ]);

};