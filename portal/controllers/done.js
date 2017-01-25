app
    .controller('DoneController', ['$scope', 'config', '$location',
        function ($scope, config, $location) {
            var teamInfo = config.getTeamInfo();
            var settings = config.getConfiguration("slack");

            $scope.slackConfiguration = {
                clientId: settings.clientId,
                clientSecret: settings.clientSecret,
                teamName: teamInfo.teamName,
                slackUrl: teamInfo.teamUrl
            }

            $scope.navigateToConfigurationPage = function () {
                $location.url('/?config');
            }
        }
    ]);