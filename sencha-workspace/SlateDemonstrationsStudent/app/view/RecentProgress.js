Ext.define('SlateDemonstrationsStudent.view.RecentProgress', {
    extend: 'Slate.ui.SimplePanel',
    xtype: 'slate-demonstrations-student-recentprogress',
    requires: [
        'Slate.cbl.store.RecentProgress'
    ],


    config: {
        store: 'RecentProgress'
    },


    title: 'Recent Progress',
    cls: 'slate-tasks-student-recentactivity',
    tpl: [
        '<div class="table-ct">',
            '<table>',
                '<tpl if="values.length !== 0">',
                    '<thead>',
                        '<tr>',
                            '<th class="col-header scoring-domain-col">Scoring Domain</th>',
                            '<th class="col-header level-col">Rating</th>',
                        '</tr>',
                    '</thead>',
                '</tpl>',
                '<tbody>',
                    '<tpl for=".">',
                        '<tr>',
                            '<td class="scoring-domain-col">',
                                '<span class="domain-skill">{skillDescriptor:htmlEncode}</span>',
                                '<div class="meta">',
                                    '<span class="domain-competency">{competencyDescriptor:htmlEncode}</span>',
                                    '<tpl if="teacherTitle">&thinsp;&thinsp;&middot;&thinsp;&thinsp;</tpl>',
                                    '<span class="domain-teacher">{teacherTitle:htmlEncode}</span>',
                                '</div>',
                            '</td>',
                            '<td class="level-col">',
                                '<div class="cbl-level-colored cbl-level-{targetLevel} <tpl if="!override">cbl-rating-{demonstratedLevel}</tpl>">',
                                   '<tpl if="override">',
                                       '<i class="fa fa-check"></i>',
                                   '<tpl elseif="demonstratedLevel == 0">',
                                       'M',
                                   '<tpl else>',
                                       '{demonstratedLevel}',
                                   '</tpl>',
                               '</div>',
                            '</td>',
                        '</tr>',
                    '</tpl>',
                    '<tpl if="values.length == 0">',
                        '<tr>',
                            '<td class="empty-text">No demonstrations have been logged in this content area.</td>',
                        '</tr>',
                    '</tpl>',
                '</tbody>',
            '</table>',
        '</div>'
    ],


    // config handlers
    applyStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateStore: function(store) {
        if (store) {
            store.on({
                scope: this,
                beforeload: 'onStoreBeforeLoad',
                load: 'onStoreLoad',
                refresh: 'onStoreRefresh'
            });
        }
    },


    // event handlers
    onStoreBeforeLoad: function() {
        this.addCls('is-loading');
        this.setLoading(true);
    },

    onStoreLoad: function() {
        this.removeCls('is-loading');
        this.setLoading(false);
    },

    onStoreRefresh: function() {
        var me = this;

        me.update(Ext.pluck(me.getStore().getRange(), 'data'));
    }
});