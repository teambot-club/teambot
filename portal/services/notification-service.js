app.factory('notificationService', ['$mdToast', function ($mdToast) {

    var notificationTypes = {
        error: 'error',
        success: 'success'
    };

    function showNotification(message, hideDelay, type) {
        hideDelay = hideDelay || 3000;
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('left')
                .theme(type + '-toast')
                .hideDelay(hideDelay));
    }

    function showError(message, hideDelay) {
        showNotification(message, hideDelay, notificationTypes.error);
    }

    function showSuccess(message, hideDelay) {
        showNotification(message, hideDelay, notificationTypes.success);
    }

    return {
        showError: showError,
        showSuccess: showSuccess
    };
}]);