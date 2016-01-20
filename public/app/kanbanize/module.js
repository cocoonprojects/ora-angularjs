angular.module('app.kanbanize', [
		'ui.router'
	])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('org.kanbanizeBoardSettings', {
					url: '/kanbanizeBoard/:boardId',
					templateUrl: 'app/kanbanize/partials/board-settings.html',
					controller: 'BoardController as ctrl',
					params: {
						'projectId': ''
					}
				});
		}
	]);