/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * TODO:
 * - use view-bound store instances rather than global stores
 */
Ext.define('Slate.cbl.view.teacher.Dashboard', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-teacher-dashboard',
    requires:[
        'Slate.cbl.util.CBL',

        'Slate.cbl.view.teacher.DashboardController',
        'Slate.cbl.widget.Popover',

        'Slate.cbl.model.ContentArea',
        'Slate.cbl.store.Students',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.store.Skills'
    ],

    controller: 'slate-cbl-teacher-dashboard',

    config: {
        contentArea: null,
        popover: true
    },

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
                                    '<td class="cbl-grid-progress-cell <tpl if="isAverageLow">is-average-low</tpl> <tpl if="level">cbl-level-{level}</tpl>" data-student="{student.ID}">',
                                        '<tpl if="level">',
                                            '<span class="cbl-grid-progress-bar" style="width: {percentComplete}%"></span>',
                                            '<span class="cbl-grid-progress-level">L{level}</span>',
                                            '<span class="cbl-grid-progress-percent">{percentComplete}%</span>',
                                            '<span class="cbl-grid-progress-average">',
                                                '{demonstrationsAverage:number("0.##")}',
                                            '</span>',
                                        '</tpl>',
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
        },
        progressrowclick: 'onProgressRowClick'
    },


    // local subtemplates
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
        '<tpl for=".">',
            '<tr class="cbl-grid-skill-row" data-skill="{ID}">',
                '<tpl for="students">',
                    '<td class="cbl-grid-demos-cell cbl-level-{level}" data-student="{student.ID}">',
                        '<ul class="cbl-grid-demos">',
                            '{%demonstrationsTpl.applyOut(values.demonstrations, out)%}',
                        '</ul>',
                    '</td>',
                '</tpl>',
            '</tr>',
        '</tpl>',
    ],

    demonstrationsTpl: [
        '<tpl for=".">',
            '<tpl if="DemonstrationID">',
                '<li class="cbl-grid-demo cbl-grid-demo-<tpl if="DemonstratedLevel==0">uncounted<tpl else>counted</tpl>" data-demonstration="{DemonstrationID}">',
                    '<tpl if="DemonstratedLevel==0">M<tpl else>{DemonstratedLevel}</tpl>',
                '</li>',
            '<tpl else>',
                '<li class="cbl-grid-demo cbl-grid-demo-empty"></li>',
            '</tpl>',
        '</tpl>'
    ],


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

    /**
     * Attached via listeners config in view
     */
    onProgressRowClick: function(dashboardView, ev, targetEl) {
        this.expandCompetency(
            Slate.cbl.store.Competencies.getById(
                targetEl.getAttribute('data-competency')
            )
        );
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
    
    expandCompetency: function(competency) {
        var me = this,
            rowEls = me.getRowElsForCompetency(competency),
            headersRowEl = rowEls.headers,
            studentsRowEl = rowEls.students,
            skillsHeight = 0,
            _finishExpand, _finishToggle;

// TODO: instead of loading data from here, fire a beforeexpand event that the contoller can cancel pending load, and then re-call expandCompetency
        Ext.suspendLayouts();

        _finishToggle = function() {
            headersRowEl.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            studentsRowEl.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            Ext.resumeLayouts(true);
        };


        // handle collapse
        if (competency.get('expanded')) {
            competency.set('expanded', false);
            headersRowEl.removeCls('is-expanded');
            studentsRowEl.removeCls('is-expanded');
            _finishToggle();
            return;
        }


        // handle expand
        competency.set('expanded', true);

        _finishExpand = function() {
            skillsHeight = headersRowEl.down('.cbl-grid-skills-grid').getHeight();
            headersRowEl.addCls('is-expanded');
            studentsRowEl.addCls('is-expanded');
            _finishToggle();
        };

        // skills are already loaded & rendered, finish expand immediately
        if (competency.get('skillsRendered')) {
            _finishExpand();
            return;
        }

        // load demonstrations and skills
        Slate.cbl.API.getAllDemonstrationsByStudentsCompetency(Slate.cbl.store.Students.collect('ID'), competency.getId(), function(loadedDemonstrations) {
            competency.set('demonstrations', loadedDemonstrations); // TODO: don't decorate models
            if (competency.skills) {
                me.refreshCompetency(competency);
                _finishExpand();
            }
        });

        Slate.cbl.store.Skills.getAllByCompetency(competency, function() {
            if (competency.get('demonstrations')) { // TODO: don't decorate models
                me.refreshCompetency(competency);
                _finishExpand();
            }
        });
    },
    
    getRowElsForCompetency: function(competency) {
        if (competency.rowEls) {
            return competency.rowEls;
        }
 
        var rows = this.el.select(
            Ext.String.format('.cbl-grid-skills-row[data-competency="{0}"]', competency.getId()),
            true // true to get back unique Ext.Element instances
        );
        
        return competency.rowEls = {
            headers: rows.item(0),
            students: rows.item(1)
        };
    }
});
