app
    .controller('DoneController', ['$scope', '$location', 'configuration', 'configService', '$mdDialog',
        function ($scope, $location, configuration, configService, $mdDialog) {
            $scope.isLoading = false;
            $scope.resetSettings = function () {
                var confirm = $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('Reset Teambot settings?')
                    .textContent('All data will be lost.')
                    .ariaLabel('Lucky day')
                    .ok('Confirm')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
                    $scope.isLoading = true;
                    configService.removeConfig()
                        .then(function () {
                            $scope.isLoading = false;
                        });
                    $location.url('/');
                }, function () {
                    // handle cancel click here
                });
            }

            $scope.config = {
                teamName: configuration.team.teamName,
                teamUrl: configuration.team.teamUrl,
                clientId: configuration.slack.clientId,
                clientSecret: configuration.slack.clientSecret
            }

            $scope.showConfirm = function (ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete your debt?')
                    .textContent('All of the banks have agreed to forgive you your debts.')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Please do it!')
                    .cancel('Sounds like a scam');

                $mdDialog.show(confirm).then(function () {
                    $scope.status = 'You decided to get rid of your debt.';
                }, function () {
                    $scope.status = 'You decided to keep your debt.';
                });
            };
        }
    ]);