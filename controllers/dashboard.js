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
		
		self.draw = function(scope,prize) {
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to proceed to draw '+prize['prize_description']+'?',function() { execDraw(); },function() {});

			function execDraw() {
				
				blockUI.show(prize['prize_description']+ ' on progress...');
				$http({
				  method: 'POST',
				  url: 'controllers/dashboard.php?r=draw',
				  data: {prize_id: prize['id'], draw_date: 'CURRENT_TIMESTAMP'}
				}).then(function mySucces(response) {
				
					blockUI.hide();
					
				}, function myError(response) {

				  // error

				});					
				
			}
			
		}
		
	};
	
	return new appService();
	
});

app.controller('dashboardCtrl', function($http,$scope,$timeout,appService) {
	
	$scope.views = {};
	
	$scope.views.alert = false;
	$scope.views.alertMsg = '';
	
	$scope.draw = function() {
		$scope.views.alert = false;
		$scope.views.alertMsg = '';		
		if (($scope.views.prize == undefined) || ($scope.views.prize == '')) {
			$scope.views.alert = true;
			$scope.views.alertMsg = 'No prize to draw, please select one';
			return;
		}
		appService.draw($scope,$scope.views.prize);
	};
	
	$scope.views.prizeTypeSelect = function() {
		$http({
		  method: 'POST',
		  url: 'controllers/dashboard.php?r=prizes',
		  data: {prize_type: $scope.views.prize_type}
		}).then(function mySucces(response) {
		
			$scope.views.prizes = response.data;
			
		}, function myError(response) {

		  // error

		});		
	};
	
	appService.draws($scope);

	$timeout(function() { $scope.views.prizeTypeSelect(); },100);
	
});