Ext.define('SlateDemonstrationsTeacher.controller.Demonstrations', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.MessageBox',
        'Ext.window.Toast'
    ],


    saveNotificationTitleTpl: [
        '<tpl if="wasPhantom">',
            'Demonstration Logged',
        '<tpl else>',
            'Demonstration Edited',
        '</tpl>'
    ],

    saveNotificationBodyTpl: [
        '<tpl if="wasPhantom">',
            '<tpl for="student">',
                '<strong>{FirstName} {LastName}</strong>',
            '</tpl>',
            ' demonstrated',
            ' <strong>',
                '{skills.length}',
                ' <tpl if="skills.length == 1">skill<tpl else>skills</tpl>',
                '.',
            '</strong>',
        '<tpl else>',
            'Updated',
            ' <strong>',
                '{skills.length}',
                ' <tpl if="skills.length == 1">skill<tpl else>skills</tpl>',
            '</strong>',
            ' demonstrated by',
            '<tpl for="student">',
                ' <strong>',
                    '{FirstName} {LastName}',
                    '.',
                '</strong>',
            '</tpl>',
        '</tpl>'
    ],

    deleteConfirmationTitleTpl: [
        'Delete demonstration #{ID}'
    ],

    deleteConfirmationBodyTpl: [
        '<p>Are you sure you want to permanently delete this demonstration?</p>',
        '<p>Scores in all the following standards will be lost:</p>',
        '<ul>',
            '<tpl for="DemonstrationSkills">',
                '<li>',
                    '<strong>Level {DemonstratedLevel}</strong> demonstrated in <strong>{Skill.Code}</strong>: <em>{Skill.Statement}</em>',
                '</li>',
            '</tpl>',
        '</ul>',
    ],


    // controller configuration
    views: [
        'Window@Slate.ui',
        'DemonstrationForm@Slate.cbl.view.demonstrations'
    ],

    stores: [
        'Students',
        'StudentCompetencies',
    ],

    models: [
        'Demonstration@Slate.cbl.model.demonstrations'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',
        createBtn: 'slate-demonstrations-teacher-dashboard slate-appheader button[action=create-demonstration]',

        demonstrationWindow: {
            autoCreate: true,

            xtype: 'slate-window',
            closeAction: 'hide',
            modal: true,
            layout: 'fit',
            minWidth: 300,
            width: 600,
            minHeight: 600,

            mainView: {
                xtype: 'slate-cbl-demonstrations-demonstrationform',
                studentSelector: {
                    store: 'Students',
                    queryMode: 'local'
                }
            }
        },
        formPanel: 'slate-cbl-demonstrations-demonstrationform',
        submitBtn: 'slate-cbl-demonstrations-demonstrationform ^ window button[action=submit]',
        continueField: 'slate-cbl-demonstrations-demonstrationform ^ window field#continueField'
    },


    // entry points
    listen: {
        controller: {
            '#': {
                bootstrapdataload: 'onBootstrapDataLoad'
            }
        }
    },

    control: {
        createBtn: {
            click: 'onCreateClick'
        },
        'slate-demonstrations-teacher-skillfooter button[action=create-demonstration]': {
            click: 'onStudentSkillCreateDemonstrationClick'
        },
        'slate-cbl-demonstrations-studentskillpanel': {
            editclick: 'onEditClick',
            deleteclick: 'onDeleteClick'
        },
        formPanel: {
            dirtychange: 'onFormDirtyChange',
            validitychange: 'onFormValidityChange'
        },
        submitBtn: {
            click: 'onSubmitClick'
        }
    },


    // event handlers
    onBootstrapDataLoad: function(app, bootstrapData) {

        // configure model defaults from server configuration
        this.getDemonstrationModel().loadFieldsConfig(bootstrapData.demonstrationFields);

        // enable create button now that model is initialized
        this.getCreateBtn().enable();
    },

    onCreateClick: function(createBtn) {
        this.openDemonstrationWindow({
            animateTarget: createBtn
        });
    },

    onStudentSkillCreateDemonstrationClick: function(createBtn) {
        var skillPanel = createBtn.up('window').getMainView(),
            competency = skillPanel.getLoadedCompetency();

        this.openDemonstrationWindow({
            animateTarget: createBtn,
            selectedCompetencies: competency ? [competency.get('Code')] : null,
            demonstration: {
                StudentID: skillPanel.getSelectedStudent()
            }
        });
    },

    onEditClick: function(skillPanel, demonstrationId, demonstrationSkill, ev) {
        this.openDemonstrationWindow({
            animateTarget: ev.target,
            demonstration: demonstrationId
        });
    },

    onDeleteClick: function(skillPanel, demonstrationId, demonstrationSkill) {
        var me = this;

        skillPanel.setLoading('Reviewing demonstration #' + demonstrationId + '&hellip;');

        me.getDemonstrationModel().load(demonstrationId, {
            include: 'DemonstrationSkills.Skill',
            success: function(loadedDemonstration) {
                var tplData = loadedDemonstration.getData();

                Ext.Msg.confirm(
                    Ext.XTemplate.getTpl(me, 'deleteConfirmationTitleTpl').apply(tplData),
                    Ext.XTemplate.getTpl(me, 'deleteConfirmationBodyTpl').apply(tplData),
                    function(btnId) {
                        if (btnId != 'yes') {
                            skillPanel.setLoading(false);
                            return;
                        }

                        skillPanel.setLoading('Erasing demonstration #'+demonstrationId+'&hellip;');

                        me.getStudentCompetenciesStore().eraseDemonstration(loadedDemonstration, {
                            success: function() {
                                skillPanel.setLoading(false);
                            },
                            failure: function(erasedDemonstration, operation) {
                                skillPanel.setLoading(false);

                                Ext.Msg.show({
                                    title: 'Failed to delete demonstration',
                                    message: operation.getError(),
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                });
                            }
                        });
                    }
                );
            },
            failure: function(loadedDemonstration, operation) {
                skillPanel.setLoading(false);

                Ext.Msg.show({
                    title: 'Failed to load demonstration',
                    message: operation.getError(),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    onFormDirtyChange: function(form, dirty) {
        this.getSubmitBtn().setDisabled(!dirty || !form.isValid());
    },

    onFormValidityChange: function(form, valid) {
        this.getSubmitBtn().setDisabled(!valid || !form.isDirty());
    },

    onSubmitClick: function(submitBtn) {
        var me = this,
            formWindow = submitBtn.up('window'),
            formPanel = formWindow.getMainView(),
            demonstration = formPanel.getRecord(),
            wasPhantom = demonstration.phantom;

        formPanel.updateRecord(demonstration);

        // ensure demonstration doesn't become dirty when no changes are made to the form
        if (!demonstration.dirty) {
            return;
        }

        formWindow.setLoading('Saving demonstration&hellip;');

        me.getStudentCompetenciesStore().saveDemonstration(demonstration, {
            success: function(savedDemonstration) {
                var continueField = me.getContinueField(),
                    studentsStore = me.getStudentsStore(),
                    student = studentsStore.getById(savedDemonstration.get('StudentID')),
                    tplData = {
                        wasPhantom: wasPhantom,
                        student: student ? student.getData() : null,
                        skills: savedDemonstration.get('DemonstrationSkills')
                    },
                    nextStudent;


                // show notification to user
                Ext.toast(
                    Ext.XTemplate.getTpl(me, 'saveNotificationBodyTpl').apply(tplData),
                    Ext.XTemplate.getTpl(me, 'saveNotificationTitleTpl').apply(tplData)
                );


                // TODO: update correctly after skills get deleted during edit


                // select next student or close
                if (continueField.getValue()) {
                    nextStudent = studentsStore.getAt(studentsStore.indexOf(student) + 1);
                    formPanel.setDemonstration(me.getDemonstrationModel().create({
                        Class: savedDemonstration.get('Class'),
                        Demonstrated: new Date(),
                        StudentID: nextStudent ? nextStudent.getId() : null
                    }));
                } else {
                    formWindow.hide();
                }

                formWindow.setLoading(false);
            },
            failure: function(savedDemonstration, operation) {
                formWindow.setLoading(false);

                Ext.Msg.show({
                    title: 'Failed to log demonstration',
                    message: operation.getError(),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },


    // local methods
    openDemonstrationWindow: function(options) {
        options = options || {};

        // eslint-disable-next-line vars-on-top
        var me = this,
            DemonstrationModel = me.getDemonstrationModel(),
            formWindow = me.getDemonstrationWindow({
                ownerCmp: me.getDashboardCt()
            }),
            formPanel = formWindow.getMainView(),
            demonstration = options.demonstration;


        // reconfigure form and window
        formPanel.getRatingsField().setSelectedCompetencies(options.selectedCompetencies || null);
        formWindow.animateTarget = options.animateTarget || null;


        // fetch demonstration and show window
        if (!demonstration || (typeof demonstration == 'object' && !demonstration.isModel)) {
            demonstration = DemonstrationModel.create(Ext.apply({
                Class: 'Slate\\CBL\\Demonstrations\\ExperienceDemonstration',
                Demonstrated: new Date()
            }, demonstration || null));

            formPanel.setDemonstration(demonstration);
            formWindow.show();
        } else if (typeof demonstration == 'number') {
            formPanel.setDemonstration(null);
            formWindow.show();
            formWindow.setLoading('Loading demonstration&hellip;');

            DemonstrationModel.load(demonstration, {
                success: function(loadedDemonstration) {
                    formPanel.setDemonstration(loadedDemonstration);
                    formWindow.setLoading(false);
                },
                failure: function(savedDemonstration, operation) {
                    formWindow.hide();
                    formWindow.setLoading(false);

                    Ext.Msg.show({
                        title: 'Failed to load demonstration #'+demonstration,
                        message: operation.getError(),
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });
        } else {
            Ext.Logger.error('Invalid demonstration option');
        }
    }
});