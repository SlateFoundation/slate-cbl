/**
 * Standard header component for application dashboards
 */
Ext.define('Slate.cbl.view.app.Header', {
    extend: 'Ext.Toolbar',
    xtype: 'slate-appheader',
    requires: [
        'Slate.cbl.view.app.Title'
    ],


    config: {

        /**
         * @cfg {Ext.Compontent|String|boolean}
         *
         * String title for application or false to hide
         */
        title: null,


        dock: 'top',
        componentCls: 'slate-appheader',
        layout: {
            type: 'hbox',
            align: 'center'
        }
    },


    // config handlers
    applyTitle: function(title, oldTitle) {
        if (!title) {
            title = false;
        }

        switch (typeof title) {
            case 'boolean':
                title = {
                    hidden: !title
                };
                break;
            case 'string':
                title = {
                    html: title,
                    hidden: false
                };
                break;
            default:
                // title is object
        }

        return Ext.factory(title, 'Slate.cbl.view.app.Title', oldTitle);
    },


    // component lifecycle
    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.insert(0, me.getTitle());
    }
});