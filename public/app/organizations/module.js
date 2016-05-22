angular.module('app.organizations', [
	'ui.router'
])
.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('organizations', {
				url: '/organizations',
				templateUrl: 'app/organizations/partials/organizations.html',
				controller: 'OrganizationListController as ctrl'
			})
			.state('org.settings', {
				url: '/settings',
				templateUrl: 'app/organizations/partials/organization-settings.html',
				controller: 'OrganizationSettingsController as ctrl',
				data: {
					pillarName: 'Settings'
				}
			});
	}
]);
