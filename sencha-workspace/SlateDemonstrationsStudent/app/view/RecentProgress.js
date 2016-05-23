Ext.define('SlateDemonstrationsStudent.view.RecentProgress', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-student-recentprogress',
    requires: [
        'Slate.cbl.store.RecentProgress',
    ],

    config: {
    	studentId: null,
    	contentAreaId: null,

        loadStatus: 'unloaded',

        recentProgressStore: {
            xclass: 'Slate.cbl.store.RecentProgress'
        },

        componentCls: 'cbl-recent-progress',
        cls: 'panel',

        borderBoxCls: null,
        rootCls: null
    },

    renderTpl: [
        '<header class="panel-header">',
            '<h3 class="header-title">Recent Progress</h3>',
        '</header>',

        '<div class="table-ct">',
            '<table class="panel-body" id="{id}-tableEl" data-ref="tableEl"></table>',
        '</div>'
    ],
    childEls: [
    	'tableEl'
    ],

    progressTpl: [
        '<tpl if="values.progress.length !== 0">',
            '<thead>',
                '<tr>',
                    '<th class="col-header scoring-domain-col">Scoring Domain</th>',
                    '<th class="col-header level-col">Level</th>',
                '</tr>',
            '</thead>',
        '</tpl>',
        '<tbody>',
            '<tpl for="progress">',
                '<tr>',
                    '<td class="scoring-domain-col">',
                        '<span class="domain-skill">{skillDescriptor:htmlEncode}</span>',
                        '<div class="meta">',
                            '<span class="domain-competency">{competencyDescriptor:htmlEncode}<tpl if="teacherTitle">, </tpl></span>',
                            '<span class="domain-teacher">{teacherTitle:htmlEncode}</span>',
                        '</div>',
                    '</td>',
                    '<td class="level-col">',
                        '<div class="cbl-level-colored cbl-level-{demonstratedLevel}">',
                           '<tpl if="demonstratedLevel != 0">{demonstratedLevel}<tpl else>M</tpl>',
                       '</div>',
                    '</td>',
                '</tr>',
            '</tpl>',
            '<tpl if="values.progress.length == 0">',
                '<tr>',
                    '<td>No demonstrations have been logged in this content area.</td>',
                '</tr>',
            '</tpl>',
        '</tbody>'
    ],


    // config handlers
    updateLoadStatus: function(newStatus, oldStatus) {
        if (oldStatus) {
            this.removeCls('progress-' + oldStatus);
        }

        if (newStatus) {
            this.addCls('progress-' + newStatus);
        }
    },

    applyRecentProgressStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateRecentProgressStore: function(store) {
        if (store) {
            store.on('refresh', 'refreshProgress', this);
        }
    },


    // template methods
    onRender: function() {
    	var me = this;

    	me.callParent(arguments);

    	me.loadProgress();
    },


    // public methods
    loadProgress: function() {
    	var me = this,
    		studentId = me.getStudentId(),
    		contentAreaId = me.getContentAreaId();

    	if (!studentId || !contentAreaId) {
    		throw 'Unable to load progress without studentId and contentAreaId set';
    	}

    	me.setLoadStatus('loading');

        me.getRecentProgressStore().loadByStudentAndContentArea(studentId, contentAreaId);
    },

    refreshProgress: function() {
    	var me = this;

        me.getTpl('progressTpl').overwrite(me.tableEl, {
            progress: Ext.pluck(me.getRecentProgressStore().getRange(), 'data')
        });

    	me.setLoadStatus('loaded');
    }
});