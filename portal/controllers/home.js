app
    .controller('HomeController', ['$scope', '$http', 'config', '$location',
        function($scope, $http, config, $location) {
            var botkitUri = config.getBotkitUri();

            if (config.isConfigured() && !$location.search().config) {
                window.location.href = '/#/done';
            }

            $scope.setup = function() {
                $http({
                    method: 'POST',
                    url: '/startbot',
                    data: { "clientId": $scope.clientId, "clientSecret": $scope.clientSecret, "redirectUri": config.getRedirectUri() }
                }).then(function successCallback(response) {
                    window.location.href = botkitUri + '/login';
                }, function errorCallback(response) {
                    console.log(JSON.stringify(response));
                });
            };

        }
    ]);