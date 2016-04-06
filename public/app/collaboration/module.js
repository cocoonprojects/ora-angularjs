angular.module('app.collaboration', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.collaboration', {
					url: '/items',
					templateUrl: 'app/collaboration/partials/item-list.html',
					data: {
						pillarName: 'Items'
					},
					controller: 'ItemListController as ctrl'
				})
				.state('org.item', {
					url: '/items/:itemId',
					templateUrl: 'app/collaboration/partials/item-detail.html',
					controller: 'ItemDetailController as ctrl'
				});
		}
	]);
