app.factory('httpService', ['$http', 'constants', function($http, constants) {
    function handleSuccess(result) {
        return {
            success: true,
            data: result.data,
            status: result.status
        };
    }

    function handleError(result) {
        var status = result.status,
            data = result.data;
        if (status >= 200 && status <= 300) {
            return handleSuccess(data);
        }
        return {
            success: false,
            data: data,
            status: status
        };
    }

    function executeRequest(type, url, data) {
        switch (type) {
            case constants.httpMethods.get:
                return $http.get(url).then(handleSuccess, handleError);
            case constants.httpMethods.post:
                return $http.post(url, data).then(handleSuccess, handleError);
            case constants.httpMethods.put:
                return $http.put(url, data).then(handleSuccess, handleError);
            case constants.httpMethods.delete:
                return $http.delete(url).then(handleSuccess, handleError);
        }
    }

    return {
        executeRequest: executeRequest
    };
}]);