app
    .controller('DoneController', ['$scope', 'config', '$location',
        function ($scope, config, $location) {
            $scope.isLoading = false;
            $scope.navigateToConfigurationPage = function () {
                $location.url('/?config');
            }

            function init() {
                $scope.isLoading = true;
                config.getTeamInfo().then(function (result) {
                    var data = result.data;
                    $scope.slackConfiguration = {
                        teamName: data.teamName,
                        slackUrl: data.teamUrl
                    }
                }).then(function () {
                    return config.getSlackConfiguration();
                }).then(function (result) {
                    var data = result && result.data ? result.data : {};
                    $scope.slackConfiguration.clientId = data.clientId;
                    $scope.slackConfiguration.clientSecret = data.clientSecret;

                    $scope.isLoading = false;
                });
            }

            init();
        }
    ]);