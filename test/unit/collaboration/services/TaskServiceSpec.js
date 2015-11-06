describe('taskService', function() {

	// Initialization of the AngularJS application before each test case
	beforeEach(module('oraApp'));

	var service;
	var currUser = {
		id: "00000000-0000-0000-0000-000000000000",
		firstname: "John",
		lastname: "Doe",
		picture: "http://lorempixel.com/337/337/people"
	};

	beforeEach(inject(function($injector) {
		service = $injector.get('taskService');
	}));

	it('should return true for the task owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isOwner(task, currUser.id)).toBe(true);
	});

	it('should return false when the user is not an owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isOwner(task, currUser.id)).toBeFalsy();
	});

	it('should return false when the user is not a task member', function() {
		var task = {
			members: {}
		};

		expect(service.isOwner(task, currUser.id)).toBeFalsy();
	});

	it('should return true for a task member, not owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isMember(task, currUser.id)).toBe(true);
	});

	it('should return false for a task owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isMember(task, currUser.id)).toBeFalsy();
	});

	it('should return false for not a task member', function() {
		var task = {
			members: {
			}
		};

		expect(service.isMember(task, currUser.id)).toBeFalsy();
	});

	it('should return true for a task owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.hasJoined(task, currUser.id)).toBe(true);
	});

	it('should return true for a task member', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.hasJoined(task, currUser.id)).toBe(true);
	});

	it('should return false for not a task member', function() {
		var task = {
			members: {
			}
		};

		expect(service.hasJoined(task, currUser.id)).toBe(false);
	});

	it('should return true if all members have an estimation', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					estimation: 10
				},
				'00000000-0000-0000-0000-000000000001': {
					estimation: 20
				}
			}
		};

		expect(service.isEstimationCompleted(task)).toBe(true);
	});

	it('should return true if all members have skipped the estimation', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					estimation: -1
				},
				'00000000-0000-0000-0000-000000000001': {
					estimation: -1
				}
			}
		};

		expect(service.isEstimationCompleted(task)).toBe(true);
	});

	it('should return true if all members have skipped the estimation or estimated the task', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					estimation: 10
				},
				'00000000-0000-0000-0000-000000000001': {
					estimation: -1
				}
			}
		};

		expect(service.isEstimationCompleted(task)).toBe(true);
	});

	it('should return false if at least one member has a missing estimation', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
				},
				'00000000-0000-0000-0000-000000000001': {
					estimation: -1
				}
			}
		};

		expect(service.isEstimationCompleted(task)).toBe(false);
	});

	it('should return 0 if no members has estimated yet', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
				},
				'00000000-0000-0000-0000-000000000001': {
				},
				'00000000-0000-0000-0000-000000000002': {
				}
			}
		};

		expect(service.countEstimators(task)).toBe(0);
	});

	it('should return how many members have estimated or skipped the estimation', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
				},
				'00000000-0000-0000-0000-000000000001': {
					estimation: -1
				},
				'00000000-0000-0000-0000-000000000002': {
					estimation: 4000
				}
			}
		};

		expect(service.countEstimators(task)).toBe(2);
	});

	//it('should return an empty task collection', function() {
	//	expect(service.collection._embedded['ora:task'].length).toBe(0);
	//});
	//
	////it('should return a not empty task collection after update', function() {
	////	console.log(service.updateCollection());
	////	expect(service.collection._embedded['ora:task'].length).toBe(4);
	////});
	//
	//it('should add current user as a member of the task', function() {
	//	var task = {
	//		id: "00000000-0000-0000-0000-000000000000"
	//	};
	//	service.collection._embedded['ora:task'].push(task);
	//
	//	service.joinTask(service.collection._embedded['ora:task'][0], currUser);
	//	expect(service.collection._embedded['ora:task'][0].members.length, 1);
	//});
	//
	//it('should add remove user as a member of the task', function() {
	//	var task = {
	//		id: "00000000-0000-0000-0000-000000000000",
	//		members: {}
	//	};
	//	task.members[currUser.id] = currUser;
	//
	//	service.collection._embedded['ora:task'].push(task);
	//
	//	service.unjoinTask(service.collection._embedded['ora:task'][0], currUser);
	//	expect(service.collection._embedded['ora:task'][0].members.length, 0);
	//});
});