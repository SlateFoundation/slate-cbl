/**
 * Extend core store to require students + content area be set before loading
 */
Ext.define('SlateStudentCompetenciesAdmin.store.StudentCompetencies', {
    extend: 'Slate.cbl.store.StudentCompetencies',


    config: {
        pageSize: 0,
        proxy: {
            type: 'slate-cbl-studentcompetencies',
            include: [
                'Competencies',
                'Creator'
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