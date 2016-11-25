var app = angular.module('employees', ['block-ui']);

app.factory('appService',function($http,$timeout,blockUI) {
	
	function appService() {
		
		var self = this;
		
		this.employees = function(scope) {
			
			blockUI.show('Fetching employees...');
			scope.activeTemplate = 'views/employees-list.php';
			
			$http({
			  method: 'POST',
			  url: 'controllers/employees.php?r=list'
			}).then(function mySucces(response) {
			
				scope.employees = response.data;
				
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
				  null, null, null,
				  { "bSortable": false }
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
			
		}
		
	}
	
	return new appService();
	
});

app.controller('employeesCtrl', function($scope,$interval,appService) {
	
	appService.employees($scope);
	
});