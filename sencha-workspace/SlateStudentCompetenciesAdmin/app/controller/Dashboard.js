Ext.define('SlateStudentCompetenciesAdmin.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.MessageBox',
        'Ext.window.Toast',

        /* global Slate*/
        'Slate.cbl.util.Config'
    ],


    saveNotificationTitleTpl: 'Enrollments Saved',
    saveNotificationBodyTpl: [
        'Created',
        ' <strong>',
            '{changes}',
            ' <tpl if="changes == 1">enrollment<tpl else>enrollments</tpl>',
        '</strong>'
    ],


    // controller configuration
    views: [
        'Dashboard'
    ],

    stores: [
        'Students@Slate.store.people',
        'Competencies@Slate.cbl.store',
        'StudentCompetencies'
    ],

    models: [
        'StudentCompetency@Slate.cbl.model'
    ],

    refs: {
        dashboardCt: {
            selector: 'slate-studentcompetencies-admin-dashboard',
            autoCreate: true,

            xtype: 'slate-studentcompetencies-admin-dashboard'
        },
        contentAreaSelector: 'slate-studentcompetencies-admin-dashboard slate-appheader slate-cbl-contentareaselector',
        studentsListSelector: 'slate-studentcompetencies-admin-dashboard slate-appheader slate-cbl-studentslistselector',
        statusText: 'slate-studentcompetencies-admin-dashboard slate-appheader #statusText',
        saveBtn: 'slate-studentcompetencies-admin-dashboard slate-appheader button[action=save-studentcompetencies]',
        grid: 'slate-studentcompetencies-admin-dashboard slate-studentcompetencies-admin-grid'
    },


    // entry points
    routes: {
        ':contentAreaCode': {
            action: 'showDashboard',
            conditions: {
                ':contentAreaCode': '([^/]+)'
            }
        },
        ':contentAreaCode/:studentsList': {
            action: 'showDashboard',
            conditions: {
                ':contentAreaCode': '([^/]+)',
                ':studentsList': '([^/]+)'
            }
        }
    },

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        },
        store: {
            '#StudentCompetencies': {
                beforeload: 'onStudentCompetenciesStoreBeforeLoad',
                load: 'onStudentCompetenciesStoreLoad',
                datachanged: {
                    buffer: 10,
                    fn: 'onStudentCompetenciesDataChanged'
                }
            }
        }
    },

    control: {
        dashboardCt: {
            selectedcontentareachange: 'onContentAreaChange',
            selectedstudentslistchange: 'onStudentsListChange'
        },
        contentAreaSelector: {
            select: 'onContentAreaSelectorSelect',
            clear: 'onContentAreaSelectorClear'
        },
        studentsListSelector: {
            select: 'onStudentsListSelectorSelect',
            clear: 'onStudentsListSelectorClear'
        },
        grid: {
            cellclick: 'onCellClick'
        },
        saveBtn: {
            click: 'onSaveBtnClick'
        }
    },


    // controller lifecycle
    onLaunch: function () {
        // build array of available levels
        this.availableLevels = Slate.cbl.util.Config.getAvailableLevels();

        // instantiate and render viewport
        this.getDashboardCt().render('slateapp-viewport');
    },


    // route handlers
    showDashboard: function(contentAreaCode, studentsList) {
        var dashboardCt = this.getDashboardCt();

        dashboardCt.setSelectedContentArea(contentAreaCode != '_' && contentAreaCode || null);
        dashboardCt.setSelectedStudentsList(this.decodeRouteComponent(studentsList) || null);
    },


    // event handlers
    onUnmatchedRoute: function(token) {
        Ext.Logger.warn('Unmatched route: '+token);
    },

    onStudentCompetenciesStoreBeforeLoad: function() {
        this.getDashboardCt().setLoading('Loading enrollments...');
    },

    onStudentCompetenciesStoreLoad: function(store, studentCompetencies, success) {
        this.getDashboardCt().setLoading(false);
    },

    onStudentCompetenciesDataChanged: function(store) {
        var changes = store.queryBy(record => record.phantom).getCount();

        this.getStatusText().update({ changes });
        this.getSaveBtn().setDisabled(changes == 0);
    },

    onContentAreaChange: function(dashboardCt, contentAreaCode) {
        var me = this,
            competenciesStore = me.getCompetenciesStore(),
            studentCompetenciesStore = me.getStudentCompetenciesStore();

        // (re)load student competencies store
        competenciesStore.setContentArea(contentAreaCode);
        competenciesStore.loadIfDirty();

        // (re)load student competencies store
        studentCompetenciesStore.setContentArea(contentAreaCode);
        studentCompetenciesStore.loadIfDirty();

        // push value to selector
        me.getContentAreaSelector().setValue(contentAreaCode);
    },

    onStudentsListChange: function(dashboardCt, studentsList) {
        var me = this,
            studentsStore = me.getStudentsStore(),
            studentCompetenciesStore = me.getStudentCompetenciesStore();

        // (re)load student competencies store
        studentsStore.setList(studentsList || null);
        studentsStore.loadIfDirty();

        // (re)load student competencies store
        studentCompetenciesStore.setStudentsList(studentsList || null);
        studentCompetenciesStore.loadIfDirty();

        // push value to selector
        me.getStudentsListSelector().setValue(studentsList);
    },

    onContentAreaSelectorSelect: function(contentAreaCombo, contentArea) {
        var path = [contentArea.get('Code')],
            studentsList = this.getDashboardCt().getSelectedStudentsList();

        if (studentsList) {
            path.push(studentsList);
        }

        this.redirectTo(path);
    },

    onContentAreaSelectorClear: function() {
        var path = ['_'],
            studentsList = this.getDashboardCt().getSelectedStudentsList();

        if (studentsList) {
            path.push(studentsList);
        }

        this.redirectTo(path);
    },

    onStudentsListSelectorSelect: function(studentsListCombo, studentsList) {
        var contentArea = this.getDashboardCt().getSelectedContentArea();

        this.redirectTo([
            contentArea || '_',
            studentsList.get('value')
        ]);
    },

    onStudentsListSelectorClear: function() {
        this.redirectTo(this.getDashboardCt().getSelectedContentArea() || '_');
    },

    onCellClick: function(grid, competencyId, studentId, cellEl) {
        var me = this,
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            StudentCompetency = me.getStudentCompetencyModel(),
            availableLevels = me.availableLevels,
            currentLevel = parseInt(cellEl.dom.textContent, 10),
            nextLevel, studentCompetency;

        // find any existing phantom record
        studentCompetency = studentCompetenciesStore.queryBy(
            sc => sc.phantom
                  && sc.get('StudentID') == studentId
                  && sc.get('CompetencyID') == competencyId
        ).first();

        // determine next level
        if (currentLevel) {
            nextLevel = availableLevels[availableLevels.indexOf(currentLevel) + 1];

            if (!nextLevel) {
                // reset existing phantom when clicking past last level
                if (studentCompetency) {
                    studentCompetency.drop();
                }

                return;
            }
        } else {
            nextLevel = availableLevels[0];
        }

        // update existing phantom or create new one
        if (studentCompetency) {
            studentCompetency.set('Level', nextLevel);
        } else {
            studentCompetency = StudentCompetency.create({
                StudentID: studentId,
                CompetencyID: competencyId,
                Level: nextLevel,
                EnteredVia: 'enrollment'
            });

            studentCompetenciesStore.add(studentCompetency);
        }
    },

    onSaveBtnClick: function(saveBtn) {
        var me = this;

        saveBtn.disable();

        this.getStudentCompetenciesStore().sync({
            success: function(batch) {
                var tplData = {
                    changes: Ext.Array.sum(batch.getOperations().map(operation => operation.getRecords().length))
                };

                // show notification to user
                Ext.toast(
                    Ext.XTemplate.getTpl(me, 'saveNotificationBodyTpl').apply(tplData),
                    Ext.XTemplate.getTpl(me, 'saveNotificationTitleTpl').apply(tplData)
                );
            },
            failure: function(batch) {
                var operations = batch.getOperations();

                saveBtn.enable();

                Ext.Msg.show({
                    title: 'Failed to save enrollments',
                    message: operations.length ? operations[0].getError() : 'Unknown problem, check your connection and try again',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    }
});