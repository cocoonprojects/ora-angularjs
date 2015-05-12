angular.module('collaborationControllers', [])
	.controller('TaskListCtrl', ['$scope', '$modal', '$log', 'Task',
		function ($scope, $modal, $log, Task) {
			$scope.tasks = Task.query();
			$scope.alertMsg = null;
			$scope.$watch('currOrg', function(newValue, oldValue) {
				if(newValue != undefined) {
					$log.debug("CurrOrg changed: " + newValue.organization.id);
				}
			});
			$scope.count = function($map) {
				return Object.keys($map).length;
			};
			$scope.deleteTask = function(id) {
				Task.delete(id);
			};
			$scope.openNewTask = function() {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: "partials/new-task.html"
				});
			};
			$scope.openTaskDetail = function(task) {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: "partials/task-detail.html",
					controller: 'TaskDetailCtrl',
					resolve: {
						task: function() {
							return task;
						}
					}
				});
			};
			$scope.openEditTask = function(id) {
				$scope.task = Task.query({ taskId: id });
				var modalInstance = $modal.open({
					templateUrl: "partials/task-detail.html",
					controller: 'TaskDetailCtrl'
				});
			}
		}])
	.controller('TaskDetailCtrl', ['$scope', '$modalInstance', '$log', 'task',
		function ($scope, $modalInstance, $log, task) {
			$scope.task = task;
			$scope.daysAgo = function(when) {
				var now = new Date();
				var d = new Date(Date.parse(when));
				return Math.round(Math.abs((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
			};
			$scope.statusClass = function() {
				switch ($scope.task.status) {
					case 20:
					case 30:
					case 40:
						return 'text-success';
					default :
						return 'text-muted';
				}
			};
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

identityControllers.controller('MyOrgsListCtrl', ['$scope', '$http', '$log',
	function ($scope, $http, $log) {
		$http.get('data/memberships.json').success(function(data) {
			$scope.orgs = data;
			$log.debug($scope.orgs._embedded['ora:organization-membership']);
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