app.directive('navigation', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/navigation/navigation.html',
        controller: function ($scope, $state) {
            $scope.getCurrentNavItem = function () {
                return $state && $state.current && $state.current.name;
            }
        }
    };
});