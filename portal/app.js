/*eslint-disable */

var app = angular
    .module('PlatformRobots', [
        'ui.router',
        'ngMaterial'
    ]).constant('constants', {
        httpMethods: {
            "get": "get",
            "post": "post",
            "put": "put",
            "delete": "delete"
        }
    });

/*eslint-enable */