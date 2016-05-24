angular.module('app.people')
.controller('MemberListController', [
	'$scope',
	'$log',
	'memberService',
	'$stateParams',
	function (
		$scope,
		$log,
		memberService,
		$stateParams) {
		$scope.isMe = function(person){
			return person.id === $scope.identity.getId();
		};

		$scope.$on('$stateChangeSuccess',function(){
			memberService.query({ orgId: $stateParams.orgId },function(data){
				$scope.members = data;
			});
		});
	}
]);
