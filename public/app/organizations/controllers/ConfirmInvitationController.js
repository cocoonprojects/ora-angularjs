angular.module('app')
	.controller('ConfirmInvitationController', [
		'$scope',
		'$stateParams',
		'$state',
		'$mdDialog',
		'SelectedOrganizationId',
		'memberService',
		'InvitationData',
		function (
			$scope,
			$stateParams,
			$state,
			$mdDialog,
			SelectedOrganizationId,
			memberService,
			InvitationData) {

				console.log(InvitationData);

				var onSuccess = function(googleUser) {
					$scope.$apply(function() {
						var profile = googleUser.getBasicProfile();
						var email = profile.getEmail();

						if(email === InvitationData.guestEmail){
							var confirm = $mdDialog.confirm({
						        title: 'Confirm',
						        textContent: 'Do You want to Join ' + InvitationData.orgName + '?',
						        ok: 'Confirm',
								cancel: 'Cancel'
							});

							$mdDialog.show(confirm).then(function(result){
								if(result){
									$scope.identity.signInFromGoogle(googleUser);
									SelectedOrganizationId.set(InvitationData.orgId);
									memberService.joinOrganization({ id: InvitationData.orgId }, function(){
										$state.go('org.flow',{ orgId: InvitationData.orgId });
									});
								}
							});
						}else{
							var alert = $mdDialog.alert({
						        title: 'Error',
						        textContent: 'Your invitation is not valid',
						        ok: 'Close'
							});

							$mdDialog.show(alert);
						}
					});
				};

				gapi.signin2.render('googleSignIn', {
					'scope': 'https://www.googleapis.com/auth/drive.readonly',
					'width': 230,
					'longtitle': true,
					'theme': 'dark',
					'onsuccess': onSuccess
				});
		}]);
