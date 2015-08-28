angular.module('oraApp.identity')
	.service('identity', ['$resource', '$log',
		function($resource, $log) {
			var token, firstname, lastname, email, avatar, memberships;
/*
			var memberships = {
				"count":2,
				"total":2,
				"_embedded":{
					"ora:organization-membership":[
						{
							"organization":{
								"id":"db118cc7-f3de-47d1-bfd8-39a79f44e4ae",
								"name":"Babba Rulez",
								"_links":{
									"self":{
										"href":"\/people\/organizations\/db118cc7-f3de-47d1-bfd8-39a79f44e4ae"
									},
									"ora:organization-member":{
										"href":"\/people\/organizations\/db118cc7-f3de-47d1-bfd8-39a79f44e4ae\/members"
									}
								}
							},
							"role":"admin",
							"createdAt":"2015-04-24T09:20:06+00:00",
							"createdBy":"Andrea Bandera"
						},
						{
							"organization":{
								"id":"b063a628-b1b0-4000-92fe-d3981139ea6e",
								"name":"Seconda organizzazione del Babba",
								"_links":{
									"self":{
										"href":"\/people\/organizations\/b063a628-b1b0-4000-92fe-d3981139ea6e"
									},
									"ora:organization-member":{
										"href":"\/people\/organizations\/b063a628-b1b0-4000-92fe-d3981139ea6e\/members"
									}
								}
							},
							"role":"admin",
							"createdAt":"2015-04-26T11:12:49+00:00",
							"createdBy":"Andrea Bandera"
						}
					]
				},
				"_links":{
					"self":{
						"href":"\/memberships"
					}
				}
			};*/

			this.getFirstname    = function() { return firstname };
			this.getLastname     = function() { return lastname };
			this.getEmail        = function() { return email };
			this.getAvatar       = function() { return avatar };
			this.isAuthenticated = function() { return token ? true : false };
			this.getMemberships  = function() { return memberships };

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
			};

			//$scope.setIdentity = function(user) {
			//	$scope.identity = user;
			//	$http.get('data/memberships.json').success(function(data) {
			//		$scope.memberships = data._embedded['ora:organization-membership'];
			//		$log.debug('User ' + $scope.identity.lastname + ' is member of ' + $scope.memberships.length + " organizations");
			//	});
			//}

		}]);