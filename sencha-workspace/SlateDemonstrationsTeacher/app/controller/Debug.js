Ext.define('SlateDemonstrationsTeacher.controller.Debug', {
    extend: 'Ext.app.Controller',


    // controller configuration
    stores: [
        'Students',
        'Competencies@Slate.cbl.store',
        'StudentCompetencies',
    ],

    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',
        progressGrid: 'slate-demonstrations-teacher-dashboard slate-demonstrations-teacher-progressgrid'
    },


    // entry points
    control: {
    },


    // controller lifecycle
    onLaunch: function () {
        var me = this;

        me.getDashboardCt().add({
            xtype: 'toolbar',
            defaults: {
                scope: me
            },
            items: [
                {
                    xtype: 'tbtext',
                    html: 'Developer Debug Toolbar'
                },
                {
                    xtype: 'tbseparator'
                },
                {
                    text: 'Swap first and second students',
                    handler: me.swapFirstTwoStudents
                }
            ]
        });
    },


    // debug actions
    swapFirstTwoStudents: function() {
        var me = this,
            studentsStore = me.getStudentsStore(),
            competenciesStore = me.getCompetenciesStore(),
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetencyMaxId = studentCompetenciesStore.max('ID'),
            progressGrid = me.getProgressGrid(),
            student1 = studentsStore.getAt(0),
            student2 = studentsStore.getAt(1),
            newData = [];

        competenciesStore.each(competency => {
            var studentCompetency1 = studentCompetenciesStore.queryBy(r => r.get('CompetencyID') == competency.getId() && r.get('StudentID') == student1.getId()).first(),
                studentCompetency2 = studentCompetenciesStore.queryBy(r => r.get('CompetencyID') == competency.getId() && r.get('StudentID') == student2.getId()).first();

            newData.push(
                Ext.applyIf({
                    ID: studentCompetency1.getId(),
                    StudentID: student1.getId()
                }, studentCompetency2.getData()),
                Ext.applyIf({
                    ID: studentCompetency2.getId(),
                    StudentID: student2.getId()
                }, studentCompetency1.getData())
            );
        });

        studentCompetenciesStore.mergeData(newData);
    }
});