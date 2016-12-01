var app = angular.module('monitor', ['bootstrap-notify']);

app.factory('appService',function($http,$timeout,$interval,bootstrapNotify) {
	
	function appService() {	
	
		var self = this;	
		
		self.draw = function(scope) {
			
			$interval(function() {
				
				if (localStorage.status == "start") {

					scope.views.randomPick = 'Lorem, Ipsum ' + localStorage.prize;
					localStorage.status = "stop";
					
				}
				
			},1000);
			
		};
	
	}
	
	return new appService();	
	
});

app.controller('monitorCtrl', function($scope,$interval,appService,bootstrapNotify) {
	
	$scope.views = {};
	
	$scope.views.randomPick = '';
	
	if ( (localStorage.status == undefined) || (localStorage.prize == undefined) || (localStorage.prize_type == undefined) ) {
		
		bootstrapNotify.show('danger','Monitor is not ready, make sure the Dashboard in the Admin Page is active.');
		
	} else {
		
		localStorage.status = "stop";
		localStorage.prize = 0;
		localStorage.prize_type = "";
		bootstrapNotify.show('success','Monitor is ready for raffle draws.');
		appService.draw($scope);		
		
	}
	
});