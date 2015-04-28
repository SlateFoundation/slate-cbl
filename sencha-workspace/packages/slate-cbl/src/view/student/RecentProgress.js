/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.view.student.RecentProgress', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-student-recentprogress',
    requires: [
    	'Slate.cbl.API'
    ],

    config: {
    	studentId: null,
    	contentAreaId: null,

    	loadStatus: 'unloaded'
    },

    renderTpl: [
        '<header class="panel-header">',
        '    <h3 class="header-title">Recent Progress</h3>',
        '</header>',

        '<div class="table-ct">',
        '    <table class="panel-body" id="{id}-tableEl" data-ref="tableEl"></table>',
        '</div>'
    ],
    childEls: [
    	'tableEl'
    ],

    progressTpl: [
        '<tpl if="values.progress.length !== 0">',
        '    <thead>',
        '        <tr>',
        '            <th class="col-header scoring-domain-col">Scoring Domain</th>',
        '            <th class="col-header level-col">Level</th>',
        '        </tr>',
        '    </thead>',
        '</tpl>',
        '<tbody>',
        '    <tpl for="progress">',
        '        <tr>',
        '            <td class="scoring-domain-col">',
        '                <span class="domain-skill">{skill}</span>',
        '                <div class="meta">',
        '                    <span class="domain-competency">{competency}, </span>',
        '                    <span class="domain-teacher">{teacher}</span>',
        '                </div>',
        '            </td>',
        '            <td class="level-col">',
        '                <div class="level-color cbl-level-{level}">{[ values.level != 0 ? values.level : "M" ]}</div>',
        '            </td>',
        '        </tr>',
        '    </tpl>',
        '    <tpl if="values.progress.length == 0">',
        '        <tr>',
        '            <td>No demonstrations have been logged in this content area.</td>',
        '        </tr>',
        '    </tpl>',
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

        Slate.cbl.API.getRecentProgress(studentId, contentAreaId, function(progress) {
        	me.loadedProgress = Ext.isArray(progress) ? progress : null;
        	me.refreshProgress();
        });
    },

    refreshProgress: function() {
    	var me = this,
    		loadedProgress = me.loadedProgress;

    	if (!loadedProgress || !me.rendered) {
    		return;
    	}

        me.getTpl('progressTpl').overwrite(me.tableEl, {
            progress: loadedProgress || []
        });

    	me.setLoadStatus('loaded');
    }
});