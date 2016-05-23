var Identity = function($http, $log, $q) {
	var token, id, firstname, lastname, email, avatar, memberships;

	this.getToken        = function() { return token; };
	this.getId           = function() { return id; };
	this.getFirstname    = function() { return firstname; };
	this.getLastname     = function() { return lastname; };
	this.getEmail        = function() { return email; };
	this.getAvatar       = function() { return avatar; };
	this.isAuthenticated = function() { return token ? true : false; };
	this.getMemberships  = function() { return memberships; };

	//TODO: aggiungere gestione contributor
	this.isMember = function(orgId){
		return !!this.getMembership(orgId);
	};

	this.getMembershipRole = function(orgId){
		var rv = null;
		angular.forEach(memberships, function(value) {
			if(value.organization.id === orgId) {
				rv = value.role;
			}
		});
		return rv;
	};

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

		this.updateMemberships();
	};

	this.updateMemberships = function() {
		return $http({method: 'GET', url: 'api/memberships', headers: {'GOOGLE-JWT': token}}).success(function(data) {
			id        = data.id;
			firstname = data.firstname;
			lastname  = data.lastname;
			email     = data.email;
			avatar    = data.picture;
			memberships = data._embedded['ora:organization-membership'];
			$log.info('User ' + firstname + ' is member of ' + memberships.length + " organizations");
		});
	};

	this.loadMemberships = function(){
		if(memberships){
			var deferred = $q.defer();
			deferred.resolve(memberships);
			return deferred.promise;
		}else{
			return this.updateMemberships().then(function(){
				return memberships;
			});
		}
	};

	this.loadMembership = function(orgId){
		var that = this;
		return this.loadMemberships().then(function(){
			return that.getMembership(orgId);
		});
	};
};
angular.module('app.identity')
	.service('identity', ['$http', '$log', '$q', Identity]);
