app
    .controller('DoneController', ['$scope', '$location', 'configuration',
        function ($scope, $location, configuration) {
            $scope.navigateToConfigurationPage = function () {
                $location.url('/?config');
            }
            
            $scope.config = {
                teamName: configuration.team.teamName,
                teamUrl: configuration.team.teamUrl,
                clientId: configuration.slack.clientId,
                clientSecret: configuration.slack.clientSecret
            }
        }
    ]);