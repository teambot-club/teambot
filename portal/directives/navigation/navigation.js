app.directive('navigation', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/navigation/navigation.html',
        controller: function ($scope, $state) {
            $scope.uiState = $state
        }
    };
});