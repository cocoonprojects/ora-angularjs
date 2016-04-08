angular.module('app', [
	'ui.router',
	'ngMessages',
	'ngMaterial',
	'angularMoment',
	'infinite-scroll',
	'app.identity',
	'app.organizations',
	'app.collaboration',
	'app.people',
	'app.flow',
	'app.accounting',
	'app.kanbanize'
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
					templateUrl: 'app/main/partials/pillars.html',
					resolve: {
						members: function($stateParams, memberService) {
							return memberService.query({ orgId: $stateParams.orgId });
						},
						streams:['streamService','$stateParams','$q',function(streamService,$stateParams,$q){
							var deferred = $q.defer();
							streamService.query($stateParams.orgId,function(data){
								deferred.resolve(_.values(data._embedded['ora:stream']));
							});
							return deferred.promise;
						}]
					},
					controller: function($scope, $log, $stateParams, members,streams) {
						$scope.organization = $scope.identity.getMembership($stateParams.orgId);
						$scope.members = members;
						$scope.stream = streams[0];
						$scope.user = function(member) {
							if($scope.members && member) {
								return $scope.members._embedded['ora:member'][member.id];
							}
							return null;
						};
						$scope.pillar = {};
						$scope.$on('$stateChangeSuccess',
							function(event, toState) {
								if(toState.data && toState.data.pillarName){
									$scope.pillar.name = toState.data.pillarName;
								}
								if(toState.data && toState.data.selectedTab){
									$scope.currentTab = toState.data.selectedTab;
								}
							}
						);
					}
				});
	}])
	.config(['$mdThemingProvider',
		function($mdThemingProvider) {
			$mdThemingProvider.theme('default')
				.primaryPalette('blue-grey')
				.accentPalette('indigo');
			$mdThemingProvider.theme('input', 'default')
				.primaryPalette('grey');
		}])
	.config(['$mdIconProvider',
		function($mdIconProvider) {
			$mdIconProvider.defaultIconSet('icon-set.svg', 24);
		}])
	.run(function(amMoment) {
		amMoment.changeLocale('it');
	});
