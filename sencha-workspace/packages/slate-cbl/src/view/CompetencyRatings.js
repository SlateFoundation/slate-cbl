Ext.define('Slate.cbl.view.CompetencyRatings', {
    extend: 'Ext.panel.Panel',
    xtype: 'slate-cbl-competencyratings',
    mixins: [
        'Slate.ui.mixin.PlaceholderItem'
    ],
    requires: [
        /* global Slate */
        'Slate.cbl.model.StudentCompetency',
        'Slate.cbl.field.RatingSlider'
    ],


    config: {
        selectedStudent: null,
        selectedCompetency: null,

        studentCompetency: null,

        placeholderItem: {
            tpl: [
                '<tpl if="!values.student || !values.competency">',
                    'Select ',
                    '<tpl if="!values.student">student</tpl>',
                    '<tpl if="!values.student && !values.competency"> and </tpl>',
                    '<tpl if="!values.competency">competency</tpl>',
                '</tpl>'
            ],
            data: {}
        }
    },


    // component configuration
    padding: '16 75',

    // container configuration
    defaultType: 'slate-cbl-ratingslider',
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
            tpl: [
                '<h4 class="competency-descriptor">{Descriptor}</h4>',
                '<blockquote class="competency-statement">{Statement}</blockquote>'
            ]
        }
    ],


    // config handlers
    updateSelectedStudent: function(selectedStudent) {
        var me = this;

        me.setStudentCompetency(null);

        me.getPlaceholderItem().setData({
            student: selectedStudent || selectedStudent === false,
            competency: me.selectedCompetency
        });

        me.loadIfNeeded();
    },

    updateSelectedCompetency: function(competencyCode) {
        var me = this,
            selectedStudent = me.selectedStudent;

        me.title = competencyCode;

        me.setStudentCompetency(null);

        me.getPlaceholderItem().setData({
            student: selectedStudent || selectedStudent === false,
            competency: competencyCode
        });

        me.loadIfNeeded();
    },

    updateStudentCompetency: function(studentCompetency) {
        var me = this,
            skillValueQueue = me.skillValueQueue,
            skillFieldsMap = me.skillFieldsMap = {},
            competencyData, skills,
            skillsLength, skillIndex, skill, skillId, value;

        Ext.suspendLayouts();

        me.removeAll();

        if (studentCompetency) {
            competencyData = studentCompetency.get('Competency');
            me.setSelectedCompetency(competencyData.Code);
            me.getDockedComponent('competencyInfo').setData(competencyData);

            skills = competencyData.Skills || [];
            skillsLength = skills.length;
            skillIndex = 0;

            for (; skillIndex < skillsLength; skillIndex++) {
                skill = skills[skillIndex];
                skillId = skill.ID;
                value = skillValueQueue[skillId]

                delete skillValueQueue[skillId];

                skillFieldsMap[skillId] = me.add({
                    skill: skill,
                    level: studentCompetency.get('Level'),
                    value: value,

                    listeners: {
                        scope: me,
                        changecomplete: 'onRatingChange'
                    }
                });
            }
        } else {
            me.setPlaceholderItem('Selected student not enrolled in selected competency');
        }

        Ext.resumeLayouts(true);
    },


    // component lifecycle
    constructor: function() {
        this.skillValueQueue = {};
        this.callParent(arguments);
    },

    afterRender: function() {
        this.callParent(arguments);
        this.loadIfNeeded();
    },


    // event handlers
    onRatingChange: function(ratingSlider, value) {
        this.fireEvent('ratingchange', this, value, ratingSlider.getLevel(), ratingSlider.getSkill(), ratingSlider);
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

    setSkillValue: function(skillId, value) {
        var me = this,
            skillFieldsMap = me.skillFieldsMap,
            skillField = skillFieldsMap && skillFieldsMap[skillId];

        if (skillField && me.isStudentCompetencyLoaded()) {
            skillField.setValue(value);
        } else {
            me.skillValueQueue[skillId] = value;
        }
    }
});