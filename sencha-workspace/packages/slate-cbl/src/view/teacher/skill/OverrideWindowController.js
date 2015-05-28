/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.skill.OverrideWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-skill-overridewindow',
    requires: [
        'Slate.cbl.model.Demonstration'
    ],

    config: {
        // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
        id: 'slate-cbl-teacher-skill-overridewindow',
        control: {
//            '#': {
//                beforeshow: 'onBeforeWindowShow'
//            }
            'button[action=submit]': {
                click: 'onSubmitClick'
            },
        },

        listen: {
        }
    },

    // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    applyId: function(id) {
        return Ext.id(null, id);
    },


    // template methods
    init: function(overrideWindow) {
        var me = this,
            student = overrideWindow.getStudent(),
            standard = overrideWindow.getStandard(),
            summaryCmp = me.lookupReference('summary');

        if (student.isLoading()) {
            // framework will append our callback to the existing operation if the model is already loading
            student.load({
                callback: function() {
                    me.init(overrideWindow);
                }
            });
            return;
        }

        if (standard.isLoading()) {
            // framework will append our callback to the existing operation if the model is already loading
            standard.load({
                callback: function() {
                    me.init(overrideWindow);
                }
            });
            return;
        }

        summaryCmp.update({
            student: student.getData(),
            standard: standard.getData()
        });
    },


    // event handlers
    onSubmitClick: function() {
        var overrideWindow = this.getView(),
            demonstration = Ext.create('Slate.cbl.model.Demonstration');

        demonstration.set({
            StudentID: overrideWindow.getStudent().getId(),
            Skills: [
                {
                    SkillID: overrideWindow.getStandard().getId()
                }
            ],
            Comments: this.lookupReference('commentsField').getValue()
        });

        debugger;
    }
});