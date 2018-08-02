Ext.define('Slate.cbl.field.ratings.StudentCompetency', {
    extend: 'Ext.panel.Panel',
    xtype: 'slate-cbl-ratings-studentcompetency',
    mixins: [
        'Slate.ui.mixin.PlaceholderItem'
    ],
    requires: [
        /* global Slate */
        'Slate.cbl.model.StudentCompetency',
        'Slate.cbl.field.ratings.Slider'
    ],


    config: {
        selectedStudent: null,
        selectedCompetency: null,

        studentCompetency: null,

        placeholderItem: {
            dock: 'bottom',
            tpl: [
                '<tpl if="!values.student || !values.competency">',
                    'Select ',
                    '<tpl if="!values.student">student</tpl>',
                    '<tpl if="!values.student && !values.competency"> and </tpl>',
                    '<tpl if="!values.competency">competency</tpl>',
                '<tpl elseif="studentCompetency === false">',
                    'Selected student not enrolled in selected competency',
                '</tpl>'
            ]
        }
    },


    // component configuration
    componentCls: 'slate-cbl-ratings-studentcompetency',
    padding: '16 75',

    // container configuration
    defaultType: 'slate-cbl-ratings-slider',
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        excludeForm: true // exclude from any parent forms
    },
    dockedItems: [
        {
            dock: 'top',

            xtype: 'component',
            itemId: 'competencyInfo',
            hidden: true,
            tpl: [
                '<h4 class="competency-descriptor">{Descriptor}</h4>',
                '<blockquote class="competency-statement">{Statement}</blockquote>'
            ]
        }
    ],


    // config handlers
    updateSelectedStudent: function() {
        var me = this;

        me.setStudentCompetency(null);
        me.refreshPlaceholder();
        me.loadIfNeeded();
    },

    updateSelectedCompetency: function(competencyCode) {
        var me = this;

        me.title = competencyCode;

        me.setStudentCompetency(null);
        me.refreshPlaceholder();
        me.loadIfNeeded();
    },

    updateStudentCompetency: function(studentCompetency) {
        var me = this,
            competencyInfoCmp = me.getDockedComponent('competencyInfo'),
            skillValueQueue = me.skillValueQueue,
            skillFieldsMap = me.skillFieldsMap = {},
            currentLevel, competencyData, skills,
            skillsLength, skillIndex, skill, skillId, value;

        Ext.suspendLayouts();

        me.removeAll();

        if (studentCompetency) {
            currentLevel = studentCompetency.get('Level');
            competencyData = studentCompetency.get('Competency');
            me.setSelectedCompetency(competencyData.Code);
            competencyInfoCmp.setData(competencyData);
            competencyInfoCmp.show();

            skills = competencyData.Skills || [];
            skillsLength = skills.length;
            skillIndex = 0;

            for (; skillIndex < skillsLength; skillIndex++) {
                skill = skills[skillIndex];
                skillId = skill.ID;
                value = skillValueQueue[skillId];

                delete skillValueQueue[skillId];

                skillFieldsMap[skillId] = me.add({
                    skill: skill,
                    level: value ? value.Level : currentLevel,
                    value: value ? value.Rating : null,

                    listeners: {
                        scope: me,
                        changecomplete: 'onRatingChange'
                    }
                });
            }
        } else {
            competencyInfoCmp.hide();
        }

        me.refreshPlaceholder();

        Ext.resumeLayouts(true);
    },


    // component lifecycle
    constructor: function() {
        var me = this;

        me.skillValueQueue = {};

        me.refreshPlaceholder = Ext.Function.createBuffered(me.refreshPlaceholder, 50);

        me.callParent(arguments);
    },

    afterRender: function() {
        this.callParent(arguments);
        this.loadIfNeeded();
    },


    // event handlers
    onRatingChange: function(ratingSlider, rating) {
        this.fireEvent('ratingchange', this, rating, ratingSlider.getLevel(), ratingSlider.getSkill(), ratingSlider);
    },


    // local functions
    /**
     * Return true if StudentCompetency for selected student+competency is loaded
     */
    isStudentCompetencyLoaded: function() {
        var me = this,
            selectedStudent = me.getSelectedStudent(),
            selectedCompetency = me.getSelectedCompetency(),
            studentCompetency = me.getStudentCompetency();

        return (
            (selectedStudent || selectedStudent === false)
            && selectedCompetency
            && studentCompetency
            && (!selectedStudent || studentCompetency.get('Student').Username == selectedStudent)
            && studentCompetency.get('Competency').Code == selectedCompetency
        );
    },

    refreshPlaceholder: function() {
        var me = this,
            selectedStudent = me.getSelectedStudent();

        me.getPlaceholderItem().setData({
            student: selectedStudent || selectedStudent === false,
            competency: me.getSelectedCompetency(),
            studentCompetency: me.getStudentCompetency()
        });
    },

    loadIfNeeded: function() {
        var me = this,
            selectedStudent = me.getSelectedStudent(),
            selectedCompetency = me.getSelectedCompetency();

        // don't load if not rendered yet
        if (!me.rendered) {
            return;
        }

        // don't load until a student is selected (false means current is selected)
        if (!selectedStudent && selectedStudent !== false) {
            return;
        }

        // don't load until a competency is selected
        if (!selectedCompetency) {
            return;
        }

        // don't load if selected student+competency is already leaded
        if (me.isStudentCompetencyLoaded()) {
            return;
        }

        // load StudentCompetency model
        me.setLoading('Loading '+selectedCompetency+'&hellip;');
        Slate.cbl.model.StudentCompetency.loadHighestLevel({
            student: selectedStudent,
            competency: selectedCompetency,
            include: ['Student', 'Competency.Skills'],
            success: function(studentCompetency) {
                me.setStudentCompetency(studentCompetency);
                me.setLoading(false);
            },
            failure: function(studentCompetency, operation) {
                var response = operation.getResponse(),
                    data = response && response.data,
                    competencyData = data && data.Competency;

                Ext.suspendLayouts();

                if (competencyData) {
                    me.getDockedComponent('competencyInfo').setData(competencyData);
                }

                me.setStudentCompetency(false);

                me.setLoading(false);

                Ext.resumeLayouts(true);
            }
        });
    },

    setSkillValue: function(skillId, rating, level) {
        var me = this,
            skillFieldsMap = me.skillFieldsMap,
            skillField = skillFieldsMap && skillFieldsMap[skillId];

        if (skillField && me.isStudentCompetencyLoaded()) {
            skillField.setLevel(level);
            skillField.setValue(rating);
        } else {
            me.skillValueQueue[skillId] = {
                Rating: rating,
                Level: level
            };
        }
    },

    resetSkills: function (excludeIds) {
        var skillFieldsMap = this.skillFieldsMap,
            skillId;

        for (skillId in skillFieldsMap) {
            if (
                skillFieldsMap.hasOwnProperty(skillId)
                && (
                    !excludeIds
                    || excludeIds.indexOf(skillId) == -1
                )
            ) {
                skillFieldsMap[skillId].setValue(null);
            }
        }
    }
});