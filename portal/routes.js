'use strict()';

app
    .config(['$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            var resolveConfiguration = ['config', function (config) {
                return config.getConfig();
            }];

            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/home.html',
                    controller: 'HomeController',
                    resolve: {
                        configuration: resolveConfiguration
                    }
                })
                .state('done', {
                    url: '/done',
                    templateUrl: 'views/done.html',
                    controller: 'DoneController',
                    resolve: {
                        configuration: resolveConfiguration
                    }
                });
        }
    ]);