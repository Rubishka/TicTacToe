/**
 * Created by rubi on 14/12/2017.
 */

angular.module('myApp')
    .controller('ScoreController',
        ['$scope','$location', 'AuthService', '$rootScope','socketio','$mdToast', '$timeout',
            function ($scope, $location, AuthService,$rootScope, socketio, $mdToast , $timeout) {

                $scope.isAuthenticated = function() {
                    return AuthService.isLoggedIn();
                };


                    AuthService.getScore()
                        .success(function(data) {
                            $scope.scores = data;
                            $scope.alltime=$scope.scores[0];
                            $scope.year=$scope.scores[1];
                            $scope.month=$scope.scores[2];
                            $scope.week=$scope.scores[3];
                            $scope.day=$scope.scores[4];
                            console.log($scope.scores[0]);

                        })
                        .error(function(error) {
                            console.log(error);
                        });


            }]);



