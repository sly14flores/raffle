<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Login Page - PGLU | eRaffle System</title>

		<meta name="description" content="User login page" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

		<!-- bootstrap & fontawesome -->
		<link rel="stylesheet" href="assets/css/bootstrap.min.css" />
		<link rel="stylesheet" href="assets/font-awesome/4.2.0/css/font-awesome.min.css" />

		<!-- text fonts -->
		<link rel="stylesheet" href="assets/fonts/fonts.googleapis.com.css" />

		<!-- ace styles -->
		<link rel="stylesheet" href="assets/css/ace.min.css" />

		<!--[if lte IE 9]>
			<link rel="stylesheet" href="assets/css/ace-part2.min.css" />
		<![endif]-->
		<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />

		<!--[if lte IE 9]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

		<!--[if lt IE 9]>
		<script src="assets/js/html5shiv.min.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->
	</head>

	<body class="login-layout blur-login" ng-app="login" ng-controller="loginCtrl">
		<div class="main-container">
			<div class="main-content">
				<div class="row">
					<div class="col-sm-10 col-sm-offset-1">
						<div class="login-container">
							<div class="center">
								<h1>
									<span class="red">eRaffle</span>
									<span class="white" id="id-text2">System</span>
								</h1>
								<h4 class="blue" id="id-company-text">&copy; PGLU</h4>
							</div>

							<div class="space-6"></div>

							<div class="position-relative">
								<div id="login-box" class="login-box visible widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header blue lighter bigger">
												<i class="ace-icon fa fa-coffee green"></i>
												Please Enter Your Information
											</h4>

											<div class="space-6"></div>

											<form>
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="text" class="form-control" name="username" ng-model="account.username" placeholder="Username" />
															<i class="ace-icon fa fa-user"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input type="password" class="form-control" name="password" ng-model="account.password" placeholder="Password" />
															<i class="ace-icon fa fa-lock"></i>
														</span>
													</label>

													<div class="space"></div>													
													<div class="alert alert-danger" ng-show="views.incorrect">Username or password incorrect</div>
													<div class="clearfix">
														<button type="submit" ng-click="login()" class="width-35 pull-right btn btn-sm btn-primary">
															<i class="ace-icon fa fa-key"></i>
															<span class="bigger-110">Login</span>
														</button>
													</div>

													<div class="space-4"></div>
												</fieldset>
											</form>
											
										</div><!-- /.widget-main -->

									</div><!-- /.widget-body -->
								</div><!-- /.login-box -->
							</div><!-- /.position-relative -->

						</div>
					</div><!-- /.col -->
				</div><!-- /.row -->
			</div><!-- /.main-content -->
		</div><!-- /.main-container -->

		<!-- basic scripts -->

		<script src="angularjs/angular.min.js"></script>
		<script src="assets/js/jquery.2.1.1.min.js"></script>
		<script type="text/javascript">
		
			var app = angular.module('login', []);
			
			app.service('loginService', function($http, $window) {
				
				this.login = function(scope) {
					
					scope.views.incorrect = false;
					
					$http({
					  method: 'POST',
					  url: 'account.php?r=login',
					  data: scope.account,
					  headers : {'Content-Type': 'application/x-www-form-urlencoded'}
					}).then(function mySucces(response) {
						if (response.data['id'] == 0) {
							scope.views.incorrect = true;
						} else {
							scope.views.incorrect = false;
							$window.location.href = 'index.php';
						}
					},
					function myError(response) {
						
					});
					
				}
				
			});			
			
			app.controller('loginCtrl', function($scope, $http, $window, loginService) {
			
				$scope.views = {};
				$scope.account = {};
				
				$scope.views.incorrect = false;
				
				$scope.login = function() {
					loginService.login($scope);
				};
			
			});
			
		
		</script>

	</body>
</html>
