describe('memberService', function() {

	// Initialization of the AngularJS application before each test case
	beforeEach(module('app'));

	var service;
	var identity = {
		id: "00000000-0000-0000-0000-000000000000",
		firstname: "John",
		lastname: "Doe",
		picture: "http://lorempixel.com/337/337/people",
		getToken: function() {
			return null;
		},
		getId: function() {
			return this.id;
		},
		isAuthenticated: function() {
			return true;
		},
		getMembership: function(id) {
			if(id == '00000000-0000-0000-0000-000000000001')
				return {
					id: '00000000-0000-0000-0000-000000000001'
				};
			return null;
		}
	};

	beforeEach(inject(function($resource) {
		service = new MemberService($resource, identity);
	}));

	
});
