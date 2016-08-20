/**
 * The Dashboard controller manages the components of the student dashboard and
 * handles routing by course section.
 */
Ext.define('SlateTasksStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Slate.API'
    ],


    // dependencies
    views: [
        'Dashboard',
        'AppHeader',
        'TaskTree',
        'RecentActivity',
        'Slate.cbl.view.student.TaskHistory'
    ],

    refs: {
        dashboard: {
            selector: 'slatetasksstudent-dashboard',
            autoCreate: true,

            xtype: 'slatetasksstudent-dashboard'
        },
        appHeader: {
            selector: 'slatetasksstudent-appheader',
            autoCreate: true,

            xtype: 'slatetasksstudent-appheader'
        },
        taskTree: {
            selector: 'slatetasksstudent-tasktree',
            autoCreate: true,

            xtype: 'slatetasksstudent-tasktree'
        },
        todoList: {
            selector: 'slatetasksstudent-todolist',
            autoCreate: true,

            xtype: 'slatetasksstudent-todolist'
        },
        recentActivity: {
            selector: 'slatetasksstudent-recentactivity',
            autoCreate: true,

            xtype: 'slatetasksstudent-recentactivity'
        },
        taskHistory: {
            selector: 'slate-taskhistory',
            autoCreate: true,

            xtype: 'slate-taskhistory'
        }
    },


    // entry points
    routes: {
        'section/:sectionCode': {
            sectionId: '([a-zA-Z0-9])+',
            action: 'showCourseSection'
        }
    },

    control: {
        'slatetasksstudent-appheader button[action="show-recent"]': {
            click: 'onShowRecentClick'
        },
        'slatetasksstudent-tasktree': {
            resize: 'onTaskTreeResize'
        },
        'combo#section-selector': {
            select: 'onSectionSelectorSelect',
            afterrender: 'onSectionSelectorAfterRender'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getDashboard().render('slateapp-viewport');
    },


    // event handlers
    onShowRecentClick: function(button) {
        var win = this.getRecentActivity();

        if (button.pressed) {
            win.showBy(button, 'tr-bl');
        } else {
            win.hide();
        }
    },

    onTaskTreeResize: function () {
        this.maskDemoElements();
    },

    onSectionSelectorSelect: function(combo, rec) {
        var me = this,
            courseSection = rec.get('Code');

        me.getTodoList().setCourseSection(courseSection);
        me.getTaskTree().setCourseSection(courseSection);
    },

    onSectionSelectorAfterRender: function(combo) {
        combo.getStore().on('load', function(store) {
            store.insert(0, {
                ID: 0,
                Code: null,
                Title: 'All'
            })
            combo.select(0);
        });
        combo.getStore().load();
    },


    // custom controller methods
    maskDemoElements: function () {
        this.getTaskHistory().setLoading(false);

        this.getTaskHistory().setLoading('');
    },

    showCourseSection: function(sectionCode) {
        var me = this;

        me.getTodoList().setCourseSection(sectionCode);
        me.getTaskTree().setCourseSection(sectionCode);
    }
});
