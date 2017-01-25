/*eslint-disable */

var app = angular
    .module('PlatformRobots', [
        'ui.router',
        'ngMaterial'
    ])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme("success-toast");
        $mdThemingProvider.theme("error-toast");
    })
    .constant('constants', {
        httpMethods: {
            "get": "get",
            "post": "post",
            "put": "put",
            "delete": "delete"
        }
    });

/*eslint-enable */