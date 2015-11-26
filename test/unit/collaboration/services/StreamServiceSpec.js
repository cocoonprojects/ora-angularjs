describe('streamService', function() {

	// Initialization of the AngularJS application before each test case
	beforeEach(module('oraApp'));

	var service;
	var identity = {
		id: "00000000-0000-0000-0000-000000000000",
		firstname: "John",
		lastname: "Doe",
		picture: "http://lorempixel.com/337/337/people",
		getToken: function () {
			return null;
		},
		getId: function () {
			return this.id;
		},
		isAuthenticated: function () {
			return true;
		},
		getMembership: function (id) {
			if (id == '00000000-0000-0000-0000-000000000001')
				return {
					id: '00000000-0000-0000-0000-000000000001'
				};
			return null;
		}
	};

	beforeEach(inject(function ($resource, $interval) {
		service = new StreamService($resource, $interval, identity);
	}));

	it('should return what a user can do on an organization', function() {
		expect(service.isAllowed('createStream', { id: '00000000-0000-0000-0000-000000000001' })).toBeTruthy();
		expect(service.isAllowed('createStream', { id: '00000000-0000-0000-0000-000000000002' })).toBeFalsy();
	});

});