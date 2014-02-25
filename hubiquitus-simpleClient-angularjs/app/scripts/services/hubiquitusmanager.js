'use strict';

var hubiquitusManager = angular.module('hubiquitusManager', []);

hubiquitusManager.factory('hubiquitusService', ['$rootScope', '$window', function ($rootScope, $window) {
    var Hubiquitus = $window.hubiquitus.Hubiquitus;
    var logger;

    $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    var hClient = null;
    var isConnected = false;
    var onConnectCallback, 
        onDisconnectCallback, 
        onReconnectCallback; 
    //     onMessageCallback;

    function init() {
        hClient = new Hubiquitus({autoReconnect: true});
        Hubiquitus.logger.enable('hubiquitus','trace');
        Hubiquitus.logger.enable('koq','trace');
        logger = Hubiquitus.logger('koq');
        hClient.on('message', onMessage);
        hClient.on('connect', onConnect);
        hClient.on('reconnect', onReconnect);
        hClient.on('disconnect', onDisconnect);
    }

    function onConnect() {
        isConnected = true;
        logger.debug('connected');
        if (typeof onConnectCallback === 'function') {
            $rootScope.safeApply(onConnectCallback);
        } 
    }
    function onReconnect() {
        isConnected = true;
        logger.debug('reconnected');
        if (typeof onConnectCallback === 'function') {
            $rootScope.safeApply(onReconnectCallback);
        }
    }
    function onDisconnect() {
        isConnected = false;
        logger.debug('disconnected');
        if (typeof onDisconnectCallback === 'function') {
            $rootScope.safeApply(onDisconnectCallback);
        }
    }

    function onMessage(req) {
        var content = req.content;
        var reply = req.reply;
        logger.debug('onMessage: ', req);
        // Ici j'utilise plutot un evenement qui est braodcaste a tous les scopes enfants de rootScope (donc tous les scopes de l'appli)
        // Cela permet d'avoir la reception des messages dans tous les controllers en meme temps si besoin
        $rootScope.$broadcast('hubiquitus:onMessage', req);
        // if (typeof onMessageCallback === 'function') {
        //     $rootScope.safeApply(function () {
        //         onMessageCallback.call(this, hMessage);
        //     });
        // }
    }

    return {
        isConnected: function () {
            return isConnected;
        },
        connect: function (login, endpoint) {
            if (!hClient) {
                init();
            }
            hClient.connect(endpoint, {username:login});
        },
        subscribe: function (actor, callback) {
            hClient.subscribe(actor, function (hMessage) {
                $rootScope.safeApply(function () {
                    callback(hMessage.payload);
                });
            });
        },
        send: function(actor, content) {
            hClient.send(actor, content);
        },
        disconnect: function () {
            hClient.disconnect();
        },
        onConnect: function (callback) {
            onConnectCallback = callback;
        },
        onReconnect: function (callback) {
            onReconnectCallback = callback;
        },
        onDisconnect: function (callback) {
            onDisconnectCallback = callback;
        }//,
        // onMessage: function (callback) {
        //     onMessageCallback = callback;
        // }
    };

}]);
