/**
 * @abstract
 * Base class providing field workflow for a collection of DemonstrationSkills raters
 */
Ext.define('Slate.cbl.field.ratings.AbstractSkillsField', {
    extend: 'Slate.ui.form.ContainerField',
    requires: [
        /* global Slate */
        'Slate.cbl.data.field.DemonstrationSkills'
    ],


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
        return Slate.cbl.data.field.DemonstrationSkills.prototype.isEqual(value1, value2);
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