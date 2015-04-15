describe('TaskListCtrl', function() {
	
	beforeEach(module('collaborationApp'));
	
	it('should create "_embedded[\'ora:item\']" model with 3 items', inject(function($controller) {
		var scope = {},
			ctrl = $controller('TaskListCtrl', {$scope:scope});

		expect(scope.__embedded['ora:item'].length).toBe(3);
	}));

});