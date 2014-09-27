/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.Dashboard', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-teacher-dashboard',
    requires:[
        'Slate.cbl.view.teacher.DashboardController',
        'Slate.cbl.model.ContentArea',
        'Slate.cbl.widget.Popover'
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
        '<tpl for="skills">',
            '<tr class="cbl-grid-skill-row" data-skill="{ID}">',
                '<tpl for="parent.studentIds">',
                    '{%var demonstrations = parent.demonstrationsByStudent && parent.demonstrationsByStudent && parent.demonstrationsByStudent[values]%}',
                    '<td class="cbl-grid-demos-cell cbl-level-9" data-student="{.}">', // TODO: real level
                        '<ul class="cbl-grid-demos">',
                            '<tpl for="this.makeRange(1, parent.DemonstrationsNeeded)">',
                                '<li class="cbl-grid-demo {[demonstrations && values <= demonstrations.length ? "is-complete" : ""]}"></li>',
                            '</tpl>',
                        '</ul>',
                    '</td>',
                '</tpl>',
            '</tr>',
        '</tpl>',
        {
            makeRange: function(from, to) {
                var arr = [],
                    i = from;

                for (; i <= to; i++) {
                    arr.push(i);
                }

                return arr;
            }
        }
    ],

    componentCls: 'cbl-grid-cmp',
    tpl: [
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
                    '<colgroup span="{students.length}" class="cbl-grid-progress-col"></colgroup>',

                    '<thead>',
                        '<tr>',
                            '<tpl for="students">',
                                '<th class="cbl-grid-student-name" data-student="{ID}">{FirstName} {LastName}</th>',
                            '</tpl>',
                        '</tr>',
                    '</thead>',

                    '<tbody>',
                        '<tpl for="competencies">',
                            '<tr class="cbl-grid-progress-row" data-competency="{ID}">',
                                '<tpl for="parent.students">',
                                    '{%var level = 9%}', // TODO: real level
                                    '{%var percent = Math.round(100 * (parent.studentDemonstrations[values.ID] || 0) / parent.totalDemonstrationsNeeded)%}',
                                    '<td class="cbl-grid-progress-cell is-halted cbl-level-{[level]}" data-student="{ID}">',
                                        '<span class="cbl-grid-progress-bar" style="width: {[percent]}%"></span>',
                                        '<span class="cbl-grid-progress-level">L{[level]}</span>',
                                        '<span class="cbl-grid-progress-percent">{[percent]}%</span>',
                                        '<span class="cbl-grid-progress-average">',
                                        	// '<img src="/img/alert.svg">',
                                        	'10.75',
                                        '</span>',
                                    '</td>',
                                '</tpl>',
                            '</tr>',
                            '<tr class="cbl-grid-skills-row" data-competency="{ID}">',
                                '<td class="cbl-grid-skills-cell" colspan="{parent.students.length}">',
                                    '<div class="cbl-grid-skills-ct">',
                                        '<table class="cbl-grid-skills-grid">',
                                            '<colgroup span="{parent.students.length}" class="cbl-grid-demos-col"></colgroup>',
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
            '<span class="cbl-grid-legend-item cbl-level-9">9</span>',
            '<span class="cbl-grid-legend-item cbl-level-10">10</span>',
            '<span class="cbl-grid-legend-item cbl-level-11">11</span>',
            '<span class="cbl-grid-legend-item cbl-level-12">12</span>',
        '</div>'
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.cbl-grid-progress-row, .cbl-grid-demos-cell'
        },
        mouseover: {
            fn: 'onSkillNameMouseOver',
            element: 'el'
//            delegate: '.cbl-grid-skill-name'
        }
//        mouseout: {
//            fn: 'onSkillsGridMouseOut',
//            element: 'el'
//        }
    },

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

    onGridClick: function(ev, t) {
        var me = this,
            targetEl;

        if (targetEl = ev.getTarget('.cbl-grid-progress-row', me.el, true)) {
            me.fireEvent('progressrowclick', me, ev, targetEl);
        } else if (targetEl = ev.getTarget('.cbl-grid-demos-cell', me.el, true)) {
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
    }
});