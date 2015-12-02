describe('accountService', function() {

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

	beforeEach(inject(function($resource, $interval) {
		service = new AccountService($resource, $interval, identity);
	}));

	it('should return 0 for an undefined transaction list', function() {
		expect(service.getInitialBalance()).toBe(0);
	});

	it('should return 0 for a null transaction list', function() {
		var transactions = null;
		expect(service.getInitialBalance(transactions)).toBe(0);
	});

	it('should return 0 for an empty transaction list', function() {
		var transactions = [];
		expect(service.getInitialBalance(transactions)).toBe(0);
	});

	it('should return 0 for a single item transaction list where amount = balance', function() {
		var transactions = [
			{ amount: 50, balance: 50 }
		];
		expect(service.getInitialBalance(transactions)).toBe(0);
	});

	it('should return 50 for this single item transaction list which increase an account', function() {
		var transactions = [
			{ amount: 50, balance: 100 }
		];
		expect(service.getInitialBalance(transactions)).toBe(50);
	});

	it('should return 50 for this single item transaction list which increase an account', function() {
		var transactions = [
			{ amount: 50, balance: 120 },
			{ amount: 30, balance: 70 }
		];
		expect(service.getInitialBalance(transactions)).toBe(40);
	});

	it('should return 100 for this single item transaction list which decrease an account', function() {
		var transactions = [
			{ amount: 50, balance: 120 },
			{ amount: -30, balance: 70 }
		];
		expect(service.getInitialBalance(transactions)).toBe(100);
	});

	it('should return -30 for this single item transaction list which decrease an account', function() {
		var transactions = [
			{ amount: 50, balance: 120 },
			{ amount: 100, balance: 70 }
		];
		expect(service.getInitialBalance(transactions)).toBe(-30);
	});

	it('should return true if the statement is of shared type', function() {
		var statement = {
			type: 'shared'
		};
		expect(service.isOrganizationAccount(statement)).toBeTruthy();
	});

	it('should return false if the statement is of personal type', function() {
		var statement = {
			type: 'personal'
		};
		expect(service.isOrganizationAccount(statement)).toBeFalsy();
	});

	it('should return false if the statement does not contain user as holder', function() {
		var statement = {
			holders: {
				'00000000-0000-0000-0000-000000000001': {
					id: '00000000-0000-0000-0000-000000000001',
					firstname: 'Jane',
					lastname: 'Doe'
				}
			}
		};
		expect(service.isHolder(statement, identity.id)).toBe(false);
	});

	it('should return false if the statement does not contain user as holder', function() {
		var statement = {
			holders: {}
		};
		expect(service.isHolder(statement, identity.id)).toBe(false);
	});

	it('should return false if the statement does not contain user as holder', function() {
		var statement = {
		};
		expect(service.isHolder(statement, identity.id)).toBeFalsy();
	});

	it('should return true if the statement contains user as holder', function() {
		var statement = {
			holders: {
				'00000000-0000-0000-0000-000000000000': null
			}
		};
		expect(service.isHolder(statement, identity.id)).toBe(true);
	});

	it('should return true if the statement contains user as holder', function() {
		var statement = {
			holders: {
				'00000000-0000-0000-0000-000000000000': {
					id: '00000000-0000-0000-0000-000000000000',
					firstname: 'John',
					lastname: 'Doe'
				}
			}
		};
		expect(service.isHolder(statement, identity.id)).toBe(true);
	});

	it('should return what the user can do on an organization account', function() {
		var statement = {
			type: 'shared',
			holders: {
				'00000000-0000-0000-0000-000000000001': {
					id: '00000000-0000-0000-0000-000000000001',
					firstname: 'Jane',
					lastname: 'Doe'
				}
			}
		};
		expect(service.isAllowed('deposit', statement)).toBe(false);
	});

	it('should return what the user can do on an organization account as holder', function() {
		var statement = {
			type: 'shared',
			holders: {
				'00000000-0000-0000-0000-000000000000': {
					id: '00000000-0000-0000-0000-000000000000',
					firstname: 'John',
					lastname: 'Doe'
				}
			}
		};
		expect(service.isAllowed('deposit', statement)).toBe(true);
	});

	it('should return what the user can do on an personal account', function() {
		var statement = {
			type: 'personal',
			holders: {
				'00000000-0000-0000-0000-000000000001': {
					id: '00000000-0000-0000-0000-000000000001',
					firstname: 'Jane',
					lastname: 'Doe'
				}
			}
		};
		expect(service.isAllowed('deposit', statement)).toBeFalsy();
	});

	it('should return what the user can do on an personal account as holder', function() {
		var statement = {
			type: 'personal',
			holders: {
				'00000000-0000-0000-0000-000000000000': {
					id: '00000000-0000-0000-0000-000000000000',
					firstname: 'John',
					lastname: 'Doe'
				}
			}
		};
		expect(service.isAllowed('deposit', statement)).toBeFalsy();
	});
});