module.exports = function(config){
  config.set({

	basePath : '../',

	files : [
		'public/components/angular/angular.js',
		'public/components/angular-route/angular-route.js',
		'public/components/angular-resource/angular-resource.js',
		'public/components/angular-animate/angular-animate.js',
		'public/components/angular-mocks/angular-mocks.js',
		'public/components/angular-bootstrap/ui-bootstrap.js',
		'public/js/**/*.js',
		'test/unit/**/*.js'
	],

	autoWatch : true,

	frameworks: ['jasmine'],

	browsers : ['Chrome'],

	plugins : [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine'
			],

	junitReporter : {
	  outputFile: 'test_out/unit.xml',
	  suite: 'unit'
	}

  });
};
