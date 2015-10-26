module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: 'public/app/**/*.js',
				dest: 'build/js/app.js'
			},
			css: {
				src: 'public/app/**/*.css',
				dest: 'build/css/style.css'
			}
		},
		uglify: {
			options: {
				preserveComments: false
			},
			js: {
				files: {
					'build/js/app.min.js': ['build/js/app.js']
				}
			}
		},
		clean: {
			build: [
				'build'
			]
		},
		jshint: {
			app: [
				'public/app/**/*.js'
			]
		},
		processhtml: {
			dist: {
				files: {
					'build/index.html': ['public/index.html']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.registerTask('build', ['jshint','clean','processhtml','concat', 'uglify']);
};
