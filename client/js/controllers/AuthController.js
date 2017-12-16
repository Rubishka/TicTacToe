/**
 * Created by rubi on 07/12/2017.
 */
angular.module('myApp')
    .controller('AuthController',
        ['$scope','$location', 'AuthService', '$rootScope','socketio','$mdToast', '$timeout',
            function ($scope, $location, AuthService,$rootScope, socketio, $mdToast, $timeout) {

                $scope.isActive = function(route) {
                    return route === $location.path();
                };

                $scope.isAuthenticated = function() {
                    return AuthService.isLoggedIn();
                };

                $scope.cancelGame = function () {
                    AuthService.cancelGame().success(function () {
                    }).error(function () {
                        console.log(error);
                    });
                };
                $scope.cancelGame();

                $scope.login = function () {
                    // initial values
                    $scope.error = false;
                    $scope.disabled = true;
                    // call login from service
                    AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                    // handle success
                        .then(function (data) {
                            $location.path('/');
                            $scope.disabled = false;
                        })
                        // handle error
                        .catch(function () {
                            $scope.error = true;
                            $scope.errorMessage = "Invalid username and/or password";
                            $scope.disabled = false;
                            $scope.loginForm = {};
                        });
                };

                $scope.logout = function () {
                    // call logout from service
                    AuthService.logout()
                        .then(function () {
                            $location.path('/login');
                        });
                };

                $scope.register = function () {
                    // initial values
                    $scope.error = false;
                    $scope.disabled = true;
                    // call register from service
                    AuthService.register($scope.registerForm.username, $scope.registerForm.password)
                    // handle success
                        .then(function () {
                            $location.path('/login');
                            $scope.disabled = false;
                            $scope.registerForm = {};
                        })
                        // handle error
                        .catch(function () {
                            $scope.error = true;
                            $scope.errorMessage = "Something went wrong!";
                            $scope.disabled = false;
                            $scope.registerForm = {};
                        });
                };
            }]);