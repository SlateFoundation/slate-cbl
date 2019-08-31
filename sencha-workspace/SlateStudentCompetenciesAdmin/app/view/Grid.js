/**
 * Renders enrollments for a given list of students across a given list of competencies
 */
Ext.define('SlateStudentCompetenciesAdmin.view.Grid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'slate-studentcompetencies-admin-grid',
    requires: [
        'Ext.XTemplate',

        /* global Slate */
        'Slate.cbl.widget.Popover',
        'Slate.cbl.util.Config'
    ],


    config: {
        popover: true,
        popoverTitleTpl: [
            'Enrollment <tpl if="ID &gt; 0">#{ID}<tpl else>(unsaved)</tpl>'
        ],
        popoverBodyTpl: [
            '<dl class="slate-studentcompetencies-admin-grid-popover">',
                '<dt>Baseline rating</dt>',
                '<dd><tpl if="BaselineRating">{BaselineRating}<tpl else>&mdash;</tpl></dd>',
                '<dt>Entered via</dt>',
                '<dd>{EnteredVia}</dd>',
                '<tpl if="Created">',
                    '<dt>Created on</dt>',
                    '<dd><time>{Created:date("D, M j, Y \\\\&\\\\m\\\\i\\\\d\\\\d\\\\o\\\\t\\\\; g:i a")}</time></dd>',
                '</tpl>',
                '<tpl for="Creator">',
                    '<dt>Created by</dt>',
                    '<dd><tpl if="Username">{Username}<tpl else>{FirstName} {LastName}</tpl></dd>',
                '</tpl>',
            '</dl>'
        ],

        // aggregrid config
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

            if (!rendered) {
                cellEl.addCls('cbl-level-colored');
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
                cellEl.toggleCls('cbl-level-phantom', highestIsPhantom);
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
        },

        // component config
        listeners: {
            scope: 'this',
            mouseenter: {
                fn: 'onCellMouseEnter',
                element: 'el',
                delegate: '.jarvus-aggregrid-cell'
            },
            mouseleave: {
                fn: 'onCellMouseLeave',
                element: 'el',
                delegate: '.jarvus-aggregrid-cell'
            }
        }
    },


    // component configuration
    cls: 'slate-studentcompetencies-admin-grid',


    // config handlers
    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },

    applyPopoverTitleTpl: function(tpl) {
        return tpl.isTemplate ? tpl : new Ext.XTemplate(tpl);
    },

    applyPopoverBodyTpl: function(tpl) {
        return tpl.isTemplate ? tpl : new Ext.XTemplate(tpl);
    },


    // component lifecycle
    initComponent: function() {
        this.availableLevels = Slate.cbl.util.Config.getAvailableLevels();
        this.callParent(arguments);
    },


    // event handlers
    onCellMouseEnter: function(ev, t) {
        var me = this,
            popover = me.getPopover(),
            studentCompetency, tplData;

        t = Ext.get(t);

        if (popover.hidden || popover.alignTarget !== t) {
            studentCompetency = this.getDataStore().getById(
                parseInt(t.getAttribute('data-studentcompetency-id'), 10)
            );

            if (studentCompetency) {
                tplData = studentCompetency.getData();

                popover.showBy(t);
                popover.update({
                    title: me.getPopoverTitleTpl().apply(tplData),
                    body: me.getPopoverBodyTpl().apply(tplData)
                });
            } else {
                popover.hide();
            }
        }
    },

    onCellMouseLeave: function() {
        this.getPopover().hide();
    }
});