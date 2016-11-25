var app = angular.module('monitor', []);

app.controller('monitorCtrl', function($scope,$interval) {
	
	$scope.showAlert = false;
	
	$interval(function() {
		
		if (localStorage.start == 1) $scope.showAlert = true;
		else $scope.showAlert = false;
	
	},1000);
	
});