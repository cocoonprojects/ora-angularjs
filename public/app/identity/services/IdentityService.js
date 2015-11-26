var Identity = function($http, $log) {
	var token, id, firstname, lastname, email, avatar, memberships;

	this.getToken        = function() { return token; };
	this.getId           = function() { return id; };
	this.getFirstname    = function() { return firstname; };
	this.getLastname     = function() { return lastname; };
	this.getEmail        = function() { return email; };
	this.getAvatar       = function() { return avatar; };
	this.isAuthenticated = function() { return token ? true : false; };
	this.getMemberships  = function() { return memberships; };

	this.getMembership = function(orgId) {
		var rv = null;
		angular.forEach(memberships, function(value) {
			if(value.organization.id === orgId) {
				rv = value.organization;
			}
		});
		return rv;
	};

	this.reset = function() {
		token = firstname = lastname = email = avatar = '';
		memberships = [];
	};

	this.signInFromGoogle = function(googleUser) {
		token = googleUser.getAuthResponse().id_token;
		$log.info("ID Token: " + token);

		// Useful data for your client-side scripts:
		var profile = googleUser.getBasicProfile();
		firstname = profile.getName();
		avatar = profile.getImageUrl();
		email = profile.getEmail();

		this.updateMemberships(token);
	};

	this.updateMemberships = function(id_token) {
		$http({method: 'GET', url: 'api/memberships', headers: {'GOOGLE-JWT': id_token}}).success(function(data) {
			id        = data.id;
			firstname = data.firstname;
			lastname  = data.lastname;
			email     = data.email;
			avatar    = data.picture;
			memberships = data._embedded['ora:organization-membership'];
			$log.info('User ' + firstname + ' is member of ' + memberships.length + " organizations");
		});
	};
};
angular.module('oraApp.identity')
	.service('identity', ['$http', '$log', Identity]);