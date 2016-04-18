/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.ContextMenu', {
    extend        : 'Ext.menu.Menu',
    alias         : 'widget.recordercontextmenu',
    panel         : null,
    width         : 300,
    plain         : true,
    initComponent : function () {
        var me = this;
        //var R              = Siesta.Resource('Siesta.Recorder.UI.RecorderPanel');

        Ext.apply(me, {
            items : [
                {
                    xtype      : 'textfield',
                    itemId     : 'newGroupName',
                    fieldLabel : 'Create group',
                    width      : 80,
                    enableKeyEvents : true,
                    listeners  : {
                        specialkey : this.onCreateGroupKeyUp,
                        scope      : this
                    }
                }
            ]
        });

        this.panel.on({
            rowcontextmenu : this.onActivate,
            scope          : this
        })

        this.callParent(arguments)

        this.nameField = this.down('#newGroupName');
    },

    onActivate : function (panel, record, node, rowIndex, e) {

        this.showAt(e.getXY());

        this.nameField.reset();

        e.stopEvent();
    },

    onCreateGroupKeyUp : function(field, e) {
        if (e.getKey() === e.ENTER) {
            var name = this.nameField.getValue();

            if (name){
                var store = this.panel.getStore();
                var selected = this.panel.getSelectionModel().getSelected().items;
                var firstRow = Math.min.apply(Math, selected.map(function(rec) { return rec.data.index; }));

                store.getRootNode().insertChild(firstRow, {
                    action   : 'group',
                    value    : name,
                    expanded : true,
                    children : selected
                });

                this.hide();
            }
        }
    }
});
