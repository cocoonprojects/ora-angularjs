angular.module('oraApp', [
	'ui.router',
	'ngMessages',
	'ngMaterial',
	'angularMoment',
	'infinite-scroll',
	'oraApp.identity',
	'oraApp.organizations',
	'oraApp.collaboration',
	'oraApp.people',
	'oraApp.flow',
	'oraApp.accounting'
])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise(function($injector, $location) {
				var $state = $injector.get("$state");
				$state.go("flow");
			});
			$stateProvider
				.state('org', {
					abstract: true,
					url: '/:orgId',
					templateUrl: 'app/global/partials/pillars.html',
					resolve: {
						members: function($stateParams, memberService) {
							return memberService.query({ orgId: $stateParams.orgId });
						}
					},
					controller: function($scope, $log, $stateParams, members) {
						$scope.organization = $scope.identity.getMembership($stateParams.orgId);
						$scope.members = members;
						$scope.user = function(member) {
							if($scope.members && member) {
								return $scope.members._embedded['ora:member'][member.id];
							}
							return null;
						};
						$scope.$on('$stateChangeSuccess',
							function(event, toState) {
								$scope.currentTab = toState.data.selectedTab;
							});
					}
				});
	}])
	.config(['$mdThemingProvider',
		function($mdThemingProvider) {
			$mdThemingProvider.theme('default')
				.primaryPalette('pink')
				.accentPalette('indigo');
			$mdThemingProvider.theme('input', 'default')
				.primaryPalette('grey');
		}])
	.config(['$mdIconProvider',
		function($mdIconProvider) {
			$mdIconProvider
					.defaultIconSet('components/angular-material/demos/icon/demoSvgIconSets/core-icons.svg', 24)
					.icon('star', 'svg/ic_star_24px.svg')
					.icon('transfer', 'svg/ic_swap_horiz_24px.svg')
					.icon('withdrawal', 'svg/ic_call_made_24px.svg')
					.icon('deposit', 'svg/ic_call_received_24px.svg')
					.icon('menu', 'svg/ic_menu_24px.svg')
					.icon('check', 'svg/ic_check_24px.svg')
					.icon('credits', 'svg/ic_attach_money_24px.svg')
					.icon('add', 'svg/ic_add_24px.svg')
					.icon('log', 'svg/ic_today_24px.svg')
					.icon('add-task', 'svg/ic_note_add_black_24px.svg')
					.icon('add-stream', 'svg/ic_view_stream_black_24px.svg')
					.icon('more', 'svg/ic_more_vert_24px.svg');
		}])
	.run(function(amMoment) {
		amMoment.changeLocale('it');
	});