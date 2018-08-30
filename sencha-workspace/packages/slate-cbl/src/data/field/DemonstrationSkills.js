Ext.define('Slate.cbl.data.field.DemonstrationSkills', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.slate-cbl-demonstrationskills',


    isEqual: function(value1, value2) {
        var skillId, skill1, skill2, rating, override;

        if (value1 === value2) {
            return true;
        }

        if (!value1 && !value2) {
            return true;
        }

        if (!value1 || !value2) {
            return false;
        }

        if (value1.length !== value2.length) {
            return false;
        }

        value1 = Ext.Array.toValueMap(value1, 'SkillID');
        value2 = Ext.Array.toValueMap(value2, 'SkillID');

        for (skillId in value1) {
            if (!value1.hasOwnProperty(skillId)) {
                continue;
            }

            skill2 = value2[skillId];

            if (!skill2) {
                return false;
            }

            skill1 = value1[skillId];
            rating = skill1.DemonstratedLevel;
            override = Boolean(skill1.Override);

            if (
                typeof rating == 'number' || typeof skill2.DemonstratedLevel == 'number'
                    ? rating !== skill2.DemonstratedLevel // if either is a number, don't let 0 == null
                    : rating != skill2.DemonstratedLevel // let null == undefined
            ) {
                return false;
            }

            if (override !== Boolean(skill2.Override)) {
                return false;
            }

            if (Boolean(skill1.Removable) !== Boolean(skill2.Removable)) {
                return false;
            }

            // differences in any following attributes are irrelevant if no DemonstrationSkill record would persist
            if ((rating === null || typeof rating == 'undefined') && !override) {
                continue;
            }

            if (skill1.TargetLevel != skill2.TargetLevel) {
                return false;
            }
        }

        return true;
    }
});