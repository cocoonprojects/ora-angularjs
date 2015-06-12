angular.module('oraApp.people', ['ngRoute', 'ngResource'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/people', {
					templateUrl: 'app/people/people-list.html',
					controller: 'OrgMemberListCtrl'
				});
		}])
	.controller('OrgMemberListCtrl', ['$scope', 'People',
		function($scope, People) {
			$scope.members = People.query();
			$scope.$watch('currOrg', function(newValue, oldValue) {
				var params = {};
				if(newValue != null) {
					params.orgId = newValue.organization.id;
				}
				$scope.members = People.query(params);
			});
		}])
	.factory('People', ['$resource',
		function($resource) {
			return $resource('data/people/organizations/:orgId/members/:id.json', { }, {
					query: { method: 'GET',  params: { },  isArray: false }
				}
			);
		}]);
