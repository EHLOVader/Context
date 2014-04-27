module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'js/**/*.js', '!js/libs/*.js'],
			options: {
				evil: true,
				camelcase: true,
				curly: true,
				eqeqeq: true,
				noempty: true,
				strict: true,
				loopfunc: true,
				globals: {
					jQuery: true,
					console: true,
					document: true
				}
			}
		},
		csslint: {
			src: ['css/*.css'],
			options: {
				ids: false,
				'compatible-vendor-prefixes': false,
				'fallback-colors': false
			}
		},
		validation: {
			options: {
				reset: true,
				reportpath: false
			},
			files: {
				src: ['*.html']
			}
		},
		zip: {
			'context-<%= pkg.version %>.zip': ['_locales/*/messages.json', 'css/**/*', 'screenshots/**/*.jpg', 'icons/**/*.png', 'js/**/*', 'other/**/*', '*.html', 'manifest.json']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-html-validation');
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask('default', ['jshint', 'csslint', 'validation']);
	grunt.registerTask('prod', ['zip']);
};