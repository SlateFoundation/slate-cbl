/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Slate.cbl.view.teacher.skill.OverrideWindow', {
    extend: 'Ext.window.Window',
    xtype: 'slate-cbl-teacher-skill-overridewindow',
    requires: [
        'Slate.cbl.view.teacher.skill.OverrideWindowController',

        'Ext.layout.container.Fit',
        'Ext.form.Panel',
        'Ext.tab.Panel',
        'Ext.grid.Panel',
        'Ext.grid.feature.Grouping',
        'Ext.grid.column.Action',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Checkbox',
        'Ext.data.ChainedStore'
    ],

    controller: 'slate-cbl-teacher-skill-overridewindow',
    
    config: {
        student: null,
        newLevel: null
    },

    title: 'Override',
    width: 600,
    constrainHeader: true,
    layout: 'fit',

    items: {
        reference: 'form',
        
        autoScroll: true,
        bodyPadding: 16,
        defaults: {
            anchor: '75%',
            allowBlank: false,
            msgTarget: 'side',
            selectOnFocus: true,
            labelAlign: 'right',
            labelWidth: 150
        },
        items: [{
            reference: 'overrideTitle',
            name: 'title',
            
            xtype: 'component'
        }, {
                reference: 'overrideReason',
                
                anchor: '-59', // add " -350" to make stretch with window
                xtype: 'textarea',

                allowBlank: true,
                selectOnFocus: false
        }, {
            xtype: 'button',
            text: 'Submit',
            scale: 'large',
            action: 'submit-override',
            formBind: true,
            margin: '0 16 0 155',
            align: 'center'
        }]
    },
    
    updateStudent: function(student) {
        var me = this,
            newLevel = me.getNewLevel(),
            _finishRender = function() {
                // debugger;
                me.down('form component[name=title]').setText('Promote '+ student.get('FullName') + ' to ' + newLevel);
            };
            
        if(me.rendered) {
            _finishRender();
        } else {
            me.on('render', _finishRender, me, { single: true });
        }
    }
});