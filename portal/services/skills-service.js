app.factory('skillsService', ['httpService', 'constants', function (httpService, constants) {

    function installSkill(skillName) {
        var data = {
            skillName: skillName
        };

        return httpService.executeRequest(constants.httpMethods.post, '/skills', data);
    }

    function getSkills() {
        return httpService.executeRequest(constants.httpMethods.get, '/skills');
    }

    return {
        installSkill: installSkill,
        getSkills: getSkills
    };
}]);