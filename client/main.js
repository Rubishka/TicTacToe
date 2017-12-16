 var myApp = angular.module('myApp', ['ngRoute','ngMaterial']);

 myApp.config(function ($routeProvider) {
     $routeProvider
         .when('/', {
             templateUrl: 'partials/home.html',
             controller: 'GameController',
             access: {restricted: false}
         })
         .when('/login', {
             templateUrl: 'partials/login.html',
             controller: 'AuthController',
             access: {restricted: false}
         })
         .when('/logout', {
             controller: 'AuthController',
             access: {restricted: true}
         })
         .when('/register', {
             templateUrl: 'partials/register.html',
             controller: 'AuthController',
             access: {restricted: false}
         })
         .when('/game', {
             templateUrl: 'partials/game.html',
             controller: 'GameController',
             access: {restricted: true}
         })
         .when('/scores', {
             controller: 'ScoreController',
             templateUrl: 'partials/scores.html',
             access: {restricted: false}
         })
         .otherwise({
             redirectTo: 'partials/home.html',
             controller: 'GameController',
             access: {restricted: false}
         });
 });

 myApp.run(function ($rootScope, $location, $route, AuthService,socketio) {
     $rootScope.$on('$routeChangeStart',
         function (event, next, current) {
             AuthService.getUserStatus()
                 .then(function(){
                     if (next.access.restricted && !AuthService.isLoggedIn()){
                         $location.path('/login');
                         $route.reload();
                     }
                 });
         });
 });

