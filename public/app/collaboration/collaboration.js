angular.module('oraApp.collaboration', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.collaboration', {
					url: '/items',
					templateUrl: 'app/collaboration/partials/task-list.html',
					data: {
						selectedTab: 0
					},
					controller: 'ItemListController as ctrl'
				})
				.state('org.item', {
					url: '/items/:itemId',
					templateUrl: 'app/collaboration/partials/task-detail.html',
					data: {
						selectedTab: 0
					},
					controller: 'ItemDetailController as ctrl'
				});
		}
	]);