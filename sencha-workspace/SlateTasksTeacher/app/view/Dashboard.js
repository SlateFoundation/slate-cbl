/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateTasksTeacher.view.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-tasks-teacher-dashboard',
    requires: [
        'SlateTasksTeacher.view.AppHeader',
        'SlateTasksTeacher.view.StudentsGrid',
        'SlateTasksTeacher.view.GridLegend',

        'Slate.cbl.widget.Placeholder'
    ],


    config: {
        // runtime state
        section: null,
        cohort: null,

        // subcomponent cubbies
        placeholderCmp: {
            html: 'Select a section to load tasks dashboard'
        },
        taskGrid: false,
        gridLegend: false
    },

    items: [{
        xtype: 'slate-tasks-teacher-appheader'
    }],


    // config handlers
    updateSection: function(section, oldSection) {
        var me = this;

        Ext.suspendLayouts();
        me.setPlaceholderCmp(!section);
        me.setTaskGrid(Boolean(section));
        me.setGridLegend(Boolean(section));
        Ext.resumeLayouts();

        me.fireEvent('sectionchange', me, section, oldSection);
    },

    updateCohort: function(cohort, oldCohort) {
        this.fireEvent('cohortchange', this, cohort, oldCohort);
    },

    applyPlaceholderCmp: function(placeholderCmp, oldPlaceholderCmp) {
        if (typeof placeholderCmp === 'boolean') {
            placeholderCmp = {
                hidden: !placeholderCmp
            };
        }

        return Ext.factory(placeholderCmp, 'Slate.cbl.widget.Placeholder', oldPlaceholderCmp);
    },

    applyTaskGrid: function(taskGrid, oldTaskGrid) {
        if (typeof taskGrid === 'boolean') {
            taskGrid = {
                hidden: !taskGrid
            };
        }

        return Ext.factory(taskGrid, 'SlateTasksTeacher.view.StudentsGrid', oldTaskGrid);
    },

    applyGridLegend: function(gridLegend, oldGridLegend) {
        if (typeof gridLegend === 'boolean') {
            gridLegend = {
                hidden: !gridLegend
            };
        }

        return Ext.factory(gridLegend, 'SlateTasksTeacher.view.GridLegend', oldGridLegend);
    },


    // component lifecycle
    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.add(me.getPlaceholderCmp());
        me.add(me.getTaskGrid());
        me.add(me.getGridLegend());
    }
});