console && console.log("### appConfig.js: begin");

//var sudokuApp = sudokuApp || angular.module('sudokuApp', ['ngRoute']);

sudokuApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/welcome', {
            templateUrl: 'ng/welcomeView.html',
            controller: 'WelcomeCtrl'
        }).
        //when('/game1', {
        //    templateUrl: 'ng/gameView1.html',
        //    //controller: 'GameCtrl'
        //}).
        when('/game2', {
            templateUrl: 'ng/gameView2.html',
            controller: 'GameCtrl'
        }).
        when('/game', {
            redirectTo: '/game2'
        }).
        when('/loggers', {
            templateUrl: 'ng/loggersView.html',
            controller: 'LoggersCtrl'
        }).
        when('/unittests', {
            templateUrl: 'ng/unitTestsView.html',
            controller: 'UnitTestsCtrl'
        }).
        otherwise({
            //redirectTo: '/welcome'
            redirectTo: '/game2'
        });
}]);

console && console.log("### appConfig.js: end");
