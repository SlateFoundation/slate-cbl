Ext.define('Slate.cbl.field.AssigneesField', {
    extend: 'Ext.form.field.Tag',
    xtype: 'slate-cbl-assigneesfield',
    requires: [
        'Slate.model.person.Person'
    ],


    config: {
        showAllStudents: true,

        fieldLabel: 'Assigned To',

        displayField: 'FullName',
        valueField: 'ID',
        queryMode: 'local',

        emptyText: 'Select one or more students',
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                weight: -2,
                handler: 'onClearClick',
                scope: 'this'
            }
        }
    },


    // field configuration
    name: 'Assignees',

    store: {
        model: 'Slate.model.person.Person'
    },

    childEls: {
        allStudentsLabel: true,
        allStudentsCheckbox: true,
        allStudentsPlaceholder: true
    },

    postSubTpl: [
        '<span id="{cmpId}-allStudentsPlaceholder" data-ref="allStudentsPlaceholder" class="{placeholderCoverCls} {placeholderCoverCls}-{ui} {emptyCls}">',
            'Uncheck all students to select individuals',
        '</span>',
        '{% values.tagPostSubTpl.applyOut(values, out) %}'
    ],

    afterSubTpl: [
        '<label id="{id}-allStudentsLabel" data-ref="allStudentsLabel">',
            '<input type="checkbox" id="{id}-allStudentsCheckbox" data-ref="allStudentsCheckbox">',
            ' All Students',
        '</label>'
    ],


    // component lifecycle
    initComponent: function() {
        var me = this,
            allowBlank, clearTrigger;

        me.callParent(arguments);

        allowBlank = me.allowBlank;
        clearTrigger = me.getTrigger('clear');

        clearTrigger.setHidden(!allowBlank || !me.value.length);

        if (allowBlank) {
            me.on('change', function(combo, value) {
                clearTrigger.setHidden(me.allStudentsCheckbox.dom.checked || me.isEmpty(value));
            });
        }
    },

    afterRender: function() {
        var me = this;

        me.callParent();

        me.allStudentsLabel.setDisplayed(me.getShowAllStudents());
        me.allStudentsCheckbox.on('change', 'onAllStudentsCheckboxChange', me);
        me.allStudentsPlaceholder.setDisplayed(false);
    },


    // field lifecycle
    getSubTplData: function() {
        var data = this.callParent(arguments);

        data.tagPostSubTpl = Ext.XTemplate.getTpl(this.superclass, 'postSubTpl');

        return data;
    },

    setValue: function(value) {
        var id, ids = [];

        if (!Ext.isObject(value)) {
            return this.callParent(arguments);
        }

        for (id in value) {
            if (value.hasOwnProperty(id) && value[id]) {
                ids.push(id);
            }
        }

        return this.callParent([ids]);
    },

    getValue: function() {
        var me = this,
            value = me.callParent(arguments),
            valueField = me.valueField,
            store = me.getStore(),
            length = store.getCount(), i = 0,
            id, map = {};

        for (; i < length; i++) {
            id = store.getAt(i).get(valueField);
            map[id] = value.indexOf(id) != -1;
        }

        return map;
    },

    isEqual: function(value1, value2) {
        return Ext.Object.equals(value1, value2);
    },

    isEmpty: function(value) {
        return !Ext.Array.contains(Ext.Object.getValues(value), true);
    },

    refreshEmptyText: function() {
        var me = this,
            emptyClsElements = me.emptyClsElements,
            isEmpty, i;

        if (me.rendered) {
            isEmpty = me.isEmpty(me.getValue());
            me.placeholderLabel.setDisplayed(isEmpty);
            for (i = 0; i < emptyClsElements.length; i++) {
                emptyClsElements[i].toggleCls(me.emptyUICls, isEmpty);
            }
        }
    },

    getErrors: function(value) {
        var me = this,
            errors;

        value = value || me.getValue();
        errors = me.callParent([value]);

        if (!me.allowBlank && me.isEmpty(value)) {
            errors.push(me.blankText);
        }

        return errors;
    },


    // config handlers
    updateShowAllStudents: function(showAllStudents) {
        if (this.rendered) {
            this.allStudentsLabel.setDisplayed(showAllStudents);
            this.updateLayout();
        }
    },


    // event handlers
    onAllStudentsCheckboxChange: function() {
        var me = this,
            checked = me.allStudentsCheckbox.dom.checked,
            allStudentsPlaceholder = me.allStudentsPlaceholder,
            store = me.getStore(),
            finishSelectAll = function() {
                me.setValue(store.collect(me.valueField));
                allStudentsPlaceholder.setDisplayed(true);
            };

        me.triggerWrap[checked ? 'mask' : 'unmask']();
        me.itemList.setDisplayed(!checked);

        if (checked) {
            me.preAllValue = me.getValue();
            if (store.isLoaded()) {
                finishSelectAll();
            } else {
                store.load({
                    callback: finishSelectAll
                });
            }
        } else {
            allStudentsPlaceholder.setDisplayed(false);
            me.setValue(me.preAllValue || null);
            me.preAllValue = null;
        }
    },

    onClearClick: function(me) {
        me.clearValue();
        me.fireEvent('clear', me);
    }
});