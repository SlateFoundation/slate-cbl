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
            minHeight: 600
        },
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
        'slate-cbl-demonstrations-demonstrationform ^ window button[action=submit]': {
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
        var me = this,
            demonstration = me.getDemonstrationModel().create({
                Demonstrated: new Date()
            }),
            demonstrationWindow = me.getDemonstrationWindow({
                ownerCmp: me.getDashboardCt(),
                animateTarget: createBtn,

                mainView: {
                    xtype: 'slate-cbl-demonstrations-demonstrationform',
                    studentSelector: {
                        store: me.getStudentsStore(),
                        queryMode: 'local'
                    }
                }
            }),
            formPanel = demonstrationWindow.getMainView();

        formPanel.loadRecord(demonstration);
        formPanel.reset();
        demonstrationWindow.show();
    },

    onSubmitDemonstrationClick: function(submitBtn) {
        var me = this,
            formWindow = submitBtn.up('window'),
            formPanel = formWindow.getMainView(),
            demonstration = formPanel.getRecord(),
            wasPhantom = demonstration.phantom,
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetenciesInclude = studentCompetenciesStore.getProxy().getInclude();

        formPanel.updateRecord(demonstration);

        // ensure demonstration doesn't become dirty when no changes are made to the form
        if (!demonstration.dirty) {
            return;
        }

        formPanel.setLoading('Saving demonstration&hellip;');

        demonstration.save({
            include: Ext.Array.merge(
                Ext.Array.map(studentCompetenciesInclude, function(include) {
                    return 'StudentCompetencies.'+include;
                }),
                Ext.Array.map(studentCompetenciesInclude, function(include) {
                    return 'StudentCompetencies.next.'+include;
                })
            ),
            success: function(savedDemonstration) {
                var studentField = formPanel.getForm().findField('StudentID'),
                    continueField = me.getContinueField(),
                    studentsStore = me.getStudentsStore(),
                    student = studentsStore.getById(savedDemonstration.get('StudentID')),
                    studentCompetencies = savedDemonstration.get('StudentCompetencies') || [],
                    studentCompetenciesLength = studentCompetencies.length,
                    studentCompetencyIndex = 0, nextStudentCompetency,
                    tplData = {
                        wasPhantom: wasPhantom,
                        student: student ? student.getData() : null,
                        skills: savedDemonstration.get('Skills')
                    },
                    nextStudent;


                // collapse any embedded "next" records into main array
                for (; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
                    nextStudentCompetency = studentCompetencies[studentCompetencyIndex].next;

                    if (nextStudentCompetency) {
                        studentCompetencies.push(nextStudentCompetency);
                    }
                }


                // update grid
                studentCompetenciesStore.mergeData(studentCompetencies);


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
    }
});