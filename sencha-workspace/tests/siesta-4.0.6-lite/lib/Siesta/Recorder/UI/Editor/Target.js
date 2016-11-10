/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.Editor.Target', {
    extend          : 'Ext.form.field.ComboBox',
    alias           : 'widget.targeteditor',

    enableKeyEvents : true,
    queryMode       : 'local',
    valueField      : 'type',
    displayField    : 'value',
    cls             : 'siesta-targeteditor',
    
    targetProperty  : 'target',

    store : {
        proxy   : 'memory',
        fields  : [ 'type', 'value', 'target' ]
    },

    getTarget : function () {
        var value       = this.getValue();
        
        if (value && /^!!(.+)/.exec(value)) {
            var record      = this.store.findRecord('type', value)

            // TODO also return 'offset'?
            return record ? record.get('target') : null
        }
        
        return value ? {
            type        : 'user',
            target      : value
        } : null
    },

    
    setValue : function (value) {
        // This method is called with an array of a single record
        if (value instanceof Siesta.Recorder.Target) {
            if (value.getTarget())
                this.callParent([ '!!' + value.getTarget().type ]);
            else
                this.callParent([ '' ])
        } else
            this.callParent(arguments)
    },
    
    
    getEditorValue : function (record) {
        return record.data[ this.targetProperty ]
    },
    
    
    applyChanges : function (actionRecord) {

        var value       = this.getValue()
        var match
        
        var target      = actionRecord.data[ this.targetProperty ]

        // Typing 100,200 should mean a coordinate
        if (typeof value === 'string' && value.match(/\d*,\d*/)) {
            value = value.split(',');
            value[0] = parseInt(value[0], 10);
            value[1] = parseInt(value[1], 10);
        }

        if (value && !target) {
            target      = actionRecord.data[ this.targetProperty ] = new Siesta.Recorder.Target({
                targets     : [ { type : 'user', target : value } ]
            })
        }

        if (target) {
            if (value && (match = /^!!(.+)/.exec(value)))
                target.activeTarget = match[ 1 ]
            else {
                target.setUserTarget(value)
            }

            // TODO
            //actionRecord.afterEdit(this.targetProperty)
        }
    },

    
    populate : function (target) {
        var storeData   = [];

        target && target.targets.forEach(function (target) {
            var type     = target.type
            value        = target.target;

            if (type === 'cq' ) {
                var splitPos = target.target.indexOf('->');
                value = splitPos > 0 ? target.target.split('->').splice(1, 0, '>>').join() : '>>' + target.target
            }

            storeData.push({
                // we add the "!!" before the type, so that "setValue(value)" can distinguish between the value as 
                // arbitrary string (user input) and value as type name (which should change only the "activeTarget")
                type    : '!!' + type, 
                value   : value,
                target  : target
            });
        });

        this.store.loadData(storeData);
    }
});
