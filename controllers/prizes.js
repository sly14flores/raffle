var app = angular.module('prizes', ['block-ui','bootstrap-notify','bootstrap-modal','account-module']);

app.factory('appService',function($http,$timeout,bootstrapModal,blockUI) {
	
	function appService() {
		
		var self = this;
		
		self.prizes = function(scope) {
			
			blockUI.show('Fetching prizes...');
			scope.activeTemplate = 'views/prizes-list.php';
			
			$http({
			  method: 'POST',
			  url: 'controllers/prizes.php?r=list'
			}).then(function mySucces(response) {
			
				scope.prizes = response.data;
				
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
				  null, null, null, { "bSortable": false }
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
		
		self.prizeForm = function(scope,id) {

			var frm = '';
				frm += '<form class="form-horizontal">';
				frm += '<div class="form-group">';
				frm += '<label class="col-md-3 control-label no-padding-right">Prize Description</label>';
				frm += '<div class="col-md-9">';
				frm += '<input class="form-control" type="text" name="prize_description" ng-model="info.prize_description">';
				frm += '</div>';
				frm += '</div>';
				frm += '<div class="form-group">';
				frm += '<label class="col-md-3 control-label no-padding-right">Prize Type</label>';
				frm += '<div class="col-md-9">';
				frm += '<select class="form-control" name="prize_type" ng-change="prizeTypeSelect()" ng-model="info.prize_type">';
				frm += '<option value=""></option>';
				frm += '<option value="Minor">Minor Prize</option>';
				frm += '<option value="Major">Major Prize</option>';
				frm += '<option value="Jackpot">Jackpot Prize</option>';
				frm += '</select>';
				frm += '</div>';
				frm += '</div>';
				frm += '<div class="form-group">';
				frm += '<label class="col-md-3 control-label no-padding-right">No of Winner(s)</label>';
				frm += '<div class="col-md-9">';
				frm += '<input class="form-control" type="number" name="no_of_winners" ng-model="info.no_of_winners" ng-disabled="views.no_of_winners">';
				frm += '</div>';
				frm += '</div>';					
				frm += '</form>';
				
			bootstrapModal.confirm(scope,'Prize Info',frm,function() { updateInfo(); },function() {});
			
			if (id > 0) {
				$timeout(function() { 
					
					$http({
					  method: 'POST',
					  url: 'controllers/prizes.php?r=edit',
					  data: {id: id}
					}).then(function mySucces(response) {
						
						scope.info = response.data;
						$timeout(function() { if (scope.info.prize_type == "Jackpot") scope.views.no_of_winners = true; },100);						
						
					}, function myError(response) {

					  // error

					});				

				},100);
			}

			function updateInfo() {
				
				$http({
				  method: 'POST',
				  url: 'controllers/prizes.php?r=save_update',
				  data: scope.info
				}).then(function mySucces(response) {
					
					$('#dynamic-table').dataTable().fnDestroy();
					self.prizes(scope);
					
				}, function myError(response) {

				  // error

				});
				
			};			
		
		};
		
		self.delPrize = function(scope,id) {
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this record?',function() { del(id); },function() {});
			
			function del(id) {
				
				$http({
				  method: 'POST',
				  data: {id: [id]},
				  url: 'controllers/prizes.php?r=delete'
				}).then(function mySucces(response) {
					
					$('#dynamic-table').dataTable().fnDestroy();
					self.prizes(scope);
					
				}, function myError(response) {
					 
				  // error
					
				});

			}			
			
		}
		
	}
	
	return new appService();
	
});

app.controller('prizesCtrl', function($scope,$timeout,appService) {
	
	$scope.views = {};
	$scope.info = {};
	
	appService.prizes($scope);
	
	$scope.addPrize = function() {		
		appService.prizeForm($scope,0);
		$scope.info.no_of_winners = "";
		$scope.views.no_of_winners = false;
		$scope.info.prize_type = "";
		$scope.info = {};		
	}
	
	$scope.editPrize = function(id) {
		appService.prizeForm($scope,id);
		$scope.views.no_of_winners = false;
	};
	
	$scope.delPrize = function(id) {
		appService.delPrize($scope,id);
	};
	
	$scope.prizeTypeSelect = function() {
		$scope.info.no_of_winners = "";
		$scope.views.no_of_winners = false;		
		if ($scope.info.prize_type == "Jackpot") {
			$scope.info.no_of_winners = 1;
			$scope.views.no_of_winners = true;
		}
	};
	
});