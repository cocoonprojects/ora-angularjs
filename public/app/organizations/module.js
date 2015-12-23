angular.module('app.organizations', [
		'ui.router'
	])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider.state('organizations', {
				url: '/organizations',
				templateUrl: 'app/organizations/partials/organizations.html',
				controller: 'OrganizationListController as ctrl'
			});
		}
	]);