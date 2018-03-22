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
        var normalValue = [],
            length = value ? value.length : 0,
            i = 0, demonstrationSkill;

        for (; i < length; i++) {
            demonstrationSkill = value[i];

            normalValue.push({
                ID: demonstrationSkill.ID || null,
                SkillID: demonstrationSkill.SkillID,
                TargetLevel: demonstrationSkill.TargetLevel || null,
                DemonstratedLevel: demonstrationSkill.DemonstratedLevel || null,
                Override: demonstrationSkill.Override || false,
                Removable: demonstrationSkill.Removable || false
            });
        }

        return normalValue;
    },

    setValue: function(value) {
        var me = this;

        // clone value to normalized array
        value = me.normalizeValue(value);

        // normal field behavior
        me.value = value;
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
        var skillId, skill1, skill2;

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

            if (skill1.DemonstratedLevel !== skill2.DemonstratedLevel) {
                return false;
            }

            if (skill1.Override !== skill2.Override) {
                return false;
            }

            if (skill1.TargetLevel !== skill2.TargetLevel) {
                return false;
            }
        }

        return true;
    },

    onChange: function(value) {
        var me = this,
            length = value ? value.length : 0,
            i = 0, skillData,
            valueSkillsMap = me.valueSkillsMap = {};

        for (; i < length; i++) {
            skillData = value[i];
            valueSkillsMap[skillData.SkillID] = skillData;
        }

        me.loadValue();

        return me.callParent([value]);
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
    }
});