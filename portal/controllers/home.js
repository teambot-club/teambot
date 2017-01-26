app
    .controller('HomeController', ['$scope', '$http', '$location', '$state', '$mdToast', 'configuration',
        function($scope, $http, $location, $state, $mdToast, configuration) {
            var botkitUri = configuration.botKitUrl;
            $scope.isLoading = false;

            if (configuration.isConfigured && !$location.search().config) {
                $state.go('done');
            }

            $scope.setup = function() {
                $scope.isLoading = true;
                
                $http({
                    method: 'POST',
                    url: '/startbot',
                    data: { 'clientId': $scope.clientId, 'clientSecret': $scope.clientSecret, 'redirectUri': configuration.redirectUri }
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