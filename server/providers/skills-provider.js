var dataProvider = require('server/providers/data-provider'),
    async = require('async'),
    skillsCollectionName = 'skills';

var SkillsProvider = function () {
    function getSkills(callback) {
        try {
            dataProvider.get({}, skillsCollectionName, function (err, data) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null, data);
            });

        } catch (err) {
            callback(err);
        }
    }

    function addSkill(skill, callback) {
        try {
            dataProvider.insert(skill, skillsCollectionName, callback);

        } catch (err) {
            callback(err);
        }
    }

    function removeSkill(skillName, callback) {
        try {
            dataProvider.remove({ 'name': skillName }, skillsCollectionName, callback);
        } catch (err) {
            callback(err);
        }
    }

    function upsertSkills(skills, callback) {
        try {
            async.forEach(skills, function (skill, callback) {
                dataProvider.update({name: skill.name}, skill, skillsCollectionName, callback)
            }, function (err) {
                console.log(err);
                callback();
            });
        } catch (err) {
            callback(err);
        }
    }

    return {
        getSkills: getSkills,
        addSkill: addSkill,
        removeSkill: removeSkill,
        upsertSkills: upsertSkills
    };
} ();

module.exports = SkillsProvider;