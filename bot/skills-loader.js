var SkillsLoader = function () {
    var npm = require("npm"),
        fs = require('fs');


    function install(controller, middleware, skillsArr, callback) {

        npm.load({
            loaded: false
        }, function (err, npm) {

            // catch errors
            npm.commands.install(skillsArr, function (err, data) {

                if (err) {
                    callback(err, null);
                    return;
                }

                if (data.length === 0) {
                    callback(err, "Modules already installed");
                    return;
                } else {
                    loadTeambotSkillsOnly(skillsArr, controller, middleware);
                    callback(err, data);
                    return;
                }
            });

            npm.on("log", function (message) {
                // log the progress of the installation
                console.log(message);
            });
        });
    }

    function loadTeambotSkillsOnly(skillsArr, controller, middleware) {
        for (var idx = 0; idx < skillsArr.length; idx++) {
            var skill = getSkillShortName(skillsArr[idx]);

            if (isTeamBotSkill(skill)) {
                require(skill)(controller, middleware);
                console.log(skill + " IS installed successfully");
            } else {
                console.log(skill + " IS NOT valid Teambot skill");
            }
        }
    }

    function getSkillShortName(name) {
            var versionIndex = name.indexOf("@");
            var shortName = versionIndex !== -1
                ? name.substring(0, versionIndex)
                : name;
            return shortName;
    }

    function getKeywords(packageName) {
        var packageJsonFilePath = 'node_modules/' + packageName + '/package.json',
            keywords = 'undefined';
        try {
            keywords = JSON.parse(fs.readFileSync(packageJsonFilePath, 'utf8')).keywords;
        } catch (err) {
            console.log(err);
        }

        return keywords;
    }

    function isTeamBotSkill(packageName) {
        var isSkill = false;
        var skillKeywords = getKeywords(packageName);

        try {
            isSkill = skillKeywords.indexOf('teambot') > -1;
        } catch (err) {
            console.log(err);
        }

        return isSkill;
    }

    function installPredefinedSkills(controller, middleware, devSkill, callback) {
        var localSkills = getSkillsFromPackageFile('bot/package.json');
        if(devSkill) {
            localSkills.push(devSkill);
        }

        this.install(controller, middleware, localSkills, callback);
    }

    function getSkillsFromPackageFile(packageFilePath) {

        var p = require(packageFilePath);
        if (!p.dependencies) return [];

        var deps = [];
        for (var mod in p.dependencies) {
            deps.push(mod + "@" + p.dependencies[mod]);
        }
        return deps;
    }

    return {
        install: install,
        installPredefinedSkills: installPredefinedSkills
    };
}();

module.exports = SkillsLoader;