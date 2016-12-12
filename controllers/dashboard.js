var app = angular.module('dashboard', ['block-ui','bootstrap-notify','bootstrap-modal','account-module']);

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
				  { "bSortable": false }, null, null, null, null, null, { "bSortable": false }
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
			
			$http({
			  method: 'POST',
			  url: 'controllers/dashboard.php?r=validate_winners',
			  data: {id: draw['id']}
			}).then(function mySucces(response) {

				if ((parseInt(response.data['total']) + 1) <= parseInt(draw['no_of_winners'])) {
					bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to draw '+draw['prize_description']+'?',function() { execDraw(); },function() {});
				} else {
					bootstrapNotify.show('danger','Maximum allowed no of winner(s) for ' + draw['prize_description'] + ' has been reached');
				}
				
				
			}, function myError(response) {

			  // error

			});

			function execDraw() {
				
				localStorage.status = "start";
				localStorage.prize = draw['id'];
				localStorage.prize_type = draw['prize_type'];
				bootstrapNotify.show('success',draw['prize_description']+' raffle draw has started');
				$('#dynamic-table').dataTable().fnDestroy();
				$timeout(function() { self.draws(scope); },1000);

			};
			
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
					localStorage.toggledDraw = "";
					localStorage.toggledDrawPrizeType = "";
					localStorage.clearScreen = 1;					
					blockUI.hide();
					
				}, function myError(response) {

				  // error

				});					
				
			}			
			
		};
		
		self.delWinner = function(scope,id) {
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this winner?',function() { delWinner(); },function() {});

			function delWinner() {
				
				blockUI.show();
				$http({
				  method: 'POST',
				  url: 'controllers/dashboard.php?r=delete_winner',
				  data: {id: [id]}
				}).then(function mySucces(response) {
					
					$('#dynamic-table').dataTable().fnDestroy();
					self.draws(scope);
					blockUI.hide();
					localStorage.clearScreen = 1;
					
				}, function myError(response) {

				  // error

				});					
				
			}			
			
		};		
		
	};
	
	return new appService();
	
});

app.controller('dashboardCtrl', function($http,$scope,$timeout,appService,bootstrapNotify) {
	
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
		
		if (!$scope.views.toggledDraw.hasOwnProperty("id")) {
			bootstrapNotify.show('danger','You must toggle on this raffle first to make a draw');
			return;
		};
		
		if ($scope.views.toggledDraw.id != draw_id) {
			bootstrapNotify.show('danger','You must toggle off ' + $scope.views.toggledDraw['description'] + ' raffle and toggle on this raffle to make a draw');
			return;			
		}
		
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
	
	$scope.delWinner = function(id) {
		appService.delWinner($scope,id);
	};
	
	$scope.monitor = function() {
		window.open("monitor/","_blank","");
	};
	
	$scope.clear = function() {
		localStorage.clearScreen = 1;
	};
	
	$scope.toggle = function(prize) {

		$scope.views.toggledDraw = {};
		localStorage.clearScreen = 1;
		
		var c = Object.keys($scope.views.toggles).length;				
		
		if (c > 1) {
			localStorage.showDrawPrize = 0;			
			oneSelection();			
			$timeout(function() { showDrawPrize(); },500);
		} else {
			oneSelection();
			showDrawPrize();
		}
		
		function oneSelection() {
			angular.forEach($scope.views.toggles, function(value, key) {
				if (prize.id != key) {
					$scope.views.toggles[key] = false;
				}
			});
		};
		
		function showDrawPrize() {
			
			if ($scope.views.toggles[prize.id]) {
				$scope.views.toggledDraw = prize;
				bootstrapNotify.show('success',prize['description'] + ' is toggled on');
				localStorage.showDrawPrize = prize['id'];
				localStorage.toggledDraw = prize['description'];
				localStorage.toggledDrawPrizeType = prize['prize_type'] + ' Prize';
			} else {
				localStorage.showDrawPrize = 0;
			}
		
		};
		
	};
	
	$scope.print = function(id) {
		window.open("reports/report.php?id="+id);
	}
	
	appService.draws($scope);

	$timeout(function() { $scope.views.prizeTypeSelect(); },100);
	
	if (localStorage.status == undefined) localStorage.status = "stop";
	if (localStorage.prize == undefined) localStorage.prize = 0;
	if (localStorage.prize_type == undefined) localStorage.prize_type = "";
	if (localStorage.clearScreen == undefined) localStorage.clearScreen = 0;
	
	if (localStorage.showDrawPrize == undefined) localStorage.showDrawPrize = 0;
	if (localStorage.toggledDraw == undefined) localStorage.toggledDraw = "";
	if (localStorage.toggledDrawPrizeType == undefined) localStorage.toggledDrawPrizeType = "";
	
	$scope.views.toggles = {};
/* 	$scope.views.toggles.prototype.length = function() {
		return Object.keys(this).length;
	}; */
	
	$scope.views.toggledDraw = {};
	
	localStorage.showDrawPrize = 0;
	
});