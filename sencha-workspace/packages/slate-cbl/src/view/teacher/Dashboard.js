/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.Dashboard', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-teacher-dashboard',
    requires:[
        'Slate.cbl.view.teacher.DashboardController',
        'Slate.cbl.model.ContentArea',
        'Slate.cbl.widget.Popover',
        'Slate.cbl.util.CBL'
    ],

    controller: 'slate-cbl-teacher-dashboard',

    config: {
        contentArea: null,
        popover: true
    },

    skillHeadersTpl: [
        '<tpl for=".">',
            '<tr class="cbl-grid-skill-row" data-skill="{ID}">',
                '<th class="cbl-grid-skill-name" data-skill-name="{Descriptor:htmlEncode}" data-skill-description="{Statement:htmlEncode}">',
                    '<div class="ellipsis">{Descriptor:htmlEncode}</div>',
                '</th>',
            '</tr>',
        '</tpl>'
    ],

    skillStudentsTpl: [
        '{%var demonstrationsTpl = this.owner.getTpl("demonstrationsTpl")%}',
        '<tpl for="skills">',
            '<tr class="cbl-grid-skill-row" data-skill="{ID}">',
                '<tpl for="parent.studentIds">',
                    '<td class="cbl-grid-demos-cell cbl-level-9" data-student="{.}">', // TODO: real level
                        '{%demonstrationsTpl.applyOut({skill: parent, studentId: values}, out)%}',
                    '</td>',
                '</tpl>',
            '</tr>',
        '</tpl>'
    ],

    demonstrationsTpl: [
        '<ul class="cbl-grid-demos">',
            '<tpl for="this.getDemonstrationBlocks(skill, studentId)">',
                '<tpl if="DemonstrationID">',
                    '<li class="cbl-grid-demo cbl-grid-demo-<tpl if="Level==0">uncounted<tpl else>counted</tpl>" data-demonstration="{DemonstrationID}">',
                        '<tpl if="Level==0">M<tpl else>{Level}</tpl>',
                    '</li>',
                '<tpl else>',
                    '<li class="cbl-grid-demo cbl-grid-demo-empty"></li>',
                '</tpl>',
            '</tpl>',
        '</ul>',
        {

            getDemonstrationBlocks: function(skill, studentId) {

                if (!skill || !studentId) {
                    return null;
                }

                var demonstrationsRequired = skill.DemonstrationsRequired,
                    blocks = Slate.cbl.util.CBL.sortDemonstrations(
                        skill.demonstrationsByStudent ? skill.demonstrationsByStudent[studentId] : [],
                        demonstrationsRequired
                );

                // add empty blocks
                while (blocks.length < demonstrationsRequired) {
                    blocks.push({});
                }

                return blocks;
            }
        }
    ],

    componentCls: 'cbl-grid-cmp',
    tpl: [
        '{%var studentsCount = values.students.length%}',
        '<div class="cbl-grid-ct">',
            '<table class="cbl-grid cbl-grid-competencies">',
                '<colgroup class="cbl-grid-competency-col"></colgroup>',

                '<thead>',
                    '<tr>',
                        '<td class="cbl-grid-corner-cell"></td>',
                    '</tr>',
                '</thead>',

                '<tbody>',
                    '<tpl for="competencies">',
                        '<tr class="cbl-grid-progress-row" data-competency="{ID}">',
                            '<th class="cbl-grid-competency-name"><div class="ellipsis">{Descriptor}</div></th>',
                        '</tr>',
                        '<tr class="cbl-grid-skills-row" data-competency="{ID}">',
                            '<td class="cbl-grid-skills-cell">',
                                '<div class="cbl-grid-skills-ct">',
                                    '<table class="cbl-grid-skills-grid">',
                                        '<colgroup class="cbl-grid-skill-col"></colgroup>',
                                        '<tbody></tbody>',
                                    '</table>',
                                '</div>',
                            '</td>',
                        '</tr>',
                    '</tpl>',
                '</tbody>',
            '</table>',

            '<div class="cbl-grid-scroll-ct">',
                '<table class="cbl-grid cbl-grid-main">',
                    '<colgroup span="{[studentsCount]}" class="cbl-grid-progress-col"></colgroup>',

                    '<thead>',
                        '<tr>',
                            '<tpl for="students">',
                                '<th class="cbl-grid-student-name" data-student="{ID}"><a href="/cbl/student-dashboard?student={Username}&content-area={parent.contentArea.Code}">{FirstName} {LastName}</a></th>',
                            '</tpl>',
                        '</tr>',
                    '</thead>',

                    '<tbody>',
                        '<tpl for="competencies">',
                            '<tr class="cbl-grid-progress-row" data-competency="{ID}">',
                                '<tpl for="students">',
                                    '<td class="cbl-grid-progress-cell <tpl if="isAverageLow">is-average-low</tpl> cbl-level-{level}" data-student="{student.ID}">',
                                        '<span class="cbl-grid-progress-bar" style="width: {percentComplete}%"></span>',
                                        '<span class="cbl-grid-progress-level">L{level}</span>',
                                        '<span class="cbl-grid-progress-percent">{percentComplete}%</span>',
                                        '<span class="cbl-grid-progress-average">',
                                            '{demonstrationsAverage:number("0.##")}',
                                        '</span>',
                                    '</td>',
                                '</tpl>',
                            '</tr>',
                            '<tr class="cbl-grid-skills-row" data-competency="{ID}">',
                                '<td class="cbl-grid-skills-cell" colspan="{[studentsCount]}"">',
                                    '<div class="cbl-grid-skills-ct">',
                                        '<table class="cbl-grid-skills-grid">',
                                            '<colgroup span="{[studentsCount]}"" class="cbl-grid-demos-col"></colgroup>',
                                            '<tbody></tbody>',
                                        '</table>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                        '</tpl>',
                    '</tbody>',
                '</table>',
            '</div>',
        '</div>',
        '<div class="cbl-grid-legend">',
            '<span class="cbl-grid-legend-label">Legend:&ensp;</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-8">8</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-9">9</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-10">10</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-11">11</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-12">12</span>',
            '<span class="cbl-grid-legend-item level-color cbl-level-13">13</span>',
        '</div>'
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.cbl-grid-progress-row, .cbl-grid-demo'
        },
        mouseover: {
            fn: 'onSkillNameMouseOver',
            element: 'el'
        }
    },


    // config handlers
    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },

    applyContentArea: function(contentArea) {
        if (!contentArea) {
            return null;
        }

        if (contentArea.isModel) {
            return contentArea;
        }

        if (contentArea === true) {
            contentArea = {};
        }

        return Ext.create('Slate.cbl.model.ContentArea', contentArea);
    },

    updateContentArea: function(newContentArea, oldContentArea) {
        this.fireEvent('contentareachange', this, newContentArea, oldContentArea);
    },


    // event handlers
    onGridClick: function(ev, targetEl) {
        var me = this;

        if (targetEl = ev.getTarget('.cbl-grid-progress-row', me.el, true)) {
            me.fireEvent('progressrowclick', me, ev, targetEl);
        } else if (targetEl = ev.getTarget('.cbl-grid-demo', me.el, true)) {
            me.fireEvent('democellclick', me, ev, targetEl);
        }
    },

    onSkillNameMouseOver: function(ev) {
        var me = this,
            popover = me.getPopover(),
            dashboardEl = me.el,
            targetEl;

        if (targetEl = ev.getTarget('.cbl-grid-skill-name', dashboardEl, true)) {
            if (popover.hidden || popover.alignTarget !== targetEl) {
                popover.showBy(targetEl);
                popover.update({
                    title: targetEl.getAttribute('data-skill-name'),
                    body: targetEl.getAttribute('data-skill-description')
                });
            }
        } else {
            popover.hide();
        }
    },


    // protected methods

    /**
     * Redraw the dashboard based on currently loaded data
     */
    refresh: function() {
        var me = this,
            contentArea = me.getContentArea(),
            studentsStore = Ext.getStore('cbl-students-loaded'),
            competenciesStore = Ext.getStore('cbl-competencies-loaded'),

            syncCompetencyRowHeights = function() {
                me.syncRowHeights(
                    me.el.select('.cbl-grid-competencies thead tr, .cbl-grid-competencies .cbl-grid-progress-row'),
                    me.el.select('.cbl-grid-main thead tr, .cbl-grid-main .cbl-grid-progress-row')
                );
            };

        if (!studentsStore.isLoaded() || !contentArea) {
            return;
        }

        if (!competenciesStore.isLoaded()) {
            contentArea.getCompetenciesForStudents(studentsStore.collect('ID'), function(competencies) {
                competenciesStore.loadRawData(competencies);
            });
            return;
        }

        Ext.suspendLayouts();

        me.update(me.getDashboardData());

        if (me.rendered) {
            syncCompetencyRowHeights();
        } else {
            me.on('render', syncCompetencyRowHeights, me, { single: true });
        }

        Ext.resumeLayouts(true);
    },

    syncRowHeights: function(table1Rows, table2Rows) {
        var table1RowHeights = [],
            table2RowHeights = [],
            rowCount, rowIndex, maxHeight;

        Ext.suspendLayouts();

        rowCount = table1Rows.getCount();

        if (table2Rows.getCount() != rowCount) {
            Ext.Logger.warn('tables\' row counts don\'t match');
        }

        // read all the row height in batch first for both tables
        for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            table1RowHeights.push(table1Rows.item(rowIndex).getHeight());
            table2RowHeights.push(table2Rows.item(rowIndex).getHeight());
        }

        // write all the max row heights
        for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            maxHeight = Math.max(table1RowHeights[rowIndex], table2RowHeights[rowIndex]);
            table1Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
            table2Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
        }

        Ext.resumeLayouts(true);
    },

    getDashboardData: function() {
        var me = this,
            contentArea = me.getContentArea(),
            competenciesStore = Ext.getStore('cbl-competencies-loaded'),
            competenciesData = Ext.pluck(competenciesStore.getRange(), 'data'),
            competenciesLength = competenciesData.length, competencyIndex, competency, competencyStudents,
            studentsStore = Ext.getStore('cbl-students-loaded'),
            studentsData = Ext.pluck(studentsStore.getRange(), 'data'),
            studentsLength = studentsData.length, studentIndex, student,
            completion, percentComplete, demonstrationsAverage;


        // build aligned students array for each competency
        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competency = competenciesData[competencyIndex];
            competencyStudents = competency.students = [];

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                student = studentsData[studentIndex];
                completion = competency.studentCompletions[student.ID] || {};
                percentComplete = Math.round(100 * (completion.demonstrationsCount || 0) / competency.totalDemonstrationsRequired);
                demonstrationsAverage = completion.demonstrationsAverage;

                competencyStudents.push({
                    student: student,
                    level: 9, // TODO: don't hardcode
                    percentComplete: percentComplete,
                    demonstrationsAverage: demonstrationsAverage,
                    isAverageLow: percentComplete >= 50 && demonstrationsAverage < competency.minimumAverage
                });
            }
        }


        return {
            contentArea: contentArea.getData(),
            students: studentsData,
            competencies: competenciesData
        };
    }
});
