'use strict()';

app
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/home.html',
                    controller: 'HomeController'
                })
                .state('done', {
                    url: '/done',
                    templateUrl: 'views/done.html'
                });
        }
    ]);