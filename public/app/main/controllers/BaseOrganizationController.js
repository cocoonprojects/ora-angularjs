angular.module('app')
	.controller('BaseOrganizationController', [
		'$scope',
		'$log',
		'$stateParams',
		'members',
        'streams',
        function(
            $scope,
            $log,
            $stateParams,
            members,
            streams) {
                $scope.organization = $scope.identity.getMembership($stateParams.orgId);
                $scope.members = members;
                $scope.stream = streams[0];
                $scope.user = function(member) {
                    if($scope.members && member) {
                        return $scope.members._embedded['ora:member'][member.id];
                    }
                    return null;
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
                    }
                );
            }
		]);
