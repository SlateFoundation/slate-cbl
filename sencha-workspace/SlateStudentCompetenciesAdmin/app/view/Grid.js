/**
 * Renders enrollments for a given list of students across a given list of competencies
 */
Ext.define('SlateStudentCompetenciesAdmin.view.Grid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'slate-studentcompetencies-admin-grid',


    config: {
        columnsStore: 'Students',
        columnHeaderField: 'FullName',
        columnMapper: 'StudentID',

        rowsStore: 'Competencies',
        rowHeaderField: 'Code',
        rowMapper: 'CompetencyID',

        dataStore: 'StudentCompetencies',
        cellTpl: null,
        cellRenderer: function(group, cellEl, rendered) {
            var studentCompetencies = group.records,
                studentCompetenciesLength = studentCompetencies.length,
                studentCompetencyIndex = 0, studentCompetency,
                highestStudentCompetency, highestLevel;

            for (; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
                studentCompetency = studentCompetencies[studentCompetencyIndex].record;

                if (
                    !highestStudentCompetency
                    || studentCompetency.get('Level') > highestStudentCompetency.get('Level')
                ) {
                    highestStudentCompetency = studentCompetency;
                }
            }

            if (highestStudentCompetency) {
                highestLevel = highestStudentCompetency.get('Level');
            }

            if (!rendered || rendered.level != highestLevel) {
                if (!rendered) {
                    cellEl.addCls('cbl-level-colored');
                }

                if (rendered && rendered.level) {
                    cellEl.removeCls('cbl-level-'+rendered.level);
                }

                if (highestLevel) {
                    cellEl.addCls('cbl-level-'+highestLevel);
                }

                cellEl.update(highestLevel ? highestLevel : '');
            }

            return {
                level: highestLevel
            };
        }
    },


    // component configuration
    cls: 'slate-studentcompetencies-admin-grid'
});