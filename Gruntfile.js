module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    /*grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    */

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
			all: {
				src: [
					"*.js", "src/**/*.js", "Gruntfile.js",
					//,"test/**/*.js", "build/**/*.js"
				],
				options: {
					jshintrc: true
				}
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
        }
    });


    //grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('default', ['jshint', 'uglify', 'concat']);

};