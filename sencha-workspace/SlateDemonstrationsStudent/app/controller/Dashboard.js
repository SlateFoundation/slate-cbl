/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('SlateDemonstrationsStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    
    refs: {
      dashboardCt: 'slate-demonstrations-student-dashboard',
      mainList: 'slate-demonstrations-student-list',
      recentProgressCmp: 'slate-cbl-student-recentprogress'
    },
    
    config: {
        control: {
            mainList: {
                onItemSelected: 'onItemSelected'
            }
        }
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
