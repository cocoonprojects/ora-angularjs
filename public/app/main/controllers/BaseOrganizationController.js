angular.module('app')
	.controller('BaseOrganizationController', [
		'$scope',
		'$log',
		'$stateParams',
		'members',
        'streams',
		'SelectedOrganizationId',
		'$state',
        function(
            $scope,
            $log,
            $stateParams,
            members,
            streams,
			SelectedOrganizationId,
			$state) {
				if(!SelectedOrganizationId.get()){
					$state.go("organizations");
					return;
				}

				$scope.organization = $scope.identity.getMembership($stateParams.orgId);
                $scope.members = members;
                $scope.stream = streams[0];
                $scope.user = function(member) {
                    if($scope.members && member) {
                        return $scope.members._embedded['ora:member'][member.id];
                    }
                    return null;
                };
				$scope.goBack = function() {
					window.history.back();
				};
                $scope.pillar = {};
                $scope.$on('$stateChangeSuccess',
                    function(event, toState) {
                        if(toState.data && toState.data.pillarName){
                            $scope.pillar.name = toState.data.pillarName;
                        }
                        if(toState.data && toState.data.selectedTab){
                            $scope.currentTab = toState.data.selectedTab;
                        }
						if(toState.data && toState.data.showBack) {
							$scope.showBack = true;
						} else {
							$scope.showBack = false;
						}

						if(toState.data){
                            $scope.fullHeight = toState.data.fullHeight;
                        }
                    }
                );
            }
		]);
