angular.module('app')
    .controller('ConfirmSavaKanbanizeSettingsController', [
        '$scope',
        '$mdDialog',
        function (
            $scope,
            $mdDialog) {

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.ok = function(){
                $mdDialog.hide();
            };
        }]);
