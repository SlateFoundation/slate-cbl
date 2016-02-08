Ext.define('SlateDemonstrationsTeacher.controller.Viewport', {
    extend: 'Ext.app.Controller',

    views: [
        'main.Main'
    ],

    config: {
        refs: {
            mainView: {
                selector: 'app-main',
                autoCreate: true,

                xtype: 'app-main'
            }
        },
    },

    onLaunch: function () {
        this.getMainView().render('slateapp-viewport');
    }
});