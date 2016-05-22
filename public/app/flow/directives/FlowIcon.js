(function() {
    "use strict";


    angular.module('app').directive('flowIcon', [
        function() {
            return {
                restrict: 'E',
                template: '<div class="flowIconContainer"><md-icon class="material-icons flowIcon" aria-label="{{pippo}}">{{pippo}}</md-icon></div>',
                scope: {
                    type: '='
                },
                link: function($scope, element, attrs) {
                    var associate = {
                        'VoteIdea': 'lightbulb_outline',
                        'VoteCompletedItem': 'done',
                        'VoteCompletedItemVotingClosed': 'gavel',
                        'VoteCompletedItemReopened': 'announcement'
                    };

                    $scope.pippo = associate[$scope.type] || 'info';
                }
            };
        }
    ]);
}());
