var npmKeyword = require('npm-keyword'),
    packageJson = require('pkg.json'),
    teambotSkillRequiredKeyword = 'ecosystem:teambot';

function isTeambotSkill(skill) {
    var isSkill = false;
    if (skill && skill.keywords) {
        isSkill = skill.keywords.indexOf(teambotSkillRequiredKeyword) > -1;
    }
    return isSkill;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function generateFriendlyName(name) {
    var friendlyName = name
        .replace('teambot', '')
        .replace('-', ' ')
        .replace('_', ' ')
        .trim();
    return toTitleCase(friendlyName);
}

function addFriendlyNamesToListOfSkills(listOfSkills) {
    for (var i in listOfSkills) {
        var skill = listOfSkills[i];
        skill.friendlyName = generateFriendlyName(skill.name);
    }
}

exports.getPublicSkillsSummary = function(req, res) {
    try {
        npmKeyword(teambotSkillRequiredKeyword).then(function(packages) {
            addFriendlyNamesToListOfSkills(packages);
            res.status(200).send(packages);
        }).catch(function(reason) {
            res.status(500).send(reason);
        });
    } catch (ex) {
        res.status(500).send(ex);
    }
};

exports.getPublicSkillInfo = function(req, res) {
    try {
        var skillName = req.params.skill;
        packageJson(skillName, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (isTeambotSkill(data)) {
                    data.friendlyName = generateFriendlyName(data.name);
                    res.status(200).send(data);
                } else {
                    res.status(404).send('There is no Teambot skill with name: ' + skillName);
                }
            }
        });
    } catch (ex) {
        res.status(500).send(ex);
    }
};