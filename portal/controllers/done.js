app.controller('DoneController', ['$scope', '$location', 'configuration', 'configService', '$mdDialog',
    function($scope, $location, configuration, configService, $mdDialog) {
        $scope.isLoading = false;
        $scope.resetSettings = function() {
            var confirm = $mdDialog.confirm()
                .clickOutsideToClose(true)
                .title('Reset Teambot settings?')
                .textContent('All data will be lost.')
                .ariaLabel('Lucky day')
                .ok('Confirm')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                $scope.isLoading = true;
                configService.removeConfig()
                    .then(function() {
                        $scope.isLoading = false;
                        $location.url('/');
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
    }
]);