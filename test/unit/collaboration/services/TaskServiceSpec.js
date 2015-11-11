describe('taskService', function() {

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
		}
	};

	beforeEach(inject(function($resource) {
		service = new TaskService($resource, identity);
	}));

	it('should return true for the task owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isOwner(task, identity.id)).toBe(true);
	});

	it('should return false when the user is not an owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isOwner(task, identity.id)).toBeFalsy();
	});

	it('should return false when the user is not a task member', function() {
		var task = {
			members: {}
		};

		expect(service.isOwner(task, identity.id)).toBeFalsy();
	});

	it('should return true for a task member, not owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isMember(task, identity.id)).toBe(true);
	});

	it('should return false for a task owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isMember(task, identity.id)).toBeFalsy();
	});

	it('should return false for not a task member', function() {
		var task = {
			members: {
			}
		};

		expect(service.isMember(task, identity.id)).toBeFalsy();
	});

	it('should return true for a task owner', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.hasJoined(task, identity.id)).toBe(true);
	});

	it('should return true for a task member', function() {
		var task = {
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.hasJoined(task, identity.id)).toBe(true);
	});

	it('should return false for not a task member', function() {
		var task = {
			members: {
			}
		};

		expect(service.hasJoined(task, identity.id)).toBe(false);
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

	it('should return what the owner can do on a work item idea', function() {
		var task = {
			status: service.TASK_STATUS.IDEA,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(true);
		expect(service.isAllowed('deleteTask', task)).toBe(true);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(true);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what a member can do on a work item idea', function() {
		var task = {
			status: service.TASK_STATUS.IDEA,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what the owner can do on an ongoing item with estimation incomplete', function() {
		var task = {
			status: service.TASK_STATUS.ONGOING,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(true);
		expect(service.isAllowed('deleteTask', task)).toBe(true);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(true);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(true);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what the owner can do on an ongoing item estimation complete', function() {
		var task = {
			status: service.TASK_STATUS.ONGOING,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			},
			estimation: 1
		};

		expect(service.isAllowed('editTask', task)).toBe(true);
		expect(service.isAllowed('deleteTask', task)).toBe(true);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(true);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(true);
		expect(service.isAllowed('completeTask', task)).toBe(true);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what a member can do on an ongoing item', function() {
		var task = {
			status: service.TASK_STATUS.ONGOING,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(true);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(true);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what not a member can do on an ongoing item', function() {
		var task = {
			status: service.TASK_STATUS.ONGOING,
			members: {
				'00000000-0000-0000-0000-000000000001': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(true);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what the owner can do on a completed item', function() {
		var task = {
			status: service.TASK_STATUS.COMPLETED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(true);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(true);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(true);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what a member can do on a completed item', function() {
		var task = {
			status: service.TASK_STATUS.COMPLETED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what not a member can do on a completed item', function() {
		var task = {
			status: service.TASK_STATUS.COMPLETED,
			members: {
				'00000000-0000-0000-0000-000000000001': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what the owner can do on an accepted item when she has not yet assigned shares', function() {
		var task = {
			status: service.TASK_STATUS.ACCEPTED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(true);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(true);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(true);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what the owner can do on an accepted item when she has assigned shares', function() {
		var task = {
			status: service.TASK_STATUS.ACCEPTED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner',
					shares: {
						'00000000-0000-0000-0000-000000000000': 1
					}
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(true);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(true);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what a member can do on an accepted item when she has not yet assigned shares', function() {
		var task = {
			status: service.TASK_STATUS.ACCEPTED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(true);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what a member can do on an accepted item when she has assigned shares', function() {
		var task = {
			status: service.TASK_STATUS.ACCEPTED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member',
					shares: {
						'00000000-0000-0000-0000-000000000000': 1
					}
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what a user can do on an accepted item', function() {
		var task = {
			status: service.TASK_STATUS.ACCEPTED,
			members: {
				'00000000-0000-0000-0000-000000000001': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(false);
	});

	it('should return what the owner can do on a closed item', function() {
		var task = {
			status: service.TASK_STATUS.CLOSED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'owner'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(true);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(true);
	});

	it('should return what a member can do on a closed item', function() {
		var task = {
			status: service.TASK_STATUS.CLOSED,
			members: {
				'00000000-0000-0000-0000-000000000000': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(true);
	});

	it('should return what a user can do on a closed item', function() {
		var task = {
			status: service.TASK_STATUS.CLOSED,
			members: {
				'00000000-0000-0000-0000-000000000001': {
					role: 'member'
				}
			}
		};

		expect(service.isAllowed('editTask', task)).toBe(false);
		expect(service.isAllowed('deleteTask', task)).toBe(false);
		expect(service.isAllowed('joinTask', task)).toBe(false);
		expect(service.isAllowed('unjoinTask', task)).toBe(false);
		expect(service.isAllowed('executeTask', task)).toBe(false);
		expect(service.isAllowed('reExecuteTask', task)).toBe(false);
		expect(service.isAllowed('estimateTask', task)).toBe(false);
		expect(service.isAllowed('remindTaskEstimate', task)).toBe(false);
		expect(service.isAllowed('completeTask', task)).toBe(false);
		expect(service.isAllowed('reCompleteTask', task)).toBe(false);
		expect(service.isAllowed('acceptTask', task)).toBe(false);
		expect(service.isAllowed('assignShares', task)).toBe(false);
		expect(service.isAllowed('showShares', task)).toBe(true);
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
	//	service.joinTask(service.collection._embedded['ora:task'][0], identity);
	//	expect(service.collection._embedded['ora:task'][0].members.length, 1);
	//});
	//
	//it('should add remove user as a member of the task', function() {
	//	var task = {
	//		id: "00000000-0000-0000-0000-000000000000",
	//		members: {}
	//	};
	//	task.members[identity.id] = identity;
	//
	//	service.collection._embedded['ora:task'].push(task);
	//
	//	service.unjoinTask(service.collection._embedded['ora:task'][0], identity);
	//	expect(service.collection._embedded['ora:task'][0].members.length, 0);
	//});
});