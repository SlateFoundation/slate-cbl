Ext.define('Slate.cbl.widget.SkillsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Slate.cbl.store.Skills',
        'Ext.form.field.ComboBox',
        'Ext.view.View'
    ],
    xtype: 'slate-skillsfield',
    config: {
        readOnly: false
    },

    componentCls: 'slate-skillsfield',

    fieldLabel: 'Skills',

    items: [
        {
            width: '100%',
            xtype: 'combo',
            name: 'SkillIDs',
            store: {
                model: 'Slate.cbl.model.Skill',
                autoLoad: true
            },
            queryParam: 'q',
            displayField: 'Code_Descriptor',
            valueField: 'ID',
            emptyText: 'Competency code or statement\u2026', // &hellip;
            hideTrigger: true,
            minChars: 2,
            listeners: {
                beforeselect: function(combo, record) {
                    var dataview = combo.next('dataview'),
                        store = dataview.getStore();

                    store.add(record);
                    return false;
                }
            },
            selectOnTab: false
        },
        {
            xtype: 'dataview',
            itemId: 'skills-list',
            cls: 'slate-skillsfield-list',
            store: {
                model: 'Slate.cbl.model.Skill'
            },
            autoEl: 'ul',
            itemSelector: '.slate-skillsfield-item',
            tpl: [
                '<tpl for=".">',
                    '<li class="slate-skillsfield-item">',
                        '<div class="slate-skillsfield-token">',
                            '<strong class="slate-skillsfield-item-code">{Code}</strong>',
                            '<span class="slate-skillsfield-item-title" title="{Descriptor}">{Descriptor}</span>',
                            '<tpl if="isEditable">',
                                '<i tabindex="0" class="slate-skillsfield-item-remove fa fa-times-circle"></i>',
                            '</tpl>',
                        '</div>',
                    '</li>',
                '</tpl>'
            ],
            prepareData: function(data, recordIndex, record) {
                var recordData = record.getData();

                recordData.isEditable = !this.up('slate-skillsfield').getReadOnly();

                return recordData;
            },
            listeners: {
                itemclick: function(view, record, item, idx, event) {

                    if (event.target.classList.contains('slate-skillsfield-item-remove')) {
                        view.getStore().remove(record);
                    }
                }
            }
        }
    ],

    updateReadOnly: function(readOnly) {
        var me = this,
            field, view;

        if (!me.rendered) {
            me.on('render', function() {
                return me.updateReadOnly(readOnly);
            });
            return;
        }

        field = me.down('combo');
        view = me.down('#skills-list');
        readOnly = Boolean(readOnly);

        view.refreshView();
        field[readOnly ? 'hide' : 'show']();
    },

    getSkills: function(returnRecords, idsOnly) {
        var me = this,
            skillsList = me.down('#skills-list'),
            skillsStore = skillsList.getStore();

        if (returnRecords === false) {
            if (idsOnly === true) {
                return skillsStore.collect('ID');
            }
            return Ext.Array.map(skillsStore.getRange(), function(s) {
                return s.getData();
            });
        }
        return skillsStore.getRange();
    },

    setSkills: function(skills, append) {
        var me = this,
            skillsList = me.down('#skills-list'),
            skillsStore = skillsList.getStore();

        if (append !== true) {
            skillsStore.removeAll();
        }
        skillsStore.add(skills);
    }
});