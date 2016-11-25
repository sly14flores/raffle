angular.module('block-ui',[]).service('blockUI',function($timeout,$compile) {
	
	this.show = function(msg = 'Please wait...') {

		$.blockUI({
			message: '<span style="font-size: 12px;">'+msg+'</span>',
			css: {
			border: 'none',
			padding: '15px',
			backgroundColor: '#000',
			'-webkit-border-radius': '10px',
			'-moz-border-radius': '10px',
			opacity: .5,
			color: '#fff'
			}
		});

	}

	this.hide = function() {

		$.unblockUI();

	}

	this.login = function(scope) {
		
		var frm = '';
		
		frm += '<form id="lock-frmLogin" class="form-signin" novalidate>';
		frm += '<h4 class="form-signin-heading">Please provide you password to log back in</h4>';
		frm += '<label class="sr-only">Password</label>';
		frm += '<input type="password" name="lockPw" ng-model="lockPw" class="form-control" placeholder="Password">';
		frm += '<div class="alert alert-danger" ng-show="lockPwInvalid">Invalid Password</div>';
		frm += '<button class="btn btn-lg btn-success btn-block" type="submit" ng-click="lockLogin()">Login</button>';
		frm += '</form>';
		
		$.blockUI({
			message: frm,
			css: {
			border: 'none',
			padding: '15px',
			backgroundColor: '#000',
			'-webkit-border-radius': '10px',
			'-moz-border-radius': '10px',
			opacity: .5,
			color: '#fff'
			}
		});
		
		scope.lockPwInvalid = false;
		$timeout(function() { $compile($('#lock-frmLogin')[0])(scope); },100);

	}
	
});