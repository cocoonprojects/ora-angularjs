module.exports = function (config) {
	config.set({

		basePath: '../',

		files: [
			'public/components/angular/angular.js',
			'public/components/angular-resource/angular-resource.js',
			'public/components/angular-animate/angular-animate.js',
			'public/components/angular-mocks/angular-mocks.js',
			'public/components/angular-aria/angular-aria.js',
			'public/components/angular-ui-router/release/angular-ui-router.js',
			'public/components/angular-messages/angular-messages.js',
			'public/components/angular-material/angular-material.js',
			'public/components/moment/moment.js',
			'public/components/angular-moment/angular-moment.js',
			'public/app/flow/flow.js',
			'public/app/identity/identity.js',
			'public/app/people/people.js',
			'public/app/collaboration/collaboration.js',
			'public/app/**/*.js',
			'test/unit/**/*.js'
		],

		autoWatch: true,

		frameworks: ['jasmine'],

		browsers: ['Chrome'],

		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine'
		],

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		},

		colors: true

	});
};
