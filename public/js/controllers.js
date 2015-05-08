var collaborationControllers = angular.module('collaborationControllers', []);

collaborationControllers.controller('TaskListCtrl', ['$scope', 'Task',
	function ($scope, Task) {
		$scope.tasks = Task.query();
		$scope.count = function($map) {
			return Object.keys($map).length;
		};
		$scope.alertMsg = null;
		$scope.$watch('currOrg', function(newValue, oldValue) {
			if(newValue != undefined) {
				console.log("CurrOrg changed: " + newValue.organization.id);
			}
		});
		$scope.deleteTask = function(id) {
			Task.delete(id);
		};
		$scope.editTask = function(id) {

		}
	}]);
//
//collaborationControllers.controller('TaskDetailCtrl', ['$scope', '$routeParams', 'Task',
//	function($scope, $routeParams, Task) {
//		$scope.task = Task.get({taskId : $routeParams.taskId }, function(task) {
//			
//		});
//	}
//]);

var identityControllers = angular.module('identityControllers', []);

identityControllers.controller('MyOrgsListCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$http.get('data/memberships.json').success(function(data) {
			$scope.orgs = data;
			console.log($scope.orgs._embedded['ora:organization-membership']);
		});
		$scope.currOrg = null;
		$scope.currUser = { id: "34220c78-b054-4bd8-9a5c-70acc30d9ddc" };
	}]);

var peopleControllers = angular.module('peopleControllers', []);

peopleControllers.controller('OrgMemberListCtrl', ['$scope', 'People',
	function($scope, People) {
		$scope.members = People.query();
		$scope.$watch('currOrg', function(newValue, oldValue) {
			var id = newValue || newValue.organization.id;
				$scope.members = People.query({ orgId: id });
		});
	}]);