Ext.define('SlateDemonstrationsTeacher.view.StudentGroupSelector', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'SlateDemonstrationsTeacher.store.StudentGroups'
    ],

    xtype: 'slate-demonstrations-teacher-studentgroupselector',

    store: 'StudentGroups',

    fieldLabel: 'Students',
    displayField: 'DisplayName',
    valueField: 'ID',

    forceSelection: true,
    editable: false,

    queryMode: 'local',

    tpl: [
        '{% this.currentType = null %}',
        '<tpl for=".">',
            '{[this.showGroupHeader(values)]}',
            '<div class="x-boundlist-item">{DisplayName}</div>',
        '</tpl>',
        {
            showGroupHeader: function(data) {
                var type = '';

                if (this.currentType != data.Type) {
                    type = data.Type;
                }

                this.currentType = data.Type;
                return type;
            }
        }
    ]
});