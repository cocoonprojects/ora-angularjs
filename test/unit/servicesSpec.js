describe('taskService', function() {

	beforeEach(module('oraApp'));

	var service;
	var currUser = {
		id: "00000000-0000-0000-0000-000000000000",
		firstname: "John",
		lastname: "Doe",
		picture: "http://lorempixel.com/337/337/people"
	};

	beforeEach(inject(function($injector){
		service = $injector.get('taskService');
	}));

	it('should return an empty task collection', function() {
		expect(service.collection._embedded['ora:task'].length).toBe(0);
	});

	//it('should return a not empty task collection after update', function() {
	//	console.log(service.updateCollection());
	//	expect(service.collection._embedded['ora:task'].length).toBe(4);
	//});

	it('should add current user as a member of the task', function() {
		var task = {
			id: "00000000-0000-0000-0000-000000000000"
		};
		service.collection._embedded['ora:task'].push(task);

		service.joinTask(service.collection._embedded['ora:task'][0], currUser);
		expect(service.collection._embedded['ora:task'][0].members.length, 1);
	});

	it('should add remove user as a member of the task', function() {
		var task = {
			id: "00000000-0000-0000-0000-000000000000",
			members: {}
		};
		task.members[currUser.id] = currUser;

		service.collection._embedded['ora:task'].push(task);

		service.unjoinTask(service.collection._embedded['ora:task'][0], currUser);
		expect(service.collection._embedded['ora:task'][0].members.length, 0);
	});
});