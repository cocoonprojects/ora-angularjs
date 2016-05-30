angular.module('app.people')
.controller('MemberListController', [
	'$scope',
	'$log',
	'memberService',
	'$stateParams',
	'$mdDialog',
	function (
		$scope,
		$log,
		memberService,
		$stateParams,
		$mdDialog) {

		$scope.isMe = function(person){
			return person.id === $scope.identity.getId();
		};

		$scope.$on('$stateChangeSuccess',function(){
			memberService.query({ orgId: $stateParams.orgId },function(data){
				$scope.members = data;
			});
		});

		var sendInvitation = function(){
			alert('To Be Implemented');
		};

		$scope.openInvitationDialog = function(ev){
			$mdDialog.show({
				controller: 'InvitationController',
				templateUrl: "app/people/partials/invitation.html",
				targetEvent: ev,
				clickOutsideToClose: true
			}).then(sendInvitation);
		};
	}
]);
