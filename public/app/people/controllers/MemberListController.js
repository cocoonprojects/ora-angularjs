angular.module('app.people')
.controller('MemberListController', ['$scope', '$log',
	function ($scope, $log) {
		$scope.isMe = function(person){
			return person.id === $scope.identity.getId();
		};
	}
]);
