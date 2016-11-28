var app = angular.module('employees', ['block-ui','bootstrap-notify','bootstrap-modal']);

app.factory('appService',function($http,$timeout,bootstrapModal,blockUI) {
	
	function appService() {
		
		var self = this;
		
		self.employees = function(scope) {
			
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
				  null, null, null, { "bSortable": false }, { "bSortable": false }
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
		
		self.editEmployee = function(scope,id) {

			var frm = '';
				frm += '<form class="form-horizontal">';
				frm += '<div class="form-group">';
				frm += '<label class="col-md-3 control-label no-padding-right">Employee ID</label>';
				frm += '<div class="col-md-9">';
				frm += '<input class="form-control" type="text" name="empid" ng-model="info.empid">';
				frm += '</div>';
				frm += '</div>';
				frm += '<div class="form-group">';
				frm += '<label class="col-md-3 control-label no-padding-right">Fullname</label>';
				frm += '<div class="col-md-9">';
				frm += '<input type="text" class="form-control" name="fullname" ng-model="info.fullname">';
				frm += '</div>';
				frm += '</div>';
				frm += '<div class="form-group">';
				frm += '<label class="col-md-3 control-label no-padding-right">Office</label>';
				frm += '<div class="col-md-9">';
				frm += '<input class="form-control" type="text" name="office" ng-model="info.office">';
				frm += '</div>';
				frm += '</div>';					
				frm += '</form>';
				
			bootstrapModal.confirm(scope,'Employee Info',frm,function() { updateInfo(); },function() {});

			$timeout(function() { 
				
				$http({
				  method: 'POST',
				  url: 'controllers/employees.php?r=edit',
				  data: {id: id}
				}).then(function mySucces(response) {
					
					scope.info = response.data;
					
				}, function myError(response) {

				  // error

				});				

			},100);

			function updateInfo() {
				
				$http({
				  method: 'POST',
				  url: 'controllers/employees.php?r=update',
				  data: scope.info
				}).then(function mySucces(response) {
					
					// $('#dynamic-table').dataTable().fnDestroy();
					// self.employees(scope);
					
				}, function myError(response) {

				  // error

				});
				
			};			
		
		};
		
		self.delEmployee = function(scope,id) {
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this record?',function() { del(id); },function() {});
			
			function del(id) {
				
				$http({
				  method: 'POST',
				  data: {id: [id]},
				  url: 'controllers/employees.php?r=delete'
				}).then(function mySucces(response) {
					
					$('#dynamic-table').dataTable().fnDestroy();
					self.employees(scope);
					
				}, function myError(response) {
					 
				  // error
					
				});

			}			
			
		}
		
	}
	
	return new appService();
	
});

app.directive('importEmployees',function($http,$timeout,blockUI,appService) {
	
	return {		
		restrict: 'A',
		link: function(scope, element, attrs) {
			
			element.bind('click', function(){
			
			scope.views.alert = false;
			scope.views.alertMsg = '';			
			
			blockUI.show('Collecting employees infos...please wait');
			
				$http({
				  method: 'POST',
				  url: 'controllers/employees.php?r=collect'
				}).then(function mySucces(response) {
					
					if (response.data['status'] == 0) {
						blockUI.hide();
						scope.views.alert = true;
						scope.views.alertMsg = response.data['content'];						
					} else {
						scope.views.importProgress = true;
						scope.views.progressPercent = 1;
						scope.views.idxCurrent = 1;
						scope.views.idxTotal = response.data['employees'].length;
						scope.views.progressStatus = scope.views.idxCurrent + ' / ' + scope.views.idxTotal + ' (' + scope.views.progressPercent + '%)';						
						importEmployee(response.data['employees']);
						blockUI.hide();						
					}
					
				}, function myError(response) {

				  // error

				});				
				
			});	

			function importEmployee(employees) {

				$http({
				  method: 'POST',
				  url: 'controllers/employees.php?r=import',
				  data: {fullname: employees[scope.views.idxCurrent][0], empid: employees[scope.views.idxCurrent][1], office: employees[scope.views.idxCurrent][2]}
				}).then(function mySucces(response) {
					
					scope.views.progressPercent = Math.round((scope.views.idxCurrent*100)/scope.views.idxTotal);
					scope.views.progressStatus = (scope.views.idxCurrent + 1) + ' / ' + scope.views.idxTotal + ' (' + scope.views.progressPercent + '%)';					
					
					if (scope.views.idxCurrent <= scope.views.idxTotal) {
						scope.views.idxCurrent++;
						importEmployee(employees);
					}
					
					if ((scope.views.idxCurrent + 1) == scope.views.idxTotal) {
						$timeout(function() {
							$('#dynamic-table').dataTable().fnDestroy();
							appService.employees(scope);
							scope.views.importProgress = false;
							scope.views.progressPercent = 0;						
							scope.views.progressStatus = '';
						}, 500);
					}					
					
				}, function myError(response) {

				  // error

				});					
				
			}
			
		}
	};
	
});

app.controller('employeesCtrl', function($scope,$interval,appService) {
	
	$scope.views = {};
	
	$scope.views.importProgress = false;
	$scope.views.progressStatus = '';
	$scope.views.progressPercent = 0;
	
	$scope.views.alert = false;
	$scope.views.alertMsg = '';
	
	appService.employees($scope);
	
	$scope.editEmployee = function(id) {
		appService.editEmployee($scope,id);
	};
	
	$scope.delEmployee = function(id) {
		appService.delEmployee($scope,id);
	};	
	
});