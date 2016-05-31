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

		var sendInvitation = function(data){
			var name = data.name;
			if(data.surname){
				name += " " + data.surname;
			}else{
				data.surname = "";
			}

			memberService.inviteNewUser($stateParams.orgId,data).then(function(){
				return $mdDialog.alert({
			        title: 'Invite sent',
			        textContent: name + ' invited to your organization',
			        ok: 'Close'
				});
			},function(){
				return $mdDialog.alert({
			        title: 'Error',
			        textContent: 'Error during invitation. Please retry',
			        ok: 'Close'
				});
			}).then(function(dialog){
				$mdDialog.show(dialog);
			});
		};

		memberService.canInviteNewUser($stateParams.orgId).then(function(result){
			$scope.canInviteNewUser = result;
		});

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
