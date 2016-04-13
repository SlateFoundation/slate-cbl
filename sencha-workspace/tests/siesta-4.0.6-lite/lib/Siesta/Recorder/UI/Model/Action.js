/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.Model.Action', {
    extend      : 'Ext.data.TreeModel',
    
    fields      : Object.keys ? Object.keys(Siesta.Recorder.Action.meta.getAttributes().properties) : [],
    
    actionClass : Siesta.Recorder.Action,
    $action     : null,


    constructor : function (data) {
        if (!data.children && !('leaf' in data) && !data.root) data.leaf = true;

        // surprisingly the change in "data" variable will be reflected in "arguments"
        this.callParent([data]);

        if (data && !data.root) {
            var action = data;
            if (!(action instanceof this.actionClass)) {
                action        = new this.actionClass(action)
            }

            //Siesta.Recorder.Action.meta.getAttributes().each(function(attr){ data[attr.name] = action[attr.name]; });
            this.$action = action;

            Ext.applyIf(action, this.data);
            this.data = action;
        }

    }
//    ,
    
    
//    setTargetByType : function (targetType, target) {
//        return this.$action.setTargetByType()
//    },


//    resetValues : function () {
//        this.$action.resetValues()
//        
//        this.afterEdit([ 'targets', 'value', '__offset__' ])
//    },
//
//    
//    clearTargetOffset : function () {
//        this.$action.clearTargetOffset()
//        
//        this.afterEdit([ 'targets' ])
//    },
//    
//    
//    setTargetOffset : function (value) {
//        this.$action.setTargetOffset(value)
//        
//        this.afterEdit([ '__offset__' ])
//    }
    
    
}, function () {
    var prototype   = this.prototype

    //var attributeNames  = [];
    //Siesta.Recorder.Action.meta.getAttributes().each(function(attr){ attributeNames.push(attr.name)});
    //
    //if (this.addFields) {
    //    this.addFields(attributeNames);
    //} else {
    //    var fields      = prototype.fields
    //    fields.addAll(attributeNames);
    //}

    Joose.A.each([ 
        'getTargetOffset', 'isMouseAction', 'parseOffset', 'getTarget', 'getTargets', 'hasTarget', 'asStep', 'asCode'
    ], function (methodName) {
        prototype[ methodName ] = function () {
            return this.$action[ methodName ].apply(this.$action, arguments)
        }
    })
    
    Joose.O.each({
        clearTargetOffset       : [ 'target' ],
        setTargetOffset         : [ 'target' ],
        resetValues             : [ 'target', 'value' ],
        setAction               : [ 'action', 'target' ]
    }, function (fields, methodName) {
        prototype[ methodName ] = function () {
            var res     = this.$action[ methodName ].apply(this.$action, arguments)

            // TODO not needed since we do refreshNode
            //this.afterEdit(fields)

            return res
        }
    })
});
