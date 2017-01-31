app.controller('HomeController', ['$scope', '$http', '$location', '$state', '$mdToast', 'configuration', '$mdDialog', 'configService', 'loaderService',
    function($scope, $http, $location, $state, $mdToast, configuration, $mdDialog, configService, loaderService) {
        var botkitUri = configuration.botKitUrl;
        $scope.isConfigured = configuration.isConfigured;

        $scope.setup = function() {
            loaderService.showLoader();

            $http({
                method: 'POST',
                url: '/startbot',
                data: { 'clientId': $scope.clientId, 'clientSecret': $scope.clientSecret, 'redirectUri': configuration.redirectUri }
            }).then(function successCallback() {
                loaderService.hideLoader();
                window.location.href = botkitUri + '/login';
            }, function errorCallback(response) {
                showNotification(response.data);
                loaderService.hideLoader();
                console.log(JSON.stringify(response));
            });
        };

        
        $scope.resetSettings = function() {
            var confirm = $mdDialog.confirm()
                .clickOutsideToClose(true)
                .title('Reset Teambot settings?')
                .textContent('All data will be lost.')
                .ok('Confirm')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                loaderService.showLoader();
                configService.removeConfig()
                    .then(function() {
                        loaderService.hideLoader();
                        $state.reload();
                    });
            }, function() {
                // handle cancel click here
            });
        }

        $scope.config = {
            teamName: configuration.team.teamName,
            teamUrl: configuration.team.teamUrl,
            clientId: configuration.slack.clientId,
            clientSecret: configuration.slack.clientSecret
        }

        function showNotification(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .position('left')
                .hideDelay(3000));
        }
    }
]);