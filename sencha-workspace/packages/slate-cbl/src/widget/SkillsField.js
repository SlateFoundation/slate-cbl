Ext.define('Slate.cbl.widget.SkillsField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'Slate.cbl.store.Skills',
        'Ext.form.field.ComboBox',
        'Ext.view.View'
    ],
    xtype: 'slate-skillsfield',

    componentCls: 'slate-skillsfield',

    fieldLabel: 'Skills',

    items: [
        {
            width: '100%',
            xtype: 'combo',
            name: 'Skills',
            store: 'Skills',
            queryParam: 'q',
            displayField: 'Code_Descriptor',
            valueField: 'ID',
            emptyText: 'Competency code or statement\u2026', // &hellip;
            listeners: {
                beforeselect: function(combo, record) {
                    var dataview = combo.next('dataview'),
                        store = dataview.getStore();
                    store.add(record);
                    return false;
                }
            }
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
                            '<i tabindex="0" class="slate-skillsfield-item-remove fa fa-times-circle"></i>',
                        '</div>',
                    '</li>',
                '</tpl>'
            ],
            listeners: {
                itemclick: function(view, record, item, idx, event) {

                    if (event.target.classList.contains('slate-skillsfield-item-remove')) {
                        view.getStore().remove(record);
                    }
                }
            }
        }
    ],

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