(function() {
    "use strict";

    angular.module('app').directive('leftMenu',[
        'SelectedOrganizationId',
        function(
            SelectedOrganizationId
        ){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/main/partials/leftMenu.html',
                link: function($scope, element, attrs) {

                    $scope.organization = null;
                    $scope.canShowOrganizationSettings = false;

                    $scope.$on('$stateChangeSuccess',function(){
                        if(SelectedOrganizationId.get()){
                            $scope.organization = $scope.identity.getMembership(SelectedOrganizationId.get());
                            if($scope.organization){
                                $scope.canShowOrganizationSettings = 'admin' ===  $scope.identity.getMembershipRole(SelectedOrganizationId.get());
                            }
                        }
        			});
                }
            };
        }
    ]);
}());
