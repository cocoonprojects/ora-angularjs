describe('memberService', function() {

	// Initialization of the AngularJS application before each test case
	beforeEach(module('oraApp'));

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

	it('should return true if a not member try to join an organization', function() {
		expect(service.isAllowed('joinOrganization', { id: '00000000-0000-0000-0000-000000000000' })).toBeTruthy();
		expect(service.isAllowed('joinOrganization', { id: '00000000-0000-0000-0000-000000000001' })).toBeFalsy();
	});

	it('should return true if a member try to unjoin an organization', function() {
		expect(service.isAllowed('unjoinOrganization', { id: '00000000-0000-0000-0000-000000000001' })).toBeTruthy();
		expect(service.isAllowed('unjoinOrganization', { id: '00000000-0000-0000-0000-000000000000' })).toBeFalsy();
	});
});