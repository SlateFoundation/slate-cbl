Ext.define('SlateDemonstrationsTeacher.view.OverrideWindowController', {
    // extend: 'Ext.app.ViewController',
    // alias: 'controller.slate-demonstrations-teacher-skill-overridewindow',
    // requires: [
    //     'Ext.window.Toast',

    //     'Slate.API',

    //     'Slate.cbl.model.Demonstration'
    // ],

    // config: {
    //     // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    //     id: 'slate-demonstrations-teacher-skill-overridewindow',
    //     control: {
    //        '#': {
    //            beforeshow: 'onBeforeWindowShow'
    //        },
    //         'button[action=submit]': {
    //             click: 'onSubmitClick'
    //         }
    //     },

    //     listen: {
    //     }
    // },


    // toastTitleTpl: [
    //     'Standard Override Saved'
    // ],

    // toastBodyTpl: [
    //     'Overrode',
    //     ' <strong>{standard.Code}</strong>',
    //     ' for',
    //     ' <strong>{student.FullName}.</strong>'
    // ],


    // // workaround for http://www.sencha.com/forum/showthread.php?290043-5.0.1-destroying-a-view-with-ViewController-attached-disables-listen-..-handlers
    // applyId: function(id) {
    //     return Ext.id(null, id);
    // },


    // // template methods
    // onBeforeWindowShow: function(overrideWindow) {
    //     var me = this,
    //         student = overrideWindow.getStudent(),
    //         standard = overrideWindow.getStandard(),
    //         summaryCmp = me.lookupReference('summary');

    //     if (student.isLoading()) {
    //         // framework will append our callback to the existing operation if the model is already loading
    //         student.load({
    //             callback: function() {
    //                 me.init(overrideWindow);
    //             }
    //         });
    //         return;
    //     }

    //     if (standard.isLoading()) {
    //         // framework will append our callback to the existing operation if the model is already loading
    //         standard.load({
    //             callback: function() {
    //                 me.init(overrideWindow);
    //             }
    //         });
    //         return;
    //     }

    //     summaryCmp.update({
    //         student: student.getData(),
    //         standard: standard.getData()
    //     });
    // },


    // // event handlers
    // onSubmitClick: function() {
    //     var me = this,
    //         overrideWindow = me.getView(),
    //         student = overrideWindow.getStudent(),
    //         standard = overrideWindow.getStandard(),
    //         demonstration = Ext.create('Slate.cbl.model.Demonstration', {
    //             Class: 'Slate\\CBL\\Demonstrations\\OverrideDemonstration',
    //             StudentID: student.getId(),
    //             Skills: [
    //                 {
    //                     SkillID: standard.getId(),
    //                     Override: 1
    //                 }
    //             ],
    //             Comments: me.lookupReference('commentsField').getValue()
    //         });

    //     overrideWindow.setLoading('Submitting override&hellip;');
    //     demonstration.save({
    //         callback: function(record, operation, success) {
    //             var tplData;

    //             if (success) {
    //                 tplData = {
    //                     student: student.getData(),
    //                     standard: standard.getData()
    //                 };

    //                 Ext.toast(
    //                     Ext.XTemplate.getTpl(me, 'toastBodyTpl').apply(tplData),
    //                     Ext.XTemplate.getTpl(me, 'toastTitleTpl').apply(tplData)
    //                 );

    //                 overrideWindow.close();

    //                 Slate.API.fireEvent('demonstrationsave', demonstration);
    //             } else {
    //                 overrideWindow.setLoading(false);

    //                 Ext.Msg.show({
    //                     title: 'Failed to apply override',
    //                     message: operation.getError() || 'Please backup your work to another application and report this to your technical support contact',
    //                     buttons: Ext.Msg.OK,
    //                     icon: Ext.Msg.ERROR
    //                 });
    //             }
    //         }
    //     });
    // }
});