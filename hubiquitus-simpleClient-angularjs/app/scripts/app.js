'use strict';

angular.module('simpleClientApp', [
    'ngRoute',
    'hubiquitusManager',
    'simpleClientControllers'
    ])
    .config(['$routeProvider',function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/connection.html',
                controller: 'ConnectionCtrl'
            })
            .when('/client', {
                templateUrl: 'views/client.html',
                controller: 'ClientCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
