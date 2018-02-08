Ext.define('SlateDemonstrationsTeacher.controller.Demonstrations', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast'
    ],


    toastTitleTpl: [
        '<tpl if="wasPhantom">',
            'Demonstration Logged',
        '<tpl else>',
            'Demonstration Edited',
        '</tpl>'
    ],

    toastBodyTpl: [
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
        demonstrationForm: 'slate-cbl-demonstrations-demonstrationform',
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
            click: 'onCreateDemonstrationClick'
        },
        'slate-demonstrations-teacher-skillfooter button[action=create-demonstration]': {
            click: 'onStudentSkillCreateDemonstrationClick'
        },
        'slate-cbl-demonstrations-studentskillpanel': {
            editclick: 'onEditDemonstrationClick',
            deleteclick: 'onDeleteDemonstrationClick'
        },
        demonstrationForm: {
            dirtychange: 'onFormDirtyChange',
            validitychange: 'onFormValidityChange'
        },
        submitBtn: {
            click: 'onSubmitDemonstrationClick'
        }
    },


    // event handlers
    onBootstrapDataLoad: function(app, bootstrapData) {
        var Model = this.getDemonstrationModel(),
            fieldsConfig = bootstrapData.demonstrationFields,
            fieldName, fieldConfig, field;

        // configure model defaults from server configuration
        if (fieldsConfig) {
            for (fieldName in fieldsConfig) {
                if (!fieldsConfig.hasOwnProperty(fieldName)) {
                    continue;
                }

                fieldConfig = fieldsConfig[fieldName];
                field = Model.getField(fieldName);

                if (!field) {
                    continue;
                }

                if (fieldConfig.default) {
                    field.defaultValue = fieldConfig.default;
                }

                if (fieldConfig.values) {
                    field.values = fieldConfig.values;
                }
            }
        }

        // enable create button now that model is initialized
        this.getCreateBtn().enable();
    },

    onCreateDemonstrationClick: function(createBtn) {
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

    onEditDemonstrationClick: function(skillPanel, demonstrationId, demonstrationSkill, ev) {
        console.info('onEditDemonstrationClick\n\tdemonstration=%o\n\tdemonstrationSkill=%o', demonstrationId, demonstrationSkill.getId());

        this.openDemonstrationWindow({
            animateTarget: ev.target,
            demonstration: demonstrationId
        });
    },

    onDeleteDemonstrationClick: function(skillPanel, demonstrationId, demonstrationSkill) {
        console.info('onDeleteDemonstrationClick\n\tdemonstration=%o\n\tdemonstrationSkill=%o', demonstrationId, demonstrationSkill.getId());
    },

    onFormDirtyChange: function(form, dirty) {
        this.getSubmitBtn().setDisabled(!dirty || !form.isValid());
    },

    onFormValidityChange: function(form, valid) {
        this.getSubmitBtn().setDisabled(!valid || !form.isDirty());
    },

    onSubmitDemonstrationClick: function(submitBtn) {
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

        formPanel.setLoading('Saving demonstration&hellip;');

        me.getStudentCompetenciesStore().saveDemonstration(demonstration, {
            success: function(savedDemonstration) {
                var continueField = me.getContinueField(),
                    studentsStore = me.getStudentsStore(),
                    student = studentsStore.getById(savedDemonstration.get('StudentID')),
                    tplData = {
                        wasPhantom: wasPhantom,
                        student: student ? student.getData() : null,
                        skills: savedDemonstration.get('Skills')
                    },
                    nextStudent;


                // show notification to user
                Ext.toast(
                    Ext.XTemplate.getTpl(me, 'toastBodyTpl').apply(tplData),
                    Ext.XTemplate.getTpl(me, 'toastTitleTpl').apply(tplData)
                );


                // TODO: update correctly after skills get deleted during edit


                // select next student or close
                if (continueField.getValue()) {
                    nextStudent = studentsStore.getAt(studentsStore.indexOf(student) + 1);
                    formPanel.loadRecord(me.getDemonstrationModel().create({
                        Demonstrated: new Date(),
                        StudentID: nextStudent ? nextStudent.getId() : null
                    }));
                } else {
                    formWindow.hide();
                }

                formPanel.setLoading(false);
            },
            failure: function(savedDemonstration, operation) {
                formPanel.setLoading(false);

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
            demonstrationWindow = me.getDemonstrationWindow({
                ownerCmp: me.getDashboardCt()
            }),
            formPanel = demonstrationWindow.getMainView(),
            demonstration = options.demonstration;


        // initially configure form and window
        formPanel.getRatingsField().setSelectedCompetencies(options.selectedCompetencies || null);
        demonstrationWindow.animateTarget = options.animateTarget || null;


        // fetch demonstration and show window
        if (!demonstration || (typeof demonstration == 'object' && !demonstration.isModel)) {
            demonstration = DemonstrationModel.create(Ext.apply({
                Class: 'Slate\\CBL\\Demonstrations\\ExperienceDemonstration',
                Demonstrated: new Date()
            }, options.demonstration || null));

            formPanel.loadRecord(demonstration);
            demonstrationWindow.show();
        } else if (typeof demonstration == 'number') {
            formPanel.reset();
            demonstrationWindow.show();
            formPanel.setLoading('Loading demonstration&hellip;');

            DemonstrationModel.load(demonstration, {
                success: function(loadedDemonstration) {
                    formPanel.loadRecord(loadedDemonstration);
                    formPanel.setLoading(false);
                },
                failure: function(savedDemonstration, operation) {
                    demonstrationWindow.hide();
                    formPanel.setLoading(false);

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