describe('TaskListCtrl', function() {
	
	beforeEach(module('oraApp'));
	
	it('should create "_embedded[\'ora:item\']" model with 3 items', inject(function($controller) {
		var scope = { __embedded: { "ora:task": [{},{},{}] }};
		scope.$watch = function() {};
		var ctrl = $controller('TaskListCtrl', {$scope:scope});

		expect(scope.__embedded['ora:task'].length).toBe(3);
	}));

});