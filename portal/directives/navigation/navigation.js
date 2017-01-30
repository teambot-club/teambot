app.directive('navigation', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/navigation/navigation.html',
        controller: function ($scope, $state) {
            $scope.currentNavItem = $state.current.name || 'home';
            
            $scope.goto = function (name) {
                $state.go(name);
            }
        }
    };
});