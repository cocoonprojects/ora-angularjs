angular.module('oraApp')
	.filter('percentage', ['$filter', function ($filter) {
		return function(input, decimals, sign) {
			var rv = $filter('number')(input * 100, decimals) + '%';
			return sign && input > 0 ? '+' + rv : rv;
		};
	}]);