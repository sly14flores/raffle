var app = angular.module('dashboard', ['block-ui','bootstrap-notify','bootstrap-modal']);

app.factory('appService',function($http,$timeout,bootstrapModal,bootstrapNotify,blockUI) {
	
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
		
		self.add = function(scope,prize) {
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to add '+prize['prize_description']+'?',function() { add(); },function() {});

			function add() {
				
				blockUI.show(prize['prize_description']+ ' on progress...');
				$http({
				  method: 'POST',
				  url: 'controllers/dashboard.php?r=add',
				  data: {prize_id: prize['id'], draw_date: 'CURRENT_TIMESTAMP'}
				}).then(function mySucces(response) {
					blockUI.hide();
					$('#dynamic-table').dataTable().fnDestroy();
					$timeout(function() { self.draws(scope); },100);
				}, function myError(response) {

				  // error

				});					
				
			}
			
		};
		
		self.draw = function(scope,draw) {
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to draw '+draw['prize_description']+'?',function() { execDraw(); },function() {});

			function execDraw() {
				
				blockUI.show(draw['prize_description']+ ' on progress...');
				$http({
				  method: 'POST',
				  url: 'controllers/dashboard.php?r=draw',
				  data: {prize_id: draw['id'], draw_date: 'CURRENT_TIMESTAMP'}
				}).then(function mySucces(response) {
					blockUI.hide();
					$('#dynamic-table').dataTable().fnDestroy();
					$timeout(function() { self.draws(scope); },100);
					localStorage.status = "start";
					localStorage.prize = draw['id'];
					localStorage.prize_type = draw['prize_type'];
					bootstrapNotify.show('success',draw['prize_description']+' raffle draw has started');
					
				}, function myError(response) {

				  // error

				});					
				
			}
			
		};		
		
		self.del = function(scope,id) {
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this draw?',function() { del(); },function() {});

			function del() {
				
				blockUI.show();
				$http({
				  method: 'POST',
				  url: 'controllers/dashboard.php?r=delete',
				  data: {id: [id]}
				}).then(function mySucces(response) {
					
					$('#dynamic-table').dataTable().fnDestroy();
					self.draws(scope);
					blockUI.hide();
					
				}, function myError(response) {

				  // error

				});					
				
			}			
			
		};
		
	};
	
	return new appService();
	
});

app.controller('dashboardCtrl', function($http,$scope,$timeout,appService) {
	
	$scope.views = {};
	
	$scope.views.alert = false;
	$scope.views.alertMsg = '';

	$scope.add = function() {
		$scope.views.alert = false;
		$scope.views.alertMsg = '';
		$scope.views.alertMsg = '';		
		if (($scope.views.prize == undefined) || ($scope.views.prize == '')) {
			$scope.views.alert = true;
			$scope.views.alertMsg = 'No prize to add, please select one';
			return;
		}
		appService.add($scope,$scope.views.prize);
	};	
	
	$scope.draw = function(draw_id) {	
		$http({
		  method: 'POST',
		  url: 'controllers/dashboard.php?r=prize',
		  data: {draw_id: draw_id}
		}).then(function mySucces(response) {

			appService.draw($scope,response.data);
			
		}, function myError(response) {

		  // error

		});
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
	
	$scope.del = function(id) {
		appService.del($scope,id);
	};
	
	$scope.monitor = function() {
		window.open("monitor/","_blank","");
	}
	
	appService.draws($scope);

	$timeout(function() { $scope.views.prizeTypeSelect(); },100);
	
	if (localStorage.status == undefined) localStorage.status = "stop";
	if (localStorage.prize == undefined) localStorage.prize = 0;
	if (localStorage.prize_type == undefined) localStorage.prize_type = "";
	
});