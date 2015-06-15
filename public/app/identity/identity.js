angular.module('oraApp.identity', [])
	.controller('IdentityController', ['$scope', '$http', '$log',
		function($scope, $http, $log) {
			$scope.memberships = [];
			$scope.identity = null;
			$scope.currOrg = null;

			$scope.setIdentity = function(user) {
				$scope.identity = user;
				$http.get('data/memberships.json').success(function(data) {
					$scope.memberships = data._embedded['ora:organization-membership'];
					$log.debug('User ' + $scope.identity.lastname + ' is member of ' + $scope.memberships.length + " organizations");
				});
			}

			$scope.isAuthenticated = function() {
				return $scope.identity != null;
			}

			$scope.isAllowed = {
				'createTask': function(stream) { return $scope.isAuthenticated() }, // TODO: Manca il controllo sull'appartenenza all'organizzazione dello stream
				'editTask': function(task) { return $scope.isAuthenticated() && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
				'deleteTask': function(task) { return $scope.isAuthenticated() && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
				'joinTask': function(task) { return $scope.isAuthenticated() && task.status < 20 && task.members[$scope.identity.id] === undefined },
				'unjoinTask': function(task) { return $scope.isAuthenticated() && task.status < 20 && task.members[$scope.identity.id] !== undefined },
				'executeTask': function(task) { return $scope.isAuthenticated() },
				'completeTask': function(task) { return $scope.isAuthenticated() && task.status < 30 && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
				'acceptTask': function(task) { return $scope.isAuthenticated() && task.status < 40 && task.status > 20 && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
				'estimateTask': function(task, member) { return $scope.isAuthenticated() && task.status < 30 && member.id == $scope.identity.id },
				'assignShares': function(task) { return $scope.isAuthenticated() }
			};

			$scope.setIdentity({
				id: "34220c78-b054-4bd8-9a5c-70acc30d9ddc",
				firstname: "John",
				lastname: "Doe",
				picture: "http://lorempixel.com/337/337/people"
			});
		}]);