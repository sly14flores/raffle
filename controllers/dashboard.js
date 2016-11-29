var app = angular.module('dashboard', ['block-ui','bootstrap-notify','bootstrap-modal']);

app.factory('appService',function($http,$timeout,bootstrapModal,blockUI) {
	
	function appService() {
		
		var self = this;
		
		self.draws = function(scope) {
			
			blockUI.show();
			scope.activeTemplate = 'views/draws-list.php';
			
			$http({
			  method: 'POST',
			  url: 'controllers/dashboard.php?r=list'
			}).then(function mySucces(response) {
			
				scope.draws = response.data;
				
			}, function myError(response) {

			  // error

			});
			
			//initiate dataTables plugin
			$timeout(function() {
			var oTable1 = 
			$('#dynamic-table')
			//.wrap("<div class='dataTables_borderWrap' />")   //if you are applying horizontal scrolling (sScrollX)
			.dataTable( {
				bAutoWidth: false,
				"aoColumns": [
				  null, null, null, null, { "bSortable": false }
				],
				"aaSorting": [],
		
				//,
				//"sScrollY": "200px",
				//"bPaginate": false,
		
				//"sScrollX": "100%",
				//"sScrollXInner": "120%",
				//"bScrollCollapse": true,
				//Note: if you are applying horizontal scrolling (sScrollX) on a ".table-bordered"
				//you may want to wrap the table inside a "div.dataTables_borderWrap" element
		
				//"iDisplayLength": 50
			} );
			//oTable1.fnAdjustColumnSizing();
			
			}, 500);
			
			$timeout(function() { blockUI.hide(); },1000);		
			
		};
		
	};
	
	return new appService();
	
});

app.controller('dashboardCtrl', function($scope,$timeout,appService) {
	
	$scope.views = {};
	$scope.info = {};
	
	appService.draws($scope);
	
});