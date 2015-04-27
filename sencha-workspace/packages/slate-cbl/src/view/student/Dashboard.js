/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.student.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'slate-cbl-student-dashboard',
    requires:[
        'Slate.cbl.view.student.DashboardController',
        'Slate.cbl.view.student.CompetencyCard',
        'Slate.cbl.model.Student',
        'Slate.cbl.model.ContentArea',
        'Slate.cbl.widget.Popover'
    ],

    controller: 'slate-cbl-student-dashboard',

    config: {
        student: null,
        contentArea: null,

        popover: {
            pointer: 'none'
        },
        competenciesStatus: 'unloaded'
    },

    autoEl: {
        tag: 'ul',
        cls: 'cbl-competency-panels'
    },
    defaultType: 'slate-cbl-student-competencycard',
    layout: 'container',


    // config handlers
    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },

    applyStudent: function(student) {
        if (!student) {
            return null;
        }

        if (student.isModel) {
            return student;
        }

        return Ext.create('Slate.cbl.model.Student', student);
    },

    updateStudent: function(newStudent, oldStudent) {
        this.fireEvent('studentchange', this, newStudent, oldStudent);
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

    updateCompetenciesStatus: function(newStatus, oldStatus) {
        if (oldStatus) {
            this.removeCls('competencies-' + oldStatus);
        }

        if (newStatus) {
            this.addCls('competencies-' + newStatus);
        }
    }
});
