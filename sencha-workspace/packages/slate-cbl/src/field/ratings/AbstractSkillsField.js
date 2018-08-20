/**
 * @abstract
 * Base class providing field workflow for a collection of DemonstrationSkills raters
 */
Ext.define('Slate.cbl.field.ratings.AbstractSkillsField', {
    extend: 'Slate.ui.form.ContainerField',


    name: 'DemonstrationSkills',
    allowBlank: true,
    blankText: 'At least one rating must be selected',


    constructor: function() {
        var me = this;

        me.loadValue = Ext.Function.createBuffered(me.loadValue, 100, me);

        me.callParent(arguments);
    },

    initValue: function() {
        var me = this,
            value = me.value;

        me.originalValue = me.normalizeValue(value);
        me.value = me.normalizeValue(value);
    },

    normalizeValue: function(value) {
        return Ext.Array.map(value || [], this.normalizeDemonstrationSkill, this);
    },

    normalizeDemonstrationSkill: function(demonstrationSkill) {
        var level = demonstrationSkill.DemonstratedLevel;

        return {
            ID: demonstrationSkill.ID || null,
            SkillID: demonstrationSkill.SkillID,
            TargetLevel: demonstrationSkill.TargetLevel || null,
            DemonstratedLevel: typeof level == 'number' ? level : null,
            Override: demonstrationSkill.Override || false,
            Removable: demonstrationSkill.Removable || false
        };
    },

    setValue: function(value) {
        var me = this,
            valueSkillsMap = me.valueSkillsMap = {},
            i = 0, length, skillData;

        // clone value to normalized array
        value = me.normalizeValue(value);

        // update value and valueSkillsMap
        me.value = value;
        for (length = value.length; i < length; i++) {
            skillData = value[i];
            valueSkillsMap[skillData.SkillID] = skillData;
        }

        // load new value into UI via implementation
        me.loadValue();

        // trigger change events if value differs from lastValue
        me.checkChange();

        // ensure lastValue and value always reference same instance
        me.lastValue = value;

        return me;
    },

    resetOriginalValue: function() {
        var me = this;

        // use clone from normalizeValue to isolate from updates
        me.originalValue = me.normalizeValue(me.getValue());
        me.checkDirty();
    },

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
            override = skill1.Override;

            if (rating !== skill2.DemonstratedLevel) {
                return false;
            }

            if (override !== skill2.Override) {
                return false;
            }

            if (skill1.Removable !== skill2.Removable) {
                return false;
            }

            // differences in any following attributes are irrelevant if no DemonstrationSkill record would persist
            if (rating === null && !override) {
                continue;
            }

            if (skill1.TargetLevel !== skill2.TargetLevel) {
                return false;
            }
        }

        return true;
    },

    loadValue: Ext.emptyFn,

    getErrors: function(value) {
        var me = this,
            errors;

        value = value || me.getValue();
        errors = me.callParent([value]);

        if (!me.allowBlank && value.length == 0) {
            errors.push(me.blankText);
        }

        return errors;
    },

    setSkillValue: function(skillId, rating, level, removable) {
        var me = this,
            value = me.value,
            valueSkillsMap = me.valueSkillsMap,
            skillData = valueSkillsMap[skillId];

        if (!skillData) {
            skillData = valueSkillsMap[skillId] = me.normalizeDemonstrationSkill({
                SkillID: skillId,
                Removable: removable
            });

            value.push(skillData);
        }

        skillData.DemonstratedLevel = rating;

        if (level) {
            skillData.TargetLevel = level;
        }
    },

    getSkillValue: function(skillId) {
        return this.valueSkillsMap[skillId] || null;
    },

    removeSkillValue: function(skillId) {
        var me = this,
            valueSkillsMap = me.valueSkillsMap,
            skillData = valueSkillsMap[skillId];

        delete valueSkillsMap[skillId];

        if (skillData) {
            Ext.Array.remove(me.value, skillData);
        }
    }
});