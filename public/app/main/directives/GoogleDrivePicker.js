(function() {
	"use strict";

	var APIKEY_GOOGLE  = 'AIzaSyBx2sD5LLPis-w2k53aujeDuevtn5rWXdw';
	var CLIENT_ID_GOOLE = '324494101979-kd155mfhheot9jjplga314139rl0p5pk';
	var access_token;
	var picker;
	var GOOGLE_AUTH_INFO = {
		'client_id': CLIENT_ID_GOOLE,
		'scope': "https://www.googleapis.com/auth/drive.readonly",
		'immediate': true
	};

	var showPicker = function(callback) {
		var pickerCallback = function(data) {
			if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
				var file = data[google.picker.Response.DOCUMENTS][0],id = file[google.picker.Document.ID],request = gapi.client.drive.files.get({
					fileId: id
				});

				request.execute(callback(file));
			}
		};

		picker = new google.picker.PickerBuilder().
			addView(google.picker.ViewId.DOCUMENTS).
			setAppId(CLIENT_ID_GOOLE).
			setOAuthToken(access_token).
			setCallback(pickerCallback).
			build().
			setVisible(true);
	};

	angular.module('app').directive('googleDrivePicker',[
		'$q',
		function($q){

			var doAuth = function(){
				var deferred = $q.defer();
				gapi.load('auth', {'callback': function(){
					window.gapi.auth.authorize(GOOGLE_AUTH_INFO,function(authResult){
						access_token = authResult.access_token;
						deferred.resolve(access_token);
					});
				}});
				return deferred.promise;
			};

			return {
				restrict: 'A',
				scope:{
					onFileSelect:'&?'
				},
				link: function($scope, element, attrs) {
					var domElement = element[0];

					$scope.onFileSelect = $scope.onFileSelect || _.noop;

					doAuth().then(function(){
						domElement.addEventListener('click', function(){
							showPicker(function(file){
								$scope.onFileSelect({
									file:file
								});
							});
						});
					});
				}
			};
		}]);
	}());
