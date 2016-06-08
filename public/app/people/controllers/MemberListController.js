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

		$scope.orgId = $stateParams.orgId;

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

		$scope.canInviteNewUser = memberService.canInviteNewUser($stateParams.orgId);
		$scope.isAllowed = memberService.isAllowed.bind(memberService);

		$scope.openInvitationDialog = function(ev){
			$mdDialog.show({
				controller: 'InvitationController',
				templateUrl: "app/people/partials/invitation.html",
				targetEvent: ev,
				clickOutsideToClose: true
			}).then(sendInvitation);
		};

		$scope.removeUser = function(ev,member){
			var confirm = $mdDialog.confirm()
					.title("Would you remove this user from the organization?")
					.textContent("This operation cannot be undone.")
					.targetEvent(ev)
					.ok("Yes")
					.cancel("No");

			$mdDialog.show(confirm).then(function() {
				memberService.removeUserFromOrganization($stateParams.orgId,member.id).then(function(){
					memberService.query({ orgId: $stateParams.orgId },function(data){
						$scope.members = data;
					});
				});
			});

		};
	}
]);
