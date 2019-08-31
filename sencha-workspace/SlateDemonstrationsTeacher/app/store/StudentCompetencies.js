/**
 * Extend core store to require students + content area be set before loading
 */
Ext.define('SlateDemonstrationsTeacher.store.StudentCompetencies', {
    extend: 'Slate.cbl.store.StudentCompetencies',


    config: {
        pageSize: 0,
        proxy: {
            type: 'slate-cbl-studentcompetencies',
            include: [
                'Competencies.Skills',
                'Competencies.totalDemonstrationsRequired',
                'effectiveDemonstrationsData',
                'demonstrationsRequired',
                'demonstrationsMissed',
                'demonstrationsComplete',
                'demonstrationsAverage',
                'minimumAverage',
                'isLevelComplete',
                'growth'
            ],
            relatedTable: [
                {
                    relationship: 'Student',
                    clearOnLoad: true
                }
            ],
            extraParams: {
                limit: 0
            }
        }
    },


    // member methods
    loadIfDirty: function() {
        if (!this.getStudentsList() || !this.getContentArea()) {
            return;
        }

        this.callParent();
    }
});