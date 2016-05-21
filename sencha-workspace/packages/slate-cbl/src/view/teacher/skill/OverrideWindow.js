/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.skill.OverrideWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-teacher-skill-overridewindow',
    requires: [
        'Slate.cbl.view.teacher.skill.OverrideWindowController',

        'Slate.cbl.API',

        'Slate.cbl.model.Skill',
        'Slate.cbl.model.Student',

        'Ext.form.field.TextArea'
    ],

    controller: 'slate-cbl-teacher-skill-overridewindow',

    config: {
        student: null,
        standard: null
    },

    title: 'Override Standard',
    width: 400,
    minWidth: 400,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            reference: 'summary',

            xtype: 'component',
            padding: '16 32 0',
            tpl: [
                '<p><strong>Student:</strong> {student.FullName}</p>',
                '<p><strong>Standard:</strong> <em>{standard.Code}</em> &mdash; {standard.Statement}</p>'
            ]
        },
        {
            reference: 'commentsField',
            flex: 1,

            xtype: 'textarea',
            fieldLabel: 'Comments'
        },
        {
            xtype: 'button',
            text: 'Submit',
            scale: 'large',
            action: 'submit'
        }
    ],


    // config handlers
    applyStudent: function(student) {
        if (!student) {
            return null;
        }
        
        return student.isModel ? student : Slate.cbl.API.getSession().getRecord(Slate.cbl.model.Student, student);
    },

    applyStandard: function(standard) {
        if (!standard) {
            return null;
        }
        
        return standard.isModel ? standard : Slate.cbl.API.getSession().getRecord(Slate.cbl.model.Skill, standard);
    }
});
