angular.module('account-module',['bootstrap-modal']).directive('logoutAccount', function($http,$window,bootstrapModal) {

	return {
	    restrict: 'A',
	    link: function(scope, element, attrs) {			
			
			element.bind('click', function(){
					
				bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to logout?',function() { logout(); },function() {});

			});
			
			function logout() {
				
				$window.location.href = 'logout.php';
				
			}

	    }
	};

});