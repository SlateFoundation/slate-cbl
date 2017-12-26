/**
 * Extend core store to require student + content area be set before loading
 */
Ext.define('SlateDemonstrationsStudent.store.StudentCompetencies', {
    extend: 'Slate.cbl.store.StudentCompetencies',


    config: {
        pageSize: 0,
        proxy: {
            type: 'slate-cbl-studentcompetencies',
            include: [
                'Competencies.Skills',
                'Competencies.totalDemonstrationsRequired',
                'Competencies.minimumAverageOffset',
                'demonstrationsRequired',
                'demonstrationsMissed',
                'demonstrationsComplete',
                'demonstrationsAverage',
                'isLevelComplete',
                'growth'
            ],
            extraParams: {
                limit: 0
            }
        }
    },


    // member methods
    loadIfDirty: function() {
        if (!this.getStudent() || !this.getContentArea()) {
            return;
        }

        this.callParent();
    }
});