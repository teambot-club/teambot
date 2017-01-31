app
    .controller('SkillsController', ['$scope', 'skillsService', 'loaderService', 'notificationService',
        function ($scope, skillsService, loaderService, notificationService) {
            $scope.installSkill = function (skillName) {
                loaderService.showLoader();
                skillsService.installSkill(skillName)
                    .then(function (result) {
                        if (result && result.success) {
                            notificationService.showSuccess('Skill installed successfully');
                            clearCustomSkillInputs();
                        } else {
                            notificationService.showError('Cannot find teambot package on the provided url');
                        }

                        loaderService.hideLoader();
                    });
            }

            $scope.skills = [];
            init();

            function init() {
                loaderService.showLoader();
                skillsService.getSkills()
                    .then(function (result) {
                        loaderService.hideLoader();
                        if (result && result.success) {
                            $scope.skills = result.data;
                        }
                    });
            }

            function clearCustomSkillInputs() {
                $scope.customSkillName = null;
                $scope.customSkillSource = null;
            }
        }
    ]);