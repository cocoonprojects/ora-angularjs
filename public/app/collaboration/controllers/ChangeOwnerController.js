angular.module('app.collaboration')
.controller('ChangeOwnerController', ["$scope", "$mdDialog", "item", "owner", function($scope, $mdDialog, item, owner) {

	$scope.item = item;

	$scope.partecipants = _.values(item.members);

	$scope.result = {
		owner: owner.id
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

    $scope.close = function() {
        $mdDialog.hide($scope.result.owner);
    };

}]);
