angular.module('oraApp.people')
	.controller('MemberListController', ['$scope', '$log', 'memberService',
		function ($scope, $log, memberService) {
			$scope.members = memberService.query({ orgId: $scope.currOrg.id });
			$scope.user = function(member) {
				return $scope.members['_embedded']['ora:organization-member'][member.id];
			};
		}]);
