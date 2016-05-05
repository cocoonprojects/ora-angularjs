angular.module('app.collaboration')
.controller('OnItemAddedDialogController', ["$scope", "$mdDialog",function($scope, $mdDialog) {

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

    $scope.close = function() {
        $mdDialog.hide();
    };
    
}]);
