'use strict';

var simpleClientControllers = angular.module('simpleClientControllers', []);

simpleClientControllers.controller('NavbarCtrl', ['$rootScope', '$scope', '$location', 'hubiquitusService', function ($rootScope, $scope, $location, hubiquitusService) {
	$scope.connectImg = 'images/hubi_disconnected.png';
    $rootScope.connected = false;
    hubiquitusService.onConnect(function() {
        $rootScope.connected = true;
        $scope.connectImg = 'images/hubi_connected.png';
        // Affichage de la page suivante apres connexion
        $location.path('client');
    });
    hubiquitusService.onReconnect(function() {
        $rootScope.connected = true;
        $scope.connectImg = 'images/hubi_connected.png';
    });
    hubiquitusService.onDisconnect(function() {
        $rootScope.connected = false;
        $scope.connectImg = 'images/hubi_disconnected.png';
    });
	
    $scope.isConnected = function() {
        return $rootScope.connected;
    };
    
    $scope.disconnect = function() {
        hubiquitusService.disconnect();
        // Retour a la page d'accueil connexion
        $location.path('/');
    };

}]);


simpleClientControllers.controller('ConnectionCtrl', ['$scope', 'hubiquitusService', function ($scope, hubiquitusService) {
    $scope.connect = function() {
        hubiquitusService.connect($scope.login, $scope.server);
    };
}]);

'use strict';

simpleClientControllers.controller('ClientCtrl', ['$rootScope', '$scope', '$location', 'hubiquitusService', function ($rootScope, $scope, $location, hubiquitusService) {
    if (!$rootScope.connected) {
        // Retour a la page d'accueil connexion
        $location.path('/');
    }
    $scope.message = {};
    $scope.message.sent = false;
    $scope.send = function() {
        hubiquitusService.send($scope.message.actor, $scope.message.content);
        $scope.message.sent = true;
    };

	$scope.messages = [];
    $scope.$on('hubiquitus:onMessage', function(evt, req) {
        // Ici evenement asynchrone, le binding avec la vue n'est pas automatique, il faut prevenir angular de mettre a jour
        // Deux methodes:
        // Avec digest directement:
        /*$scope.message = req;
        $scope.$digest();*/
        // Ou en faisant la mise a jour du scope dans une fonction apply (qui appellera digest)
        $scope.$apply(function($scope) {
            $scope.messages.push(req);
        });
    });
}]);
