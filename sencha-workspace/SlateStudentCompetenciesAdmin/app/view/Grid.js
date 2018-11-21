/**
 * Renders enrollments for a given list of students across a given list of competencies
 */
Ext.define('SlateStudentCompetenciesAdmin.view.Grid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'slate-studentcompetencies-admin-grid',
    requires: [
        /* global Slate */
        'Slate.cbl.util.Config'
    ],


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
            var availableLevels = this.availableLevels,
                studentCompetencies = group.records,
                studentCompetenciesLength = studentCompetencies.length,
                studentCompetencyIndex = 0, studentCompetency, level,
                highestLevel = 0, highestIsPhantom = false, highestIncreasable, highestId;

            for (; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
                studentCompetency = studentCompetencies[studentCompetencyIndex].record;
                level = studentCompetency.get('Level');

                if (level > highestLevel) {
                    highestLevel = level;
                    highestIsPhantom = studentCompetency.phantom;
                    highestId = studentCompetency.getId();
                }
            }

            if (rendered.level != highestLevel) {
                if (rendered && rendered.level) {
                    cellEl.removeCls('cbl-level-'+rendered.level);
                }

                if (highestLevel) {
                    cellEl.addCls('cbl-level-'+highestLevel);
                }

                highestIncreasable = availableLevels.indexOf(highestLevel) != availableLevels.length - 1;

                cellEl
                    .toggleCls('cbl-level-increasable', highestIncreasable)
                    .toggleCls('cbl-level-maxxed', !highestIncreasable)
                    .update(highestLevel ? highestLevel : '');
            }

            if (rendered.phantom != highestIsPhantom) {
                cellEl
                    .toggleCls('cbl-level-phantom', highestIsPhantom)
                    .toggleCls('cbl-level-colored-light', !highestIsPhantom)
                    .toggleCls('cbl-level-colored', highestIsPhantom);
            }

            if (rendered.id != highestId) {
                cellEl.set({
                    'data-studentcompetency-id': highestId
                });
            }

            return {
                level: highestLevel,
                phantom: highestIsPhantom,
                id: highestId
            };
        }
    },


    // component configuration
    cls: 'slate-studentcompetencies-admin-grid',


    // component lifecycle
    initComponent: function() {
        this.availableLevels = Slate.cbl.util.Config.getAvailableLevels();
        this.callParent(arguments);
    }
});