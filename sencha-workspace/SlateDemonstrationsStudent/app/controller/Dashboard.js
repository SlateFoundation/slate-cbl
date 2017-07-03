Ext.define('SlateDemonstrationsStudent.controller.Dashboard', {
    extend: 'Ext.app.Controller',


    // entry points
    control: {
        competencyCard: {
            democellclick: 'onDemoCellClick'
        }
    },


   // controller configuration
    views: [
        'AppHeader',
        'Dashboard',
        'RecentProgress',
        'OverviewWindow'
    ],

    stores: [
        'ContentAreas',
        'Students'
    ],


    refs: {
        dashboardCt: {
            selector: 'slate-demonstrations-student-dashboard',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-dashboard'
        },
        recentProgressCmp: {
            selector: 'slate-demonstrations-student-recentprogress',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-recentprogress'
        },
        appHeader: {
            selector: 'slate-demonstrations-student-appheader',
            autoCreate: true,

            xtype: 'slate-demonstrations-student-appheader'
        },
        competencyCard: 'slate-demonstrations-student-competencycard',
        studentSelector: 'slate-demonstrations-student-appheader #studentCombo',
        contentAreaSelector: 'slate-demonstrations-student-appheader #contentAreaCombo'
    },

    routes: {
        ':queryString': {
            action: 'syncFilters',
            conditions: {
                ':queryString': '.*'
            }
        }
    },

    // controller templates method overrides
    onLaunch: function () {
        var me = this,
            appHeader = me.getAppHeader(),
            dashboardCt = me.getDashboardCt(),
            recentProgressCmp = me.getRecentProgressCmp();

        // render components
        Ext.suspendLayouts();
        recentProgressCmp.render('slateapp-viewport');
        dashboardCt.render('slateapp-viewport');
        Ext.DomHelper.insertBefore('slateapp-viewport', {
            tag: 'div',
            id: 'slateapp-header'
        });
        appHeader.render('slateapp-header');
        Ext.resumeLayouts(true);
    },


    // event handlers
    onDemoCellClick: function(competencyCard, ev, targetEl) {
        this.getOverviewWindowView().create({
            ownerCmp: this.getDashboardCt(),
            autoShow: true,
            animateTarget: targetEl,

            competency: parseInt(targetEl.up('ul.cbl-skill-demos').up('li.cbl-competency-panel').getAttribute('data-competency'), 10),
            skill: parseInt(targetEl.up('ul.cbl-skill-demos').getAttribute('data-skill'), 10),
            student: this.getDashboardCt().getStudentId(),
            selectedDemonstration: parseInt(targetEl.getAttribute('data-demonstration'), 10)
        });
    },

    syncFilters: function() {
        var me = this,
            appHeader = me.getAppHeader(),
            token = Ext.util.History.getToken(),
            recentProgressCmp = me.getRecentProgressCmp(),
            dashboardCt = me.getDashboardCt(),
            splitToken = [], i = 0,
            param, value,
            studentCombo, contentAreaCombo,
            student, contentArea;

        if (token) {
            splitToken = token.split('&');
            for (; i < splitToken.length; i++) {
                param = splitToken[i].split('=', 1)[0];
                value = splitToken[i].split('=', 2)[1];

                if (param == 'student') {
                    studentCombo = appHeader.down('#studentCombo');
                    if (!studentCombo.getStore().isLoaded()) {
                        dashboardCt.mask('Loading Content Areas&hellip;');
                        studentCombo.getStore().load({
                            params: {
                                q: value
                            },
                            callback: function() {
                                dashboardCt.unmask();
                                return me.syncFilters();
                            }
                        });
                        return;
                    }

                    student = studentCombo.getStore().findRecord('Username', value);
                    studentCombo.setValue(student);
                    if (student) {
                        // configure recent progress component with any available embedded data
                        recentProgressCmp.setStudentId(student.getId());
                        // configure dashboard with any available embedded data
                        dashboardCt.setStudentId(student.getId());
                    }
                } else if (param == 'contentarea') {
                    contentAreaCombo = appHeader.down('#contentAreaCombo');
                    if (!contentAreaCombo.getStore().isLoaded()) {
                        dashboardCt.mask('Loading Content Areas&hellip;');
                        contentAreaCombo.getStore().getSource().load(function() {
                            dashboardCt.unmask();
                            return me.syncFilters();
                        });
                        return;
                    }

                    contentArea = contentAreaCombo.getStore().findRecord('Code', value);
                    contentAreaCombo.setValue(contentArea);
                    if (contentArea) {
                        recentProgressCmp.setContentAreaId(contentArea.getId());
                        dashboardCt.setContentAreaId(contentArea.getId());
                    }
                }
            }
        }
    }
});
