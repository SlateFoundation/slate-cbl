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
            competencyData, skills;

        me.removeAll();

        if (studentCompetency) {
            competencyData = studentCompetency.get('Competency');
            me.setSelectedCompetency(competencyData.Code);
            me.getDockedComponent('competencyInfo').setData(competencyData);

            skills = competencyData.Skills || [];

            me.add(Ext.Array.map(skills, function(skill) {
                return {
                    skill: skill,

                    // TODO: provide real values
                    level: studentCompetency.get('Level'),
                    value: null,

                    listeners: {
                        scope: me,
                        changecomplete: 'onRatingChange'
                    }
                };
            }));
        } else {
            me.setPlaceholderItem('Selected student not enrolled in selected competency');
        }
    },


    // component lifecycle
    afterRender: function() {
        this.callParent(arguments);
        this.loadIfNeeded();
    },


    // event handlers
    onRatingChange: function(ratingSlider, value) {
        this.fireEvent('ratingchange', this, value, ratingSlider.getLevel(), ratingSlider.getSkill(), ratingSlider);
    },


    // local functions
    loadIfNeeded: function() {
        var me = this,
            selectedStudent = me.getSelectedStudent(),
            selectedCompetency = me.getSelectedCompetency(),
            studentCompetency = me.getStudentCompetency();

        if (
            !me.rendered // don't load if not rendered yet
            || (!selectedStudent && selectedStudent !== false) // don't load until a student is selected (false means current is selected)
            || !selectedCompetency // don't load until a competency is selected
            // don't load if selected student+competency is already leaded
            || (
                studentCompetency
                && (!selectedStudent || studentCompetency.get('Student').Username == selectedStudent)
                && studentCompetency.get('Competency').Code == selectedCompetency
            )
        ) {
            return;
        }

        me.setLoading('Loading '+selectedCompetency+'&hellip;');
        Slate.cbl.model.StudentCompetency.loadHighestLevel({
            student: selectedStudent,
            competency: selectedCompetency,
            include: ['Student', 'Competency.Skills'],
            success: function(loadedStudentCompetency) {
                me.setStudentCompetency(loadedStudentCompetency);
                me.setLoading(false);
            },
            failure: function(loadedStudentCompetency, operation) {
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
    }
});