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
        }
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
                    // selectedStudent: context.student,
                    // selectedSkill: context.skill,
                    // selectedDemonstration: context.demonstrationId
                }
            }),
            formPanel = demonstrationWindow.getMainView();

        formPanel.loadRecord(demonstration);
        formPanel.reset();
        demonstrationWindow.show();
    },

    onSubmitDemonstrationClick: function(submitBtn) {
        var me = this,
            formPanel = submitBtn.up('window').getMainView(),
            demonstration = formPanel.getRecord(),
            wasPhantom = demonstration.phantom,
            studentCompetenciesStore = me.getStudentCompetenciesStore(),
            studentCompetenciesInclude = studentCompetenciesStore.getProxy().getInclude();

        formPanel.updateRecord(demonstration);

        console.table([formPanel.getValues(), demonstration.getData()]);
        console.table(demonstration.get('Skills'));

        if (!demonstration.dirty) {
            return;
        }

        formPanel.setLoading('Saving demonstration&hellip;');

        demonstration.save({
            include: Ext.Array.map(studentCompetenciesInclude, function(include) {
                return 'StudentCompetencies.'+include;
            }),
            success: function(savedDemonstration, operation) {
                var student = me.getStudentsStore().getById(savedDemonstration.get('StudentID')),
                    tplData = {
                        wasPhantom: wasPhantom,
                        student: student ? student.getData() : null,
                        skills: savedDemonstration.get('Skills')
                    };


                // update grid
                studentCompetenciesStore.mergeData(savedDemonstration.get('StudentCompetencies'));


                // show notification to user
                Ext.toast(
                    Ext.XTemplate.getTpl(me, 'toastBodyTpl').apply(tplData),
                    Ext.XTemplate.getTpl(me, 'toastTitleTpl').apply(tplData)
                );

                // TODO: ensure sent target level is used
                // TODO: implement continue to next student
                // TODO: update correctly after skills get deleted during edit

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