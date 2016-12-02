var app = angular.module('monitor', ['bootstrap-notify']);

app.factory('appService',function($http,$timeout,$interval,bootstrapNotify) {
	
	function appService() {	
	
		var self = this;	
		
		self.draw = function(scope) {
			
			$interval(function() {

				if (localStorage.clearScreen == 1) {
					localStorage.clearScreen = 0;
					scope.views.pick = '';
					scope.views.office = '';
				}
				
				if (localStorage.status == "start") {

					localStorage.status = "stop";
					
					$http({
					  method: 'POST',
					  url: 'controllers/monitor.php?r=draw',
					  data: {draw_id: localStorage.prize}
					}).then(function mySucces(response) {
						scope.views.pick = response.data['fullname'];
						scope.views.office = response.data['office'];
					}, function myError(response) {

					  // error

					});					
					
				}
				
			},1000);
			
		};
	
	}
	
	return new appService();	
	
});

app.controller('monitorCtrl', function($scope,$interval,appService,bootstrapNotify) {
	
	$scope.views = {};
	
	$scope.views.pick = '';
	$scope.views.office = '';
	
	if ( (localStorage.status == undefined) || (localStorage.prize == undefined) || (localStorage.prize_type == undefined) || (localStorage.clear == undefined) ) {
		
		bootstrapNotify.show('danger','Monitor is not ready, make sure the Dashboard in the Admin Page is active.');
		
	} else {
		
		localStorage.status = "stop";
		localStorage.prize = 0;
		localStorage.prize_type = "";
		localStorage.clearScreen = 0;
		
		bootstrapNotify.show('success','Monitor is ready for raffle draws.');
		appService.draw($scope);		
		
	}
	
});