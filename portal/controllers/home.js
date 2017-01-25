app
    .controller('HomeController', ['$scope', '$http', 'config', '$location', '$state', '$mdToast',
        function($scope, $http, config, $location, $state, $mdToast) {
            var botkitUri = config.getBotkitUri();
            $scope.isLoading = false;

            if (config.isConfigured() && !$location.search().config) {
                $state.go('done');
            }

            $scope.setup = function() {
                $scope.isLoading = true;
                
                $http({
                    method: 'POST',
                    url: '/startbot',
                    data: { "clientId": $scope.clientId, "clientSecret": $scope.clientSecret, "redirectUri": config.getRedirectUri() }
                }).then(function successCallback() {
                    $scope.isLoading = false;
                    window.location.href = botkitUri + '/login';
                }, function errorCallback(response) {
                    showNotification(response.data);
                    $scope.isLoading = false;
                    console.log(JSON.stringify(response));
                });
            };

            function showNotification(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position('left')
                        .hideDelay(3000));
            }
        }
    ]);