angular.module('oraApp.identity')
	.controller('IdentityController', ['$scope', '$log', '$location', 'identity',
		function($scope, $log, $location, identity) {
			$scope.identity = identity;
			$scope.currOrg = null;

			//$scope.isAllowed = {
			//	'createTask': function(stream) { return $scope.isAuthenticated() }, // TODO: Manca il controllo sull'appartenenza all'organizzazione dello stream
			//	'editTask': function(task) { return $scope.isAuthenticated() && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
			//	'deleteTask': function(task) { return $scope.isAuthenticated() && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
			//	'joinTask': function(task) { return $scope.isAuthenticated() && task.status < 20 && task.members[$scope.identity.id] === undefined },
			//	'unjoinTask': function(task) { return $scope.isAuthenticated() && task.status < 20 && task.members[$scope.identity.id] !== undefined },
			//	'executeTask': function(task) { return $scope.isAuthenticated() },
			//	'completeTask': function(task) { return $scope.isAuthenticated() && task.status < 30 && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
			//	'acceptTask': function(task) { return $scope.isAuthenticated() && task.status < 40 && task.status > 20 && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
			//	'estimateTask': function(task, member) { return $scope.isAuthenticated() && task.status < 30 && member.id == $scope.identity.id },
			//	'assignShares': function(task) { return $scope.isAuthenticated() }
			//};

			$scope.signOut = function() {
				var auth2 = gapi.auth2.getAuthInstance();
				auth2.signOut().then(function () {
					identity.reset();
					$log.info('User signed out.');
					$location.path('/');
				});
			}
		}]);
