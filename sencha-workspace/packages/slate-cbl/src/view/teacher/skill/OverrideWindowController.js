/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.teacher.skill.OverrideWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slate-cbl-teacher-skill-overridewindow',
    requires: [
        'Slate.cbl.API',
        'Slate.cbl.field.LevelSlider',

        'Ext.MessageBox',
        'Ext.window.Toast',
        'Ext.util.MixedCollection'
    ],

    config: {
        control: {
            '#': {
                show: 'onShow'
            }
        }
    },

    // event handlers
    onShow: function(editWindow) {

    }
});